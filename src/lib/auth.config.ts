import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Base config without email provider (for middleware - Edge compatible)
export const authConfig: NextAuthConfig = {
  providers: [], // Email provider added in full auth.ts
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      
      if (isOnDashboard && !isLoggedIn) {
        return false; // Redirect to login
      }
      
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
};

// For middleware only - no Node.js dependencies
export const { auth: authMiddleware } = NextAuth(authConfig);
