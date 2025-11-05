"use client"
import React, { useEffect, useState } from 'react'
import { Search, Download, Grid3X3, Grid2X2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import useAppStore from '@/store/appStore'
import { downloadImage } from '@/lib/downloadUtils'

const SidebarGallery = () => {
    const {
        allGeneratedImages,
        gallerySearchTerm,
        promptHistory,
        setAllGeneratedImages,
        setGallerySearchTerm
    } = useAppStore();

    const [gridSize, setGridSize] = useState<'small' | 'medium'>('medium');
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    useEffect(() => {
        // Extract all images from history when component mounts
        const allImages = promptHistory.flatMap(item => item.imageUrls);
        setAllGeneratedImages(allImages);
    }, [promptHistory, setAllGeneratedImages]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGallerySearchTerm(e.target.value);
    };

    const handleDownloadImage = async (imageUrl: string) => {
        setIsDownloading(imageUrl);
        try {
            await downloadImage(imageUrl);
        } finally {
            setIsDownloading(null);
        }
    };

    const filteredImages = gallerySearchTerm 
        ? allGeneratedImages.filter(imageUrl => {
            const historyItem = promptHistory.find(item => item.imageUrls.includes(imageUrl));
            return historyItem?.prompt.toLowerCase().includes(gallerySearchTerm.toLowerCase());
        })
        : allGeneratedImages;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-800 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by prompt..."
                        value={gallerySearchTerm}
                        onChange={handleSearch}
                        className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                </div>

                {/* Grid size controls */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        {filteredImages.length} images
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setGridSize('medium')}
                            className={`p-1 rounded transition-colors ${
                                gridSize === 'medium' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                            }`}
                            title="Medium grid"
                        >
                            <Grid2X2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setGridSize('small')}
                            className={`p-1 rounded transition-colors ${
                                gridSize === 'small' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                            }`}
                            title="Small grid"
                        >
                            <Grid3X3 className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {filteredImages.length === 0 ? (
                    <div className="text-center py-12">
                        <Grid3X3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm">
                            {gallerySearchTerm ? 'No images found.' : 'No images in gallery yet.'}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            Generate images to see them here!
                        </p>
                    </div>
                ) : (
                    <div className={`grid ${gridSize === 'small' ? 'grid-cols-3 gap-2' : 'grid-cols-2 gap-3'}`}>
                        {filteredImages.map((imageUrl, index) => {
                            const historyItem = promptHistory.find(item => 
                                item.imageUrls.includes(imageUrl)
                            );

                            return (
                                <div
                                    key={`${imageUrl}-${index}`}
                                    className="relative group bg-[#222] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={`Generated ${index + 1}`}
                                        width={gridSize === 'small' ? 80 : 120}
                                        height={gridSize === 'small' ? 80 : 120}
                                        className="w-full h-auto object-cover"
                                    />
                                    
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleDownloadImage(imageUrl)}
                                            disabled={isDownloading === imageUrl}
                                            className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
                                            title="Download image"
                                        >
                                            {isDownloading === imageUrl ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {historyItem && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs truncate">
                                                {historyItem.prompt}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarGallery;