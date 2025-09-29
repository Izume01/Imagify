"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Download, Loader2 } from 'lucide-react'
import { downloadImage, generateFilenameFromPrompt } from '@/lib/downloadUtils'

interface ImageWithDownloadProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    prompt?: string;
    index?: number;
}

const ImageWithDownload: React.FC<ImageWithDownloadProps> = ({
    src,
    alt,
    width,
    height,
    className,
    priority,
    prompt,
    index
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDownloading(true);
        
        try {
            const filename = prompt 
                ? generateFilenameFromPrompt(prompt, index)
                : `imagify-${Date.now()}-${(index || 0) + 1}.png`;
                
            await downloadImage(src, filename);
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="relative group">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                priority={priority}
            />
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-xl">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Download image"
                >
                    {isDownloading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Download className="w-6 h-6" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default ImageWithDownload;