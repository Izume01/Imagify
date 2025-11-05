"use client"

import React, { useMemo, useEffect } from 'react'
import { DM_Sans } from 'next/font/google'
import { Sparkles } from 'lucide-react'
import useAppStore from '@/store/appStore'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

const Display = () => {
    const { promptHistory, fetchPromptHistory, isLoadingHistory } = useAppStore();
    
    // Auto-load history when component mounts
    useEffect(() => {
        if (promptHistory.length === 0 && !isLoadingHistory) {
            fetchPromptHistory();
        }
    }, []);
    
    const displayImages = useMemo(() => {
        return promptHistory
            .slice(0, 20)
            .flatMap(item => item.imageUrls.map(url => ({
                url,
                name: item.prompt,
                isUserCreation: true
            })));
    }, [promptHistory]);

    // Show loading state while fetching
    if (isLoadingHistory && promptHistory.length === 0) {
        return (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto mt-20">
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-6"></div>
                    <p className="text-gray-400 text-lg">Loading your creations...</p>
                </div>
            </div>
        );
    }

    if (displayImages.length === 0) {
        return (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto mt-20">
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Sparkles className="w-16 h-16 text-purple-400 mb-6" />
                    <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-4 ${dmSans.className}`}>
                        Your gallery is empty
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md">
                        Start creating amazing images with AI and they'll appear here!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto mt-8">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-8 sm:mb-12 text-center ${dmSans.className}`}>
                Your recent <span className="text-purple-400">creations</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {displayImages.map((image, index) => (
                    <div
                        key={`${image.url}-${index}`}
                        className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative"
                    >
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-auto object-cover aspect-square"
                            loading="lazy"
                        />
                        
                        <div className="p-3 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs leading-relaxed line-clamp-2">"{image.name}"</p>
                            <span className="text-purple-300 text-xs">Your creation</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Display