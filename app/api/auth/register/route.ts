import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, tenantName, businessTemplateId } = body;

    if (!email || !password || !tenantName || !businessTemplateId) {
      return NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate slug dari nama tenant
    let slug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existingSlug = await prisma.tenant.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`;
    }

    // Gunakan transaksi untuk memastikan semua data tersimpan dengan benar
    const result = await prisma.$transaction(async (tx) => {
      // 1. Ambil Semua TemplateRole berdasarkan businessTemplateId
      const templateRoles = await tx.templateRole.findMany({
        where: { businessTemplateId },
      });

      if (!templateRoles.length) {
        throw new Error("Template Roles tidak ditemukan untuk bisnis template ini");
      }

      const newTenant = await tx.tenant.create({
        data: {
          name: tenantName,
          slug,
          businessTemplateId,
        },
      });

      // 3. Buat semua Role khusus untuk Tenant ini
      const rolesData = templateRoles.map(tr => ({
        tenantId: newTenant.id,
        templateRoleId: tr.id,
        permissions: {}, 
      }));

      await tx.role.createMany({
        data: rolesData
      });

      // Fetch back the newly created roles to find the OWNER role ID
      const createdRoles = await tx.role.findMany({
        where: { tenantId: newTenant.id },
        include: { templateRole: true }
      });

      const ownerRole = createdRoles.find(r => r.templateRole.roleCode === "OWNER");

      if (!ownerRole) {
        throw new Error("Owner Role gagal dibuat");
      }

      // 4. Buat User sebagai OWNER
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          tenantId: newTenant.id,
          roleId: ownerRole.id,
        },
      });

      // 5. Buat profil Staff untuk Owner
      const newStaff = await tx.staff.create({
        data: {
          tenantId: newTenant.id,
          userId: newUser.id,
          fullName: "Owner",
          phone: null,
          professionId: null,
        }
      });

      return { tenant: newTenant, user: newUser, staff: newStaff };
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", tenantId: result.tenant.id, tenantSlug: result.tenant.slug },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
