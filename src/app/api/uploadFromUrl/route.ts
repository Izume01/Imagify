import { v2 as cloudinary } from 'cloudinary';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return Response.json({ error: 'Image URL missing' }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.upload(imageUrl, { folder: 'imgify' });
    
    if (!result?.secure_url) {
      return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

    await prisma.fileMaker.create({
      data: {
        url: result.secure_url,
        createdAt: new Date(),
      }
    });

    return Response.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Upload failed:', error);
    return Response.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
