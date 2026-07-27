import { create } from 'zustand';

interface TenantState {
  tenantId: string | null;
  businessTemplateName: string | null;
  themeColorHex: string | null;
  isSetupComplete: boolean;
  setTenantContext: (id: string, name: string, color: string) => void;
  completeSetup: () => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenantId: null,
  businessTemplateName: null,
  themeColorHex: null,
  isSetupComplete: false,
  setTenantContext: (id, name, color) => 
    set({ tenantId: id, businessTemplateName: name, themeColorHex: color, isSetupComplete: false }),
  completeSetup: () => set({ isSetupComplete: true })
}));
