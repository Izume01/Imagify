"use client"
import { Heart, ArrowUp, Plus, Minus, Download } from 'lucide-react'
import React from 'react'
import { clashDisplay } from '@/lib/fonts'
import useAppStore from '@/store/appStore'
import Image from 'next/image'
import { BorderBeam } from './magicui/border-beam'
import ImageWithDownload from './ImageWithDownload'
import GenerationOptions from './GenerationOptions'
import { downloadAllImages, generateFilenameFromPrompt } from '@/lib/downloadUtils'


const Hero = () => {
    const {
        userprompt,
        setUserPrompt,
        imageCount,
        setImageCount,
        generatedImages,
        setGeneratedImages,
        isGenerating,
        setIsGenerating,
        savePromptToHistory,
        generationOptions,
        addToGallery
    } = useAppStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userprompt.trim()) return;

        setIsGenerating(true);
        setGeneratedImages(Array(imageCount).fill(null));

        try {
            let enhancedPrompt = userprompt.trim();
            
            if (generationOptions.style) enhancedPrompt += `, in ${generationOptions.style} style`;
            if (generationOptions.mood) enhancedPrompt += `, ${generationOptions.mood} mood`;
            if (generationOptions.colorScheme) enhancedPrompt += `, ${generationOptions.colorScheme} color scheme`;
            if (generationOptions.quality) enhancedPrompt += `, ${generationOptions.quality} quality`;

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: enhancedPrompt, count: imageCount }),
            });

            if (!response.ok) return;

            const data = await response.json();

            if (data.image_urls) {
                setGeneratedImages(data.image_urls);
                addToGallery(data.image_urls);
                await savePromptToHistory(userprompt, data.image_urls, imageCount);
                
                setTimeout(() => {
                    document.getElementById("generated-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } catch (error) {
            console.error("Error generating images:", error);
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

    const handleDownloadAll = async () => {
        if (generatedImages.length === 0 || generatedImages.some(img => !img)) return;
        
        try {
            const baseFilename = generateFilenameFromPrompt(userprompt).replace('.png', '');
            await downloadAllImages(generatedImages, baseFilename);
        } catch (error) {
            console.error('Failed to download images:', error);
        }
    };

    return (
        <>
            <div className='hero'>
                <div className={`flex flex-col items-center justify-center px-4 transition-all duration-500 ${generatedImages.length > 0 ? 'pt-20 sm:pt-40' : 'min-h-[60vh] sm:h-[70vh] pt-12 sm:pt-24'}`}>
                    <div className="flex flex-col items-center text-center">
                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-medium font-clash-display flex flex-col sm:flex-row gap-2 sm:gap-5 text-white items-center ${clashDisplay.variable}`}>
                            Visualize your ideas <span className='text-red-500 animate-[pulse_2s_ease-in-out_infinite] scale-125 rotate-12 transition-all duration-1000'><Heart className='w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 drop-shadow-lg' fill="currentColor" /></span> With <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                                Imagify
                            </span>
                        </h1>

                        <div className='tracking-wide text-gray-400 text-center font-clash-display mt-3 sm:mt-5 max-w-xl sm:max-w-2xl mx-auto leading-relaxed text-sm sm:text-base lg:text-lg px-4'>
                            Let your ideas stand out with one-of-a-kind AI-generated visuals
                        </div>

                        <form onSubmit={handleSubmit} className="flex justify-center mt-6 sm:mt-10 w-full max-w-xs sm:max-w-md lg:max-w-[800px] px-4">
                            <div className="relative w-full h-full bg-[#1e1e1e] rounded-3xl p-6 space-y-4">

                                <div className='relative rounded-xl overflow-hidden'>
                                    <input
                                        value={userprompt}
                                        onChange={(e) => setUserPrompt(e.target.value)}
                                        type="text"
                                        placeholder="Describe the image you want to generate..."
                                        className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-[#2a2a2a] rounded-xl outline-none text-white text-sm sm:text-base placeholder:text-gray-400 border border-gray-600 transition-colors"
                                    />
                                    <BorderBeam
                                        duration={6}
                                        delay={3}
                                        size={400}
                                        className="from-transparent via-blue-500 to-transparent !rounded-xl"
                                    />
                                </div>

                                <GenerationOptions />

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                                    {/* Image Count Selector */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-xs sm:text-sm">Images:</span>
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
                                        disabled={isGenerating || !userprompt.trim()}
                                        className="bg-gradient-to-r bg-neutral-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center hover:bg-neutral-600"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                        {isGenerating ? "Generating..." : "Generate"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Generated Images Section */}
            <div id="generated-section" className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Download All Button */}
                {generatedImages.length > 0 && generatedImages.every(img => img) && (
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={handleDownloadAll}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download All Images
                        </button>
                    </div>
                )}
                
                <div
                    className={`grid gap-4 sm:gap-6 justify-items-center ${
                        generatedImages.length === 1
                            ? 'grid-cols-1 max-w-md mx-auto'
                            : generatedImages.length === 2
                                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                    {generatedImages.map((imageUrl, index) => (
                        <div
                            key={index}
                            className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-[#1e1e1e] p-1 sm:p-2 w-full max-w-[300px] sm:max-w-[400px]"
                        >
                            {imageUrl ? (
                                <ImageWithDownload
                                    src={imageUrl}
                                    alt={`Generated Image ${index + 1}`}
                                    width={400}
                                    height={400}
                                    className="w-full h-auto object-contain rounded-xl"
                                    priority={index === 0}
                                    prompt={userprompt}
                                    index={index}
                                />
                            ) : (
                                <div className="w-full aspect-square bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]"></div>
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
    );
};

export default Hero;
