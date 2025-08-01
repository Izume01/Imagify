import { NextRequest, NextResponse } from 'next/server';

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_TOKEN!;

export async function POST(req: NextRequest) {
    const { prompt, count = 1 } = await req.json();

    console.log("HUGGING_FACE_API_KEY:", `"${HUGGING_FACE_API_KEY}"`);
    console.log("API_URL:", `"${API_URL}"`);
    console.log("prompt:", `"${prompt}"`);
    console.log("count:", count);

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
            return `data:image/png;base64,${base64}`;
        });

        const imageUrls = await Promise.all(imagePromises);

        return NextResponse.json({ image_urls: imageUrls });
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
