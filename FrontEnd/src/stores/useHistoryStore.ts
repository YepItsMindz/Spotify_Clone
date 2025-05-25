import { create } from "zustand";

export interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl?: string;
}

export interface HistoryItem {
  _id: string;
  songId: Song;
  listenedAt: string;
}

interface HistoryStore {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  addToHistory: (song: Song) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  setHistory: (history) => set({ history }),
  addToHistory: (song) =>
    set((state) => {
      // Remove if already exists
      const filtered = state.history.filter((h) => h.songId._id !== song._id);
      // Add new entry at the top, keep only 20
      return {
        history: [
          {
            _id: Math.random().toString(36).slice(2),
            songId: song,
            listenedAt: new Date().toISOString(),
          },
          ...filtered,
        ].slice(0, 20),
      };
    }),
}));
