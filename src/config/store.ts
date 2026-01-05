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
  description: string;
  since: string;
  icon: string;
  
  // Contact
  email: string;
  phone: string;
  
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
  tagline: import.meta.env.VITE_STORE_TAGLINE || 'Since 1998',
  description: import.meta.env.VITE_STORE_DESCRIPTION || 'Premium spirits, wine, sake, craft beer & essentials.',
  since: import.meta.env.VITE_STORE_SINCE || '1998',
  icon: import.meta.env.VITE_STORE_ICON || '🥃',
  
  // Contact
  email: import.meta.env.VITE_STORE_EMAIL || 'info@sfliquor.com',
  phone: import.meta.env.VITE_STORE_PHONE || '(415) 555-0100',
  
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
  
  // Data Sources - Google Sheets
  googleSheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || '1yjEkHPrTZ4mPJOUJX_7mU1gwFuy0bRZbZZ_tSZASI9I',
  productsSheetGid: import.meta.env.VITE_PRODUCTS_SHEET_GID || '2011133176',
  locationsSheetGid: import.meta.env.VITE_LOCATIONS_SHEET_GID || '0',
  categoriesSheetGid: import.meta.env.VITE_CATEGORIES_SHEET_GID || '0',
  faqsSheetGid: import.meta.env.VITE_FAQS_SHEET_GID || '0',
  
  // Features
  features: {
    deliveryEnabled: import.meta.env.VITE_DELIVERY_ENABLED === 'true',
    deliveryMessage: import.meta.env.VITE_DELIVERY_MESSAGE || 'Delivery coming soon to your area',
    showPrices: import.meta.env.VITE_SHOW_PRICES !== 'false',
    showInventory: import.meta.env.VITE_SHOW_INVENTORY !== 'false',
  },
  
  // SEO
  seo: {
    title: import.meta.env.VITE_SEO_TITLE || 'SF Liquor & Market | Premium Spirits Near Union Square',
    description: import.meta.env.VITE_SEO_DESCRIPTION || 'Full liquor store in San Francisco with whiskey, vodka, wine, sake, craft beer and more. Open late near Union Square.',
    keywords: (import.meta.env.VITE_SEO_KEYWORDS || 'liquor store, san francisco, union square, whiskey, vodka, wine, sake, beer').split(',').map((k: string) => k.trim()),
  },
};

export default storeConfig;

