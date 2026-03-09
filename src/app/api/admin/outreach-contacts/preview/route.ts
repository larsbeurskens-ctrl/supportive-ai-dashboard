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
  const contact = await prisma.outreachContact.findUnique({ where: { id: contactId } });
  if (!contact) return Response.json({ error: "Contact not found" }, { status: 404 });

  const slug = contact.trackingSlug || slugify(contact.businessName || contact.email.split("@")[0]);
  const trackingUrl = `${SITE_URL}/for/${slug}`;
  const { subject, html } = buildEmail(contact, trackingUrl, template);

  return Response.json({
    from: "Lars Beurskens <lars@supportive-ai.com>",
    to: contact.email,
    subject,
    html,
    trackingUrl,
    template,
    contact: {
      businessName: contact.businessName,
      name: contact.name,
      vertical: contact.vertical,
      painSignal: contact.painSignal,
    },
  });
}
