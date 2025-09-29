"use client"
import React, { useEffect, useState } from 'react'
import { Search, History, Trash2, RefreshCw, X, Clock, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import useAppStore, { PromptHistoryItem } from '@/store/appStore'

const PromptHistory = () => {
    const {
        promptHistory,
        isLoadingHistory,
        showHistory,
        historySearchTerm,
        setShowHistory,
        setHistorySearchTerm,
        fetchPromptHistory,
        deleteHistoryItem,
        useHistoryPrompt
    } = useAppStore();

    const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();

    useEffect(() => {
        if (showHistory && promptHistory.length === 0) {
            fetchPromptHistory();
        }
    }, [showHistory, promptHistory.length, fetchPromptHistory]);

    useEffect(() => {
        if (searchDebounce) {
            clearTimeout(searchDebounce);
        }

        const timeout = setTimeout(() => {
            if (showHistory) {
                fetchPromptHistory(historySearchTerm);
            }
        }, 300);

        setSearchDebounce(timeout);

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [historySearchTerm, showHistory, fetchPromptHistory]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHistorySearchTerm(e.target.value);
    };

    const handleUsePrompt = (item: PromptHistoryItem) => {
        useHistoryPrompt(item);
    };

    const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this prompt from history?')) {
            await deleteHistoryItem(id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!showHistory) {
        return (
            <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition-colors text-sm"
            >
                <History className="w-4 h-4" />
                History
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col border border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-semibold text-white">Prompt History</h2>
                    </div>
                    <button
                        onClick={() => setShowHistory(false)}
                        className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your prompts..."
                            value={historySearchTerm}
                            onChange={handleSearch}
                            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
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
                            <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">
                                {historySearchTerm ? 'No prompts found matching your search.' : 'No prompts in history yet.'}
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Start generating images to build your history!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {promptHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#222] rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                                    onClick={() => handleUsePrompt(item)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(item.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <ImageIcon className="w-3 h-3" />
                                                    {item.imageCount} image{item.imageCount !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <p className="text-white text-sm font-medium mb-3 overflow-hidden max-h-10">
                                                {item.prompt}
                                            </p>
                                            
                                            {/* Generated Images Preview */}
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {item.imageUrls.slice(0, 4).map((url, index) => (
                                                    <div key={index} className="flex-shrink-0">
                                                        <Image
                                                            src={url}
                                                            alt={`Generated ${index + 1}`}
                                                            width={60}
                                                            height={60}
                                                            className="rounded-md object-cover w-15 h-15"
                                                        />
                                                    </div>
                                                ))}
                                                {item.imageUrls.length > 4 && (
                                                    <div className="flex-shrink-0 w-15 h-15 bg-[#333] rounded-md flex items-center justify-center text-xs text-gray-400">
                                                        +{item.imageUrls.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUsePrompt(item);
                                                }}
                                                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Use this prompt"
                                            >
                                                <RefreshCw className="w-4 h-4 text-white" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteItem(item.id, e)}
                                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete from history"
                                            >
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800">
                    <p className="text-xs text-gray-400 text-center">
                        Click on any prompt to use it again, or use the actions on hover
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromptHistory;