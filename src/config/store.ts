/**
 * Store Configuration
 * 
 * This file contains store-specific configuration that can be customized
 * per deployment via environment variables.
 * 
 * To customize for a different store:
 * 1. Set the environment variables in Vercel dashboard
 * 2. Or create a .env.local file for local development
 */

export interface StoreConfig {
  // Basic Info
  name: string;
  tagline: string;
  headline: string;
  description: string;
  categories: string;
  since: string;
  icon: string;
  
  // Location
  address: string;
  phone: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
  lat: string;
  lng: string;
  
  // Social
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    yelp?: string;
  };
  
  // Branding
  primaryColor: string;
  accentColor: string;
  heroImage: string;
  
  // Data Sources
  googleSheetId: string;
  productsSheetGid: string;
  locationsSheetGid: string;
  categoriesSheetGid: string;
  faqsSheetGid: string;
  
  // Features
  features: {
    deliveryEnabled: boolean;
    deliveryMessage: string;
    showPrices: boolean;
    showInventory: boolean;
    showOtherLocations: boolean;
  };
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Default configuration - can be overridden via environment variables
export const storeConfig: StoreConfig = {
  // Basic Info
  name: import.meta.env.VITE_STORE_NAME || 'SF Liquor & Market',
  tagline: import.meta.env.VITE_STORE_TAGLINE || 'Your Neighborhood Market',
  headline: import.meta.env.VITE_STORE_HEADLINE || 'Your Local Market & Liquor Store',
  description: import.meta.env.VITE_STORE_DESCRIPTION || 'Sake, Beer, Wine, Spirits, Pharmacy & More',
  categories: import.meta.env.VITE_STORE_CATEGORIES || 'Sake, Beer, Wine, Spirits, Pharmacy',
  since: import.meta.env.VITE_STORE_SINCE || '',
  icon: import.meta.env.VITE_STORE_ICON || '🍷',
  
  // Location
  address: import.meta.env.VITE_STORE_ADDRESS || '123 Main Street, San Francisco, CA',
  phone: import.meta.env.VITE_STORE_PHONE || '(415) 555-0100',
  email: import.meta.env.VITE_STORE_EMAIL || 'info@store.com',
  hoursWeekday: import.meta.env.VITE_STORE_HOURS_WEEKDAY || 'Mon-Fri: 9:00 AM - 10:00 PM',
  hoursWeekend: import.meta.env.VITE_STORE_HOURS_WEEKEND || 'Sat-Sun: 10:00 AM - 9:00 PM',
  lat: import.meta.env.VITE_STORE_LAT || '37.7749',
  lng: import.meta.env.VITE_STORE_LNG || '-122.4194',
  
  // Social
  socialLinks: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || '',
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || '',
    twitter: import.meta.env.VITE_SOCIAL_TWITTER || '',
    yelp: import.meta.env.VITE_SOCIAL_YELP || '',
  },
  
  // Branding
  primaryColor: import.meta.env.VITE_PRIMARY_COLOR || '#171717',
  accentColor: import.meta.env.VITE_ACCENT_COLOR || '#16a34a',
  heroImage: import.meta.env.VITE_HERO_IMAGE || 'https://images.unsplash.com/photo-1690248387895-2db2a8072ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  
  // Data Sources - Google Sheets
  googleSheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || '1yjEkHPrTZ4mPJOUJX_7mU1gwFuy0bRZbZZ_tSZASI9I',
  productsSheetGid: import.meta.env.VITE_PRODUCTS_SHEET_GID || '2011133176',
  locationsSheetGid: import.meta.env.VITE_LOCATIONS_SHEET_GID || '0',
  categoriesSheetGid: import.meta.env.VITE_CATEGORIES_SHEET_GID || '0',
  faqsSheetGid: import.meta.env.VITE_FAQS_SHEET_GID || '0',
  
  // Features
  features: {
    deliveryEnabled: import.meta.env.VITE_DELIVERY_ENABLED === 'true',
    deliveryMessage: import.meta.env.VITE_DELIVERY_MESSAGE || 'Delivery coming soon',
    showPrices: import.meta.env.VITE_SHOW_PRICES !== 'false',
    showInventory: import.meta.env.VITE_SHOW_INVENTORY !== 'false',
    showOtherLocations: import.meta.env.VITE_SHOW_OTHER_LOCATIONS === 'true',
  },
  
  // SEO
  seo: {
    title: import.meta.env.VITE_SEO_TITLE || 'Local Market & Liquor Store | San Francisco',
    description: import.meta.env.VITE_SEO_DESCRIPTION || 'Your neighborhood market with sake, beer, wine, spirits, pharmacy and more in San Francisco.',
    keywords: (import.meta.env.VITE_SEO_KEYWORDS || 'liquor store, market, san francisco, sake, beer, wine, spirits').split(',').map((k: string) => k.trim()),
  },
};

// Helper to get the store's single location
export function getStoreLocation() {
  return {
    id: 'main',
    name: storeConfig.name,
    address: storeConfig.address,
    phone: storeConfig.phone,
    hours: {
      weekday: storeConfig.hoursWeekday,
      weekend: storeConfig.hoursWeekend,
    },
    coordinates: {
      lat: parseFloat(storeConfig.lat),
      lng: parseFloat(storeConfig.lng),
    },
    image: storeConfig.heroImage,
    description: storeConfig.description,
  };
}

export default storeConfig;
