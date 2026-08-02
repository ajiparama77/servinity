"use client";

import React, { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, Clock, CheckCircle2, GripVertical, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CreateServicePage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const [activeTab, setActiveTab] = useState("master");

  const [steps, setSteps] = useState([
    { id: 1, type: "action", name: "Application", duration: 15 },
    { id: 2, type: "pause", name: "Processing / Waiting", duration: 30 },
    { id: 3, type: "action", name: "Washing & Styling", duration: 20 },
  ]);

  const [addons, setAddons] = useState([
    { id: 1, name: "Vitamin Hair Scrub", price: "50000", duration: 10 },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/${tenantId}/services`} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tambah Layanan Baru</h1>
            <p className="text-slate-500 text-sm mt-1">Konfigurasi detail layanan, workflow, dan add-ons.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            Batal
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm">
            <Save size={16} />
            Simpan Layanan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-4 shrink-0">
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab("master")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "master" ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              1. Master Data
            </button>
            <button 
              onClick={() => setActiveTab("workflow")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                activeTab === "workflow" ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              2. Workflow Steps
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "workflow" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>{steps.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab("addons")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                activeTab === "addons" ? "bg-white text-indigo-600 shadow-sm border border-slate-200/60" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              3. Add-Ons
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "addons" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>{addons.length}</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === "master" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Informasi Dasar Layanan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nama Layanan <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Contoh: Hair Coloring & Lifting" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Kategori <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all">
                    <option>Pilih Kategori</option>
                    <option>Hair Treatment</option>
                    <option>Haircut</option>
                    <option>Body Spa</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Deskripsi Singkat</label>
                  <textarea rows={3} placeholder="Jelaskan secara singkat mengenai layanan ini..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Harga Dasar (Rp) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                    <input type="number" placeholder="0" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">Buffer Time (Menit)</label>
                    <HelpCircle size={14} className="text-slate-400" />
                  </div>
                  <input type="number" placeholder="15" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
                  <p className="text-xs text-slate-500">Waktu jeda setelah layanan selesai untuk sterilisasi ruangan/alat sebelum klien berikutnya.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "workflow" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Workflow & Steps</h2>
                  <p className="text-xs text-slate-500 mt-1">Atur tahapan layanan, termasuk durasi dan jeda otomatis.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200 transition-colors">
                    + Add Pause
                  </button>
                  <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md hover:bg-indigo-100 transition-colors">
                    + Add Step
                  </button>
                </div>
              </div>

              {/* Timeline Builder dummy */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Connector line */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-[-16px] w-0.5 bg-slate-200 z-0"></div>
                    )}
                    
                    <div className={`relative z-10 flex items-start gap-4 p-4 rounded-xl border ${step.type === 'pause' ? 'bg-orange-50/50 border-orange-100 border-dashed' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="cursor-grab text-slate-400 mt-2">
                        <GripVertical size={16} />
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${step.type === 'pause' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {step.type === 'pause' ? <Clock size={16} /> : <span className="text-sm font-bold">{index + 1}</span>}
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-xs font-medium text-slate-500 uppercase">{step.type === 'pause' ? 'Pause Name' : 'Step Name'}</label>
                          <input type="text" defaultValue={step.name} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-400 transition-colors" />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-xs font-medium text-slate-500 uppercase">Duration (Mins)</label>
                          <input type="number" defaultValue={step.duration} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-400 transition-colors" />
                        </div>
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-xs font-medium text-slate-500 uppercase">Type</label>
                          <div className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center h-[34px] ${step.type === 'pause' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                            {step.type === 'pause' ? 'Staff Available' : 'Requires Staff'}
                          </div>
                        </div>
                      </div>

                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors mt-6">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-indigo-900 text-sm">Total Estimasi Durasi</h4>
                  <p className="text-xs text-indigo-700 mt-0.5">Dihitung otomatis dari total steps dan pause.</p>
                </div>
                <div className="text-2xl font-bold text-indigo-700">
                  {steps.reduce((acc, curr) => acc + curr.duration, 0)} Menit
                </div>
              </div>
            </div>
          )}

          {activeTab === "addons" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Service Add-Ons</h2>
                  <p className="text-xs text-slate-500 mt-1">Tambahkan opsi layanan ekstra yang bisa dipilih klien (Upsell).</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md hover:bg-indigo-100 transition-colors">
                  <Plus size={14} /> Add New Add-on
                </button>
              </div>

              <div className="space-y-4">
                {addons.map((addon, index) => (
                  <div key={addon.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-200 transition-colors">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Add-on Name</label>
                      <input type="text" defaultValue={addon.name} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-400 transition-colors" />
                    </div>
                    <div className="w-full md:w-48 space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Extra Price (Rp)</label>
                      <input type="number" defaultValue={addon.price} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-400 transition-colors" />
                    </div>
                    <div className="w-full md:w-32 space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Extra Mins</label>
                      <input type="number" defaultValue={addon.duration} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:border-indigo-400 transition-colors" />
                    </div>
                    <div className="mt-5">
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {addons.length === 0 && (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Plus className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-slate-900">Belum ada Add-on</h3>
                    <p className="text-xs text-slate-500 mt-1">Tambahkan opsi upsell untuk meningkatkan pendapatan dari layanan ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
