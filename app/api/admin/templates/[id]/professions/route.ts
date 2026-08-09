import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: templateId } = await params;
    const body = await request.json();
    const { professionName } = body;

    if (!professionName || professionName.trim() === "") {
      return NextResponse.json({ error: "Profession name is required" }, { status: 400 });
    }

    // Auto-generate code from name
    const professionCode = professionName.trim().toUpperCase().replace(/\s+/g, '_');

    const newProfession = await prisma.templateProfession.create({
      data: {
        businessTemplateId: templateId,
        professionName: professionName.trim(),
        professionCode,
      }
    });

    return NextResponse.json(newProfession, { status: 201 });
  } catch (error) {
    console.error("POST Admin Profession Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
