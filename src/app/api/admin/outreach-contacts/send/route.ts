import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "larsbeurskens@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://supportive-ai.com";

const VERTICAL_DESTINATIONS: Record<string, string> = {
  plumbing: "/plumbing#hear-it",
  window_cleaning: "/window-cleaning#hear-it",
  hvac: "/hvac#hear-it",
};

const VERTICAL_LABELS: Record<string, string> = {
  plumbing: "plumbing",
  window_cleaning: "window cleaning",
  hvac: "HVAC",
};

const DEMO_PHONES: Record<string, string> = {
  plumbing: "(240) 301-1473",
  window_cleaning: "(845) 209-2401",
  hvac: "(845) 209-2401",
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function buildEmail(contact: {
  name?: string | null; businessName?: string | null; vertical: string;
  painSignal?: string | null; score: number;
}, trackingUrl: string, template: string): { subject: string; html: string } {
  const firstName = contact.name?.split(" ")[0] || "there";
  const biz = contact.businessName || "your business";
  const vLabel = VERTICAL_LABELS[contact.vertical] || contact.vertical;
  const demoPhone = DEMO_PHONES[contact.vertical] || "(845) 209-2401";
  const hasPain = !!contact.painSignal;

  if (template === "follow_up") {
    return {
      subject: `Re: Quick question about ${biz}`,
      html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#1a2e3b;font-size:15px;line-height:1.7;">
<p>Hi ${firstName},</p>
<p>Just following up — I know ${vLabel} work keeps you busy (which is exactly why I built this).</p>
<p>If you're curious, the fastest way to see what Supportive AI does is to hear a real call recording:</p>
<p style="margin:20px 0;"><a href="${trackingUrl}" style="background:#e8930c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Listen to a 2-min demo call →</a></p>
<p>Or call our demo agent yourself: <strong>${demoPhone}</strong></p>
<p>If the timing isn't right, no worries at all.</p>
<p>Lars<br/><span style="color:#5a7184;font-size:13px;">Founder, Supportive AI</span></p>
</div>`,
    };
  }

  // first_touch — pain signal version
  if (hasPain) {
    return {
      subject: `How ${biz} sounds when you miss a call`,
      html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#1a2e3b;font-size:15px;line-height:1.7;">
<p>Hi ${firstName},</p>
<p>I built an AI receptionist that answers ${vLabel} calls 24/7 — books appointments, checks your calendar, and sends the customer a confirmation text. All before you finish the job you're on.</p>
<p>Here's a real call recording so you can hear exactly what your customers would experience:</p>
<p style="margin:20px 0;"><a href="${trackingUrl}" style="background:#e8930c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Listen to a 2-min demo call →</a></p>
<p>It handles emergencies too — flags them immediately and texts you with the details.</p>
<p>I'll give you a quick call this week to see if it's a fit. No pitch, just want to hear how you handle calls today.</p>
<p>— Lars<br/><span style="color:#5a7184;font-size:13px;">Founder, Supportive AI · ${demoPhone}</span></p>
</div>`,
    };
  }

  // first_touch — no pain signal
  return {
    subject: `Never miss another ${vLabel} call`,
    html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#1a2e3b;font-size:15px;line-height:1.7;">
<p>Hi ${firstName},</p>
<p>I built an AI receptionist that answers ${vLabel} calls 24/7 — books appointments, checks your calendar, and sends the customer a confirmation text. All before you finish the job you're on.</p>
<p>Here's a real call recording so you can hear what your customers would experience:</p>
<p style="margin:20px 0;"><a href="${trackingUrl}" style="background:#e8930c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Listen to a 2-min demo call →</a></p>
<p>Costs less than one missed job per month — and you can try it free for 7 days, no card required.</p>
<p>Worth a quick call this week?</p>
<p>— Lars<br/><span style="color:#5a7184;font-size:13px;">Founder, Supportive AI · ${demoPhone}</span></p>
</div>`,
  };
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contactId, template = "first_touch" } = await req.json();
  if (!contactId) return Response.json({ error: "contactId required" }, { status: 400 });

  const contact = await prisma.outreachContact.findUnique({ where: { id: contactId } });
  if (!contact) return Response.json({ error: "Contact not found" }, { status: 404 });
  if (contact.status === "sent" && template === "first_touch") {
    return Response.json({ error: "Already sent first touch" }, { status: 400 });
  }

  // 1. Create tracking link (or reuse existing)
  let slug = contact.trackingSlug;
  if (!slug) {
    slug = slugify(contact.businessName || contact.email.split("@")[0]);
    // Ensure unique slug
    const existing = await prisma.trackedLink.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    await prisma.trackedLink.create({
      data: {
        slug,
        label: `${contact.businessName || contact.email} — ${contact.vertical}`,
        destination: VERTICAL_DESTINATIONS[contact.vertical] || "/#hear-it",
        vertical: contact.vertical.replace("_", "-"),
      },
    });
  }

  const trackingUrl = `${SITE_URL}/for/${slug}`;

  // 2. Build personalized email
  const { subject, html } = buildEmail(contact, trackingUrl, template);

  // 3. Send via Resend
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Lars from Supportive AI <lars@supportive-ai.com>",
      to: contact.email,
      subject,
      html,
      replyTo: "lars@supportive-ai.com",
    });
  } catch (err) {
    console.error("[OUTREACH] Send failed:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  // 4. Update contact status
  await prisma.outreachContact.update({
    where: { id: contactId },
    data: {
      status: "sent",
      sentAt: new Date(),
      trackingSlug: slug,
      emailTemplate: template,
    },
  });

  return Response.json({ ok: true, slug, trackingUrl });
}
