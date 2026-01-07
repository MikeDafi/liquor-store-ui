/**
 * Store Configuration
 * 
 * Each Vercel deployment should set the VITE_STORE_ID environment variable:
 * - home-service-market: Home Service Market store
 * - town-country-market: Town Country Market store
 * - mmc-wine-spirit: MMC Wine & Spirit store
 * 
 * In Vercel dashboard: Settings > Environment Variables > Add:
 *   Name: VITE_STORE_ID
 *   Value: <store-id>
 */

export interface StoreConfig {
  id: string;
  name: string;
  spreadsheetId: string;
  url: string;
}

// All stores in the network
export const stores: StoreConfig[] = [
  {
    id: 'home-service-market',
    name: 'Home Service Market',
    spreadsheetId: '17lpkOLWIIeXz17sjTuGrAyQMNz3wcRsUCleuirLc2Bw',
    url: 'https://home-service-market.vercel.app', // Update with actual URL
  },
  {
    id: 'town-country-market',
    name: 'Town Country Market',
    spreadsheetId: '1NH20t073dWNihFY49p5WYxiGTf0_ui1GBVN9UxPklh4',
    url: 'https://town-country-market.vercel.app', // Update with actual URL
  },
  {
    id: 'mmc-wine-spirit',
    name: 'MMC Wine & Spirit',
    spreadsheetId: '1__JWmXYb_2fbtMp1Fk7DSCXq6DNQGrFfsLQ4Pdj3emg',
    url: 'https://mmc-wine-spirit.vercel.app', // Update with actual URL
  },
];

/**
 * Get the current store config based on environment variable
 * Defaults to first store if not set
 */
export function getCurrentStore(): StoreConfig {
  const storeId = import.meta.env.VITE_STORE_ID || 'home-service-market';
  return stores.find(s => s.id === storeId) || stores[0];
}

/**
 * Get other stores (for "Other Locations" navigation)
 */
export function getOtherStores(): StoreConfig[] {
  const currentStore = getCurrentStore();
  return stores.filter(s => s.id !== currentStore.id);
}

/**
 * Build Google Sheets CSV export URL
 */
export function getSpreadsheetCsvUrl(spreadsheetId: string, gid: string = '0'): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

