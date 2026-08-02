"use client";

import React from "react";
import { Users, TrendingUp, Crown, Search, Filter, AlertTriangle, ShieldCheck, UserCircle, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomersPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const dummyCustomers = [
    {
      id: 1,
      name: "Sarah Wijaya",
      phone: "+62 812-3456-7890",
      lifetimeSpend: "Rp 15.450.000",
      lastVisit: "2 Hari yang lalu",
      membership: "Gold",
      noShowRate: 0,
      riskLevel: "safe", // safe, warning, critical
    },
    {
      id: 2,
      name: "Michael Chen",
      phone: "+62 877-1234-5678",
      lifetimeSpend: "Rp 3.200.000",
      lastVisit: "1 Bulan yang lalu",
      membership: "Silver",
      noShowRate: 30, // 30% no show
      riskLevel: "warning",
    },
    {
      id: 3,
      name: "Bella Ananda",
      phone: "+62 851-9876-5432",
      lifetimeSpend: "Rp 450.000",
      lastVisit: "3 Bulan yang lalu",
      membership: "None",
      noShowRate: 60, // 60% no show
      riskLevel: "critical",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data klien, riwayat perawatan, dan analitik loyalitas.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
            <UserCircle size={16} />
            Tambah Klien Baru
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:border-indigo-100 transition-colors">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pengunjung Hari Ini</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">45 <span className="text-sm font-normal text-slate-500">Klien</span></h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:border-emerald-100 transition-colors">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Spender Terbanyak Hari Ini</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1 line-clamp-1">Sarah Wijaya</h3>
            <p className="text-xs text-emerald-600 font-medium">Rp 2.500.000</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-4 hover:border-amber-100 transition-colors">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Crown size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Membership Baru</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">8 <span className="text-sm font-normal text-slate-500">Join Hari Ini</span></h3>
          </div>
        </div>
      </div>

      {/* Main Content: Customer List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari nama, no HP, atau email..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Profil Klien</th>
                <th className="px-6 py-4 font-semibold">Lifetime Spend & Membership</th>
                <th className="px-6 py-4 font-semibold">Kunjungan Terakhir</th>
                <th className="px-6 py-4 font-semibold">No-Show / Risk Level</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-500 mt-1">{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-slate-700">{customer.lifetimeSpend}</span>
                      {customer.membership !== "None" ? (
                        <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          customer.membership === "Gold" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-200 text-slate-700 border border-slate-300"
                        }`}>
                          <Crown size={10} className="mr-1" /> {customer.membership}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Regular</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {customer.lastVisit}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.riskLevel === 'safe' && (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-medium">Aman ({customer.noShowRate}%)</span>
                      </div>
                    )}
                    {customer.riskLevel === 'warning' && (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-medium">Warning ({customer.noShowRate}%)</span>
                      </div>
                    )}
                    {customer.riskLevel === 'critical' && (
                      <div className="flex items-center gap-1.5 text-red-600">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-bold">Red Flag ({customer.noShowRate}%)</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/${tenantId}/customers/profile`} className="inline-flex items-center justify-center px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100">
                      Lihat Profil
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
