"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import { useState } from "react";
import { User, Clock, Scissors, Plus } from "lucide-react";

export default function POSPage() {
  const { themeColorHex } = useTenantStore();
  
  const statusTabs = ["On Progress", "Finished", "Done"];
  const [activeTab, setActiveTab] = useState("Finished");

  // Mock Appointments
  const appointments = [
    { id: 1, customer: "Sarah Wijaya", service: "Laser Treatment", price: 850000, status: "On Progress", time: "09:15", staff: "dr. Kevin" },
    { id: 4, customer: "Nuril", service: "Hair Coloring", price: 450000, status: "On Progress", time: "11:00", staff: "Nurul" },
    { id: 2, customer: "Chika", service: "Creambath", price: 200000, status: "Finished", time: "10:00", staff: "Siska" },
    { id: 5, customer: "Tamu 1 (Walk-in)", service: "Premium Haircut", price: 85000, status: "Finished", time: "12:30", staff: "Nurul" },
    { id: 3, customer: "Budi", service: "Basic Haircut", price: 60000, status: "Done", time: "08:00", staff: "Siska" },
  ];

  // Mock Products / Add-ons for the right panel
  const availableProducts = [
    { id: 101, name: "Hair Tonic", price: 120000 },
    { id: 102, name: "Soothing Gel", price: 50000 },
    { id: 103, name: "Post-treatment Cream", price: 250000 },
  ];

  const [selectedAppt, setSelectedAppt] = useState<typeof appointments[0] | null>(null);
  const [additionalItems, setAdditionalItems] = useState<{id: number, name: string, price: number, qty: number}[]>([]);

  const filteredAppointments = appointments.filter(a => a.status === activeTab);

  const handleSelectAppointment = (appt: typeof appointments[0]) => {
    setSelectedAppt(appt);
    setAdditionalItems([]); // reset additions when changing appointment
  };

  const addProduct = (prod: typeof availableProducts[0]) => {
    if (!selectedAppt) return;
    setAdditionalItems(prev => {
      const exists = prev.find(p => p.id === prod.id);
      if (exists) {
        return prev.map(p => p.id === prod.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const basePrice = selectedAppt ? selectedAppt.price : 0;
  const additionsTotal = additionalItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const subtotal = basePrice + additionsTotal;
  const tax = subtotal * 0.11;
  const grandTotal = subtotal + tax;

  return (
    <div className="flex w-full h-full bg-slate-50">
      {/* Left Panel: Appointments */}
      <div className="flex-1 flex flex-col border-r border-slate-200">
        
        {/* Header & Tabs */}
        <div className="bg-white p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Daftar Transaksi (POS)</h2>
          <div className="flex space-x-2">
            {statusTabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Appointments Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">Tidak ada appointment dengan status ini.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.map(appt => (
                <button 
                  key={appt.id}
                  onClick={() => handleSelectAppointment(appt)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    selectedAppt?.id === appt.id 
                      ? 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/30 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-slate-900 text-lg">{appt.customer}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      appt.status === 'On Progress' ? 'bg-amber-100 text-amber-700' :
                      appt.status === 'Finished' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 mb-4">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Scissors size={14} className="text-indigo-500"/> {appt.service}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Clock size={14} className="text-indigo-500"/> {appt.time} (Staf: {appt.staff})
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Tagihan Layanan</span>
                    <span className="font-bold text-indigo-700">Rp {appt.price.toLocaleString('id-ID')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Payment / Bill */}
      <div className="w-[400px] bg-white flex flex-col shadow-2xl z-20 shrink-0">
        
        {/* Bill Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Rincian Pembayaran</h2>
          <p className="text-sm text-slate-500 mt-1">
            {selectedAppt ? `Order #${selectedAppt.id} - ${selectedAppt.customer}` : "Pilih appointment di samping"}
          </p>
        </div>
        
        {/* Bill Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {!selectedAppt ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <p>Belum ada transaksi terpilih</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Base Service */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Layanan Utama</h3>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{selectedAppt.service}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Staf: {selectedAppt.staff}</p>
                  </div>
                  <p className="font-bold text-slate-900">Rp {selectedAppt.price.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Additional Products */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Additional / Produk</h3>
                </div>
                
                {additionalItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {additionalItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">Rp {item.price.toLocaleString('id-ID')} x {item.qty}</p>
                        </div>
                        <p className="font-bold text-sm text-slate-900">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add Product Dropdown/Buttons Mock */}
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <p className="text-xs font-medium text-indigo-800 mb-2">+ Tambah Pembelian Lain:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableProducts.map(prod => (
                      <button 
                        key={prod.id}
                        onClick={() => addProduct(prod)}
                        className="text-xs bg-white border border-indigo-200 text-indigo-700 px-2 py-1.5 rounded hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        {prod.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Totals & Checkout Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Pajak (11%)</span>
              <span className="font-medium text-slate-900">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-slate-200">
              <span className="text-slate-900">Total</span>
              <span className="text-indigo-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <button 
            disabled={!selectedAppt || selectedAppt.status === 'Done'}
            className={`w-full py-4 text-white rounded-xl font-bold text-lg shadow-lg transition-all
              ${!selectedAppt || selectedAppt.status === 'Done' ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-indigo-500/25'}
            `}
            style={{ backgroundColor: (!selectedAppt || selectedAppt.status === 'Done') ? undefined : (themeColorHex || '#4f46e5') }}
          >
            {selectedAppt?.status === 'Done' ? 'Sudah Lunas' : 'Proses Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
}
