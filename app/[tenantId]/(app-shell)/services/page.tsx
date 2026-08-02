"use client";

import React from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ServicesPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  const dummyServices = [
    {
      id: 1,
      name: "Hair Coloring & Lifting",
      category: "Hair Treatment",
      duration: "65 mins",
      price: "Rp 450.000",
      steps: 3,
      addons: 2,
      status: "Active",
    },
    {
      id: 2,
      name: "Premium Men's Haircut",
      category: "Haircut",
      duration: "45 mins",
      price: "Rp 150.000",
      steps: 1,
      addons: 1,
      status: "Active",
    },
    {
      id: 3,
      name: "Keratin Smooth Treatment",
      category: "Hair Treatment",
      duration: "120 mins",
      price: "Rp 850.000",
      steps: 4,
      addons: 0,
      status: "Active",
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Menu</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola semua layanan, harga, dan durasi pengerjaan.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <Link href={`/${tenantId}/services/create`} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
            <Plus size={16} />
            Tambah Layanan
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
              placeholder="Cari layanan..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Layanan</th>
                <th className="px-6 py-4 font-semibold">Harga Dasar</th>
                <th className="px-6 py-4 font-semibold">Total Durasi</th>
                <th className="px-6 py-4 font-semibold text-center">Steps</th>
                <th className="px-6 py-4 font-semibold text-center">Add-ons</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{service.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{service.category}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {service.price}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {service.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md ${service.steps > 1 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {service.steps} Step{service.steps > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-md">
                      {service.addons > 0 ? `${service.addons} Items` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-emerald-600 font-medium">{service.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/${tenantId}/services/create`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
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
        
        {/* Pagination Dummy */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Menampilkan <span className="font-medium text-slate-900">3</span> dari <span className="font-medium text-slate-900">3</span> layanan</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-sm text-slate-400 bg-slate-50 rounded-md cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md">1</button>
            <button className="px-3 py-1 text-sm text-slate-400 bg-slate-50 rounded-md cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
