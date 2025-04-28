import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LinkData {
  content: string;
  linkedElement: string;
  type: string;
  url: string;
  target: string;
  noFollow: boolean;
  status: number;
  id: string | null;
  class: string | null;
}

interface LinkSummary {
  totals: {
    internal: number;
    external: number;
    nonUrlProtocol: number;
    noFollow: number;
  };
  links: LinkData[];
}

interface LinkState {
  lastUpdated: number | null;
  ttl: number;
  isLoading: boolean;
  data: LinkSummary | null;
  fetchData: (url: string, force?: boolean) => Promise<void>;
  clearCache: () => void;
}

const ONE_HOUR = 60 * 60 * 1000;
const WEB_SERVICES_ENDPOINT = import.meta.env.VITE_WEB_SERVICES_ENDPOINT;

export const useSeoLinkStore = create<LinkState>()(
  persist(
    (set, get) => ({
      lastUpdated: null,
      ttl: ONE_HOUR,
      isLoading: false,
      data: null,

      fetchData: async (url: string, force = false) => {
        const state = get();
        if (!force && state.lastUpdated && Date.now() - state.lastUpdated < state.ttl) {
          return;
        }

        set({ isLoading: true });
        
        try {
          const response = await fetch(`${WEB_SERVICES_ENDPOINT}/services/v1/crawler/link-summary`, {
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
          console.error('Error fetching link data:', error);
          set({ isLoading: false });
        }
      },

      clearCache: () => set({
        lastUpdated: null,
        data: null
      })
    }),
    {
      name: 'seo-link-storage'
    }
  )
);
