/**
 * Store Configuration
 * 
 * All store data is centralized in stores.json
 * Each Vercel deployment should set the VITE_STORE_ID environment variable:
 * - home-service-market
 * - town-country-market
 * - mmc-wine-spirit
 */

import storesData from './stores.json';

export interface StoreAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  full: string;
}

export interface StoreHours {
  weekday: string;
  weekend: string;
}

export interface StoreFAQ {
  question: string;
  answer: string;
}

export interface StoreReview {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface StoreConfig {
  id: string;
  name: string;
  since: string;
  tagline: string;
  description: string;
  headline: string;
  icon: string;
  address: StoreAddress;
  phone: string;
  hours: StoreHours;
  spreadsheetId: string;
  url: string;
  faqs: StoreFAQ[];
  reviews: StoreReview[];
}

// Type the imported JSON
const stores: Record<string, StoreConfig> = storesData as Record<string, StoreConfig>;

// All store IDs
export const storeIds = Object.keys(stores);

/**
 * Get the current store config based on environment variable
 * Defaults to first store if not set
 */
export function getCurrentStore(): StoreConfig {
  const storeId = import.meta.env.VITE_STORE_ID || 'home-service-market';
  return stores[storeId] || stores['home-service-market'];
}

/**
 * Get store by ID
 */
export function getStoreById(storeId: string): StoreConfig | undefined {
  return stores[storeId];
}

/**
 * Get all stores
 */
export function getAllStores(): StoreConfig[] {
  return Object.values(stores);
}

/**
 * Get other stores (for "Other Locations" navigation)
 */
export function getOtherStores(): StoreConfig[] {
  const currentStore = getCurrentStore();
  return Object.values(stores).filter(s => s.id !== currentStore.id);
}

/**
 * Build Google Sheets CSV export URL
 * Default gid=2011133176 is the "All Products" sheet
 */
export function getSpreadsheetCsvUrl(spreadsheetId: string, gid: string = '2011133176'): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
}
