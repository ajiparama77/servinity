import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      tenantId?: string;
      tenantSlug?: string;
      roleId?: string;
      isSuperadmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    tenantId?: string;
    tenantSlug?: string;
    roleId?: string;
    isSuperadmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string;
    tenantSlug?: string;
    roleId?: string;
    isSuperadmin?: boolean;
  }
}
