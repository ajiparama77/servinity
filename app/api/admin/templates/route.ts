import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.businessTemplate.findMany({
      include: {
        templateProfessions: {
          orderBy: { professionName: 'asc' }
        },
        templateRoles: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("GET Admin Templates Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
