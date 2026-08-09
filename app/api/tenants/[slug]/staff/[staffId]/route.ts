import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string; staffId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, staffId } = await params;
    const body = await request.json();
    const { fullName, phone, email, password, roleId, professionId, isActive } = body;

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { user: true }
    });

    if (!staff || staff.tenantId !== tenant.id) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    if (email && email !== staff.user?.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
    }

    // Role check
    let isServiceProvider = false;
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: { templateRole: true }
      });
      if (!role) return NextResponse.json({ error: "Invalid role selected" }, { status: 400 });
      isServiceProvider = role.templateRole.roleCode === "SERVICE_PROVIDER";
      
      if (isServiceProvider && professionId === undefined && staff.professionId === null) {
         // Should validate profession if role changed to service provider
         return NextResponse.json({ error: "Profession is required for Service Providers" }, { status: 400 });
      }
    }

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      let userUpdateData: any = {};
      if (email) userUpdateData.email = email;
      if (roleId) userUpdateData.roleId = roleId;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        userUpdateData.passwordHash = await bcrypt.hash(password, salt);
      }
      if (isActive !== undefined) userUpdateData.isActive = isActive;

      if (Object.keys(userUpdateData).length > 0 && staff.userId) {
        await tx.user.update({
          where: { id: staff.userId },
          data: userUpdateData
        });
      }

      const updatedStaff = await tx.staff.update({
        where: { id: staffId },
        data: {
          ...(fullName && { fullName }),
          ...(phone !== undefined && { phone: phone || null }),
          ...(isActive !== undefined && { isActive }),
          ...(professionId !== undefined ? { profession: professionId ? { connect: { id: professionId } } : { disconnect: true } } : {})
        }
      });

      return updatedStaff;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("PUT Staff Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string; staffId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, staffId } = await params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const staff = await prisma.staff.findUnique({
      where: { id: staffId }
    });

    if (!staff || staff.tenantId !== tenant.id) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    // Delete in transaction
    await prisma.$transaction(async (tx) => {
      await tx.staff.delete({
        where: { id: staffId }
      });
      if (staff.userId) {
        await tx.user.delete({
          where: { id: staff.userId }
        });
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE Staff Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
