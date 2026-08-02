"use client";

import React, { useState } from "react";
import { ArrowLeft, UserCircle, Phone, Mail, Calendar, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, History, FileSignature, Stethoscope, Star, FileText, MapPin, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomerProfilePage() {
  const params = useParams();
  const tenantId = params.tenantId as string;
  const [activeTab, setActiveTab] = useState("basic_info");

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href={`/${tenantId}/customers`} className="p-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Detail Profil Pelanggan</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Client Identity & Warning Badge */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 flex items-center justify-center text-amber-700 font-bold text-3xl shadow-inner mb-4 relative">
              SW
              <div className="absolute -bottom-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border-2 border-white shadow-sm">
                Gold Member
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">Sarah Wijaya</h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5"><Phone size={14}/> +62 812-3456-7890</p>

            <div className="w-full mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Lifetime Spend</p>
                <p className="text-lg font-bold text-slate-900 mt-1">Rp 15.45M</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total Visits</p>
                <p className="text-lg font-bold text-slate-900 mt-1">24x</p>
              </div>
            </div>
          </div>

          {/* Risk Badge Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">No-Show & Flagging Rate</h3>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">30%</p>
                <p className="text-xs text-slate-500 font-medium">Tingkat Ketidakhadiran</p>
              </div>
            </div>
            
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-amber-500 h-full w-[30%]"></div>
            </div>
            <p className="text-xs text-slate-500">
              Klien ini telah tidak hadir (No-Show) sebanyak <span className="font-bold text-slate-700">3 kali</span> dari 10 janji temu terakhir.
            </p>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">Sistem merekomendasikan penagihan DP (Down Payment) wajib sebesar 50% untuk *booking* klien ini di masa mendatang.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Data */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Horizontal Tabs */}
            <div className="flex items-center border-b border-slate-100 bg-slate-50/50 px-2 pt-2 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab("basic_info")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'basic_info' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <UserCircle size={16} /> Informasi Dasar
              </button>
              <button 
                onClick={() => setActiveTab("history")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <History size={16} /> Riwayat Pembelian
              </button>
              <button 
                onClick={() => setActiveTab("ratings")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'ratings' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <MessageSquareQuote size={16} /> Kritik & Saran
              </button>
              <button 
                onClick={() => setActiveTab("medical")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'medical' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <Stethoscope size={16} /> Rekam Medis
              </button>
              <button 
                onClick={() => setActiveTab("digital_form")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'digital_form' ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                <FileSignature size={16} /> Digital Sign
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 flex-1">
              
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic_info' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Informasi Dasar Pelanggan</h3>
                    <button className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">Edit Profil</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Nama Lengkap</label>
                      <p className="text-sm font-medium text-slate-900">Sarah Wijaya</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">sarah.w@example.com <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Verified</span></p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Nomor HP / WhatsApp</label>
                      <p className="text-sm font-medium text-slate-900">+62 812-3456-7890</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500 uppercase">Tanggal Lahir</label>
                      <p className="text-sm font-medium text-slate-900">14 Februari 1995 (29 Tahun)</p>
                    </div>
                    <div className="space-y-1 md:col-span-2 pt-4 border-t border-slate-100">
                      <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1.5"><MapPin size={14}/> Alamat Tempat Tinggal</label>
                      <p className="text-sm text-slate-700 mt-1">Jl. Sudirman No. 45, Komplek Mutiara Indah, Blok C2<br/>Kecamatan Kebayoran Baru, Jakarta Selatan, 12190</p>
                    </div>
                    <div className="space-y-1 md:col-span-2 pt-4 border-t border-slate-100">
                      <label className="text-xs font-medium text-slate-500 uppercase">Preferensi Terapis / Staf</label>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium rounded-full">dr. Kevin (Aesthetic)</span>
                        <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium rounded-full">Mbak Nurul (Spa)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HISTORY (PURCHASE & APPOINTMENT) */}
              {activeTab === 'history' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Riwayat Pembelian & Janji Temu</h3>
                    <select className="text-xs font-medium px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none">
                      <option>Semua Waktu</option>
                      <option>Tahun Ini</option>
                      <option>Bulan Ini</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-start justify-between p-4 border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors bg-slate-50/30">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">Laser Hair Removal - Underarm</h4>
                            <p className="text-xs text-slate-500 mt-1">12 Agustus 2026, 14:00 wib</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle2 size={12} /> Selesai</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">Rp 850.000</p>
                          <p className="text-xs text-slate-500 font-medium text-indigo-600 mt-1 hover:underline cursor-pointer">POS-#10042</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: RATINGS & FEEDBACK */}
              {activeTab === 'ratings' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Kritik, Saran & Penilaian Klien</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(star => <Star key={star} size={14} className="fill-amber-400 text-amber-400" />)}
                        </div>
                        <span className="text-xs text-slate-400">12 Ags 2026</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Laser Hair Removal - Underarm</h4>
                      <p className="text-sm text-slate-600 italic">"Pelayanannya sangat ramah, dr. Kevin menjelaskan prosedurnya dengan sangat detail. Tidak terlalu sakit seperti yang saya bayangkan. Terima kasih!"</p>
                    </div>

                    <div className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3].map(star => <Star key={star} size={14} className="fill-amber-400 text-amber-400" />)}
                          {[4,5].map(star => <Star key={star} size={14} className="text-slate-200" />)}
                        </div>
                        <span className="text-xs text-slate-400">22 Jun 2026</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">Body Scrub & Spa</h4>
                      <p className="text-sm text-slate-600 italic">"Pijatannya enak, tapi ruangannya agak terlalu dingin AC-nya, mungkin next time bisa disesuaikan ya suhu ruangannya."</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDICAL RECORDS */}
              {activeTab === 'medical' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Data Medis & Kondisi Fisik</h3>
                    <button className="text-xs font-medium px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md">Update Rekam Medis</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5"><AlertTriangle size={14}/> Catatan Alergi</p>
                      <p className="text-sm font-medium text-red-900 mt-2">Alergi terhadap kandungan Retinol konsentrasi tinggi. Kulit sensitif pada area T-Zone.</p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Stethoscope size={14}/> Kondisi Fisik Umum</p>
                      <p className="text-sm font-medium text-slate-900 mt-2">Normal. Riwayat tekanan darah stabil. Sedang tidak dalam masa kehamilan.</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-bold text-slate-900 text-sm mb-4 border-b border-slate-100 pb-2">Catatan Dokter / Terapis (Treatment Notes)</h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-100 text-indigo-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                          <Stethoscope size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-900 text-sm">Review Pasca-Laser</h4>
                            <span className="text-xs font-medium text-slate-500">12 Ags 2026</span>
                          </div>
                          <p className="text-xs text-slate-600">Reaksi kulit normal, sedikit kemerahan yang memudar dalam 2 jam. Dianjurkan menggunakan soothing gel 2x sehari selama 3 hari.</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">Ditulis oleh: dr. Kevin</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DIGITAL RISK FORMS */}
              {activeTab === 'digital_form' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">Digital Consent & Risk Forms</h3>
                      <p className="text-xs text-slate-500 mt-1">Formulir persetujuan medis yang telah ditandatangani oleh klien secara digital.</p>
                    </div>
                    <button className="text-xs font-medium px-3 py-1.5 bg-indigo-600 text-white rounded-md">Minta Tanda Tangan Baru</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Signed Form Card */}
                    <div className="p-5 border border-emerald-100 bg-emerald-50/30 rounded-xl relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="absolute top-0 right-0 p-3">
                        <ShieldCheck className="text-emerald-500/20 w-16 h-16" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Signed</span>
                          <span className="text-xs text-slate-500 font-medium">12 Ags 2026, 13:45</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Laser Treatment Consent & Risk Ack.</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 pr-12">Persetujuan untuk tindakan laser intensitas tinggi, pemahaman akan risiko hiperpigmentasi sementara.</p>
                        
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-emerald-100">
                          <div className="flex items-center gap-2">
                            <FileSignature size={14} className="text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-800">TTD Digital: Verified</span>
                          </div>
                          <button className="text-xs font-medium text-indigo-600 hover:underline">Lihat PDF</button>
                        </div>
                      </div>
                    </div>

                    {/* Unsigned / Pending Form Card */}
                    <div className="p-5 border border-amber-100 bg-amber-50/30 rounded-xl relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded">Pending Signature</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">Chemical Peeling Patch Test Result</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">Persetujuan hasil patch test sebelum melakukan Chemical Peeling seluruh wajah.</p>
                        
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-amber-100">
                          <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md w-full">Buka Panel Tanda Tangan (iPad)</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
