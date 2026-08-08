import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Xendit } from "xendit-node";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { subscriptionPlanId } = body;

    if (!subscriptionPlanId) {
      return NextResponse.json({ error: "Missing subscriptionPlanId" }, { status: 400 });
    }

    if (!process.env.XENDIT_SECRET_KEY) {
      return NextResponse.json({ error: "Server Configuration Error: XENDIT_SECRET_KEY is missing." }, { status: 500 });
    }

    // Initialize Xendit Client
    const xenditClient = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
    });

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Wrap DB operations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get Plan
      const plan = await tx.subscriptionPlan.findUnique({
        where: { id: subscriptionPlanId }
      });

      if (!plan) throw new Error("Plan not found");

      // 2. Prepare TenantSubscription (Do not update active plan yet)
      let tenantSub = await tx.tenantSubscription.findUnique({
        where: { tenantId: tenant.id }
      });

      if (!tenantSub) {
        // If they don't have a subscription at all (e.g. legacy user), create a dummy TRIAL one
        tenantSub = await tx.tenantSubscription.create({
          data: {
            tenantId: tenant.id,
            subscriptionPlanId, // Safe to put here if they never had one
            status: "TRIAL", 
            startDate: new Date(),
            nextBillingDate: new Date(),
          }
        });
      }

      // 3. Create UNPAID Invoice in Database (save the requested plan here!)
      const invoiceNumber = `INV-${tenant.slug.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const amount = Number(plan.pricePerMonth);
      
      const invoice = await tx.billingInvoice.create({
        data: {
          tenantSubscriptionId: tenantSub.id,
          subscriptionPlanId: plan.id, // The plan they are buying
          invoiceNumber,
          amount,
          status: "UNPAID",
        }
      });

      return { tenantSub, invoice, plan };
    });

    // 4. Hit Xendit API to create the Invoice URL
    const { Invoice } = xenditClient;
    const xenditInvoice = await Invoice.createInvoice({
      data: {
        externalId: result.invoice.invoiceNumber,
        amount: Number(result.invoice.amount),
        description: `Subscription: ${result.plan.name} for ${tenant.name}`,
        customer: {
          givenNames: tenant.name,
        },
        successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${tenant.slug}/settings/billing`,
        failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${tenant.slug}/settings/billing`,
      }
    });

    return NextResponse.json({
      invoiceUrl: xenditInvoice.invoiceUrl,
      invoiceNumber: result.invoice.invoiceNumber
    });
  } catch (error: any) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
