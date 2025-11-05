import { NextRequest, NextResponse } from 'next/server';

const { CLOUDFLARE_API_KEY, CLOUDFLARE_ACCOUNT_ID, NEXT_PUBLIC_APP_URL } = process.env;

const uploadToCloudinary = async (imageUrl: string) => {
  const res = await fetch(`${NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/uploadFromUrl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  return data.url;
};

export async function POST(req: NextRequest) {
  const { prompt, count = 1 } = await req.json();

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  try {
    const generateImage = async () => {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${CLOUDFLARE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            seed: Math.floor(Math.random() * 10000)
          })
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const result = await response.json();
      if (!result.success || !result.result?.image) {
        throw new Error('No image returned');
      }

      const binaryString = atob(result.result.image);
      const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0) || 0);
      const base64 = Buffer.from(img).toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      
      return await uploadToCloudinary(dataUrl);
    };

    const imageUrls = await Promise.all(Array(count).fill(null).map(generateImage));
    return NextResponse.json({ image_urls: imageUrls });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({
      error: "Failed to generate image",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
