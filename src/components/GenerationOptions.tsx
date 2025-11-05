"use client"
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Palette, Ratio, Sparkles, Eye } from 'lucide-react'
import useAppStore from '@/store/appStore'

const GenerationOptions = () => {
    const { generationOptions, setGenerationOptions } = useAppStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const styleOptions = [
        { value: '', label: 'Default' },
        { value: 'photorealistic', label: 'Photorealistic' },
        { value: 'digital-art', label: 'Digital Art' },
        { value: 'oil-painting', label: 'Oil Painting' },
        { value: 'watercolor', label: 'Watercolor' },
        { value: 'sketch', label: 'Sketch' },
        { value: 'anime', label: 'Anime' },
        { value: 'cartoon', label: 'Cartoon' },
        { value: '3d-render', label: '3D Render' },
        { value: 'minimalist', label: 'Minimalist' },
        { value: 'vintage', label: 'Vintage' }
    ];

    const aspectRatioOptions = [
        { value: '', label: 'Square (1:1)' },
        { value: '16:9', label: 'Landscape (16:9)' },
        { value: '9:16', label: 'Portrait (9:16)' },
        { value: '4:3', label: 'Classic (4:3)' },
        { value: '3:4', label: 'Portrait (3:4)' },
        { value: '21:9', label: 'Ultrawide (21:9)' }
    ];

    const qualityOptions = [
        { value: '', label: 'Standard' },
        { value: 'high', label: 'High Quality' },
        { value: 'ultra', label: 'Ultra HD' }
    ];

    const moodOptions = [
        { value: '', label: 'Neutral' },
        { value: 'vibrant', label: 'Vibrant' },
        { value: 'dark', label: 'Dark & Moody' },
        { value: 'bright', label: 'Bright & Cheerful' },
        { value: 'dramatic', label: 'Dramatic' },
        { value: 'calm', label: 'Calm & Peaceful' },
        { value: 'energetic', label: 'Energetic' },
        { value: 'mysterious', label: 'Mysterious' }
    ];

    const colorSchemeOptions = [
        { value: '', label: 'Natural Colors' },
        { value: 'monochrome', label: 'Monochrome' },
        { value: 'warm', label: 'Warm Tones' },
        { value: 'cool', label: 'Cool Tones' },
        { value: 'pastel', label: 'Pastel Colors' },
        { value: 'neon', label: 'Neon Colors' },
        { value: 'earth', label: 'Earth Tones' },
        { value: 'vintage', label: 'Vintage Colors' }
    ];

    const handleOptionChange = (key: string, value: string) => {
        setGenerationOptions({
            ...generationOptions,
            [key]: value
        });
    };

    const resetOptions = () => {
        setGenerationOptions({});
    };

    const hasCustomOptions = Object.values(generationOptions).some(value => value !== '');

    return (
        <div className="bg-[#1e1e1e] rounded-xl border border-gray-700">
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#252525] transition-colors rounded-xl"
            >
                <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Advanced Options</span>
                    {hasCustomOptions && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                            Active
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>

            {/* Options */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-gray-700">
                    {/* Quick Reset */}
                    {hasCustomOptions && (
                        <div className="pt-3">
                            <button
                                type="button"
                                onClick={resetOptions}
                                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Reset to defaults
                            </button>
                        </div>
                    )}

                    {/* Style */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Palette className="w-4 h-4" />
                            Art Style
                        </label>
                        <select
                            value={generationOptions.style || ''}
                            onChange={(e) => handleOptionChange('style', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            {styleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Ratio className="w-4 h-4" />
                            Aspect Ratio
                        </label>
                        <select
                            value={generationOptions.aspectRatio || ''}
                            onChange={(e) => handleOptionChange('aspectRatio', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            {aspectRatioOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quality */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                            <Eye className="w-4 h-4" />
                            Quality
                        </label>
                        <select
                            value={generationOptions.quality || ''}
                            onChange={(e) => handleOptionChange('quality', e.target.value)}
                            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            {qualityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Grid layout for smaller options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Mood */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Sparkles className="w-4 h-4" />
                                Mood
                            </label>
                            <select
                                value={generationOptions.mood || ''}
                                onChange={(e) => handleOptionChange('mood', e.target.value)}
                                className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                            >
                                {moodOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Color Scheme */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                <Palette className="w-4 h-4" />
                                Colors
                            </label>
                            <select
                                value={generationOptions.colorScheme || ''}
                                onChange={(e) => handleOptionChange('colorScheme', e.target.value)}
                                className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                            >
                                {colorSchemeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pt-2">
                        <p className="text-xs text-gray-500">
                            These options will be added to your prompt automatically to enhance the generated images.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GenerationOptions;