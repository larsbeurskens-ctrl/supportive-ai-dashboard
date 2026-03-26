import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CACHE_HEADERS = {
  'Content-Type': 'text/html',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

function jsRedirect(url: string) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${url}"><script>window.location.replace("${url}");</script></head><body>Redirecting...</body></html>`,
    { status: 200, headers: CACHE_HEADERS }
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supportive-ai.com';

  try {
    const link = await prisma.trackedLink.findUnique({ where: { slug } });

    if (!link) {
      return jsRedirect(`${baseUrl}/plumbing#hear-it`);
    }

    // Log click (fire-and-forget)
    prisma.linkClick.create({
      data: {
        trackedLinkId: link.id,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            request.headers.get('x-real-ip') ?? null,
        userAgent: request.headers.get('user-agent') ?? null,
        referer: request.headers.get('referer') ?? null,
      },
    }).catch(() => {});

    // Update outreach contact — set linkClickedAt (first click wins) + upgrade status only if lower
    const LOW_STATUSES = ['sent', 'opened'];
    prisma.outreachContact.findFirst({ where: { trackingSlug: slug } }).then(contact => {
      if (!contact) return;
      const updates: Record<string, unknown> = {};
      if (!contact.linkClickedAt) updates.linkClickedAt = new Date();
      if (!contact.emailOpenedAt) updates.emailOpenedAt = new Date(); // clicked = definitely opened
      if (LOW_STATUSES.includes(contact.status)) updates.status = 'clicked';
      if (Object.keys(updates).length > 0) {
        prisma.outreachContact.update({ where: { id: contact.id }, data: updates }).catch(() => {});
      }
      // Log activity for history
      prisma.outreachActivity.create({
        data: {
          contactId: contact.id,
          type: 'link_clicked',
          notes: `Clicked link to ${link.destination}`,
        },
      }).catch(() => {});
    }).catch(() => {});

    const destination = link.destination.startsWith('http')
      ? link.destination
      : `${baseUrl}${link.destination}`;

    return jsRedirect(destination);
  } catch {
    return jsRedirect(`${baseUrl}/plumbing#hear-it`);
  }
}
