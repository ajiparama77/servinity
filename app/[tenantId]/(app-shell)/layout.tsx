"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, LogOut, ArrowLeft } from "lucide-react";
import { getDynamicSidebarMenu } from "@/lib/navigation";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const tenantId = params.tenantId as string;
  const { businessTemplateName, themeColorHex } = useTenantStore();

  const handleLogout = () => {
    router.push("/");
  };

  const isOverview = pathname.endsWith('/overview');
  
  // Extract module name from pathname: e.g. /tenant-123/settings/profile -> 'settings'
  const pathSegments = pathname.split('/').filter(Boolean);
  // pathSegments[0] is tenantId, pathSegments[1] is the module
  const currentModuleKey = pathSegments.length > 1 ? pathSegments[1] : 'overview';

  const dynamicMenuConfig = getDynamicSidebarMenu(tenantId);
  const activeMenu = dynamicMenuConfig[currentModuleKey];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      {!isOverview && (
        <aside 
          className="w-64 text-white flex flex-col transition-colors duration-300 shadow-xl z-10 shrink-0"
          style={{ backgroundColor: themeColorHex || '#111827' }}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight">Servinity</h2>
            <p className="text-sm opacity-80 mt-1 font-medium">{businessTemplateName || "Loading..."}</p>
          </div>

          <div className="px-4 mb-4">
            <Link 
              href={`/${tenantId}/overview`}
              className="flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/30 py-2 px-3 rounded-md"
            >
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
          </div>

          <div className="px-6 py-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">
              {activeMenu?.title || "Menu"}
            </h3>
          </div>

          <nav className="flex-1 mt-2">
            <ul className="space-y-1 px-4">
              {activeMenu?.items.map((item) => {
                const isActive = pathname.includes(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-white/20 font-semibold shadow-sm"
                          : "hover:bg-white/10 hover:translate-x-1"
                      }`}
                    >
                      <Icon size={18} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          <div className="p-4">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-md hover:bg-red-500/80 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* Header */}
        <header 
          className={`px-8 py-4 flex justify-between items-center shadow-sm z-0 shrink-0 transition-colors duration-300 ${themeColorHex ? 'text-white border-b border-white/10' : 'bg-white border-b'}`}
          style={{ backgroundColor: themeColorHex || undefined }}
        >
          <div className={`flex items-center text-sm ${themeColorHex ? 'text-white/80' : 'text-gray-500'}`}>
            <span>{businessTemplateName || "Dashboard"}</span>
            <ChevronRight size={16} className="mx-2" />
            <span className={`font-semibold capitalize ${themeColorHex ? 'text-white' : 'text-gray-900'}`}>
              {activeMenu ? activeMenu.title : 'Overview'}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <button className={`relative transition-colors ${themeColorHex ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
              <Bell size={20} />
              <span className={`absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ${themeColorHex ? 'border border-white' : ''}`}></span>
            </button>
            <div className={`h-6 w-px ${themeColorHex ? 'bg-white/20' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${themeColorHex ? 'hover:bg-black/10' : 'hover:bg-gray-50'}`}>
              <div className="text-right hidden md:block">
                <p className={`text-sm font-bold ${themeColorHex ? 'text-white' : 'text-gray-900'}`}>John Doe</p>
                <p className={`text-xs ${themeColorHex ? 'text-white/80' : 'text-gray-500'}`}>Owner</p>
              </div>
              <div className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center text-sm font-bold ${themeColorHex ? 'bg-white/20 border-white/50 text-white' : 'bg-gradient-to-tr from-gray-200 to-gray-300 border-white text-gray-600'}`}>
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
