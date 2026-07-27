"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export default function TaxAndPaymentPage() {
  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Tax & Payment</h2>
        <p className="text-gray-500 mt-2">Configure default tax rates, service charges, and accepted payment methods.</p>
      </div>

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
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">VAT Rate (%)</Label>
              <Input id="taxRate" type="number" defaultValue="11" />
            </div>

            <div className="flex items-center justify-between border-b pb-4 pt-2">
              <div className="space-y-0.5">
                <Label className="text-base">Apply Service Charge</Label>
                <p className="text-sm text-gray-500">Additional fee for your services.</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceCharge">Service Charge Rate (%)</Label>
              <Input id="serviceCharge" type="number" defaultValue="5" />
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Save Tax Settings</Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Accepted Payment Methods</CardTitle>
            <CardDescription>Select which payment methods appear on POS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox id="cash" defaultChecked disabled />
                <Label htmlFor="cash" className="flex-1 cursor-pointer font-medium">Cash</Label>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Required</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox id="qris" defaultChecked />
                <Label htmlFor="qris" className="flex-1 cursor-pointer font-medium">QRIS / E-Wallet</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox id="edc_bca" defaultChecked />
                <Label htmlFor="edc_bca" className="flex-1 cursor-pointer font-medium">Debit/Credit Card (EDC BCA)</Label>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox id="edc_mandiri" />
                <Label htmlFor="edc_mandiri" className="flex-1 cursor-pointer font-medium">Debit/Credit Card (EDC Mandiri)</Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox id="transfer" defaultChecked />
                <Label htmlFor="transfer" className="flex-1 cursor-pointer font-medium">Bank Transfer</Label>
              </div>
            </div>
            
            <Button className="w-full mt-2" variant="outline">Update Payment Methods</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
