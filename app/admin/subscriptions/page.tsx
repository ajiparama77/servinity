import prisma from "@/lib/prisma";
import SubscriptionsClient from "./SubscriptionsClient";

export default async function AdminSubscriptions() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { pricePerMonth: 'asc' }
  });

  // Convert Decimal to string/number for the client component to prevent Next.js serialization errors
  const serializedPlans = plans.map(plan => ({
    ...plan,
    pricePerMonth: Number(plan.pricePerMonth),
    features: (plan.features as string[]) || [],
  }));

  return <SubscriptionsClient initialPlans={serializedPlans} />;
}
