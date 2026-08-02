"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import { useState } from "react";
import { 
  BarChart3, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Users, 
  CalendarCheck, 
  Scissors, 
  Clock, 
  Download, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const { themeColorHex, businessTemplateName } = useTenantStore();
  const [activeTab, setActiveTab] = useState<"dashboard" | "reports" | "billing">("dashboard");
  const [reportSubTab, setReportSubTab] = useState<"orders" | "sales" | "commission" | "tax">("orders");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reporting & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau performa bisnis dan status langganan Anda.</p>
        </div>

        <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BarChart3 size={16} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'reports' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FileText size={16} /> Reports
          </button>
          <button 
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'billing' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CreditCard size={16} /> Subscription
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------- */}
      {/* 1. OPERATIONAL DASHBOARD */}
      {/* ----------------------------------------------------- */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white relative overflow-hidden">
              <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Today's Revenue</p>
                  <div className="p-1.5 bg-white/20 rounded-lg"><TrendingUp size={16} className="text-white" /></div>
                </div>
                <h3 className="text-2xl font-bold mb-1">Rp 4.250.000</h3>
                <p className="text-xs text-indigo-100 flex items-center gap-1">
                  <span className="text-emerald-300 font-bold">+12%</span> vs kemarin
                </p>
              </CardContent>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Appts</p>
                  <div className="p-1.5 bg-blue-50 rounded-lg"><CalendarCheck size={16} className="text-blue-500" /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">24</h3>
                <p className="text-xs text-slate-500">Hari ini</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Occupancy Rate</p>
                  <div className="p-1.5 bg-emerald-50 rounded-lg"><Users size={16} className="text-emerald-500" /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">78%</h3>
                <p className="text-xs text-slate-500">Dari kapasitas harian</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Top Service</p>
                  <div className="p-1.5 bg-pink-50 rounded-lg"><Scissors size={16} className="text-pink-500" /></div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight">Premium Haircut</h3>
                <p className="text-xs text-slate-500 mt-2">12 Booking</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Staff Util.</p>
                  <div className="p-1.5 bg-orange-50 rounded-lg"><Clock size={16} className="text-orange-500" /></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">85%</h3>
                <p className="text-xs text-slate-500">Rata-rata sibuk</p>
              </CardContent>
            </Card>

          </div>

          {/* Charts Area Mock */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-0 shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Trend Pendapatan (7 Hari Terakhir)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-64 flex items-center justify-center bg-slate-50/50">
                {/* Mock Chart Visual */}
                <div className="w-full h-full flex items-end justify-between px-4 gap-2">
                  {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} className="w-full bg-indigo-100 rounded-t-sm relative group">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-sm transition-all group-hover:bg-indigo-400" 
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Performa Staf Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { name: "dr. Kevin", rev: "Rp 1.500k", count: 5 },
                    { name: "Nurul", rev: "Rp 1.200k", count: 8 },
                    { name: "Siska", rev: "Rp 850k", count: 6 }
                  ].map((s, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.count} Layanan</p>
                      </div>
                      <p className="font-bold text-indigo-700 text-sm">{s.rev}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* 2. BASIC REPORTS & ORDER HISTORY */}
      {/* ----------------------------------------------------- */}
      {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Sub Navigation for Reports */}
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setReportSubTab("orders")}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${reportSubTab === "orders" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Riwayat Pemesanan
            </button>
            <button 
              onClick={() => setReportSubTab("sales")}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${reportSubTab === "sales" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Laporan Penjualan
            </button>
            <button 
              onClick={() => setReportSubTab("commission")}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${reportSubTab === "commission" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Laporan Komisi Staf
            </button>
            <button 
              onClick={() => setReportSubTab("tax")}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${reportSubTab === "tax" ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              Ringkasan Pajak
            </button>
          </div>

          {/* SUB: Order History */}
          {reportSubTab === "orders" && (
            <Card className="border-0 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <CardHeader className="border-b border-slate-100 bg-white pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Riwayat Pemesanan (Order History)</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Daftar transaksi berdasarkan rentang waktu.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 text-sm">
                    <span className="text-slate-500 mr-2 text-xs">Filter:</span>
                    <input type="date" defaultValue="2026-08-01" className="bg-transparent border-none text-slate-700 font-medium outline-none text-xs" />
                    <span className="mx-2 text-slate-400">-</span>
                    <input type="date" defaultValue="2026-08-12" className="bg-transparent border-none text-slate-700 font-medium outline-none text-xs" />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-6 py-4">Waktu & Invoice</th>
                        <th className="px-6 py-4">Pelanggan</th>
                        <th className="px-6 py-4">Layanan / Item</th>
                        <th className="px-6 py-4">Total Bayar</th>
                        <th className="px-6 py-4">Kasir / Metode</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { time: "12 Agu 2026 13:45", inv: "INV-20260812-001", cust: "Sarah Wijaya", item: "Laser Treatment + Gel", total: 943500, method: "QRIS", cashier: "Admin1" },
                        { time: "12 Agu 2026 12:15", inv: "INV-20260812-002", cust: "Budi", item: "Premium Haircut", total: 94350, method: "CASH", cashier: "Admin1" },
                        { time: "12 Agu 2026 10:30", inv: "INV-20260812-003", cust: "Chika", item: "Creambath", total: 222000, method: "CARD", cashier: "Admin2" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{row.inv}</p>
                            <p className="text-xs text-slate-500">{row.time}</p>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">{row.cust}</td>
                          <td className="px-6 py-4">{row.item}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">Rp {row.total.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold mr-2">{row.method}</span>
                            <span className="text-xs text-slate-500">{row.cashier}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SUB: Sales Report */}
          {reportSubTab === "sales" && (
            <Card className="border-0 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <CardHeader className="border-b border-slate-100 bg-white pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Laporan Penjualan (Harian/Bulanan)</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Akumulasi pendapatan kotor.</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-6 py-4">Periode</th>
                        <th className="px-6 py-4">Total Order</th>
                        <th className="px-6 py-4">Gross Revenue</th>
                        <th className="px-6 py-4">Total Discount</th>
                        <th className="px-6 py-4">Net Sales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { period: "Agustus 2026", tx: 450, gross: 85000000, disc: 2500000, net: 82500000 },
                        { period: "Juli 2026", tx: 420, gross: 78000000, disc: 1200000, net: 76800000 },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{row.period}</td>
                          <td className="px-6 py-4">{row.tx} Transaksi</td>
                          <td className="px-6 py-4">Rp {row.gross.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 text-red-500">- Rp {row.disc.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">Rp {row.net.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SUB: Commission Report */}
          {reportSubTab === "commission" && (
            <Card className="border-0 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <CardHeader className="border-b border-slate-100 bg-white pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Laporan Komisi Staf</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Rincian komisi yang harus dibayarkan ke staf.</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-6 py-4">Nama Staf</th>
                        <th className="px-6 py-4">Total Layanan</th>
                        <th className="px-6 py-4">Nilai Transaksi (Gross)</th>
                        <th className="px-6 py-4">Total Komisi Diraih</th>
                        <th className="px-6 py-4">Status Pembayaran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: "dr. Kevin", count: 85, gross: 45000000, comm: 18000000, status: "Belum Dibayar" },
                        { name: "Nurul", count: 120, gross: 15000000, comm: 4500000, status: "Lunas" },
                        { name: "Siska", count: 110, gross: 8500000, comm: 2550000, status: "Lunas" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                          <td className="px-6 py-4">{row.count} Selesai</td>
                          <td className="px-6 py-4 text-slate-500">Rp {row.gross.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 font-bold text-orange-500">Rp {row.comm.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${row.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SUB: Tax Summary */}
          {reportSubTab === "tax" && (
            <Card className="border-0 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <CardHeader className="border-b border-slate-100 bg-white pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Ringkasan Pajak Terpungut</CardTitle>
                  <p className="text-xs text-slate-500 mt-1">PPN/PB1 yang ditambahkan pada transaksi pelanggan.</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-6 py-4">Bulan</th>
                        <th className="px-6 py-4">Tarif Pajak Diterapkan</th>
                        <th className="px-6 py-4">Dasar Pengenaan Pajak (DPP)</th>
                        <th className="px-6 py-4">Total Pajak Terpungut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { month: "Agustus 2026", rate: "11%", dpp: 82500000, tax: 9075000 },
                        { month: "Juli 2026", rate: "11%", dpp: 76800000, tax: 8448000 },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">{row.month}</td>
                          <td className="px-6 py-4">{row.rate}</td>
                          <td className="px-6 py-4 text-slate-500">Rp {row.dpp.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 font-bold text-red-600">Rp {row.tax.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* 3. SUBSCRIPTION & BILLING */}
      {/* ----------------------------------------------------- */}
      {activeTab === "billing" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Current Plan Status */}
            <Card className="border-0 shadow-md md:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  <CheckCircle2 size={14} /> ACTIVE PLAN
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Paket Langganan Servinity</h3>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">Premium Plan</h2>
                <p className="text-slate-500 mb-6">Paket lengkap untuk manajemen {businessTemplateName || "Klinik/Salon"} tanpa batasan fitur.</p>
                
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-4xl font-bold text-indigo-600">Rp 499.000</span>
                  <span className="text-slate-500 font-medium pb-1">/ bulan</span>
                </div>

                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">Periode Penagihan Berikutnya</p>
                    <p className="font-bold text-slate-900">12 September 2026</p>
                  </div>
                  <div className="flex-1 border-l border-slate-100 pl-4">
                    <p className="text-xs text-slate-500 mb-1">Metode Pembayaran</p>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400"/> BCA Virtual Account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions / Upgrade */}
            <Card className="border-0 shadow-sm bg-slate-50 flex flex-col justify-center">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-indigo-500">
                  <TrendingUp size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Kelola Langganan</h3>
                <p className="text-xs text-slate-500 mb-6">Upgrade ke paket tahunan untuk menghemat hingga 20%.</p>
                <div className="space-y-2">
                  <button className="w-full py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                    Upgrade ke Tahunan
                  </button>
                  <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                    Ganti Metode Pembayaran
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Billing History */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Riwayat Tagihan (Billing History)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { date: "12 Agu 2026", invoice: "INV-202608-001", amount: 499000, status: "Paid" },
                  { date: "12 Jul 2026", invoice: "INV-202607-001", amount: 499000, status: "Paid" },
                  { date: "12 Jun 2026", invoice: "INV-202606-001", amount: 499000, status: "Paid" },
                ].map((inv, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{inv.invoice}</p>
                        <p className="text-xs text-slate-500">{inv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-bold text-slate-900">Rp {inv.amount.toLocaleString('id-ID')}</p>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full w-20 justify-center">
                        {inv.status}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-800"><Download size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
