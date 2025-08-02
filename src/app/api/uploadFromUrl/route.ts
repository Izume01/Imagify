// app/api/uploadFromUrl/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req : NextRequest) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return Response.json({ error: 'Image URL missing' }, { status: 400 });
  }

  try {
    console.log('Attempting to upload to Cloudinary...');
    console.log('Cloudinary config check:', {
      cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      api_key: !!process.env.CLOUDINARY_API_KEY,
      api_secret: !!process.env.CLOUDINARY_API_SECRET
    });

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'imgify', 
    });

    console.log('Cloudinary upload result:', result?.secure_url ? 'Success' : 'Failed');

    if (!result || !result.secure_url) {
      console.error('Cloudinary upload failed - no secure_url returned');
      return Response.json({ error: 'Upload failed' }, { status: 500 });
    }

    console.log('Attempting to save to database...');
    const file = await prisma.fileMaker.create({
      data : {
        url : result.secure_url,
        createdAt : new Date(),
      }
    })
    console.log('File created:', file);
    console.log('Database save successful');

    return Response.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Upload failed with detailed error:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return Response.json({ error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
