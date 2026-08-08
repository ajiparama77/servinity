import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. In a production app, verify the Xendit Callback Token here.
    // const xenditToken = req.headers.get("x-callback-token");
    
    const body = await req.json();
    console.log("Xendit Webhook Received:", body);

    const { external_id, status } = body;

    if (!external_id || status !== "PAID") {
      return NextResponse.json({ message: "Ignored or Missing Data" }, { status: 200 });
    }

    // 2. Wrap the update in a transaction
    await prisma.$transaction(async (tx) => {
      // Find the Invoice
      const invoice = await tx.billingInvoice.findUnique({
        where: { invoiceNumber: external_id },
        include: { tenantSubscription: true }
      });

      if (!invoice) {
        console.error(`Invoice not found for external_id: ${external_id}`);
        return; // Return silently to acknowledge the webhook
      }

      if (invoice.status === "PAID") {
        return; // Already processed
      }

      // Update Invoice Status
      await tx.billingInvoice.update({
        where: { id: invoice.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        }
      });

      // Activate Subscription with the new Plan
      await tx.tenantSubscription.update({
        where: { id: invoice.tenantSubscriptionId },
        data: {
          subscriptionPlanId: invoice.subscriptionPlanId,
          status: "ACTIVE",
          // Update the billing cycle based on today
          nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        }
      });
    });

    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Xendit Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
