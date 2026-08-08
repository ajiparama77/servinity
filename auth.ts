import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // 1. Check Superadmin first
        const superadmin = await prisma.superadmin.findUnique({
          where: { email: credentials.email as string }
        });

        if (superadmin) {
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            superadmin.passwordHash
          );
          if (passwordsMatch) {
            return {
              id: superadmin.id,
              email: superadmin.email,
              isSuperadmin: true,
            };
          }
          return null; // Don't fall through if email matched superadmin but wrong password
        }

        // 2. Check regular User (Tenant)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true }
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            tenantId: user.tenantId,
            tenantSlug: user.tenant.slug,
            roleId: user.roleId,
            isSuperadmin: false,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId;
        token.tenantSlug = (user as any).tenantSlug;
        token.roleId = (user as any).roleId;
        token.isSuperadmin = (user as any).isSuperadmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        (session.user as any).tenantId = token.tenantId as string;
        (session.user as any).tenantSlug = token.tenantSlug as string;
        (session.user as any).roleId = token.roleId as string;
        (session.user as any).isSuperadmin = token.isSuperadmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
