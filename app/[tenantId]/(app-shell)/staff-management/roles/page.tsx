"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShieldAlert, Check } from "lucide-react";

export default function RolesAndPermissionsPage() {
  const roles = [
    { id: 1, name: "Owner", description: "Full access to all modules and settings.", users: 1 },
    { id: 2, name: "Manager", description: "Can manage staff, services, and view reports.", users: 2 },
    { id: 3, name: "Cashier", description: "Access to POS Checkout and basic customer data.", users: 4 },
    { id: 4, name: "Therapist / Stylist", description: "Can view their own appointments and commissions.", users: 8 },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Roles & Permissions</h2>
          <p className="text-gray-500 mt-2">Manage access control (RBAC) for your staff members.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
          <Plus size={18} />
          Create Custom Role
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 flex items-start gap-3">
        <div className="mt-0.5"><ShieldAlert size={20} className="text-amber-600"/></div>
        <div>
          <h4 className="font-semibold">Role-Based Access Control (RBAC)</h4>
          <p className="text-sm mt-1">Changes to role permissions will apply immediately to all staff members assigned to that role.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow relative">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                  {role.users} Users
                </span>
              </div>
              <CardDescription className="pt-2">{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-green-500" /> View Dashboard
                </div>
                {role.name === 'Owner' || role.name === 'Manager' ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-green-500" /> Manage Staff
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400 line-through">
                    Manage Staff
                  </div>
                )}
                {role.name === 'Owner' ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-green-500" /> Billing Settings
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400 line-through">
                    Billing Settings
                  </div>
                )}
              </div>
              
              <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50">
                Edit Permissions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
