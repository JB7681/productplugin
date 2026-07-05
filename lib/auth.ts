import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

// ==========================================================
// ADMIN ACCESS CONTROL
// Only the Gmail address(es) listed in ADMIN_EMAILS (env var,
// comma-separated) are allowed into /admin. Everyone else who
// signs in with Google is authenticated but NOT authorized.
// ==========================================================
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Allow the Google OAuth flow to complete for anyone (so NextAuth
      // doesn't error out), but we gate real access in middleware + isAdmin().
      return !!user.email;
    },
    async session({ session }) {
      if (session.user?.email) {
        (session.user as any).isAdmin = ADMIN_EMAILS.includes(
          session.user.email.toLowerCase()
        );
      }
      return session;
    },
  },
};

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
