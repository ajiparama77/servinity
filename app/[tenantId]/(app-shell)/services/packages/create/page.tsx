"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, Package as PackageIcon, Info, LayoutList } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CreatePackagePage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  
  const [includedServices, setIncludedServices] = useState([
    { id: 1, name: "Body Scrub", price: 400000, duration: 45 },
    { id: 2, name: "Facial Treatment", price: 350000, duration: 60 },
  ]);

  const originalTotal = includedServices.reduce((acc, curr) => acc + curr.price, 0);
  const totalDuration = includedServices.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/${tenantId}/services/packages`} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Buat Paket Baru</h1>
            <p className="text-slate-500 text-sm mt-1">Kombinasikan beberapa layanan menjadi satu paket penjualan.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            Batal
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
            <Save size={16} />
            Simpan Paket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <PackageIcon size={20} className="text-indigo-600" />
              Detail Paket
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nama Paket <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Contoh: Bridal Glow Up Spa" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Deskripsi Paket</label>
                <textarea rows={3} placeholder="Jelaskan detail paket ini..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LayoutList size={20} className="text-indigo-600" />
                Layanan dalam Paket
              </h2>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md hover:bg-indigo-100 transition-colors">
                <Plus size={14} /> Pilih Layanan
              </button>
            </div>
            
            <div className="space-y-3">
              {includedServices.map((service, index) => (
                <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{service.name}</p>
                      <p className="text-xs text-slate-500">{service.duration} Menit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Rp {service.price.toLocaleString('id-ID')}</span>
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-center">
                <p className="text-sm text-slate-500">Klik "Pilih Layanan" untuk menambahkan layanan ke dalam paket ini.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Pricing & Summary</h2>
            
            <div className="py-4 space-y-4 border-b border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Durasi</span>
                <span className="font-medium text-slate-900">{totalDuration} Menit</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Harga Asli</span>
                <span className="font-medium text-slate-500 line-through">Rp {originalTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Harga Jual Paket (Rp) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rp</span>
                  <input type="number" defaultValue={650000} className="w-full pl-10 pr-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-lg font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
                </div>
                <div className="flex items-start gap-2 mt-2 p-3 bg-emerald-50 rounded-lg text-xs text-emerald-700">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p>Dengan harga ini, klien menghemat <strong>Rp {(originalTotal - 650000).toLocaleString('id-ID')}</strong> ({(100 - (650000 / originalTotal) * 100).toFixed(0)}%).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
