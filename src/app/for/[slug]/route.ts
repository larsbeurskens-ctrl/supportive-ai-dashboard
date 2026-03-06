import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    const link = await prisma.trackedLink.findUnique({ where: { slug } });

    if (!link) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Log the click fire-and-forget
    prisma.linkClick.create({
      data: {
        trackedLinkId: link.id,
        ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            request.headers.get('x-real-ip') ?? null,
        userAgent: request.headers.get('user-agent') ?? null,
        referer: request.headers.get('referer') ?? null,
      },
    }).catch(() => {});

    // Update outreach contact status to "clicked" if linked
    prisma.outreachContact.updateMany({
      where: { trackingSlug: slug, status: 'sent' },
      data: { status: 'clicked' },
    }).catch(() => {});

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supportive-ai.com';
    const destination = link.destination.startsWith('http')
      ? link.destination
      : `${baseUrl}${link.destination}`;

    // Use HTML redirect to preserve #hash fragments (HTTP 302 strips them)
    if (destination.includes('#')) {
      return new NextResponse(
        `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${destination}"><script>window.location.href="${destination}";</script></head><body>Redirecting...</body></html>`,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    return NextResponse.redirect(destination, { status: 302 });
  } catch {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
