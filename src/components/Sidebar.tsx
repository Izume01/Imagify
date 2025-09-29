"use client"
import React from 'react'
import { X, History, Images, Menu } from 'lucide-react'
import useAppStore from '@/store/appStore'
import SidebarHistory from './SidebarHistory'
import SidebarGallery from './SidebarGallery'

const Sidebar = () => {
    const {
        sidebarOpen,
        sidebarSection,
        setSidebarOpen,
        setSidebarSection
    } = useAppStore();

    const handleSectionChange = (section: 'history' | 'gallery') => {
        if (sidebarSection === section && sidebarOpen) {
            setSidebarOpen(false);
            setSidebarSection(null);
        } else {
            setSidebarSection(section);
            setSidebarOpen(true);
        }
    };

    return (
        <>
            {/* Sidebar Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white hover:bg-[#2a2a2a] transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full bg-[#1a1a1a] border-r border-gray-800 z-40
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                w-80 lg:w-96
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">Imagify Studio</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => handleSectionChange('history')}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors
                            ${sidebarSection === 'history' 
                                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10' 
                                : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                            }
                        `}
                    >
                        <History className="w-4 h-4" />
                        History
                    </button>
                    <button
                        onClick={() => handleSectionChange('gallery')}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors
                            ${sidebarSection === 'gallery' 
                                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10' 
                                : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                            }
                        `}
                    >
                        <Images className="w-4 h-4" />
                        Gallery
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {sidebarSection === 'history' && <SidebarHistory />}
                    {sidebarSection === 'gallery' && <SidebarGallery />}
                    {!sidebarSection && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <Images className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <p className="text-sm">Select a tab to view content</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;