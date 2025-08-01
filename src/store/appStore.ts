import { create } from 'zustand'

type AppStateProps = {
    userprompt: string;
    setUserPrompt: (prompt: string) => void;
    imageCount: number;
    setImageCount: (count: number) => void;
    generatedImages: string[];
    setGeneratedImages: (images: string[]) => void;
    isGenerating: boolean;
    setIsGenerating: (generating: boolean) => void;
}

const useAppStore = create<AppStateProps>((set) => ({
    userprompt: "",
    setUserPrompt: (prompt: string) => set({ userprompt: prompt }),
    imageCount: 1,
    setImageCount: (count: number) => set({ imageCount: count }),
    generatedImages: [],
    setGeneratedImages: (images: string[]) => set({ generatedImages: images }),
    isGenerating: false,
    setIsGenerating: (generating: boolean) => set({ isGenerating: generating }),
}))

export default useAppStore;