"use client";

import { useTenantStore } from "@/app/store/tenantStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, UploadCloud, Hexagon, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function BusinessProfilePage() {
  const { businessTemplateName, themeColorHex, isSetupComplete, completeSetup, setTenantContext } = useTenantStore();
  const router = useRouter();
  const params = useParams();
  const tenantSlug = params.tenantId as string;

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [bName, setBName] = useState("");
  const [category, setCategory] = useState(businessTemplateName || "Salon & Beauty");
  const [colorHex, setColorHex] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchTenant() {
      try {
        const res = await fetch(`/api/tenants/${tenantSlug}`);
        if (res.ok) {
          const data = await res.json();
          setBName(data.name);
          if (data.businessTemplate?.name) {
            setCategory(data.businessTemplate.name);
          }
          if (data.logo_photo) {
            setLogoPreview(data.logo_photo);
          }
          if (data.colorHex) {
            setColorHex(data.colorHex);
          }
        }
      } catch (error) {
        console.error("Failed to fetch tenant:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (tenantSlug) {
      fetchTenant();
    }
  }, [tenantSlug]);

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', bName);
      formData.append('colorHex', colorHex);
      if (fileInputRef.current?.files?.[0]) {
        formData.append('logo', fileInputRef.current.files[0]);
      }

      const res = await fetch(`/api/tenants/${tenantSlug}`, {
        method: 'PUT',
        body: formData
      });
      
      if (res.ok) {
        const updated = await res.json();
        // Update context store so sidebar updates immediately
        setTenantContext(updated.id, updated.name, updated.effectiveColor || '#111827', updated.logo_photo);
        
        completeSetup();
        router.push(`/${tenantSlug}/overview`);
      } else {
        alert("Gagal mengupdate profil bisnis");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Business Profile</h2>
        <p className="text-gray-500 mt-2">Manage your core business information.</p>
      </div>

      {!isSetupComplete && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex items-start gap-3">
          <div className="mt-0.5"><CheckCircle2 size={20} className="text-blue-600"/></div>
          <div>
            <h4 className="font-semibold">Complete your profile</h4>
            <p className="text-sm mt-1">Please fill out your business details to unlock all features like Appointments and POS.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your company details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompleteSetup} className="space-y-6">
            
            {/* Logo Upload Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-gray-100">
              <div className="w-full md:w-1/3 space-y-2">
                <Label>Business Logo</Label>
                <p className="text-xs text-gray-500">This will be displayed on receipts and online booking page. (Max 2MB)</p>
              </div>
              <div className="w-full md:w-2/3 flex items-center gap-6">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-white ring-1 ring-gray-200 relative group"
                  style={{ backgroundColor: themeColorHex || '#f3f4f6' }}
                >
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Business Logo" className="w-full h-full object-cover" />
                      <div 
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => setLogoPreview(null)}
                      >
                        <X className="text-white" size={24} />
                      </div>
                    </>
                  ) : (
                    <Hexagon fill="white" className="opacity-20" size={48} />
                  )}
                </div>
                
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setLogoPreview(url);
                    }
                  }}
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <UploadCloud size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-blue-600">Click to upload</p>
                  <p className="text-xs text-gray-400">or drag and drop JPG, PNG</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="bName">Business Name</Label>
                <Input 
                  id="bName" 
                  value={bName} 
                  onChange={(e) => setBName(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={category} 
                  readOnly 
                  className="bg-gray-50 text-gray-500" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="colorHex">Custom Theme Color</Label>
                <div className="flex items-center gap-3">
                  <Input 
                    type="color" 
                    id="colorHexPicker" 
                    value={colorHex || "#111827"} 
                    onChange={(e) => setColorHex(e.target.value)} 
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    id="colorHex" 
                    placeholder="#FFFFFF or leave empty for default" 
                    value={colorHex} 
                    onChange={(e) => setColorHex(e.target.value)} 
                    className="flex-1 max-w-[200px]"
                  />
                </div>
                <p className="text-xs text-gray-500">Leave empty to use your category's default color.</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.push(`/${tenantSlug}/overview`)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSetupComplete ? "Save Changes" : "Save & Unlock Features"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
