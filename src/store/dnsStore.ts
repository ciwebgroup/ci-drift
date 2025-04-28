import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DnsState } from '../types/stores';


const WEB_SERVICES_ENDPOINT = import.meta.env.VITE_WEB_SERVICES_ENDPOINT;
const FIVE_MINUTES = 5 * 60 * 1000;

async function fetchNetworkInfo(url: string) {
  try {
    const domain = new URL(url).hostname.split('.').slice(-2).join('.');
    
    // Fetch DNS records
    const dnsResponse = await fetch(
      `${WEB_SERVICES_ENDPOINT}/services/v1/dns/resolve/${domain}
    `);

    const dnsRecords = await dnsResponse.json();

    // Fetch WHOIS data
    const whoisResponse = await fetch(
      `${WEB_SERVICES_ENDPOINT}/services/v1/dns/whois/${domain}`
    );
    
    const rawWhoisData = await whoisResponse.json();
    const whoisData = {
      'WHOIS Server': Object.keys(rawWhoisData)[0],
      ...rawWhoisData[Object.keys(rawWhoisData)[0]]
    };
    
    // Remove the text property as it's not needed
    delete whoisData.text;

    // Get hosting info
    const aRecord = dnsRecords.a?.[0];
    let hosting = 'Unknown';
    
    if (aRecord) {
      const hostingResponse = await fetch(`https://ipapi.co/${aRecord}/json/`);
      const hostingData = await hostingResponse.json();
      hosting = `${hostingData.org || 'Unknown'} (${hostingData.country})`;
    }

    console.log('DNS Records:', dnsRecords);
    console.log('WHOIS Data:', whoisData);

    // Extra info
    const extra = [
      `Registry Domain ID: ${whoisData.registryDomainId || 'N/A'}`,
      `DNSSEC: ${whoisData.dnssec || 'N/A'}`,
      `Registry Expiry: ${whoisData.registryExpiryDate || 'N/A'}`
    ].join('\n');

    return { dnsRecords, whoisData, hosting, extra };
  } catch (error) {
    console.error('Error fetching network information:', error);
    throw error;
  }
}

export const useDnsStore = create<DnsState>()(
  persist(
    (set, get) => ({
      lastUpdated: null,
      ttl: FIVE_MINUTES,
      isLoading: false,
      dnsRecords: null,
      whoisData: null,
      hosting: null,
      extra: null,

      fetchData: async (url: string, force = false) => {
        const state = get();
        const domain = new URL(url).hostname;
        
        // Check cache unless force refresh
        if (!force && state.lastUpdated && Date.now() - state.lastUpdated < state.ttl) {
          return;
        }

        set({ isLoading: true });
        
        try {
          const data = await fetchNetworkInfo(url);
          set({
            ...data,
            lastUpdated: Date.now(),
            isLoading: false
          });
        } catch (error) {
          set({ 
            isLoading: false,
            dnsRecords: { ERROR: ['Failed to fetch DNS records'] },
            whoisData: { error: 'Failed to fetch WHOIS data' },
            hosting: 'Error detecting hosting provider',
            extra: 'Error fetching additional information'
          });
        }
      },
      clearCache: () => set({
        lastUpdated: null,
        dnsRecords: null,
        whoisData: null,
        hosting: null,
        extra: null
      })
    }),
    {
      name: 'dns-storage'
    }
  )
);

