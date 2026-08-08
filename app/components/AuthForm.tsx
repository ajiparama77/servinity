"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useTenantStore } from "@/app/store/tenantStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Hexagon } from "lucide-react";

export default function AuthForm() {
  const router = useRouter();
  const setPendingRegistration = useTenantStore((state) => state.setPendingRegistration);
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email atau password salah");
      } else {
        const session = await getSession();
        
        if (session?.user?.isSuperadmin) {
          router.push("/admin");
        } else if (session?.user?.tenantSlug) {
          router.push(`/${session.user.tenantSlug}/overview`);
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simpan data sementara ke state management untuk dibawa ke step selanjutnya (Onboarding)
    setPendingRegistration({ tenantName, email, password });
    
    // Arahkan ke halaman pemilihan kategori bisnis
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-300 to-purple-200 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center gap-2 mb-8 text-white">
          <Hexagon fill="white" className="text-blue-500" size={28} />
          <span className="text-2xl font-bold tracking-widest">SERVINITY</span>
        </div>

        <Card className="w-full shadow-2xl border-0 rounded-2xl p-4 bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back!" : "Create Workspace"}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {isLogin 
                  ? "Silakan login menggunakan akun Anda." 
                  : "Buat tenant baru Anda sekarang."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-[#5C6BFA] hover:bg-[#4a56c9] text-white font-medium text-base">
                    {loading ? "Loading..." : "Sign In"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName" className="text-xs font-semibold text-gray-700">Nama Bisnis / Tenant</Label>
                  <Input 
                    id="tenantName" 
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Cth: Acme Corp" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regEmail" className="text-xs font-semibold text-gray-700">Email Owner</Label>
                  <Input 
                    id="regEmail" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@example.com" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="regPassword" className="text-xs font-semibold text-gray-700">Password</Label>
                  <Input 
                    id="regPassword" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Buat password"
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-[#5C6BFA] hover:bg-[#4a56c9] text-white font-medium text-base">
                    Lanjutkan ke Pilihan Kategori
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-gray-500">
              {isLogin ? (
                <>Belum punya akun? <button onClick={() => setIsLogin(false)} className="text-[#5C6BFA] font-semibold hover:underline">Daftar sekarang</button></>
              ) : (
                <>Sudah punya akun? <button onClick={() => setIsLogin(true)} className="text-[#5C6BFA] font-semibold hover:underline">Sign in</button></>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
