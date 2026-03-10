import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "larsbeurskens@gmail.com";

// GET — fetch activities for a contact
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");
  if (!contactId) return Response.json({ error: "contactId required" }, { status: 400 });

  const activities = await prisma.outreachActivity.findMany({
    where: { contactId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return Response.json(activities);
}

// POST — log a new activity
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contactId, type, outcome, notes } = await req.json();
  if (!contactId || !type) {
    return Response.json({ error: "contactId and type required" }, { status: 400 });
  }

  // Create activity
  const activity = await prisma.outreachActivity.create({
    data: { contactId, type, outcome: outcome || null, notes: notes || null },
  });

  // Determine new status based on outcome
  const STATUS_MAP: Record<string, string> = {
    no_answer: "called",
    voicemail: "voicemail",
    spoke: "spoke",
    demo_played: "demo_played",
    interested: "interested",
    not_interested: "not_interested",
    callback_scheduled: "spoke",
    note: "", // Don't change status for notes
  };
  const newStatus = outcome ? STATUS_MAP[outcome] : undefined;

  // Update contact's lastContactedAt and optionally status
  await prisma.outreachContact.update({
    where: { id: contactId },
    data: {
      lastContactedAt: new Date(),
      ...(newStatus ? { status: newStatus } : {}),
    },
  });

  return Response.json(activity);
}
