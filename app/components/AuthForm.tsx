"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTenantStore } from "@/app/store/tenantStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hexagon } from "lucide-react";

type Template = {
  id: string;
  name: string;
  colorHex: string;
};

export default function AuthForm({ templates }: { templates: Template[] }) {
  const router = useRouter();
  const setTenantContext = useTenantStore((state) => state.setTenantContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const handleDummyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const dummyTenant = templates[0];
    if (dummyTenant) {
      setTenantContext("tenant-dummy-login", dummyTenant.name, dummyTenant.colorHex);
      router.push("/tenant-dummy-login/overview");
    }
  };

  const handleDummyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const template = templates.find(t => t.id === selectedTemplateId);
    if (template) {
      setTenantContext("tenant-new", template.name, template.colorHex);
      router.push("/tenant-new/overview");
    } else {
      alert("Please select a business template first");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-300 to-purple-200 p-4">
      
      <div className="w-full max-w-md">
        {/* Logo */}
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
                  ? "We missed you! Please enter your details." 
                  : "Set up your Servinity tenant today."}
              </p>
            </div>

            {isLogin ? (
              /* LOGIN FORM */
              <form onSubmit={handleDummyLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your Email" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter Password" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-600 font-medium hover:underline">Forgot password?</a>
                </div>

                <div className="pt-2 space-y-3">
                  <Button type="submit" className="w-full h-11 rounded-lg bg-[#5C6BFA] hover:bg-[#4a56c9] text-white font-medium text-base">
                    Sign in
                  </Button>
                  <Button type="button" variant="outline" className="w-full h-11 rounded-lg border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium text-base flex items-center justify-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                    Sign in with google
                  </Button>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleDummyRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-xs font-semibold text-gray-700">Business Name</Label>
                  <Input 
                    id="businessName" 
                    placeholder="e.g. Glamour Salon" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-700">Business Category</Label>
                  <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} required>
                    <SelectTrigger className="rounded-lg bg-gray-50/50 border-gray-200 h-11">
                      <SelectValue placeholder="Select business type...">
                        {selectedTemplateId ? templates.find(t => t.id === selectedTemplateId)?.name : "Select business type..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: template.colorHex }} />
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail" className="text-xs font-semibold text-gray-700">Owner Email</Label>
                  <Input 
                    id="ownerEmail" 
                    type="email" 
                    placeholder="owner@example.com" 
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerPassword" className="text-xs font-semibold text-gray-700">Password</Label>
                  <Input 
                    id="ownerPassword" 
                    type="password" 
                    placeholder="Create a strong password"
                    className="rounded-lg bg-gray-50/50 border-gray-200 h-11"
                    required 
                  />
                </div>
                
                <div className="pt-2">
                  <Button type="submit" className="w-full h-11 rounded-lg bg-[#5C6BFA] hover:bg-[#4a56c9] text-white font-medium text-base">
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-gray-500">
              {isLogin ? (
                <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-[#5C6BFA] font-semibold hover:underline">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-[#5C6BFA] font-semibold hover:underline">Sign in</button></>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
