/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Store Info
  readonly VITE_STORE_NAME: string;
  readonly VITE_STORE_TAGLINE: string;
  readonly VITE_STORE_DESCRIPTION: string;
  readonly VITE_STORE_SINCE: string;
  readonly VITE_STORE_ICON: string;
  
  // Contact
  readonly VITE_STORE_EMAIL: string;
  readonly VITE_STORE_PHONE: string;
  
  // Social
  readonly VITE_SOCIAL_INSTAGRAM: string;
  readonly VITE_SOCIAL_FACEBOOK: string;
  readonly VITE_SOCIAL_TWITTER: string;
  readonly VITE_SOCIAL_YELP: string;
  
  // Branding
  readonly VITE_PRIMARY_COLOR: string;
  readonly VITE_ACCENT_COLOR: string;
  
  // Google Sheets
  readonly VITE_GOOGLE_SHEET_ID: string;
  readonly VITE_PRODUCTS_SHEET_GID: string;
  readonly VITE_LOCATIONS_SHEET_GID: string;
  readonly VITE_CATEGORIES_SHEET_GID: string;
  readonly VITE_FAQS_SHEET_GID: string;
  
  // Features
  readonly VITE_DELIVERY_ENABLED: string;
  readonly VITE_DELIVERY_MESSAGE: string;
  readonly VITE_SHOW_PRICES: string;
  readonly VITE_SHOW_INVENTORY: string;
  
  // SEO
  readonly VITE_SEO_TITLE: string;
  readonly VITE_SEO_DESCRIPTION: string;
  readonly VITE_SEO_KEYWORDS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
