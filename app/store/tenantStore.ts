import { create } from 'zustand';

interface TenantState {
  tenantId: string | null;
  businessTemplateName: string | null;
  themeColorHex: string | null;
  logoUrl: string | null;
  isSetupComplete: boolean;
  pendingRegistration: any | null; // { tenantName, email, password }
  setTenantContext: (id: string, name: string, color: string, logoUrl?: string) => void;
  setPendingRegistration: (data: any) => void;
  completeSetup: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenantId: null,
  businessTemplateName: null,
  themeColorHex: null,
  logoUrl: null,
  isSetupComplete: false,
  pendingRegistration: null,
  setTenantContext: (id, name, color, logoUrl) => 
    set({ tenantId: id, businessTemplateName: name, themeColorHex: color, logoUrl: logoUrl || null, isSetupComplete: true }),
  setPendingRegistration: (data) => set({ pendingRegistration: data }),
  completeSetup: () => set({ isSetupComplete: true })
}));
