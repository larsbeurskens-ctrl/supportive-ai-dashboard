import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { authConfig } from "./auth.config";

const prisma = new PrismaClient();
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://supportive-ai-backend-production.up.railway.app';

// Full auth config with email provider + database adapter
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "email",
      name: "Email",
      type: "email",
      maxAge: 60 * 60, // 1 hour
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // Rate limit: max 3 emails per address per hour, 30 global per hour
        const now = new Date();
        const perEmailCount = await prisma.verificationToken.count({
          where: { identifier: email.toLowerCase(), expires: { gt: now } }
        });
        if (perEmailCount >= 3) {
          console.warn(`[AUTH] Rate limit hit for ${email}: ${perEmailCount} active tokens`);
          throw new Error("Too many sign-in attempts for this email. Please try again later.");
        }
        const globalCount = await prisma.verificationToken.count({
          where: { expires: { gt: now } }
        });
        if (globalCount >= 30) {
          console.warn(`[AUTH] Global rate limit hit: ${globalCount} active tokens`);
          throw new Error("Service is busy. Please try again later.");
        }

        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Brand the email by the user's business (Cotorra vs Supportive AI)
        let isCotorra = false;
        try {
          const r = await fetch(`${API_BASE}/api/users/by-email/${encodeURIComponent(email.toLowerCase())}`);
          if (r.ok) {
            const u = await r.json();
            isCotorra = u?.business?.brand === 'cotorra';
          }
        } catch { /* default to Supportive AI branding */ }
        const brandName = isCotorra ? "Cotorra" : "Supportive AI";
        const accent = isCotorra ? "#0F9A66" : "#e8930c";
        const headingColor = isCotorra ? "#16150F" : "#1a1a1a";
        
        try {
          await resend.emails.send({
            from: `${brandName} <noreply@supportive-ai.com>`,
            to: email,
            subject: `Sign in to ${brandName}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head><meta charset="utf-8"><title>Sign in to ${brandName}</title></head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: #f5f5f5;">
                  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h1 style="color: ${headingColor}; font-size: 24px; margin-bottom: 24px;">Sign in to ${brandName}</h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                      Click the button below to sign in to your dashboard. This link expires in 1 hour.
                    </p>
                    <a href="${url}" style="display: inline-block; background: ${accent}; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Sign in to Dashboard
                    </a>
                    <p style="color: #999; font-size: 14px; margin-top: 32px;">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                  </div>
                </body>
              </html>
            `,
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    },
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      // On sign-in, create or get user in our backend
      if (user.email) {
        try {
          await fetch(`${API_BASE}/api/users/auth-callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, name: user.name }),
          });
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
        }
      }
      return true;
    },
    async jwt({ token, trigger }) {
      // Fetch business info on sign-in or when token is refreshed
      if (trigger === 'signIn' || !token.businessId || (token as any).brand === undefined) {
        if (token.email) {
          try {
            const res = await fetch(`${API_BASE}/api/users/by-email/${encodeURIComponent(token.email)}`);
            if (res.ok) {
              const userData = await res.json();
              token.userId = userData.id;
              token.role = userData.role;
              if (userData.business) {
                token.businessId = userData.business.id;
                token.businessName = userData.business.name;
                token.industry = userData.business.industry;
                token.timezone = userData.business.timezone;
                (token as any).brand = userData.business.brand ?? null;
              }
            }
          } catch (error) {
            console.error('Failed to fetch user business info:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).userId = token.userId;
        (session.user as any).role = token.role;
        (session.user as any).businessId = token.businessId || null;
        (session.user as any).businessName = token.businessName || null;
        (session.user as any).industry = token.industry || null;
        (session.user as any).timezone = token.timezone || null;
        (session.user as any).brand = (token as any).brand ?? null;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Notify Lars when a new user signs up
      const ADMIN_EMAIL = 'larsbeurskens@gmail.com';
      if (user.email && user.email !== ADMIN_EMAIL) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Supportive AI <noreply@supportive-ai.com>",
            to: ADMIN_EMAIL,
            subject: `🎉 New signup: ${user.email}`,
            html: `<div style="font-family:sans-serif;padding:20px;">
              <h2 style="margin:0 0 12px">New user signed up</h2>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Name:</strong> ${user.name || '(not provided)'}</p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              <p style="margin-top:16px;"><a href="https://supportive-ai.com/dashboard">Open Dashboard</a></p>
            </div>`,
          });
        } catch (err) {
          console.error('[AUTH] Failed to send new signup notification:', err);
        }
      }
    },
  },
});
