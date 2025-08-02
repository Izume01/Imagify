import { Search } from 'lucide-react'
import React from 'react'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

const images = [
    {
        name: 'Mountains',
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470'
    },
    {
        name: 'Forest',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
    },
    {
        name: 'Cityscape',
        url: 'https://images.unsplash.com/photo-1494526585095-c41746248156'
    },

    {
        name: 'Animal',
        url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d'
    },

    {
        name: 'Avatar PNG',
        url: 'https://avatars.githubusercontent.com/u/9919?v=4'
    },
    {
        name: 'Sample AVIF',
        url: 'https://res.cloudinary.com/demo/image/upload/sample.avif'
    },
    {
        name: 'Sample WebP',
        url: 'https://www.gstatic.com/webp/gallery/1.webp'
    }
]

const Display = () => {
    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 sm:mb-10 leading-tight tracking-tight px-2 ${dmSans.className}`}>
                Explore what the community<br className="hidden sm:block" /><span className="sm:hidden"> </span>is building with <span className="text-purple-400">Imagify</span>.
            </h1>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4 px-2">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="break-inside-avoid bg-[#1e1e1e] rounded-lg overflow-hidden shadow-md"
                    >
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />

                    </div>
                ))}
            </div>
        </div>
    )
}

export default Display
