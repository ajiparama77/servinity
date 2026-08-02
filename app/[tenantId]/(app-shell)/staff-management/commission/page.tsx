"use client";

import { CircleDollarSign, Save } from "lucide-react";

export default function CommissionMock() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Commission & Incentive</h1>
        <p className="text-slate-500 mt-1 text-sm">Atur aturan komisi flat atau persentase dan fitur split commission.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Rules */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <CircleDollarSign className="text-indigo-500" />
            Global Commission Rules
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Komisi Default</label>
              <select className="w-full border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option>Persentase (%)</option>
                <option>Nominal Tetap (Rp)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nilai Komisi</label>
              <div className="relative">
                <input type="text" className="w-full border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" defaultValue="15" />
                <span className="absolute right-3 top-2.5 text-slate-400 font-medium">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Split Rules */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Split Commission Rule</h2>
          <p className="text-sm text-slate-500 mb-6">Jika satu layanan dikerjakan oleh lebih dari 1 Service Provider.</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg">
              <input type="radio" name="split" id="split1" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" defaultChecked />
              <label htmlFor="split1" className="text-sm font-medium text-slate-700">Dibagi Rata (50:50)</label>
            </div>
            <div className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-lg transition-colors cursor-pointer">
              <input type="radio" name="split" id="split2" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="split2" className="text-sm font-medium text-slate-700">Proporsional Berdasarkan Waktu</label>
            </div>
            <div className="flex items-center gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-lg transition-colors cursor-pointer">
              <input type="radio" name="split" id="split3" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="split3" className="text-sm font-medium text-slate-700">Custom Split (%)</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
          <Save size={18} />
          Simpan Konfigurasi
        </button>
      </div>
    </div>
  );
}
