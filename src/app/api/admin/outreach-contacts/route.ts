import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ADMIN_EMAIL = "larsbeurskens@gmail.com";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) return null;
  return session;
}

export async function GET(req: Request) {
  if (!(await checkAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const vertical = url.searchParams.get("vertical");
  const status = url.searchParams.get("status");
  const sort = url.searchParams.get("sort") || "score"; // score | last_contact
  const limit = parseInt(url.searchParams.get("limit") || "100");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const where: Record<string, unknown> = {};
  if (vertical) where.vertical = vertical;
  if (status) where.status = status;

  const orderBy = sort === "last_contact"
    ? [{ lastContactedAt: { sort: "desc" as const, nulls: "last" as const } }, { score: "desc" as const }]
    : { score: "desc" as const };

  const now = new Date();
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const [contacts, total, stats, emailFollowUps, callFollowUps, textFollowUps] = await Promise.all([
    prisma.outreachContact.findMany({
      where, orderBy, take: limit, skip: offset,
      include: {
        _count: { select: { activities: true } },
        activities: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    prisma.outreachContact.count({ where }),
    prisma.$queryRaw`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'unsent' THEN 1 END) as unsent,
        COUNT(CASE WHEN status IN ('sent', 'clicked') THEN 1 END) as sent,
        COUNT(CASE WHEN status = 'texted' THEN 1 END) as texted,
        COUNT(CASE WHEN status IN ('called', 'voicemail') THEN 1 END) as called,
        COUNT(CASE WHEN status IN ('spoke', 'demo_played') THEN 1 END) as spoke,
        COUNT(CASE WHEN status = 'interested' THEN 1 END) as interested,
        COUNT(CASE WHEN status = 'not_interested' THEN 1 END) as not_interested,
        COUNT(CASE WHEN status = 'signed_up' THEN 1 END) as signed_up
      FROM "OutreachContact"
    ` as Promise<Array<Record<string, bigint>>>,
    // Email follow-ups: sent 4+ days ago, no activity since
    prisma.outreachContact.findMany({
      where: {
        status: "sent",
        sentAt: { lt: fourDaysAgo },
      },
      orderBy: { sentAt: "asc" },
      take: 20,
      include: { _count: { select: { activities: true } } },
    }),
    // Call follow-ups: last activity was no_answer/voicemail 3+ days ago
    prisma.outreachContact.findMany({
      where: {
        status: { in: ["called", "voicemail"] },
        lastContactedAt: { lt: threeDaysAgo },
      },
      orderBy: { lastContactedAt: "asc" },
      take: 20,
      include: { _count: { select: { activities: true } } },
    }),
    // Text follow-ups: texted 2+ days ago, no further activity
    prisma.outreachContact.findMany({
      where: {
        status: "texted",
        lastContactedAt: { lt: twoDaysAgo },
      },
      orderBy: { lastContactedAt: "asc" },
      take: 20,
      include: { _count: { select: { activities: true } } },
    }),
  ]);

  const pipeline = stats[0];
  return Response.json({
    contacts,
    total,
    pipeline: {
      total: Number(pipeline.total),
      unsent: Number(pipeline.unsent),
      sent: Number(pipeline.sent),
      texted: Number(pipeline.texted),
      called: Number(pipeline.called),
      spoke: Number(pipeline.spoke),
      interested: Number(pipeline.interested),
      not_interested: Number(pipeline.not_interested),
      signed_up: Number(pipeline.signed_up),
    },
    followUps: {
      email: emailFollowUps,
      call: callFollowUps,
      text: textFollowUps,
    },
  });
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { contacts } = await req.json() as {
    contacts: Array<{
      email: string; name?: string; businessName?: string; phone?: string;
      website?: string; vertical: string; score?: number; painSignal?: string; notes?: string;
    }>;
  };

  if (!contacts?.length) return Response.json({ error: "No contacts provided" }, { status: 400 });

  let imported = 0;
  let skipped = 0;

  for (const c of contacts) {
    try {
      await prisma.outreachContact.upsert({
        where: { email_vertical: { email: c.email.toLowerCase().trim(), vertical: c.vertical } },
        create: {
          email: c.email.toLowerCase().trim(),
          name: c.name || null,
          businessName: c.businessName || null,
          phone: c.phone || null,
          website: c.website || null,
          vertical: c.vertical,
          score: c.score || 0,
          painSignal: c.painSignal || null,
          notes: c.notes || null,
        },
        update: {}, // don't overwrite existing
      });
      imported++;
    } catch {
      skipped++;
    }
  }

  return Response.json({ imported, skipped, total: contacts.length });
}
