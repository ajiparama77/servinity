import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, pricePerMonth, maxBranches, isActive, features } = body;

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        pricePerMonth,
        maxBranches,
        isActive,
        features,
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Failed to update subscription plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.isSuperadmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    // Check if plan is being used
    const activeSubscriptions = await prisma.tenantSubscription.count({
      where: { subscriptionPlanId: id }
    });

    if (activeSubscriptions > 0) {
      return NextResponse.json(
        { error: "Cannot delete plan because it is actively used by tenants." },
        { status: 400 }
      );
    }

    await prisma.subscriptionPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete subscription plan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
