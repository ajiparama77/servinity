"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, MonitorSmartphone, Settings, BarChart3, UsersRound, Scissors, Lock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OverviewPage() {
  const { businessTemplateName, themeColorHex, isSetupComplete } = useTenantStore();
  const params = useParams();
  const tenantId = params.tenantId as string;

  const modules = [
    {
      title: "Settings",
      description: "Company info & business hours",
      icon: Settings,
      href: `/${tenantId}/settings`,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      alwaysUnlocked: true
    },
    {
      title: "Staff",
      description: "Manage employees & roles",
      icon: Users,
      href: `/${tenantId}/staff-management`,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Services",
      description: "Service menu & pricing",
      icon: Scissors,
      href: `/${tenantId}/services`,
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      title: "Customers",
      description: "Client database & history",
      icon: UsersRound,
      href: `/${tenantId}/customers`,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Appointments",
      description: "Manage bookings & calendar",
      icon: CalendarDays,
      href: `/${tenantId}/appointments`,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "POS Checkout",
      description: "Sales and transactions",
      icon: MonitorSmartphone,
      href: `/${tenantId}/pos`,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Reports",
      description: "Analytics & commissions",
      icon: BarChart3,
      href: `/${tenantId}/reports`,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      
      {/* Welcome Banner */}
      <div 
        className="rounded-2xl p-8 text-white shadow-lg relative overflow-hidden"
        style={{ backgroundColor: themeColorHex || '#111827' }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to {businessTemplateName || "Dashboard"}</h1>
          <p className="text-white/90 max-w-lg">
            {!isSetupComplete 
              ? "Please complete your business profile in Settings to unlock all features." 
              : "Manage your daily operations, track sales, and overview your staff performance all in one place."}
          </p>
        </div>
        
        {/* Abstract shapes for background */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2"></div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 px-1">Application Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            const isLocked = !isSetupComplete && !mod.alwaysUnlocked;
            
            // Highlight settings if setup not complete
            const isHighlighted = !isSetupComplete && mod.alwaysUnlocked;

            return (
              <Link 
                key={i} 
                href={isLocked ? "#" : mod.href} 
                className={`block group ${isLocked ? 'cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  if (isLocked) {
                    e.preventDefault();
                    alert("Selesaikan profil bisnis Anda terlebih dahulu di menu Settings.");
                  }
                }}
              >
                <Card className={`h-full border-0 transition-all duration-300 overflow-hidden relative
                  ${isLocked ? 'bg-gray-50/50 shadow-sm opacity-70' : 'shadow-md hover:shadow-xl hover:-translate-y-1 group-hover:ring-2 ring-gray-200'}
                  ${isHighlighted ? 'ring-2 ring-blue-400 ring-offset-2 animate-pulse' : ''}
                `}>
                  
                  {isLocked && (
                    <div className="absolute top-3 right-3 text-gray-400">
                      <Lock size={18} />
                    </div>
                  )}

                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300
                      ${isLocked ? 'bg-gray-100 text-gray-400' : `${mod.bgColor} ${mod.color} group-hover:scale-110`}
                    `}>
                      <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{mod.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
