"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  const { themeColorHex } = useTenantStore();
  const params = useParams();
  const tenantId = params.tenantId as string;

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Topbar Minimalis */}
      <header 
        className="h-16 flex items-center justify-between px-6 text-white shadow-md z-10"
        style={{ backgroundColor: themeColorHex || '#333' }}
      >
        <div className="flex items-center space-x-4">
          <Link href={`/${tenantId}/overview`} className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            Servinity POS
          </Link>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">Main Branch</span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-sm font-medium">Online</span>
          </div>
          <div className="h-6 w-px bg-white/30"></div>
          <div className="text-sm">Cashier: <span className="font-semibold">Budi (PIN Login)</span></div>
          <button className="bg-white text-gray-900 px-4 py-1.5 rounded text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm">
            Switch User
          </button>
        </div>
      </header>

      {/* POS Workspace (No global sidebar) */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
