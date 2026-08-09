"use client";

import { useState, useEffect } from "react";
import { Users, Search, Plus, MoreHorizontal, X, UserCog, Briefcase, Mail, Phone, Pencil, Trash2 } from "lucide-react";

export default function StaffListClient({ 
  initialStaff, 
  roles, 
  professions, 
  tenantId 
}: { 
  initialStaff: any[], 
  roles: any[], 
  professions: any[], 
  tenantId: string 
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [staffList, setStaffList] = useState<any[]>(initialStaff);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    professionId: "",
    isActive: true
  });
  
  const resetForm = () => {
    setFormData({ fullName: "", phone: "", email: "", password: "", professionId: "", isActive: true });
    setSelectedRoleId("");
    setEditingStaffId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (staff: any) => {
    setEditingStaffId(staff.id);
    setFormData({
      fullName: staff.fullName || "",
      phone: staff.phone || "",
      email: staff.user?.email || "",
      password: "", // Leave blank for edit unless they want to change
      professionId: staff.professionId || "",
      isActive: staff.isActive
    });
    setSelectedRoleId(staff.user?.roleId || "");
    setIsAddModalOpen(true);
  };
  // Try to pre-select Service Provider if it exists
  const serviceProviderRole = roles.find(r => r.templateRole?.roleCode === 'SERVICE_PROVIDER');
  const isServiceProviderSelected = selectedRoleId === serviceProviderRole?.id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !selectedRoleId) {
      alert("Harap lengkapi semua field wajib (Nama, Email, Role)");
      return;
    }

    if (!editingStaffId && !formData.password) {
      alert("Password diwajibkan untuk staf baru");
      return;
    }

    if (isServiceProviderSelected && !formData.professionId) {
      alert("Harap pilih profesi untuk Service Provider");
      return;
    }

    setIsSubmitting(true);
    try {
      const pathSegments = window.location.pathname.split('/');
      const slug = pathSegments[1];

      const url = editingStaffId 
        ? `/api/tenants/${slug}/staff/${editingStaffId}` 
        : `/api/tenants/${slug}/staff`;
        
      const res = await fetch(url, {
        method: editingStaffId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roleId: selectedRoleId,
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menyimpan data");
      }

      // Success, refresh the page to get fresh data
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus staf ${name}? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    try {
      const pathSegments = window.location.pathname.split('/');
      const slug = pathSegments[1];
      const res = await fetch(`/api/tenants/${slug}/staff/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");
      window.location.reload();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff List</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola daftar seluruh staf, role, dan profesi di tenant ini.</p>
        </div>
        <button 
          onClick={openAddModal}
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
              {roles.map(r => <option key={r.id} value={r.id}>{r.templateRole?.roleName}</option>)}
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
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-100 shadow-inner">
                        {staff.fullName ? staff.fullName.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{staff.fullName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Staff ID: {staff.id.toString().substring(0,8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-slate-600">
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {staff.user?.email || '-'}</div>
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {staff.phone || '-'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        <UserCog className="w-3 h-3" />
                        {staff.user?.role?.templateRole?.roleName || '-'}
                      </span>
                      {staff.profession && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                          <Briefcase className="w-3 h-3" />
                          {staff.profession.professionName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      staff.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${staff.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(staff)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger" title="Edit Staf">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(staff.id, staff.fullName)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger" title="Hapus Staf">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingStaffId ? "Edit Staf" : "Tambah Staf Baru"}</h2>
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
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No. Handphone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0812xxxxxx" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email / Username</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password {editingStaffId ? "(Kosongkan jika tidak ingin mengubah)" : "Awal"}</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={editingStaffId ? "Kosongkan jika tidak diubah" : "Password untuk staff login"} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>

              {editingStaffId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Akun</label>
                  <select name="isActive" value={formData.isActive.toString()} onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.value === 'true'}))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}

              <div className="border-t border-slate-100 pt-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">Role Sistem</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(role => (
                    <div 
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`cursor-pointer px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
                        selectedRoleId === role.id 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600 shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedRoleId === role.id ? 'border-indigo-600' : 'border-slate-300'
                      }`}>
                        {selectedRoleId === role.id && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                      </div>
                      <span className="text-sm font-medium">{role.templateRole?.roleName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditional Input for Service Provider */}
              {isServiceProviderSelected && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-indigo-900 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    Pilih Profesi (Master Profession)
                  </label>
                  <p className="text-xs text-indigo-600 mb-3">Staff ini akan dapat dipetakan layanannya berdasarkan profesinya.</p>
                  <select name="professionId" value={formData.professionId} onChange={handleInputChange} className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm text-slate-700">
                    <option value="" disabled>-- Pilih Profesi --</option>
                    {professions.map(p => (
                      <option key={p.id} value={p.id}>{p.professionName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
