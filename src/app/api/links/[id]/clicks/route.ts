import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const clicks = await prisma.linkClick.findMany({
      where: { trackedLinkId: id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(clicks);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch clicks' }, { status: 500 });
  }
}
