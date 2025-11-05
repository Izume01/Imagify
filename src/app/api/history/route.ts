import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';

    const whereClause = search 
      ? { prompt: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [history, total] = await Promise.all([
      prisma.promptHistory.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.promptHistory.count({ where: whereClause })
    ]);

    return NextResponse.json({
      history,
      total,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    return NextResponse.json({ error: 'Failed to fetch prompt history' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageUrls, imageCount } = await req.json();

    if (!prompt || !imageUrls || !imageCount) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, imageUrls, imageCount' },
        { status: 400 }
      );
    }

    const newHistory = await prisma.promptHistory.create({
      data: {
        prompt: prompt.trim(),
        imageUrls,
        imageCount,
      },
    });

    return NextResponse.json(newHistory);
  } catch (error) {
    console.error('Error saving prompt history:', error);
    return NextResponse.json({ error: 'Failed to save prompt history' }, { status: 500 });
  }
}

