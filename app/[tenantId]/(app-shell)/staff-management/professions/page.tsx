"use client";

import { useState } from "react";
import { Briefcase, Plus, MoreHorizontal, X } from "lucide-react";

export default function ProfessionsMock() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const professionsData = [
    { id: 1, name: "Hair Stylist", description: "Menangani potong rambut, pewarnaan, dan perawatan rambut (creambath dll).", staffCount: 5, color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: 2, name: "Nail Artist", description: "Spesialis perawatan kuku, manicure, pedicure, dan nail art.", staffCount: 3, color: "bg-pink-100 text-pink-700 border-pink-200" },
    { id: 3, name: "Therapist", description: "Terapis pijat refleksi dan relaksasi tubuh.", staffCount: 4, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { id: 4, name: "Aesthetic Doctor", description: "Dokter kecantikan untuk treatment medis seperti botox, laser, dll.", staffCount: 2, color: "bg-purple-100 text-purple-700 border-purple-200" },
    { id: 5, name: "Makeup Artist", description: "Penata rias untuk acara khusus atau wedding.", staffCount: 1, color: "bg-amber-100 text-amber-700 border-amber-200" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Master Profession</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola daftar profesi dan spesialisasi Service Provider Anda.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95 text-sm"
        >
          <Plus size={18} />
          Tambah Profesi
        </button>
      </div>

      {/* Profession Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {professionsData.map((prof) => (
          <div key={prof.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1 rounded-md text-xs font-bold border ${prof.color}`}>
                {prof.name}
              </div>
              <button className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-6 min-h-[40px] leading-relaxed">
              {prof.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-500">Terdapat staf dengan profesi ini</span>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-sm font-bold text-slate-900">{prof.staffCount} Staf</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Profession Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="text-indigo-500 w-5 h-5" />
                Buat Profesi Baru
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Profesi</label>
                <input type="text" placeholder="Cth: Junior Stylist" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi / Job Desk</label>
                <textarea rows={3} placeholder="Tulis deskripsi profesi..." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Warna Identitas (Label UI)</label>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 ring-blue-500 shadow-sm"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer hover:scale-110 transition-transform"></div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 cursor-pointer hover:scale-110 transition-transform"></div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors">
                Batal
              </button>
              <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                Simpan Profesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
