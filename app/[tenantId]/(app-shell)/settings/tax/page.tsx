"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function TaxAndPaymentPage() {
  const params = useParams();
  const tenantSlug = params.tenantId as string;

  const [branches, setBranches] = useState<{id: string, name: string}[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTax, setIsSavingTax] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Tax State
  const [applyTax, setApplyTax] = useState(true);
  const [taxPercentage, setTaxPercentage] = useState<number>(11);
  const [applyServiceCharge, setApplyServiceCharge] = useState(true);
  const [serviceChargePercentage, setServiceChargePercentage] = useState<number>(5);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  // Custom Method Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customMethodName, setCustomMethodName] = useState("");
  const [customMethodType, setCustomMethodType] = useState("TRANSFER"); // Or E_WALLET, EDC, etc
  
  // Edit Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [detailsText, setDetailsText] = useState("");

  const fetchBranches = async () => {
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/branches`);
      if (res.ok) {
        const data = await res.json();
        const flattenBranches = (branchesList: any[], prefix = ""): {id: string, name: string}[] => {
          let flat: {id: string, name: string}[] = [];
          branchesList.forEach(b => {
            flat.push({ id: b.id, name: `${prefix}${b.name}` });
            if (b.subBranches && b.subBranches.length > 0) {
              flat = flat.concat(flattenBranches(b.subBranches, `${prefix}${b.name} - `));
            }
          });
          return flat;
        };
        setBranches(flattenBranches(data));
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const branchQuery = selectedBranchId ? `?branchId=${selectedBranchId}` : '';
      
      const [taxRes, paymentRes] = await Promise.all([
        fetch(`/api/tenants/${tenantSlug}/tax${branchQuery}`),
        fetch(`/api/tenants/${tenantSlug}/payment-methods${branchQuery}`)
      ]);

      if (taxRes.ok) {
        const taxData = await taxRes.json();
        setApplyTax(taxData.applyTax ?? true);
        setTaxPercentage(taxData.taxPercentage ? parseFloat(taxData.taxPercentage) : 11);
        setApplyServiceCharge(taxData.applyServiceCharge ?? true);
        setServiceChargePercentage(taxData.serviceChargePercentage ? parseFloat(taxData.serviceChargePercentage) : 5);
      }

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        setPaymentMethods(paymentData);
      }

    } catch (error) {
      console.error("Failed to fetch settings data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tenantSlug) {
      fetchBranches();
    }
  }, [tenantSlug]);

  useEffect(() => {
    if (tenantSlug) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantSlug, selectedBranchId]);

  const handleSaveTax = async () => {
    setIsSavingTax(true);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/tax`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranchId || null,
          applyTax,
          taxName: 'VAT (PPN)',
          taxPercentage,
          applyServiceCharge,
          serviceChargePercentage
        })
      });
      if (res.ok) {
        // Just flash green or do nothing on success since it's a silent save pattern
      }
    } catch (error) {
      console.error("Save tax error", error);
    } finally {
      setIsSavingTax(false);
    }
  };

  const handleSavePaymentMethods = async () => {
    setIsSavingPayment(true);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/payment-methods`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranchId || null,
          methods: paymentMethods
        })
      });
    } catch (error) {
      console.error("Save payment methods error", error);
    } finally {
      setIsSavingPayment(false);
    }
  };

  const togglePaymentMethod = (methodCode: string, checked: boolean) => {
    setPaymentMethods(methods => 
      methods.map(m => m.methodCode === methodCode ? { ...m, isActive: checked } : m)
    );
  };

  const handleDeleteMethod = (methodCode: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(methods => methods.filter(m => m.methodCode !== methodCode));
    }
  };

  const handleAddCustomMethod = () => {
    if (!customMethodName.trim()) {
      alert("Please enter a method name.");
      return;
    }

    const uniqueCode = `CUSTOM_${Date.now()}`;
    const newMethod = {
      methodCode: uniqueCode,
      methodName: customMethodName,
      isActive: true,
      isDefault: false,
      isCustom: true,
      details: { type: customMethodType }
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setIsAddModalOpen(false);
    setCustomMethodName("");
  };

  const openDetailsModal = (method: any) => {
    setEditingMethod(method);
    setDetailsText(method.details?.info || "");
    setIsDetailsModalOpen(true);
  };

  const saveDetails = () => {
    if (editingMethod) {
      setPaymentMethods(methods => methods.map(m => {
        if (m.methodCode === editingMethod.methodCode) {
          return {
            ...m,
            details: {
              ...m.details,
              info: detailsText
            }
          };
        }
        return m;
      }));
    }
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tax & Payment</h2>
          <p className="text-gray-500 mt-2">Configure default tax rates, service charges, and accepted payment methods.</p>
        </div>
        <div className="w-full md:w-64 space-y-1.5">
          <Label htmlFor="branchSelect" className="text-xs font-semibold uppercase text-gray-500">Applicable Branch</Label>
          <select 
            id="branchSelect"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
          >
            <option value="">All Branches (Global)</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tax Config */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Set up VAT (PPN) and standard service charges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Apply VAT (PPN)</Label>
                  <p className="text-sm text-gray-500">Automatically calculate tax on checkout.</p>
                </div>
                <Switch checked={applyTax} onCheckedChange={setApplyTax} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxRate">VAT Rate (%)</Label>
                <Input 
                  id="taxRate" 
                  type="number" 
                  value={taxPercentage} 
                  onChange={e => setTaxPercentage(parseFloat(e.target.value) || 0)} 
                  disabled={!applyTax} 
                />
              </div>

              <div className="flex items-center justify-between border-b pb-4 pt-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Apply Service Charge</Label>
                  <p className="text-sm text-gray-500">Additional fee for your services.</p>
                </div>
                <Switch checked={applyServiceCharge} onCheckedChange={setApplyServiceCharge} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serviceCharge">Service Charge Rate (%)</Label>
                <Input 
                  id="serviceCharge" 
                  type="number" 
                  value={serviceChargePercentage} 
                  onChange={e => setServiceChargePercentage(parseFloat(e.target.value) || 0)} 
                  disabled={!applyServiceCharge} 
                />
              </div>
              
              <Button onClick={handleSaveTax} disabled={isSavingTax} className="w-full bg-blue-600 hover:bg-blue-700">
                {isSavingTax ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-1.5">
                <CardTitle>Accepted Payment Methods</CardTitle>
                <CardDescription>Select which payment methods appear on POS.</CardDescription>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} size="sm" variant="outline" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                Add Custom
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                {paymentMethods.map(method => (
                  <div key={method.methodCode} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox 
                      id={method.methodCode} 
                      checked={method.isActive} 
                      disabled={method.isDefault}
                      onCheckedChange={(checked) => togglePaymentMethod(method.methodCode, checked as boolean)} 
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={method.methodCode} className="cursor-pointer font-medium leading-none">
                          {method.methodName}
                        </Label>
                        {method.isDefault && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      {method.details?.info && (
                        <p className="text-sm text-gray-500">{method.details.info}</p>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => openDetailsModal(method)}
                    >
                      Details
                    </Button>

                    {method.isCustom && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteMethod(method.methodCode)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <Button onClick={handleSavePaymentMethods} disabled={isSavingPayment} className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50" variant="outline">
                {isSavingPayment ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Payment Methods
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Custom Method Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Payment Method</DialogTitle>
            <DialogDescription>
              Create a custom payment option for your POS and invoices.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Method Name</Label>
              <Input 
                placeholder="e.g., Transfer Mandiri, ShopeePay" 
                value={customMethodName} 
                onChange={e => setCustomMethodName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={customMethodType}
                onChange={e => setCustomMethodType(e.target.value)}
              >
                <option value="TRANSFER">Bank Transfer</option>
                <option value="E_WALLET">E-Wallet</option>
                <option value="EDC">Debit / Credit (EDC)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomMethod}>Add Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details / Instructions</DialogTitle>
            <DialogDescription>
              Set instructions or account details for {editingMethod?.methodName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Details</Label>
              <Input 
                placeholder="e.g., Mandiri 123456789 a/n Servinity" 
                value={detailsText} 
                onChange={e => setDetailsText(e.target.value)} 
              />
              <p className="text-xs text-gray-500">
                This will be printed on invoices and receipts for customer reference.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Cancel</Button>
            <Button onClick={saveDetails}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
