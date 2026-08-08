"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Plus, Pencil, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SubscriptionPlan = {
  id: string;
  name: string;
  pricePerMonth: any; // Decimal comes as object/string
  maxBranches: number;
  isActive: boolean;
  features: string[];
};

export default function SubscriptionsClient({ initialPlans }: { initialPlans: SubscriptionPlan[] }) {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    pricePerMonth: "",
    maxBranches: "1",
    isActive: true,
    features: [""]
  });

  const resetForm = () => {
    setFormData({
      name: "",
      pricePerMonth: "",
      maxBranches: "1",
      isActive: true,
      features: [""]
    });
    setEditingPlan(null);
    setError("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      pricePerMonth: plan.pricePerMonth?.toString() || "0",
      maxBranches: plan.maxBranches.toString(),
      isActive: plan.isActive,
      features: plan.features?.length ? [...plan.features] : [""]
    });
    setIsModalOpen(true);
    setError("");
  };

  const handleOpenDelete = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsDeleteModalOpen(true);
    setError("");
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        pricePerMonth: Number(formData.pricePerMonth),
        maxBranches: Number(formData.maxBranches),
        isActive: formData.isActive,
        features: formData.features.filter(f => f.trim() !== "") // Remove empty strings
      };

      const url = editingPlan 
        ? `/api/admin/subscriptions/${editingPlan.id}`
        : `/api/admin/subscriptions`;
        
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save plan");
      }

      setIsModalOpen(false);
      router.refresh();
      
      // Optomistic UI update (or wait for refresh)
      const savedPlan = await res.json();
      if (editingPlan) {
        setPlans(plans.map(p => p.id === savedPlan.id ? savedPlan : p));
      } else {
        setPlans([...plans, savedPlan]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPlan) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/subscriptions/${editingPlan.id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete plan");
      }

      setPlans(plans.filter(p => p.id !== editingPlan.id));
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Master Data</h1>
            <p className="text-gray-500 mt-1">Manage the available subscription plans for tenants.</p>
          </div>
          <Button onClick={handleOpenAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus size={16} /> Add Plan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>These plans are displayed to tenants in their billing settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Plan Name</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Price / Month</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Max Branches</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-3 font-semibold">Features</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {plan.name}
                      </td>
                      <td className="px-6 py-4">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0
                        }).format(Number(plan.pricePerMonth))}
                      </td>
                      <td className="px-6 py-4">
                        {plan.maxBranches >= 999 ? 'Unlimited' : plan.maxBranches}
                      </td>
                      <td className="px-6 py-4">
                        {plan.isActive ? (
                          <span className="flex items-center text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded w-fit">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 text-xs font-semibold bg-red-50 px-2 py-1 rounded w-fit">
                            <XCircle className="w-3 h-3 mr-1" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-4 space-y-1">
                          {((plan.features as string[]) || []).map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEdit(plan)}>
                          <Pencil size={14} className="mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(plan)}>
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {plans.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No subscription plans found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Add Subscription Plan"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. Basic Plan" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price / Month (Rp)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={formData.pricePerMonth} 
                  onChange={e => setFormData({...formData, pricePerMonth: e.target.value})} 
                  placeholder="149000" 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxBranches">Max Branches (999 for unlimited)</Label>
                <Input 
                  id="maxBranches" 
                  type="number"
                  value={formData.maxBranches} 
                  onChange={e => setFormData({...formData, maxBranches: e.target.value})} 
                  placeholder="1" 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300"
              />
              <Label htmlFor="isActive">Plan is Active (Visible to tenants)</Label>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Features List</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus size={14} className="mr-1" /> Add Feature
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      value={feature}
                      onChange={e => handleFeatureChange(idx, e.target.value)}
                      placeholder="e.g. Advanced POS System"
                    />
                    <Button type="button" variant="ghost" className="px-2 text-red-500 hover:text-red-700" onClick={() => removeFeature(idx)}>
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? "Saving..." : "Save Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{editingPlan?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Yes, Delete Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
