"use client"

import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import useAppStore from '@/store/appStore'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

const images = [
    {
        name: 'Mountains',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754114122/imgify/b5krmvaonfunntkrwvdw.jpg'
    },
    {
        name: 'Forest',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754114221/imgify/gbolhktjga7dlkttyqsl.jpg'
    },
    {
        name: 'Cityscape',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754114233/imgify/prwf6xuiwnu6ekjoz7eo.jpg'
    },

    {
        name: 'Animal',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754114233/imgify/prwf6xuiwnu6ekjoz7eo.jpg'
    },

    {
        name: 'Avatar PNG',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754111438/imgify/epzmp482zsbwwhmvhh5v.jpg'
    },
    {
        name: 'Sample AVIF',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754113910/imgify/qcgr0mnv9vja14wgvk6m.jpg'
    },
    {
        name: 'Sample WebP',
        url: 'https://res.cloudinary.com/dg9srfcis/image/upload/v1754111318/imgify/abnqkoc6ziqsda364plb.jpg'
    }
]

const Display = () => {
    const { promptHistory } = useAppStore();
    const [displayImages, setDisplayImages] = useState(images); // Start with fallback images

    useEffect(() => {
        const recentImages = promptHistory
            .slice(0, 12) 
            .flatMap(item => item.imageUrls.map(url => ({
                url,
                name: item.prompt,
                createdAt: item.createdAt
            })))
            .slice(0, 20); 

        if (recentImages.length > 0) {
            const mixed = [...recentImages, ...images].slice(0, 24);
            setDisplayImages(mixed);
        }
    }, [promptHistory]);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 sm:mb-10 leading-tight tracking-tight px-2 ${dmSans.className}`}>
                {promptHistory.length > 0 ? (
                    <>Your recent creations<br className="hidden sm:block" /><span className="sm:hidden"> </span>& community <span className="text-purple-400">highlights</span>.</>
                ) : (
                    <>Explore what the community<br className="hidden sm:block" /><span className="sm:hidden"> </span>is building with <span className="text-purple-400">Imagify</span>.</>
                )}
            </h1>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4 px-2">
                {displayImages.map((image, index) => (
                    <div
                        key={`${image.url}-${index}`}
                        className="break-inside-avoid bg-[#1e1e1e] rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300 relative"
                    >
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />
                        
                        {promptHistory.some(item => item.imageUrls.includes(image.url)) && (
                            <div className="p-3 bg-gradient-to-t from-black/90 to-transparent absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs leading-relaxed">
                                    "{image.name}"
                                </p>
                                <span className="text-purple-300 text-xs">Your creation</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Display