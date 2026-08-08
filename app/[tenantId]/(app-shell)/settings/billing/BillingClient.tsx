"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles, AlertCircle, CreditCard, Landmark, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useTenantStore } from "@/app/store/tenantStore";

type Plan = {
  id: string;
  name: string;
  pricePerMonth: any;
  maxBranches: number;
  features: string[];
};

type CurrentSubscription = {
  status: string;
  nextBillingDate: Date;
  subscriptionPlanId: string;
  subscriptionPlan: {
    name: string;
    pricePerMonth: any;
  }
} | null;

export default function BillingClient({ 
  plans, 
  currentSub 
}: { 
  plans: Plan[], 
  currentSub: CurrentSubscription 
}) {
  const router = useRouter();
  const { tenantId, themeColorHex } = useTenantStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlanForCheckout(plan);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlanForCheckout) return;
    
    setLoading(true);
    setError("");

    try {
      const slug = window.location.pathname.split('/')[1]; // get tenantSlug from URL
      const res = await fetch(`/api/tenants/${slug}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subscriptionPlanId: selectedPlanForCheckout.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses langganan.");
      }

      // Redirect to Xendit Secure Checkout
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        throw new Error("Gagal mendapatkan link pembayaran.");
      }

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const isTrial = !currentSub;
  const currentPlanName = isTrial ? "Free Trial" : currentSub?.subscriptionPlan.name;
  const activePlanId = currentSub?.subscriptionPlanId;

  return (
    <>
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Current Plan Banner */}
        <div 
          className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden"
          style={{ backgroundColor: themeColorHex || '#111827' }}
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Sparkles size={20} className="text-yellow-300" /> 
                Current Plan: {currentPlanName}
              </h2>
              <p className="text-white/80 text-sm">
                {isTrial 
                  ? "You are currently on a trial. Upgrade to unlock all premium features." 
                  : `Next billing date: ${new Date(currentSub.nextBillingDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}`}
              </p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30 text-sm font-semibold">
              Status: {isTrial ? "TRIAL" : currentSub?.status}
            </div>
          </div>
          
          {/* Background blobs */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 border-l-4 border-red-500 rounded-md">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Upgrade Your Workspace</h3>
            <p className="text-gray-500 mt-2">Choose the best plan that fits your business needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = activePlanId === plan.id;
              const price = Number(plan.pricePerMonth);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`flex flex-col relative transition-all duration-300 ${
                    isCurrent ? 'ring-2 ring-indigo-600 shadow-xl scale-105 z-10 bg-indigo-50/30' : 'hover:shadow-lg border-gray-200'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      Active Plan
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>
                      Ideal for {plan.maxBranches >= 999 ? "unlimited" : plan.maxBranches} branch{plan.maxBranches > 1 ? 'es' : ''}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <span className="text-3xl font-extrabold text-gray-900">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0
                        }).format(price)}
                      </span>
                      <span className="text-gray-500 text-sm font-medium"> / bulan</span>
                    </div>
                    
                    <ul className="space-y-3 flex-1 text-sm text-gray-600">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="p-0.5 bg-green-100 text-green-700 rounded-full shrink-0 mt-0.5">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-2 font-medium">
                        <div className="p-0.5 bg-indigo-100 text-indigo-700 rounded-full shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span>Max {plan.maxBranches >= 999 ? "Unlimited" : plan.maxBranches} Cabang</span>
                      </li>
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className={`w-full ${
                        isCurrent 
                          ? 'bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      }`}
                      disabled={isCurrent}
                      onClick={() => handleOpenCheckout(plan)}
                    >
                      {isCurrent ? "Current Plan" : "Select Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Checkout / Payment Modal */}
      <Dialog open={!!selectedPlanForCheckout} onOpenChange={(open) => !open && setSelectedPlanForCheckout(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              Review your plan details and complete the simulated payment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlanForCheckout && (
            <div className="space-y-6 py-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{selectedPlanForCheckout.name}</p>
                  <p className="text-xs text-slate-500">Billed monthly</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0
                    }).format(Number(selectedPlanForCheckout.pricePerMonth))}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
                <Landmark className="text-indigo-600 mt-1 shrink-0" size={20} />
                <p className="text-sm text-indigo-900">
                  You will be redirected to Xendit's secure payment gateway to complete this transaction using your preferred method (Virtual Account, E-Wallet, QRIS, or Credit Card).
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setSelectedPlanForCheckout(null)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700" 
              onClick={handleConfirmPayment}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
