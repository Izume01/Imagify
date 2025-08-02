"use client"
import { Heart, ArrowUp, Plus, Minus } from 'lucide-react'
import React, { useState } from 'react'
import { clashDisplay } from '@/lib/fonts'
import useAppStore from '@/store/appStore'
import Image from 'next/image'

const Hero = () => {
    const {
        userprompt,
        setUserPrompt,
        imageCount,
        setImageCount,
        generatedImages,
        setGeneratedImages,
        isGenerating,
        setIsGenerating
    } = useAppStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userprompt.trim()) {
            console.log("Please enter a prompt");
            return;
        }

        setIsGenerating(true);
        setGeneratedImages([]); // Clear previous images
        
        // Create placeholder array for skeleton loaders
        const placeholders = Array(imageCount).fill(null);
        setGeneratedImages(placeholders);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: userprompt,
                    count: imageCount
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error:", data.error || "Unknown error");
                return;
            }

            if (data.image_urls) {
                setGeneratedImages(data.image_urls);

                setTimeout(() => {
                    document.getElementById("generated-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100); // Slight delay to allow render
            }

        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const adjustImageCount = (increment: boolean) => {
        const newCount = increment ? imageCount + 1 : imageCount - 1;
        if (newCount >= 1 && newCount <= 4) {
            setImageCount(newCount);
        }
    };

    return (
        <>
            <div className=' hero'>
                <div className={`flex flex-col items-center justify-center px-4 transition-all duration-500 ${generatedImages.length > 0 ? 'pt-40' : 'h-[70vh] pt-24'}`}>
                    {/* Fixed Header Section */}
                    <div className="flex flex-col items-center text-center">
                        <h1 className={`text-5xl font-medium font-clash-display flex gap-5 ${clashDisplay.variable}`}>
                            Visualize your ideas <span className='text-red-500 animate-[pulse_2s_ease-in-out_infinite] scale-125 rotate-12 tilt-12 transition-all duration-1000'><Heart className='w-10 h-10 drop-shadow-lg' fill="currentColor" /></span> With <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                                Imagify
                            </span>
                        </h1>

                        <div className='tracking-wide text-gray-400 text-center font-clash-display mt-5 max-w-2xl mx-auto leading-relaxed text-lg'>
                            Let your ideas stand out with one-of-a-kind AI-generated visuals
                        </div>

                        <div className="flex justify-center mt-10 w-full max-w-[800px]">
                            <div className="relative w-full bg-[#1e1e1e] rounded-3xl p-6 space-y-4">
                                {/* Input Field */}
                                <input
                                    value={userprompt}
                                    onChange={(e) => setUserPrompt(e.target.value)}
                                    type="text"
                                    placeholder="Describe the image you want to generate..."
                                    className="w-full h-12 px-4 bg-[#2a2a2a] rounded-xl outline-none text-white text-base placeholder:text-gray-400 border border-gray-600 focus:border-purple-500 transition-colors"
                                />

                                {/* Controls Row */}
                                <div className="flex justify-between items-center">
                                    {/* Image Count Selector */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-sm">Images:</span>
                                        <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-lg p-1">
                                            <button
                                                type="button"
                                                onClick={() => adjustImageCount(false)}
                                                disabled={imageCount <= 1}
                                                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-white font-medium min-w-[20px] text-center">{imageCount}</span>
                                            <button
                                                type="button"
                                                onClick={() => adjustImageCount(true)}
                                                disabled={imageCount >= 4}
                                                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <button
                                        type="submit"
                                        onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                                        disabled={isGenerating || !userprompt.trim()}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <ArrowUp className="w-4 h-4" />
                                                Generate
                                            </>
                                        ) : (
                                            <>
                                                <ArrowUp className="w-4 h-4" />
                                                Generate
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Images Section */}
            <div id="generated-section" className="w-full max-w-[1200px] mx-auto px-4 py-10">
                <div
                    className={`grid gap-6 justify-items-center ${generatedImages.length === 1
                        ? 'grid-cols-1'
                        : generatedImages.length === 2
                            ? 'grid-cols-1 md:grid-cols-2'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}
                >
                    {generatedImages.map((imageUrl, index) => (
                        <div
                            key={index}
                            className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-[#1e1e1e] p-2 w-full max-w-[400px]"
                        >
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={`Generated Image ${index + 1}`}
                                    width={400}
                                    height={400}
                                    className="w-full h-auto object-contain rounded-xl"
                                    priority={index === 0}
                                />
                            ) : (
                                // Simple Skeleton Loader
                                <div className="w-full aspect-square bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    {/* Simple shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
                                    
                                    {/* Simple loading content */}
                                    <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
                                        <div className="w-8 h-8 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                                        <div className="text-gray-400 text-sm">Loading...</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Hero
