import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, pricePerMonth, maxBranches, isActive, features } = body;

    const newPlan = await prisma.subscriptionPlan.create({
      data: {
        name,
        pricePerMonth,
        maxBranches,
        isActive,
        features,
      },
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("Failed to create subscription plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
