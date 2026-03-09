import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { buildEmail, slugify, VERTICAL_DESTINATIONS } from "@/lib/outreach-templates";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "larsbeurskens@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://supportive-ai.com";

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
  const { subject, html } = buildEmail(contact, trackingUrl, template);

  // Send via Resend
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Lars Beurskens <lars@supportive-ai.com>",
      to: contact.email,
      subject,
      html,
      replyTo: "lars@supportive-ai.com",
    });
  } catch (err) {
    console.error("[OUTREACH] Send failed:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }

  // Update contact status
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
