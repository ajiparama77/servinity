import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Hexagon, LayoutDashboard, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Security Guard
  if (!session?.user?.isSuperadmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2 text-white">
          <Hexagon fill="white" className="text-blue-500" size={24} />
          <span className="text-xl font-bold tracking-wider">SERVINITY</span>
          <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase ml-1">Admin</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin">
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <LayoutDashboard size={20} />
              Dashboard
            </span>
          </Link>
          <Link href="/admin/subscriptions">
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <CreditCard size={20} />
              Subscriptions
            </span>
          </Link>
          <Link href="/admin/templates">
            <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Hexagon size={20} />
              Templates & Roles
            </span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium text-white">{session.user.email}</p>
            <p className="text-xs text-slate-500">Super Administrator</p>
          </div>
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut({ redirectTo: "/" });
          }}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 gap-2">
              <LogOut size={18} />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
