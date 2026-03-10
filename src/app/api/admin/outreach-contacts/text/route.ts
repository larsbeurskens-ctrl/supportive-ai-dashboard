import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "larsbeurskens@gmail.com";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://supportive-ai-backend-production.up.railway.app";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contactId, body, isFollowUp } = await req.json();
  if (!contactId || !body) {
    return Response.json({ error: "contactId and body required" }, { status: 400 });
  }

  const contact = await prisma.outreachContact.findUnique({ where: { id: contactId } });
  if (!contact) return Response.json({ error: "Contact not found" }, { status: 404 });
  if (!contact.phone) return Response.json({ error: "Contact has no phone number" }, { status: 400 });

  try {
    // Send SMS via backend
    const smsRes = await fetch(`${API_BASE}/api/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: contact.phone,
        body,
        name: contact.name || contact.businessName || undefined,
        company: contact.businessName || undefined,
        vertical: contact.vertical,
      }),
    });

    if (!smsRes.ok) {
      const err = await smsRes.json().catch(() => ({ error: "SMS send failed" }));
      return Response.json({ error: err.error || "SMS send failed" }, { status: 500 });
    }

    // Log activity
    await prisma.outreachActivity.create({
      data: {
        contactId,
        type: isFollowUp ? "text_follow_up" : "text",
        outcome: "sent",
        notes: body.length > 200 ? body.substring(0, 200) + "..." : body,
      },
    });

    // Update contact status
    const newStatus = isFollowUp ? contact.status : "texted"; // Keep status if follow-up
    await prisma.outreachContact.update({
      where: { id: contactId },
      data: {
        lastContactedAt: new Date(),
        ...(newStatus !== contact.status ? { status: newStatus } : {}),
      },
    });

    return Response.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Outreach text error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
