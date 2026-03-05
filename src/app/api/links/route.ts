import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/links — list all tracked links with click counts
export async function GET() {
  try {
    const links = await prisma.trackedLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        clicks: {
          orderBy: { createdAt: 'desc' },
          take: 1, // latest click only for "last seen"
        },
        _count: { select: { clicks: true } },
      },
    });
    return NextResponse.json(links);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

// POST /api/links — create a new tracked link
export async function POST(req: NextRequest) {
  try {
    const { slug, label, destination, vertical } = await req.json();

    if (!slug || !label || !destination) {
      return NextResponse.json({ error: 'slug, label, and destination are required' }, { status: 400 });
    }

    // Sanitise slug — lowercase, hyphens only
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const link = await prisma.trackedLink.create({
      data: { slug: cleanSlug, label, destination, vertical: vertical ?? null },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'That slug is already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
