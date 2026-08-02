"use client";

import { UserCheck, UserX, Activity, Clock, LogIn, AlertCircle } from "lucide-react";

export default function StaffManagementDashboard() {
  const stats = [
    { label: "Hadir", value: 45, icon: UserCheck, bg: "bg-emerald-500", text: "text-emerald-500", light: "bg-emerald-50" },
    { label: "Sakit", value: 2, icon: Activity, bg: "bg-amber-500", text: "text-amber-500", light: "bg-amber-50" },
    { label: "Izin", value: 1, icon: Clock, bg: "bg-blue-500", text: "text-blue-500", light: "bg-blue-50" },
    { label: "Tidak Masuk", value: 3, icon: UserX, bg: "bg-rose-500", text: "text-rose-500", light: "bg-rose-50" },
  ];

  const accessLogs = [
    { id: 1, name: "Budi Santoso", role: "Service Provider", time: "08:15 AM", status: "Success", device: "Desktop PC", ip: "192.168.1.10" },
    { id: 2, name: "Siti Aminah", role: "Manager", time: "08:30 AM", status: "Success", device: "iPhone 13", ip: "114.120.4.55" },
    { id: 3, name: "Andi Wijaya", role: "Service Provider", time: "08:45 AM", status: "Failed", device: "Unknown", ip: "192.168.1.15" },
    { id: 4, name: "Rina Kusuma", role: "Admin", time: "09:00 AM", status: "Success", device: "MacBook Pro", ip: "192.168.1.5" },
    { id: 5, name: "Joko Anwar", role: "Service Provider", time: "09:12 AM", status: "Success", device: "Android", ip: "114.120.4.55" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Dashboard</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Ringkasan kehadiran harian karyawan dan aktivitas akses sistem.
        </p>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300 overflow-hidden cursor-default hover:-translate-y-1"
          >
            {/* Decorative background blur */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${stat.bg} opacity-[0.03] group-hover:opacity-[0.06] blur-xl transition-opacity duration-300`} />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className={`text-4xl font-bold tracking-tight ${stat.text}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.light} ${stat.text} shadow-inner`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Access Logs Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LogIn className="w-5 h-5 text-indigo-500" />
              Akses Log Login Staf
            </h2>
            <p className="text-sm text-slate-500 mt-1">Aktivitas login terbaru dari pengguna sistem hari ini.</p>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
            Lihat Semua
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Staf</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Waktu Login</th>
                <th className="px-6 py-4 font-semibold">Perangkat & IP</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {log.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{log.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {log.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                    {log.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{log.device}</span>
                      <span className="text-xs text-slate-500 font-mono">{log.ip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === "Success" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        Berhasil
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Gagal
                      </span>
                    )}
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
