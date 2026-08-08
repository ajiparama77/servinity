import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CreditCard } from "lucide-react";

export default async function AdminDashboard() {
  // Query statistics
  const totalTenants = await prisma.tenant.count();
  
  const activeSubscriptions = await prisma.tenantSubscription.count({
    where: { status: "ACTIVE" }
  });

  const totalRevenue = await prisma.billingInvoice.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" }
  });

  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(totalRevenue._sum.amount || 0));

  const tenants = await prisma.tenant.findMany({
    include: {
      tenantSubscription: {
        include: { subscriptionPlan: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of Servinity platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-gray-500 mt-1">Registered salon businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-green-600 font-medium mt-1">Tenants currently paying</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedRevenue}</div>
            <p className="text-xs text-gray-500 mt-1">All time paid invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">Tenant Name</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Slug (URL)</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Current Plan</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => {
                  const sub = tenant.tenantSubscription;
                  const isTrial = !sub; // Default trial if no subscription row
                  const isUnsubscribed = sub && sub.status === "CANCELED";
                  const isActive = sub && sub.status === "ACTIVE";

                  return (
                    <tr key={tenant.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {tenant.name}
                      </td>
                      <td className="px-6 py-4">/{tenant.slug}</td>
                      <td className="px-6 py-4">
                        {sub?.subscriptionPlan?.name || "Free Trial"}
                      </td>
                      <td className="px-6 py-4">
                        {isActive ? (
                          <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded text-xs font-semibold">
                            Subscribed
                          </span>
                        ) : isUnsubscribed ? (
                          <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded text-xs font-semibold">
                            Unsubscribed
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded text-xs font-semibold">
                            Trial / Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(tenant.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
