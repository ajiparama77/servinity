"use client";

import { useState } from "react";
import { UserCog, ShieldCheck, ChevronDown, Check, Edit2, Shield } from "lucide-react";

export default function RolesMock() {
  const [activeRole, setActiveRole] = useState("Manager");

  const roles = [
    { id: "owner", name: "Owner", users: 1, type: "System Default", desc: "Akses penuh ke seluruh sistem dan pengaturan." },
    { id: "manager", name: "Manager", users: 2, type: "System Default", desc: "Akses hampir penuh, tidak dapat menghapus tenant." },
    { id: "admin", name: "Admin", users: 3, type: "Custom Role", desc: "Akses ke operasional, reservasi, dan staf." },
    { id: "cashier", name: "Cashier", users: 4, type: "System Default", desc: "Akses khusus POS dan riwayat transaksi harian." },
    { id: "provider", name: "Service Provider", users: 15, type: "System Default", desc: "Akses terbatas melihat jadwal reservasi sendiri." },
  ];

  const permissions = [
    { module: "Dashboard & Analytics", actions: ["View Dashboard", "View Financial Reports", "Export Reports"] },
    { module: "Staff Management", actions: ["View Staff", "Create/Edit Staff", "Manage Roles", "Manage Payroll/Commission"] },
    { module: "Appointments & Calendar", actions: ["View All Calendar", "Manage Appointments", "View Own Schedule"] },
    { module: "Point of Sales (POS)", actions: ["Process Transaction", "Apply Discount", "Void Transaction", "View Daily Shift"] },
    { module: "Services & Products", actions: ["View Catalog", "Edit Pricing & Catalog", "Manage Inventory"] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-500 mt-1 text-sm">Atur tingkat akses dan izin (RBAC) untuk setiap peran di sistem.</p>
        </div>
        <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
          + Buat Custom Role
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Role List Sidebar */}
        <div className="w-full lg:w-1/3 space-y-3">
          {roles.map(role => (
            <div 
              key={role.id}
              onClick={() => setActiveRole(role.name)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                activeRole === role.name 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-bold ${activeRole === role.name ? 'text-indigo-900' : 'text-slate-900'}`}>
                  {role.name}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  role.type === 'System Default' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {role.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mb-3">{role.desc}</p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <UserCog className="w-3.5 h-3.5" />
                {role.users} Pengguna
              </div>
            </div>
          ))}
        </div>

        {/* Permission Editor Main Area */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-indigo-500" />
                  Izin Akses: {activeRole}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Centang modul dan fitur yang dapat diakses oleh peran ini.
                </p>
              </div>
              {activeRole === "Owner" ? (
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md">
                  Role Owner tidak dapat diubah
                </span>
              ) : (
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
                  Simpan Hak Akses
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {permissions.map((perm, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="font-semibold text-slate-800 text-sm">{perm.module}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
                    {perm.actions.map((action, aIdx) => {
                      // Mocking checked state based on active role
                      let isChecked = false;
                      if (activeRole === "Owner") isChecked = true;
                      else if (activeRole === "Manager" && !action.includes("Payroll")) isChecked = true;
                      else if (activeRole === "Cashier" && action.includes("POS")) isChecked = true;
                      else if (activeRole === "Service Provider" && action === "View Own Schedule") isChecked = true;
                      else if (activeRole === "Admin" && !action.includes("POS") && !action.includes("Payroll")) isChecked = true;

                      return (
                        <label key={aIdx} className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                          } ${activeRole === "Owner" ? 'opacity-60 cursor-not-allowed' : ''}`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-sm font-medium ${isChecked ? 'text-indigo-900' : 'text-slate-600'}`}>
                            {action}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
