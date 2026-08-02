"use client";

import { useState } from "react";
import { Wrench, Network, Plus, Check } from "lucide-react";

export default function SkillsMapMock() {
  const [selectedProf, setSelectedProf] = useState("Hair Stylist");

  const professions = ["Hair Stylist", "Nail Artist", "Therapist"];
  
  // Mock mappings
  const serviceCategories = [
    {
      category: "Hair Treatment",
      services: [
        { id: "s1", name: "Premium Haircut", duration: "45 Min", mapped: true },
        { id: "s2", name: "Kids Haircut", duration: "30 Min", mapped: true },
        { id: "s3", name: "Hair Coloring", duration: "120 Min", mapped: true },
        { id: "s4", name: "Keratin Treatment", duration: "90 Min", mapped: true },
      ]
    },
    {
      category: "Nail Care",
      services: [
        { id: "s5", name: "Manicure Basic", duration: "45 Min", mapped: false },
        { id: "s6", name: "Pedicure Basic", duration: "45 Min", mapped: false },
        { id: "s7", name: "Gel Polish", duration: "60 Min", mapped: false },
      ]
    },
    {
      category: "Spa & Body",
      services: [
        { id: "s8", name: "Full Body Massage", duration: "90 Min", mapped: false },
        { id: "s9", name: "Foot Reflexology", duration: "60 Min", mapped: false },
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Skill & Service Mapping</h1>
        <p className="text-slate-500 mt-1 text-sm">Tentukan layanan apa saja yang bisa dikerjakan oleh profesi tertentu.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profession List (Left) */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Pilih Profesi</h3>
            </div>
            <div className="p-2 space-y-1">
              {professions.map(prof => (
                <div 
                  key={prof} 
                  onClick={() => setSelectedProf(prof)}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all font-medium text-sm flex items-center justify-between ${
                    selectedProf === prof 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {prof}
                  {selectedProf === prof && <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mapped Services (Right) */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Network className="text-indigo-500 w-5 h-5" />
                  Pemetaan Layanan: {selectedProf}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Centang layanan yang diizinkan untuk dikerjakan oleh {selectedProf}.</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
                Simpan Pemetaan
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {serviceCategories.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-bold text-slate-800">{cat.category}</h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {cat.services.map((svc) => (
                      <div 
                        key={svc.id} 
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedProf === "Hair Stylist" && svc.mapped 
                          ? 'bg-indigo-50/50 border-indigo-200' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-[4px] border flex items-center justify-center transition-colors ${
                            selectedProf === "Hair Stylist" && svc.mapped
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                            : 'bg-white border-slate-300'
                          }`}>
                            {selectedProf === "Hair Stylist" && svc.mapped && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${selectedProf === "Hair Stylist" && svc.mapped ? 'text-indigo-900' : 'text-slate-700'}`}>
                              {svc.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{svc.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
