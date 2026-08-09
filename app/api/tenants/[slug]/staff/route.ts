import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { fullName, phone, email, password, roleId, professionId } = body;

    if (!fullName || !email || !password || !roleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Check if email already exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Determine if the selected role requires a profession (Service Provider)
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: { templateRole: true }
    });

    if (!role) {
      return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
    }

    const isServiceProvider = role.templateRole.roleCode === "SERVICE_PROVIDER";
    if (isServiceProvider && !professionId) {
      return NextResponse.json({ error: "Profession is required for Service Providers" }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User and Staff profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          tenantId: tenant.id,
          email,
          passwordHash,
          roleId,
        }
      });

      const newStaff = await tx.staff.create({
        data: {
          tenant: { connect: { id: tenant.id } },
          user: { connect: { id: newUser.id } },
          fullName,
          phone: phone || null,
          ...(isServiceProvider && professionId ? { profession: { connect: { id: professionId } } } : {})
        }
      });

      return { user: newUser, staff: newStaff };
    });

    return NextResponse.json(result.staff, { status: 201 });
  } catch (error) {
    console.error("POST Staff Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
