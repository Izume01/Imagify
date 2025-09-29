import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/history - Retrieve prompt history
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/history - Received request');
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const search = url.searchParams.get('search') || '';
    console.log('Query params:', { limit, offset, search });

    const whereClause = search 
      ? {
          prompt: {
            contains: search,
            mode: 'insensitive' as const
          }
        }
      : {};

    console.log('Querying database...');
    const history = await prisma.promptHistory.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.promptHistory.count({
      where: whereClause
    });

    console.log('Query results:', { historyCount: history.length, total });

    return NextResponse.json({
      history,
      total,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching prompt history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt history' },
      { status: 500 }
    );
  }
}

// POST /api/history - Save new prompt to history
export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/history - Received request');
    const { prompt, imageUrls, imageCount } = await req.json();
    console.log('Request data:', { prompt, imageUrls, imageCount });

    if (!prompt || !imageUrls || !imageCount) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: prompt, imageUrls, imageCount' },
        { status: 400 }
      );
    }

    console.log('Creating history entry...');

    const newHistory = await prisma.promptHistory.create({
      data: {
        prompt: prompt.trim(),
        imageUrls,
        imageCount,
      },
    });
    console.log('History entry created:', newHistory);

    return NextResponse.json(newHistory);
  } catch (error) {
    console.error('Error saving prompt history:', error);
    return NextResponse.json(
      { error: 'Failed to save prompt history' },
      { status: 500 }
    );
  }
}

