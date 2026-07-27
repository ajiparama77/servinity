import {
  Building2,
  MapPin,
  Receipt,
  CreditCard,
  Users,
  UserCog,
  Calendar,
  CalendarClock,
  Scissors,
  Package,
  MonitorSmartphone,
  BarChart3
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
};

export type ModuleConfig = {
  [key: string]: {
    title: string;
    items: NavItem[];
  };
};

export const getDynamicSidebarMenu = (tenantId: string): ModuleConfig => ({
  "settings": {
    title: "Settings",
    items: [
      { name: "Business Profile", href: `/${tenantId}/settings/business-profile`, icon: Building2 },
      { name: "Locations & Branches", href: `/${tenantId}/settings/locations`, icon: MapPin },
      { name: "Holidays & Off-Days", href: `/${tenantId}/settings/holidays`, icon: Calendar },
      { name: "Tax & Payment", href: `/${tenantId}/settings/tax`, icon: Receipt },
      { name: "Subscription", href: `/${tenantId}/settings/billing`, icon: CreditCard },
    ]
  },
  "staff-management": {
    title: "Staff Management",
    items: [
      { name: "Staff List", href: `/${tenantId}/staff-management`, icon: Users },
      { name: "Roles & Access", href: `/${tenantId}/staff-management/roles`, icon: UserCog },
    ]
  },
  "appointments": {
    title: "Appointments",
    items: [
      { name: "Calendar View", href: `/${tenantId}/appointments`, icon: Calendar },
      { name: "Online Booking", href: `/${tenantId}/appointments/online`, icon: CalendarClock },
    ]
  },
  "services": {
    title: "Services",
    items: [
      { name: "Service Menu", href: `/${tenantId}/services`, icon: Scissors },
      { name: "Packages & Bundles", href: `/${tenantId}/services/packages`, icon: Package },
    ]
  },
  "pos": {
    title: "POS Checkout",
    items: [
      { name: "Terminal", href: `/${tenantId}/pos`, icon: MonitorSmartphone },
      { name: "Daily Sales", href: `/${tenantId}/pos/sales`, icon: Receipt },
    ]
  },
  "reports": {
    title: "Reports",
    items: [
      { name: "Overview", href: `/${tenantId}/reports`, icon: BarChart3 },
    ]
  },
  "customers": {
    title: "Customers",
    items: [
      { name: "Client List", href: `/${tenantId}/customers`, icon: Users },
    ]
  }
});
