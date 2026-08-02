"use client";

import React from "react";
import { Plus, Search, Filter, Edit, Trash2, CheckCircle2, Package as PackageIcon, Clock, Percent } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PackagesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const dummyPackages = [
    {
      id: 1,
      name: "Bridal Glow Up Spa",
      description: "Paket lengkap perawatan sebelum pernikahan",
      services: ["Body Scrub", "Facial Treatment", "Hair Spa"],
      originalPrice: "Rp 1.200.000",
      packagePrice: "Rp 950.000",
      totalDuration: "150 mins",
      status: "Active",
    },
    {
      id: 2,
      name: "Men's Premium Grooming",
      description: "Haircut, shave, dan pijat kepala",
      services: ["Premium Haircut", "Hot Towel Shave", "Scalp Massage"],
      originalPrice: "Rp 400.000",
      packagePrice: "Rp 350.000",
      totalDuration: "75 mins",
      status: "Active",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Packages & Bundles</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola paket kombinasi layanan dengan harga khusus.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <Link href={`/${tenantId}/services/packages/create`} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
            <Plus size={16} />
            Buat Paket Baru
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari paket..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/4">Info Paket</th>
                <th className="px-6 py-4 font-semibold w-1/3">Layanan yang Termasuk</th>
                <th className="px-6 py-4 font-semibold">Harga & Durasi</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <PackageIcon size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{pkg.name}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{pkg.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.services.map((service, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-700">{pkg.packagePrice}</span>
                        <span className="text-xs text-slate-400 line-through">{pkg.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={12} /> {pkg.totalDuration}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-emerald-600 font-medium">{pkg.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/${tenantId}/services/packages/create`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                        <Edit size={16} />
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
