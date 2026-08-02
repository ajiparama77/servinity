"use client";

import { useState } from "react";
import { Users, Search, Plus, MoreHorizontal, X, UserCog, Briefcase, Mail, Phone } from "lucide-react";

export default function StaffListMock() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Service Provider");

  const staffData = [
    { id: 1, name: "Budi Santoso", email: "budi@servinity.com", phone: "081234567890", role: "Service Provider", profession: "Hair Stylist", status: "Active" },
    { id: 2, name: "Siti Aminah", email: "siti@servinity.com", phone: "081298765432", role: "Manager", profession: "-", status: "Active" },
    { id: 3, name: "Andi Wijaya", email: "andi@servinity.com", phone: "085612345678", role: "Cashier", profession: "-", status: "Inactive" },
    { id: 4, name: "Rina Kusuma", email: "rina@servinity.com", phone: "089912345678", role: "Admin", profession: "-", status: "Active" },
    { id: 5, name: "Joko Anwar", email: "joko@servinity.com", phone: "081112223333", role: "Service Provider", profession: "Nail Artist", status: "Active" },
  ];

  const roles = ["Admin", "Manager", "Cashier", "Service Provider"];
  const professions = ["Hair Stylist", "Nail Artist", "Therapist", "Doctor", "Makeup Artist"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff List</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola daftar seluruh staf, role, dan profesi di tenant ini.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={18} />
          Tambah Staf
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-50/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau role..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white" 
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white text-slate-600">
              <option>Semua Role</option>
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white text-slate-600">
              <option>Semua Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Profil Staf</th>
                <th className="px-6 py-4 font-semibold">Kontak</th>
                <th className="px-6 py-4 font-semibold">Role & Profesi</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffData.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100 shadow-inner">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{staff.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{staff.id === 1 || staff.id === 4 ? 'Full-time' : 'Part-time'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-slate-600">
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {staff.email}</div>
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {staff.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        <UserCog className="w-3 h-3" />
                        {staff.role}
                      </span>
                      {staff.role === "Service Provider" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                          <Briefcase className="w-3 h-3" />
                          {staff.profession}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal (Slide-over or centered dialog mock) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Tambah Staf Baru</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" placeholder="John Doe" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No. Handphone</label>
                  <input type="tel" placeholder="0812xxxxxx" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email / Username</label>
                <input type="email" placeholder="john@example.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">Role Sistem</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(role => (
                    <div 
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`cursor-pointer px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
                        selectedRole === role 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600 shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedRole === role ? 'border-indigo-600' : 'border-slate-300'
                      }`}>
                        {selectedRole === role && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                      </div>
                      <span className="text-sm font-medium">{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditional Input for Service Provider */}
              {selectedRole === "Service Provider" && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-indigo-900 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    Pilih Profesi (Master Profession)
                  </label>
                  <p className="text-xs text-indigo-600 mb-3">Staff ini akan dapat dipetakan layanannya berdasarkan profesinya.</p>
                  <select className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm text-slate-700">
                    <option value="" disabled selected>-- Pilih Profesi --</option>
                    {professions.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
