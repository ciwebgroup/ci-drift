import { create } from 'zustand';

interface BuildState {
  lastBuildTime: Date | null;
  buildStatus: 'success' | 'failure' | 'running' | 'unknown';
  isLoading: boolean;
  setBuildStatus: (status: BuildState['buildStatus']) => void;
  setLastBuildTime: (time: Date) => void;
  setLoading: (loading: boolean) => void;
}

export const useBuildStore = create<BuildState>((set) => ({
  lastBuildTime: null,
  buildStatus: 'unknown',
  isLoading: false,
  setBuildStatus: (status) => set({ buildStatus: status }),
  setLastBuildTime: (time) => set({ lastBuildTime: time }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
