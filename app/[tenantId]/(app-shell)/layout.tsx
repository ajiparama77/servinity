"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, LogOut, ArrowLeft } from "lucide-react";
import { getDynamicSidebarMenu } from "@/lib/navigation";
import { useEffect, useState, useRef } from "react";
import { getSession, signOut } from "next-auth/react";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const tenantSlug = params.tenantId as string;
  const pathname = usePathname();
  const router = useRouter();
  const { businessTemplateName, themeColorHex, logoUrl, setTenantContext } = useTenantStore();

  const [userName, setUserName] = useState("Loading...");
  const [userRole, setUserRole] = useState("User");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initTenant() {
      if (!tenantSlug) return;
      try {
        const res = await fetch(`/api/tenants/${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          setTenantContext(data.id, data.name, data.effectiveColor || '#111827', data.logo_photo);
        }
      } catch (error) {
        console.error("Failed to fetch tenant for layout:", error);
      }
    }
    
    if (!businessTemplateName) {
      initTenant();
    }
  }, [tenantSlug, businessTemplateName, setTenantContext, themeColorHex]);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setUserName(session.user.name || session.user.email?.split('@')[0] || "User");
        setUserRole((session.user as any).roleName || ((session.user as any).isSuperadmin ? "Superadmin" : "Admin"));
      }
    });

    // Close dropdown on outside click
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const isOverview = pathname.endsWith('/overview');
  
  // Extract module name from pathname: e.g. /tenant-123/settings/profile -> 'settings'
  const pathSegments = pathname.split('/').filter(Boolean);
  // pathSegments[0] is tenantId, pathSegments[1] is the module
  const currentModuleKey = pathSegments.length > 1 ? pathSegments[1] : 'overview';

  const dynamicMenuConfig = getDynamicSidebarMenu(tenantSlug);
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
            <div className="flex items-center gap-3">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Tenant Logo" className="w-8 h-8 rounded-md object-cover bg-white p-0.5" />
              )}
              <h2 className="text-2xl font-bold tracking-tight">Servinity</h2>
            </div>
            <p className="text-sm opacity-80 mt-1 font-medium">{businessTemplateName || "Loading..."}</p>
          </div>

          <div className="px-4 mb-4">
            <Link 
              href={`/${tenantSlug}/overview`}
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
            
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${themeColorHex ? 'hover:bg-black/10' : 'hover:bg-gray-50'}`}
              >
                <div className="text-right hidden md:block">
                  <p className={`text-sm font-bold ${themeColorHex ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
                  <p className={`text-xs capitalize ${themeColorHex ? 'text-white/80' : 'text-gray-500'}`}>{userRole}</p>
                </div>
                <div className={`w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center text-sm font-bold uppercase ${themeColorHex ? 'bg-white/20 border-white/50 text-white' : 'bg-gradient-to-tr from-gray-200 to-gray-300 border-white text-gray-600'}`}>
                  {userName.substring(0, 2)}
                </div>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-bold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
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
