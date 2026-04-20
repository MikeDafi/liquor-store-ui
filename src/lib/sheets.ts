/**
 * Google Sheets Data Fetching Utilities
 * 
 * Fetches data from public Google Sheets using the CSV export feature.
 * No API key required for public sheets.
 */

import { getCurrentStore } from '../../data/storeConfig';

// Build the Google Sheets CSV export URL
function getSheetCsvUrl(sheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

// Parse CSV string into array of objects
function parseCsv<T>(csv: string): T[] {
  const lines = csv.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  // Parse header row
  const headers = parseCsvLine(lines[0]);
  
  // Parse data rows
  const data: T[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      // Convert header to camelCase
      const key = header.trim().toLowerCase().replace(/\s+(.)/g, (_, c) => c.toUpperCase());
      row[key] = values[index]?.trim() || '';
    });
    
    data.push(row as T);
  }
  
  return data;
}

// Parse a single CSV line, handling quoted values
function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

// Fetch data from a specific sheet
export async function fetchSheetData<T>(gid: string): Promise<T[]> {
  const currentStore = getCurrentStore();
  const url = getSheetCsvUrl(currentStore.spreadsheetId, gid);
  
  console.log('[Sheets] Fetching from:', url);
  console.log('[Sheets] Store:', currentStore.name, 'Sheet ID:', currentStore.spreadsheetId);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status}`);
    }
    
    const csv = await response.text();
    const parsed = parseCsv<T>(csv);
    console.log('[Sheets] Parsed rows:', parsed.length);
    if (parsed.length > 0) {
      console.log('[Sheets] First row:', parsed[0]);
    }
    return parsed;
  } catch (error) {
    console.error('[Sheets] Error fetching sheet data:', error);
    return [];
  }
}

// Product data from sheet (maps to actual Google Sheet columns)
// Different stores may have different column names, so we support multiple variants
export interface SheetProduct {
  // Common columns (camelCase converted from various header names)
  available?: string;
  nameOfProduct?: string;
  code?: string;
  priceInStore?: string;
  prices?: string;  // Alternative column name
  category?: string;
  // Legacy/optional columns for backwards compatibility
  id?: string;
  name?: string;
  subcategory?: string;
  price?: string;
  size?: string;
  image?: string;
  description?: string;
  brand?: string;
  locations?: string;
  isTouristFavorite?: string;
}

// Location data from sheet
export interface SheetLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hoursWeekday: string;
  hoursWeekend: string;
  lat: string;
  lng: string;
  image: string;
  description: string;
}

// Category data from sheet
export interface SheetCategory {
  id: string;
  name: string;
  icon: string;
  image: string;
}

// FAQ data from sheet
export interface SheetFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Default GIDs for sheet tabs
const DEFAULT_PRODUCTS_GID = '2011133176';
const DEFAULT_LOCATIONS_GID = '0';
const DEFAULT_CATEGORIES_GID = '0';
const DEFAULT_FAQS_GID = '0';

// Fetch products from Google Sheet
export async function fetchProducts(): Promise<SheetProduct[]> {
  return fetchSheetData<SheetProduct>(DEFAULT_PRODUCTS_GID);
}

// Fetch locations from Google Sheet
export async function fetchLocations(): Promise<SheetLocation[]> {
  return fetchSheetData<SheetLocation>(DEFAULT_LOCATIONS_GID);
}

// Fetch categories from Google Sheet
export async function fetchCategories(): Promise<SheetCategory[]> {
  return fetchSheetData<SheetCategory>(DEFAULT_CATEGORIES_GID);
}

// Fetch FAQs from Google Sheet
export async function fetchFaqs(): Promise<SheetFaq[]> {
  return fetchSheetData<SheetFaq>(DEFAULT_FAQS_GID);
}

// Category placeholder images
const categoryImages: Record<string, string> = {
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
  spirits: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
  whiskey: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
  vodka: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400&q=80',
  tequila: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=400&q=80',
  rum: 'https://images.unsplash.com/photo-1614313511387-1436a4480ebb?w=400&q=80',
  gin: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400&q=80',
  sake: 'https://images.unsplash.com/photo-1579541592065-da8a15e49bc7?w=400&q=80',
  champagne: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=400&q=80',
  liqueur: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
  mixer: 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&q=80',
  food: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
  drinks: 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&q=80',
  tobacco: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
};

function getCategoryImage(category: string): string {
  const normalizedCategory = category?.toLowerCase().trim() || '';
  return categoryImages[normalizedCategory] || categoryImages.default;
}

// Transform sheet data to app format
export function transformProduct(sheet: SheetProduct) {
  // Map actual sheet columns to expected format (handles different column naming conventions)
  const name = sheet.nameOfProduct || sheet.name || '';
  const id = sheet.code || sheet.id || `product-${Math.random().toString(36).substr(2, 9)}`;
  const price = sheet.prices || sheet.priceInStore || sheet.price || '0';
  const category = sheet.category || '';
  
  // Extract brand from product name (first word or two before main product name)
  const nameParts = name.split(' ');
  const brand = sheet.brand || (nameParts.length > 2 ? nameParts.slice(0, 2).join(' ') : nameParts[0] || '');
  
  // Extract size from name if present (e.g., "750 ML", "750ml")
  const sizeMatch = name.match(/(\d+\s*(?:ml|ML|L|l|oz|OZ))/i);
  const size = sheet.size || (sizeMatch ? sizeMatch[1] : '');
  
  return {
    id,
    name,
    category,
    subcategory: sheet.subcategory || category,
    price: parseFloat(price) || 0,
    size,
    image: sheet.image || getCategoryImage(category),
    description: sheet.description || `${name} - Available in store`,
    brand,
    locations: sheet.locations?.split(',').map(l => l.trim()) || ['main'],
    isTouristFavorite: sheet.isTouristFavorite?.toLowerCase() === 'true',
  };
}

export function transformLocation(sheet: SheetLocation) {
  return {
    id: sheet.id,
    name: sheet.name,
    address: sheet.address,
    phone: sheet.phone,
    hours: {
      weekday: sheet.hoursWeekday,
      weekend: sheet.hoursWeekend,
    },
    coordinates: {
      lat: parseFloat(sheet.lat) || 0,
      lng: parseFloat(sheet.lng) || 0,
    },
    image: sheet.image,
    description: sheet.description,
  };
}

export function transformCategory(sheet: SheetCategory) {
  return {
    id: sheet.id,
    name: sheet.name,
    icon: sheet.icon,
    image: sheet.image,
  };
}

export function transformFaq(sheet: SheetFaq) {
  return {
    id: sheet.id,
    question: sheet.question,
    answer: sheet.answer,
    category: sheet.category,
  };
}





