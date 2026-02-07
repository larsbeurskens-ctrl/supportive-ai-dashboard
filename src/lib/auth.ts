import NextAuth from "next-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "email",
      name: "Email",
      type: "email",
      maxAge: 60 * 60, // 1 hour
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await resend.emails.send({
            from: "Supportive AI <noreply@supportive-ai.com>",
            to: email,
            subject: "Sign in to Supportive AI",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>Sign in to Supportive AI</title>
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; background: #f5f5f5;">
                  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 24px;">Sign in to Supportive AI</h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                      Click the button below to sign in to your dashboard. This link expires in 1 hour.
                    </p>
                    <a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600;">
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
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login/error",
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow specific emails (for now, hardcode allowed emails)
      const allowedEmails = [
        "lars@supportive-ai.com",
        "larsbeurskens@me.com",
        // Add more allowed emails here
      ];
      
      if (user.email && allowedEmails.includes(user.email.toLowerCase())) {
        return true;
      }
      
      // For now, allow all emails during development
      // Remove this line in production and use allowedEmails only
      return true;
    },
    async session({ session, token }) {
      // Add businessId to session (hardcoded for now, will come from DB later)
      if (session.user) {
        (session.user as any).businessId = "cml3ihts00000ifulnw03qk9v";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
