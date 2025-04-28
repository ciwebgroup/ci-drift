import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CtaSummary {
  phoneNumbers: number;
  webForms: number;
  schedulers: number;
  chatbots: number;
}

interface CtaState {
  lastUpdated: number | null;
  ttl: number;
  isLoading: boolean;
  data: CtaSummary | null;
  fetchData: (url: string, force?: boolean) => Promise<void>;
  clearCache: () => void;
}

const FIVE_MINUTES = 5 * 60 * 1000;
const WEB_SERVICES_ENDPOINT = import.meta.env.VITE_WEB_SERVICES_ENDPOINT;

export const useSeoCtaStore = create<CtaState>()(
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
          const response = await fetch(`${WEB_SERVICES_ENDPOINT}/services/v1/crawler/cta-summary`, {
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
          console.error('Error fetching CTA data:', error);
          set({ isLoading: false });
        }
      },

      clearCache: () => set({
        lastUpdated: null,
        data: null
      })
    }),
    {
      name: 'seo-cta-storage'
    }
  )
);
