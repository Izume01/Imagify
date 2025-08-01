import { Heart, ArrowUp } from 'lucide-react'
import React from 'react'
import { clashDisplay } from '@/lib/fonts'

const Hero = () => {
    return (
        <div className='flex flex-col items-center justify-center h-[80vh] hero'>
            <h1 className={`text-5xl font-medium font-clash-display  flex gap-5 ${clashDisplay.variable}`}>
                Visualize your ideas <span className='text-red-500 animate-[pulse_2s_ease-in-out_infinite] scale-125 rotate-12 tilt-12 transition-all duration-1000'><Heart className='w-10 h-10 drop-shadow-lg' fill="currentColor" /></span> With <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                    Imagify
                </span>

            </h1>

            <div className='tracking-wide flex gap-5 text-gray-400 text-center font-clash-display mt-5 max-w-2xl mx-auto leading-relaxed text-lg'>
                Let your ideas stand out with one-of-a-kind AI-generated visuals
            </div>

            <div className="flex justify-center mt-10">
                <div className="relative w-[700px] h-[150px] bg-[#1e1e1e] rounded-3xl p-4 flex flex-col justify-between">
                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="Ask Lovable to create a landing page for"
                        className="w-full h-10 px-3 bg-transparent outline-none text-white text-base placeholder:text-gray-400"
                    />

                    {/* Send Button at Bottom Right */}
                    <div className="flex justify-end">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full">
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Hero