import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'History ID is required' },
        { status: 400 }
      );
    }

    await prisma.promptHistory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting prompt history:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt history' },
      { status: 500 }
    );
  }
}