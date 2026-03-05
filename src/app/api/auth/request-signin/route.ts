import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, turnstileToken, callbackUrl = "/dashboard" } = await req.json();

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verify Turnstile token
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (secretKey && secretKey !== "SKIP") {
      if (!turnstileToken) {
        return Response.json({ error: "Verification required" }, { status: 403 });
      }
      const cfRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: secretKey, response: turnstileToken }),
        }
      );
      const cfData = await cfRes.json();
      if (!cfData.success) {
        console.warn(`[AUTH] Turnstile failed for ${normalizedEmail}:`, cfData);
        return Response.json({ error: "Bot verification failed" }, { status: 403 });
      }
    }

    // 2. Rate limit: max 3 per email per hour, 30 global per hour
    const now = new Date();
    const perEmailCount = await prisma.verificationToken.count({
      where: { identifier: normalizedEmail, expires: { gt: now } },
    });
    if (perEmailCount >= 3) {
      console.warn(`[AUTH] Rate limit hit for ${normalizedEmail}: ${perEmailCount} tokens`);
      return Response.json(
        { error: "Too many attempts. Please try again in an hour." },
        { status: 429 }
      );
    }
    const globalCount = await prisma.verificationToken.count({
      where: { expires: { gt: now } },
    });
    if (globalCount >= 30) {
      console.warn(`[AUTH] Global rate limit hit: ${globalCount} active tokens`);
      return Response.json(
        { error: "Service is busy. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Create verification token (matching NextAuth's format)
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(`${rawToken}${secret}`)
      .digest("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.verificationToken.create({
      data: { identifier: normalizedEmail, token: hashedToken, expires },
    });

    // 4. Build callback URL (matches NextAuth's email callback format)
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
    const params = new URLSearchParams({
      callbackUrl,
      token: rawToken,
      email: normalizedEmail,
    });
    const verifyUrl = `${baseUrl}/api/auth/callback/email?${params}`;

    // 5. Send email via Resend (same template as auth.ts)
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Supportive AI <noreply@supportive-ai.com>",
      to: normalizedEmail,
      subject: "Sign in to Supportive AI",
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sign in to Supportive AI</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px;background:#f5f5f5;">
<div style="max-width:500px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
<h1 style="color:#1a1a1a;font-size:24px;margin-bottom:24px;">Sign in to Supportive AI</h1>
<p style="color:#666;font-size:16px;line-height:1.6;margin-bottom:32px;">Click the button below to sign in to your dashboard. This link expires in 1 hour.</p>
<a href="${verifyUrl}" style="display:inline-block;background:#e8930c;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">Sign in to Dashboard</a>
<p style="color:#999;font-size:14px;margin-top:32px;">If you didn't request this email, you can safely ignore it.</p>
</div></body></html>`,
    });

    console.log(`[AUTH] Verification email sent to ${normalizedEmail}`);
    return Response.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[AUTH] request-signin error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
