import { create } from "zustand";

type WordCountStore = {
  wordCount: number;
  setWordCount: (count: number) => void;
};

export const useWordCount = create<WordCountStore>((set) => ({
  wordCount: 0,
  setWordCount: (count) => set({ wordCount: count }),
}));
