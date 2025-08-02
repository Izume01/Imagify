import { NextRequest, NextResponse } from 'next/server';

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_TOKEN!;

const uploadToCloudinary = async (imageUrl: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/uploadFromUrl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Cloudinary upload failed:', res.status, errorText);
    throw new Error(`Upload failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data.url;
};

export async function POST(req: NextRequest) {
  const { prompt, count = 1 } = await req.json();

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  try {
    const imagePromises = Array.from({ length: count }, async () => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt.trim() })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${response.status} ${errText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:image/png;base64,${base64}`;
      const imageUrl = await uploadToCloudinary(dataUrl);
      return imageUrl;
    });

    const imageUrls = await Promise.all(imagePromises);

    return NextResponse.json({ image_urls: imageUrls });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({
      error: "Failed to generate image",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
