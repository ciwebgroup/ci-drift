import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hiddenTabs: string[];
  setHiddenTabs: (tabs: string[]) => void;
  isTabHidden: (tabId: string) => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      hiddenTabs: [],

      setHiddenTabs: (tabs) => {
        set({ hiddenTabs: tabs });
      },

      isTabHidden: (tabId) => {
        return get().hiddenTabs.includes(tabId);
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);
