import { create } from 'zustand'

export type PromptHistoryItem = {
    id: string;
    prompt: string;
    imageUrls: string[];
    imageCount: number;
    createdAt: string;
    updatedAt: string;
}

export type GenerationOptions = {
    style?: string;
    aspectRatio?: string;
    quality?: string;
    mood?: string;
    colorScheme?: string;
}

export type SidebarSection = 'history' | 'gallery' | null;

type AppStateProps = {
    
    userprompt: string;
    setUserPrompt: (prompt: string) => void;
    imageCount: number;
    setImageCount: (count: number) => void;
    generatedImages: string[];
    setGeneratedImages: (images: string[]) => void;
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
    
    generationOptions: GenerationOptions;
    setGenerationOptions: (options: GenerationOptions) => void;
    
    sidebarOpen: boolean;
    sidebarSection: SidebarSection;
    setSidebarOpen: (open: boolean) => void;
    setSidebarSection: (section: SidebarSection) => void;
    
    promptHistory: PromptHistoryItem[];
    isLoadingHistory: boolean;
    historySearchTerm: string;
    setPromptHistory: (history: PromptHistoryItem[]) => void;
    addToPromptHistory: (item: PromptHistoryItem) => void;
    setIsLoadingHistory: (loading: boolean) => void;
    setHistorySearchTerm: (term: string) => void;
    fetchPromptHistory: (search?: string, limit?: number, offset?: number) => Promise<void>;
    savePromptToHistory: (prompt: string, imageUrls: string[], imageCount: number) => Promise<void>;
    deleteHistoryItem: (id: string) => Promise<void>;
    useHistoryPrompt: (historyItem: PromptHistoryItem) => void;
    
    allGeneratedImages: string[];
    gallerySearchTerm: string;
    setAllGeneratedImages: (images: string[]) => void;
    setGallerySearchTerm: (term: string) => void;
    addToGallery: (images: string[]) => void;
}

const useAppStore = create<AppStateProps>((set, get) => ({
    userprompt: "",
    setUserPrompt: (prompt: string) => set({ userprompt: prompt }),
    imageCount: 1,
    setImageCount: (count: number) => set({ imageCount: count }),
    generatedImages: [],
    setGeneratedImages: (images: string[]) => set({ generatedImages: images }),
    isGenerating: false,
    setIsGenerating: (generating: boolean) => set({ isGenerating: generating }),
    
    generationOptions: {},
    setGenerationOptions: (options: GenerationOptions) => set({ generationOptions: options }),
    
    sidebarOpen: false,
    sidebarSection: null,
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    setSidebarSection: (section: SidebarSection) => set({ sidebarSection: section }),
    
    promptHistory: [],
    isLoadingHistory: false,
    historySearchTerm: "",
    setPromptHistory: (history: PromptHistoryItem[]) => set({ promptHistory: history }),
    addToPromptHistory: (item: PromptHistoryItem) => set((state) => ({ 
        promptHistory: [item, ...state.promptHistory] 
    })),
    setIsLoadingHistory: (loading: boolean) => set({ isLoadingHistory: loading }),
    setHistorySearchTerm: (term: string) => set({ historySearchTerm: term }),
    
    fetchPromptHistory: async (search = "", limit = 20, offset = 0) => {
        set({ isLoadingHistory: true });
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
                ...(search && { search })
            });
            
            const response = await fetch(`/api/history?${params}`);
            const data = await response.json();
            
            if (response.ok) {
                if (offset === 0) {
                    set({ promptHistory: data.history });
                } else {
                    set((state) => ({ 
                        promptHistory: [...state.promptHistory, ...data.history] 
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            set({ isLoadingHistory: false });
        }
    },
    
    savePromptToHistory: async (prompt: string, imageUrls: string[], imageCount: number) => {
        try {
            const response = await fetch('/api/history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    imageUrls,
                    imageCount,
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                get().addToPromptHistory(data);
            }
        } catch (error) {
            console.error('Failed to save to history:', error);
        }
    },
    
    deleteHistoryItem: async (id: string) => {
        try {
            const response = await fetch(`/api/history/${id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                set((state) => ({
                    promptHistory: state.promptHistory.filter(item => item.id !== id)
                }));
            } else {
                const data = await response.json();
                console.error('Failed to delete history item:', data.error);
            }
        } catch (error) {
            console.error('Error deleting history item:', error);
        }
    },
    
    useHistoryPrompt: (historyItem: PromptHistoryItem) => {
        set({ 
            userprompt: historyItem.prompt,
            imageCount: historyItem.imageCount
        });
    },
    
    allGeneratedImages: [],
    gallerySearchTerm: "",
    setAllGeneratedImages: (images: string[]) => set({ allGeneratedImages: images }),
    setGallerySearchTerm: (term: string) => set({ gallerySearchTerm: term }),
    addToGallery: (images: string[]) => set((state) => ({ 
        allGeneratedImages: [...images, ...state.allGeneratedImages] 
    })),
}))

export default useAppStore;