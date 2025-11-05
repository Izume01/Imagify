"use client"
import React, { useEffect } from 'react'
import { Search, Clock, Trash2 } from 'lucide-react'
import Image from 'next/image'
import useAppStore from '@/store/appStore'

const SidebarHistory = () => {
    const {
        promptHistory,
        isLoadingHistory,
        historySearchTerm,
        setHistorySearchTerm,
        fetchPromptHistory,
        deleteHistoryItem,
        useHistoryPrompt
    } = useAppStore();


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHistorySearchTerm(e.target.value);
        fetchPromptHistory(e.target.value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-gray-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search prompts..."
                        value={historySearchTerm}
                        onChange={handleSearch}
                        className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                    </div>
                ) : promptHistory.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm">
                            {historySearchTerm ? 'No prompts found.' : 'No prompts in history yet.'}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            Generate images to see them here!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {promptHistory.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#222] rounded-lg p-3 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                                onClick={() => useHistoryPrompt(item)}
                            >
                                <div className="flex items-start gap-3">
                                    {/* First image preview */}
                                    <div className="flex-shrink-0">
                                        {item.imageUrls[0] && (
                                            <Image
                                                src={item.imageUrls[0]}
                                                alt="Preview"
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover w-12 h-12"
                                            />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-gray-400">
                                                {formatDate(item.createdAt)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {item.imageCount} image{item.imageCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <p className="text-white text-xs font-medium overflow-hidden max-h-8 leading-4">
                                            {item.prompt}
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this prompt from history?')) deleteHistoryItem(item.id);
                                        }}
                                        className="p-1 bg-red-600/80 hover:bg-red-600 rounded text-white transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                
                                {/* Additional images indicator */}
                                {item.imageUrls.length > 1 && (
                                    <div className="mt-2 flex items-center gap-1">
                                        {item.imageUrls.slice(1, 4).map((url, index) => (
                                            <Image
                                                key={index}
                                                src={url}
                                                alt={`Preview ${index + 2}`}
                                                width={24}
                                                height={24}
                                                className="rounded object-cover w-6 h-6"
                                            />
                                        ))}
                                        {item.imageUrls.length > 4 && (
                                            <div className="w-6 h-6 bg-[#333] rounded flex items-center justify-center text-xs text-gray-400">
                                                +{item.imageUrls.length - 4}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarHistory;