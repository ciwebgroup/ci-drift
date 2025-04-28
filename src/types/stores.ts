interface CacheableState {
  lastUpdated: number | null;
  ttl: number;
  isLoading: boolean;
}


export interface DnsState extends CacheableState {
  dnsRecords: Record<string, string[]> | null;
  whoisData: Record<string, string> | null;
  hosting: string | null;
  extra: string | null;
  fetchData: (url: string, force?: boolean) => Promise<void>;
  clearCache: () => void;
}

export interface QaState extends CacheableState {
  issues: any[]; // Define specific issue type
  setQaInfo: (data: Partial<QaState>) => void;
  clearCache: () => void;
}

export interface SeoState extends CacheableState {
  metrics: any; // Define specific SEO metrics
  setSeoInfo: (data: Partial<SeoState>) => void;
  clearCache: () => void;
}

export interface SpeedState extends CacheableState {
  performance: any; // Define specific performance metrics
  setSpeedInfo: (data: Partial<SpeedState>) => void;
  clearCache: () => void;
}

export interface ContentState extends CacheableState {
  content: any; // Define specific content structure
  setContentInfo: (data: Partial<ContentState>) => void;
  clearCache: () => void;
}
