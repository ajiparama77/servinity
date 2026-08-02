"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Filter, Download, Plus } from "lucide-react";

export default function RosterShiftMock() {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const dates = [12, 13, 14, 15, 16, 17, 18];
  
  const staffs = [
    { name: "Budi Santoso", prof: "Hair Stylist", shifts: ["08:00 - 16:00", "08:00 - 16:00", "08:00 - 16:00", "08:00 - 16:00", "08:00 - 16:00", "Libur", "Libur"] },
    { name: "Siti Aminah", prof: "Manager", shifts: ["10:00 - 18:00", "10:00 - 18:00", "10:00 - 18:00", "10:00 - 18:00", "10:00 - 18:00", "10:00 - 18:00", "Libur"] },
    { name: "Joko Anwar", prof: "Nail Artist", shifts: ["Libur", "12:00 - 20:00", "12:00 - 20:00", "12:00 - 20:00", "12:00 - 20:00", "12:00 - 20:00", "12:00 - 20:00"] },
    { name: "Rina Kusuma", prof: "Admin", shifts: ["09:00 - 17:00", "09:00 - 17:00", "09:00 - 17:00", "09:00 - 17:00", "09:00 - 17:00", "Libur", "Libur"] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Roster & Shift</h1>
          <p className="text-slate-500 mt-1 text-sm">Atur jadwal kerja harian staf yang otomatis terintegrasi ke ketersediaan Appointment.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm">
            <Download size={16} />
            Export PDF
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm">
            <Plus size={16} />
            Assign Shift
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Calendar Header/Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="font-bold text-slate-900 min-w-[140px] text-center">12 - 18 Agustus 2026</span>
            <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
              <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-slate-800">Minggu</button>
              <button className="px-3 py-1.5 text-slate-500 rounded-md text-xs font-bold hover:text-slate-700">Bulan</button>
            </div>
            <button className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50">
              <Filter size={14} />
              Filter Staf
            </button>
          </div>
        </div>

        {/* Weekly Roster Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead className="bg-white">
              <tr>
                <th className="p-4 border-b border-slate-200 font-bold text-slate-800 min-w-[200px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  Data Staf
                </th>
                {days.map((day, idx) => (
                  <th key={day} className="p-4 border-b border-l border-slate-100 text-center min-w-[140px]">
                    <div className="font-bold text-slate-900">{day}</div>
                    <div className={`text-xs mt-1 ${dates[idx] === 12 ? 'w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto' : 'text-slate-500'}`}>
                      {dates[idx]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff, sIdx) => (
                <tr key={sIdx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 border-b border-slate-100 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{staff.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{staff.prof}</div>
                      </div>
                    </div>
                  </td>
                  {staff.shifts.map((shift, shiftIdx) => (
                    <td key={shiftIdx} className="p-2.5 border-b border-l border-slate-100 text-center relative group/cell">
                      {shift === "Libur" ? (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 py-2 rounded-lg text-xs font-semibold">
                          Off / Libur
                        </div>
                      ) : (
                        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-indigo-100 transition-colors">
                          {shift}
                        </div>
                      )}
                      
                      {/* Hover action to edit shift */}
                      <div className="absolute inset-0 bg-black/5 rounded-lg opacity-0 group-hover/cell:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-indigo-600">Edit</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
