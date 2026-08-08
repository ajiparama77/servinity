import prisma from "@/lib/prisma";
import BillingClient from "./BillingClient";

export default async function TenantBillingPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId: slug } = await params;

  // 1. Fetch Tenant and their active subscription
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      tenantSubscription: {
        include: {
          subscriptionPlan: true
        }
      }
    }
  });

  if (!tenant) {
    return <div className="p-8 text-red-500">Tenant not found</div>;
  }

  // 2. Fetch all available plans from master data
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { pricePerMonth: 'asc' }
  });

  // 3. Serialize data for Client Component
  const serializedPlans = plans.map(p => ({
    id: p.id,
    name: p.name,
    pricePerMonth: Number(p.pricePerMonth),
    maxBranches: p.maxBranches,
    features: (p.features as string[]) || []
  }));

  const currentSub = tenant.tenantSubscription ? {
    status: tenant.tenantSubscription.status,
    nextBillingDate: tenant.tenantSubscription.nextBillingDate,
    subscriptionPlanId: tenant.tenantSubscription.subscriptionPlanId,
    subscriptionPlan: {
      name: tenant.tenantSubscription.subscriptionPlan.name,
      pricePerMonth: Number(tenant.tenantSubscription.subscriptionPlan.pricePerMonth)
    }
  } : null;

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
        <p className="text-gray-500 mt-1">Manage your active plan, billing details, and upgrade options.</p>
      </div>

      <BillingClient plans={serializedPlans} currentSub={currentSub} />
    </div>
  );
}
