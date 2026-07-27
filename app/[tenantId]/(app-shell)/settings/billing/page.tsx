"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Zap } from "lucide-react";

export default function SubscriptionBillingPage() {
  const invoices = [
    { id: "INV-2024-003", date: "Aug 01, 2024", amount: "Rp 299.000", status: "Paid" },
    { id: "INV-2024-002", date: "Jul 01, 2024", amount: "Rp 299.000", status: "Paid" },
    { id: "INV-2024-001", date: "Jun 01, 2024", amount: "Rp 299.000", status: "Paid" },
  ];

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Subscription & Billing</h2>
        <p className="text-gray-500 mt-2">Manage your current plan, upgrade options, and billing history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-blue-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-blue-900">Current Plan</CardTitle>
              <CardDescription>You are currently on the Professional Plan.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">Rp 299.000</span>
                <span className="text-gray-500 font-medium mb-1">/ month</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Unlimited Appointments</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Advanced POS System</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> WhatsApp Integration</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Custom Domain</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> API Access</div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50/50 border-t py-4 relative z-10 flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">Manage Subscription</Button>
              <Button variant="outline">Change Plan</Button>
            </CardFooter>
          </Card>

          {/* Invoice History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 border-b">
                    <tr>
                      <th className="px-4 py-3 font-medium">Invoice Number</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-medium text-blue-600">{inv.id}</td>
                        <td className="px-4 py-3 text-gray-600">{inv.date}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{inv.amount}</td>
                        <td className="px-4 py-3">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                            <Download size={18} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upsell / Info Card */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Zap className="text-yellow-300" size={24} />
              </div>
              <CardTitle className="text-xl">Upgrade to Enterprise</CardTitle>
              <CardDescription className="text-indigo-100">For multi-branch chains with more than 5 locations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-indigo-50 text-sm">
              <p>Unlock cross-branch inventory, consolidated financial reports, and dedicated account managers.</p>
              <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-blue-900 italic">VISA</div>
                <div>
                  <p className="font-semibold text-sm">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/26</p>
                </div>
              </div>
              <Button variant="link" className="px-0 mt-2 text-blue-600 h-auto">Update Payment Method</Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
