import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/gallery - Retrieve all generated images from FileMaker table
export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/gallery - Received request');
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    console.log('Query params:', { limit, offset });

    console.log('Querying FileMaker table...');
    const images = await prisma.fileMaker.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.fileMaker.count();

    console.log('Gallery query results:', { imageCount: images.length, total });

    return NextResponse.json({
      images,
      total,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}
