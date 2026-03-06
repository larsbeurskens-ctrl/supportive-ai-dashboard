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
      return jsRedirect(`${baseUrl}/#hear-it`);
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

    // Update outreach contact status (fire-and-forget)
    prisma.outreachContact.updateMany({
      where: { trackingSlug: slug, status: 'sent' },
      data: { status: 'clicked' },
    }).catch(() => {});

    const destination = link.destination.startsWith('http')
      ? link.destination
      : `${baseUrl}${link.destination}`;

    return jsRedirect(destination);
  } catch {
    return jsRedirect(baseUrl);
  }
}
