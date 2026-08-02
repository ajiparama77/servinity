"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter, Plus, User, AlertCircle, CheckCircle2, RotateCw, X, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AppointmentsPage() {
  const params = useParams();
  const tenantId = params.tenantId as string;

  // Mocking current date display
  const currentDate = "Selasa, 12 Agustus 2026";

  // Time slots for Y-axis (09:00 to 17:00)
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Staff for X-axis
  const staffMembers = [
    { id: 1, name: "dr. Kevin (Aesthetic)", role: "Doctor" },
    { id: 2, name: "Nurul", role: "Senior Therapist" },
    { id: 3, name: "Siska", role: "Junior Stylist" },
  ];

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Calendar Board</h1>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft size={18} /></button>
            <span className="text-sm font-bold text-slate-700 min-w-[160px] text-center flex items-center justify-center gap-2">
              <CalendarIcon size={14} /> {currentDate}
            </span>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight size={18} /></button>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors">Hari Ini</button>
        </div>

        <div className="flex gap-3">
          {/* Status Legend */}
          <div className="hidden lg:flex items-center gap-3 mr-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Booked</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> In Progress</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completed</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Late / No-Show</span>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={16} /> Filter Staf
          </button>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus size={16} /> Booking Baru
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[700px]">
        
        {/* Grid Header (Staff Columns) */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="w-20 border-r border-slate-200 shrink-0"></div> {/* Empty corner */}
          {staffMembers.map((staff) => (
            <div key={staff.id} className="flex-1 px-4 py-3 border-r border-slate-200 text-center min-w-[200px]">
              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-1">
                {staff.name.charAt(0)}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
              <p className="text-xs text-slate-500">{staff.role}</p>
            </div>
          ))}
        </div>

        {/* Grid Body (Time Rows & Appointments) */}
        <div className="flex-1 overflow-y-auto relative bg-slate-50/30">
          
          {/* Time scale markings (Background Grid) */}
          <div className="absolute inset-0 flex flex-col z-0">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="flex h-32 border-b border-slate-100/50">
                <div className="w-20 border-r border-slate-200 shrink-0 flex items-start justify-center pt-2 bg-white">
                  <span className="text-xs font-bold text-slate-400">{time}</span>
                </div>
                <div className="flex-1 border-r border-slate-100/50"></div>
                <div className="flex-1 border-r border-slate-100/50"></div>
                <div className="flex-1 border-r border-slate-100/50"></div>
              </div>
            ))}
          </div>

          {/* Current Time Indicator (Red line) */}
          <div className="absolute left-20 right-0 top-[400px] border-t-2 border-red-400 z-20 flex items-center" style={{ top: '42%' }}>
            <div className="absolute -left-1 w-2 h-2 rounded-full bg-red-500"></div>
          </div>

          {/* Appointments Overlay (The Drag & Drop Blocks) */}
          {/* Note: top/height are mocked in percentages or absolute pixels for visual effect */}
          <div className="absolute inset-0 ml-20 z-10 flex">
            
            {/* Column 1: Dr. Kevin */}
            <div className="flex-1 relative border-r border-slate-200 pointer-events-none">
              
              {/* Appointment 1: In Progress */}
              <div 
                onClick={() => setIsDetailModalOpen(true)}
                className="absolute left-2 right-2 top-[16px] h-[128px] bg-amber-50 border-l-4 border-amber-500 rounded shadow-sm p-2 pointer-events-auto cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-amber-900 text-xs truncate">Laser Treatment</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded animate-pulse">IN PROGRESS</span>
                </div>
                <p className="text-xs text-amber-700/80 mt-0.5 flex items-center gap-1"><User size={10}/> Sarah Wijaya</p>
                <p className="text-[10px] text-amber-600/70 mt-1 flex items-center gap-1"><Clock size={10}/> 09:15 - 10:15 (1h)</p>
              </div>

              {/* Conflict Prevention Engine Example */}
              {/* Double booked attempt showing red warning */}
              <div className="absolute left-2 w-[45%] top-[180px] h-[64px] bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded shadow-sm p-2 pointer-events-auto opacity-70 z-20">
                 <h4 className="font-bold text-red-900 text-xs truncate flex items-center gap-1"><AlertCircle size={10}/> Blocked</h4>
                 <p className="text-[10px] text-red-700 leading-tight mt-1">Sistem Mencegah Overlap</p>
              </div>

              {/* Appointment 2: Booked */}
              <div className="absolute right-2 w-[45%] top-[190px] h-[96px] bg-blue-50 border border-blue-100 border-l-4 border-l-blue-500 rounded shadow-sm p-2 pointer-events-auto cursor-grab hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-blue-900 text-xs truncate">Konsultasi</h4>
                </div>
                <p className="text-[10px] text-blue-700 mt-1 flex items-center gap-1"><User size={10}/> Budi S.</p>
                <p className="text-[10px] text-blue-600/70 mt-1 flex items-center gap-1"><Clock size={10}/> 10:30 - 11:15</p>
              </div>

            </div>

            {/* Column 2: Nurul (Multi-step Service Example) */}
            <div className="flex-1 relative border-r border-slate-200 pointer-events-none">
              
              {/* Appointment 3: Multi-step with Pause */}
              <div className="absolute left-2 right-2 top-[256px] flex flex-col pointer-events-auto">
                {/* Step 1: Action */}
                <div className="h-[64px] bg-blue-50 border border-blue-100 border-l-4 border-l-blue-500 rounded-t shadow-sm p-2 cursor-grab">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-blue-900 text-xs truncate">Hair Coloring (Step 1)</h4>
                  </div>
                  <p className="text-xs text-blue-700/80 mt-0.5"><User size={10} className="inline mr-1"/> Bella Ananda</p>
                </div>
                
                {/* Step 2: Pause (Staff is technically free here in DB, but visually linked) */}
                <div className="h-[64px] bg-slate-50 border-x border-slate-200 border-dashed relative flex items-center justify-center opacity-70">
                  <div className="absolute left-0 w-1 h-full bg-slate-300"></div>
                  <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm"><RotateCw size={10}/> Jeda Penyerapan (30m)</span>
                </div>

                {/* Step 3: Action */}
                <div className="h-[64px] bg-blue-50 border border-blue-100 border-l-4 border-l-blue-500 rounded-b shadow-sm p-2 cursor-grab">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-blue-900 text-xs truncate">Styling (Step 2)</h4>
                  </div>
                  <p className="text-[10px] text-blue-600/70 mt-1"><Clock size={10} className="inline mr-1"/> Selesai: 13:00</p>
                </div>
              </div>

            </div>

            {/* Column 3: Siska (Late Status) */}
            <div className="flex-1 relative pointer-events-none">
               {/* Appointment 4: Late */}
               <div className="absolute left-2 right-2 top-[350px] h-[96px] bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded shadow-sm p-2 pointer-events-auto cursor-grab hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-red-900 text-xs truncate">Premium Haircut</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded">LATE 15m</span>
                </div>
                <p className="text-xs text-red-700/80 mt-0.5 flex items-center gap-1"><User size={10}/> Michael Chen</p>
                <p className="text-[10px] text-red-600/70 mt-1 flex items-center gap-1"><Clock size={10}/> 11:30 - 12:15</p>
              </div>

               {/* Appointment 5: Completed */}
               <div className="absolute left-2 right-2 top-[64px] h-[64px] bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 rounded shadow-sm p-2 pointer-events-auto opacity-75">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-emerald-900 text-xs truncate">Creambath</h4>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <p className="text-xs text-emerald-700/80 mt-0.5"><User size={10} className="inline mr-1"/> Chika</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Slide-over Modal for New Booking */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsBookingModalOpen(false)}></div>
          
          {/* Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Buat Appointment Baru</h2>
                <p className="text-xs text-slate-500">Cek ketersediaan staf dan ruangan.</p>
              </div>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200">
                <X size={16} />
              </button>
            </div>

            {/* Modal form content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Customer Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">1. Data Pelanggan</h3>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Quick Add (Barbershop)</span>
                </div>
                
                <div className="space-y-3">
                  {/* Quick Add Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pelanggan (Wajib)</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Budi atau Tamu 1" 
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      defaultValue="Walk-in Guest"
                    />
                  </div>
                  
                  {/* Optional contact fields usually hidden in quick add, but shown small */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">No. HP (Opsional)</label>
                      <input 
                        type="text" 
                        placeholder="0812..." 
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Member (Jika ada)</label>
                      <button className="w-full flex items-center justify-between text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors text-left">
                        <span>Cari di Database...</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Service Selection Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">2. Pilih Layanan</h3>
                
                {/* Regular vs Paket Toggle */}
                <div className="flex p-1 bg-slate-100 rounded-lg">
                  <button className="flex-1 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-md shadow-sm">Regular</button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">Paket (Bundles)</button>
                </div>

                {/* Service Select Mock */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Layanan Regular</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500">
                    <option>Pilih layanan...</option>
                    <option>Premium Haircut - Rp 85.000 (45m)</option>
                    <option>Hair Coloring - Rp 250.000 (90m)</option>
                    <option>Shave & Massage - Rp 60.000 (30m)</option>
                  </select>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Staff & Time Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">3. Jadwal & Staf</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Staf</label>
                    <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500">
                      <option>Any (Siapa saja)</option>
                      <option>dr. Kevin</option>
                      <option>Nurul</option>
                      <option>Siska</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Waktu</label>
                    <input 
                      type="time" 
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                      defaultValue="10:00"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button onClick={() => setIsBookingModalOpen(false)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
              <button className="flex-1 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors">Simpan Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full animate-pulse">In Progress</span>
                  <span className="text-xs font-medium text-amber-700">Booking ID: #APP-9982</span>
                </div>
                <h2 className="text-xl font-bold text-amber-950">Laser Treatment</h2>
                <p className="text-sm text-amber-800/80 mt-1 flex items-center gap-1.5"><Clock size={14}/> 09:15 - 10:15 (1 Jam) • Hari Ini</p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 bg-white/50 rounded-full text-amber-700 hover:bg-white hover:text-amber-900 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Info Klien & Staf */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Klien</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">Sarah Wijaya</p>
                    <Link href={`/${tenantId}/customers/profile`} className="text-[10px] text-indigo-600 font-medium hover:underline">Lihat Profil</Link>
                  </div>
                  <p className="text-xs text-slate-500">+62 812-3456-7890</p>
                </div>
                
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Staf & Ruang</p>
                  <p className="text-sm font-bold text-slate-900">dr. Kevin</p>
                  <p className="text-xs text-slate-500">Treatment Room 1</p>
                </div>
              </div>

              {/* Rincian Transaksi */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">Rincian Layanan & Add-ons</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">Laser Hair Removal (Underarm)</span>
                    <span className="font-medium">Rp 850.000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 text-xs italic">+ Soothing Gel Add-on</span>
                    <span className="font-medium text-xs">Rp 50.000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 font-bold">
                    <span className="text-slate-900">Total Harga</span>
                    <span className="text-indigo-700">Rp 900.000</span>
                  </div>
                </div>
              </div>

              {/* Update Status Actions */}
              <div className="pt-2">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Update Status</h4>
                 <div className="grid grid-cols-4 gap-2">
                   <button className="py-2 text-xs font-medium bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed">Booked</button>
                   <button className="py-2 text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 rounded-lg shadow-sm">In Progress</button>
                   <button className="py-2 text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg transition-colors">Completed</button>
                   <button className="py-2 text-xs font-medium bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-lg transition-colors">No-Show</button>
                 </div>
              </div>
            </div>

            {/* Footer / CTA */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors">Batalkan Booking</button>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                Lanjut ke Pembayaran (POS)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
