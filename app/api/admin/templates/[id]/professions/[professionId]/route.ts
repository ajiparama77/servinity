import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string, professionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: templateId, professionId } = await params;
    const body = await request.json();
    const { professionName } = body;

    if (!professionName || professionName.trim() === "") {
      return NextResponse.json({ error: "Profession name is required" }, { status: 400 });
    }

    const professionCode = professionName.trim().toUpperCase().replace(/\s+/g, '_');

    const updatedProfession = await prisma.templateProfession.update({
      where: { 
        id: professionId,
        businessTemplateId: templateId 
      },
      data: {
        professionName: professionName.trim(),
        professionCode,
      }
    });

    return NextResponse.json(updatedProfession, { status: 200 });
  } catch (error) {
    console.error("PUT Admin Profession Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string, professionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: templateId, professionId } = await params;

    // We might want to check if the profession is in use by any staff before deleting,
    // but Prisma will throw a foreign key error if it is, which we can catch.
    await prisma.templateProfession.delete({
      where: {
        id: professionId,
        businessTemplateId: templateId
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Admin Profession Error:", error);
    if (error.code === 'P2003') {
      return NextResponse.json({ error: "Cannot delete this profession because it is currently assigned to one or more staff members." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
