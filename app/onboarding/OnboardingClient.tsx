"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTenantStore } from "@/app/store/tenantStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Template = {
  id: string;
  name: string;
  colorHex?: string;
};

export default function OnboardingClient({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const pendingRegistration = useTenantStore((state) => state.pendingRegistration);
  
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      setError("Silakan pilih kategori bisnis");
      return;
    }
    
    if (!pendingRegistration) {
      setError("Data registrasi tidak ditemukan. Silakan kembali ke halaman awal untuk mendaftar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: pendingRegistration.email, 
          password: pendingRegistration.password, 
          tenantName: pendingRegistration.tenantName, 
          businessTemplateId: selectedTemplateId 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal melakukan registrasi");
      }

      // Login Otomatis
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: pendingRegistration.email,
        password: pendingRegistration.password,
      });

      if (signInRes?.error) {
         setError("Registrasi berhasil, tapi gagal login otomatis. Silakan login manual.");
      } else {
         router.push(`/${data.tenantSlug}/overview`);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Business Category</Label>
        <Select value={selectedTemplateId} onValueChange={(val) => setSelectedTemplateId(val || "")} required>
          <SelectTrigger className="rounded-lg bg-gray-50/50 border-gray-200 h-11">
            <SelectValue placeholder="Select business type...">
              {selectedTemplateId ? templates.find(t => t.id === selectedTemplateId)?.name : "Select business type..."}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: template.colorHex || '#5C6BFA' }} />
                  <span>{template.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
         <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
           {error}
         </div>
      )}

      <Button disabled={loading} type="submit" className="w-full h-11 rounded-lg bg-[#5C6BFA] hover:bg-[#4a56c9] text-white font-medium text-base">
        {loading ? "Memproses..." : "Complete Setup"}
      </Button>
    </form>
  );
}
