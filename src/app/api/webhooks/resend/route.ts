import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Statuses that should NOT be overwritten by "opened"
const HIGHER_STATUSES = new Set([
  "clicked", "texted", "called", "voicemail", "spoke",
  "demo_played", "interested", "not_interested", "signed_up",
]);

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const type = event?.type;
    const data = event?.data;

    if (!type || !data) {
      return NextResponse.json({ ok: true }); // ack but ignore
    }

    // Extract recipient email from the webhook payload
    const toEmails: string[] = Array.isArray(data.to) ? data.to : [data.to].filter(Boolean);

    if (type === "email.opened") {
      for (const email of toEmails) {
        // Find the outreach contact by email
        const contact = await prisma.outreachContact.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (!contact) continue;

        // Set emailOpenedAt (first open wins)
        const updates: Record<string, unknown> = {};
        if (!contact.emailOpenedAt) {
          updates.emailOpenedAt = new Date();
        }
        // Only upgrade status to "opened" if they haven't progressed further
        if (contact.status === "sent" && !HIGHER_STATUSES.has(contact.status)) {
          updates.status = "opened";
        }
        if (Object.keys(updates).length > 0) {
          await prisma.outreachContact.update({
            where: { id: contact.id },
            data: updates,
          });
        }
        // Log activity for history
        await prisma.outreachActivity.create({
          data: {
            contactId: contact.id,
            type: 'email_opened',
            notes: `Email opened${contact.emailOpenedAt ? ' (again)' : ''}`,
          },
        });
      }
    }

    // Also handle bounces — useful for cleaning the list
    if (type === "email.bounced") {
      for (const email of toEmails) {
        const contact = await prisma.outreachContact.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (contact) {
          await prisma.outreachContact.update({
            where: { id: contact.id },
            data: { status: "bounced", notes: `Bounced: ${data.bounce?.message || "unknown reason"}` },
          });
          await prisma.outreachActivity.create({
            data: {
              contactId: contact.id,
              type: 'email_bounced',
              notes: `Email bounced: ${data.bounce?.message || 'unknown reason'}`,
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RESEND WEBHOOK] Error:", err);
    // Always return 200 to prevent Resend from retrying
    return NextResponse.json({ ok: true });
  }
}
