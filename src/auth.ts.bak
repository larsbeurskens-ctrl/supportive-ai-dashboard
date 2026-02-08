import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";

// For now, we'll use a simple in-memory user store
// In production, connect to the backend database
const allowedEmails = [
  "lars@supportive-ai.com",
  "larsbeurskens@gmail.com",
  // Add more allowed emails here
];

export const authConfig: NextAuthConfig = {
  providers: [
    Resend({
      from: "Supportive AI <noreply@supportive-ai.com>",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
    async signIn({ user }) {
      // Only allow specific emails during beta
      if (user.email && allowedEmails.includes(user.email.toLowerCase())) {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      // Add businessId to session (hardcoded for now, will come from DB later)
      if (session.user) {
        (session.user as any).businessId = "cml3ihts00000ifulnw03qk9v";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
