import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReadabilitySummary {
  wordCount: number;
  sentenseCount: number;
  avgWordsPerSentence: number;
  fleschReadingEaseScore: number;
}

interface ReadabilityState {
  lastUpdated: number | null;
  ttl: number;
  isLoading: boolean;
  data: ReadabilitySummary | null;
  fetchData: (url: string, force?: boolean) => Promise<void>;
  clearCache: () => void;
}

const FIVE_MINUTES = 5 * 60 * 1000;
const WEB_SERVICES_ENDPOINT = import.meta.env.VITE_WEB_SERVICES_ENDPOINT;

export const useSeoReadabilityStore = create<ReadabilityState>()(
  persist(
    (set, get) => ({
      lastUpdated: null,
      ttl: FIVE_MINUTES,
      isLoading: false,
      data: null,

      fetchData: async (url: string, force = false) => {
        const state = get();
        if (!force && state.lastUpdated && Date.now() - state.lastUpdated < state.ttl) {
          return;
        }

        set({ isLoading: true });
        
        try {
          const response = await fetch(`${WEB_SERVICES_ENDPOINT}/services/v1/crawler/readability-summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });

          const data = await response.json();
          set({
            data,
            lastUpdated: Date.now(),
            isLoading: false
          });
        } catch (error) {
          console.error('Error fetching readability data:', error);
          set({ isLoading: false });
        }
      },

      clearCache: () => set({
        lastUpdated: null,
        data: null
      })
    }),
    {
      name: 'seo-readability-storage'
    }
  )
);
