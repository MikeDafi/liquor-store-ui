/**
 * Google Sheets Data Fetching Utilities
 * 
 * Fetches data from public Google Sheets using the CSV export feature.
 * No API key required for public sheets.
 */

import { storeConfig } from '../config/store';

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
  const url = getSheetCsvUrl(storeConfig.googleSheetId, gid);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status}`);
    }
    
    const csv = await response.text();
    return parseCsv<T>(csv);
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

// Product data from sheet
export interface SheetProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  size: string;
  image: string;
  description: string;
  brand: string;
  locations: string;
  isTouristFavorite: string;
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

// Fetch products from Google Sheet
export async function fetchProducts(): Promise<SheetProduct[]> {
  return fetchSheetData<SheetProduct>(storeConfig.productsSheetGid);
}

// Fetch locations from Google Sheet
export async function fetchLocations(): Promise<SheetLocation[]> {
  return fetchSheetData<SheetLocation>(storeConfig.locationsSheetGid);
}

// Fetch categories from Google Sheet
export async function fetchCategories(): Promise<SheetCategory[]> {
  return fetchSheetData<SheetCategory>(storeConfig.categoriesSheetGid);
}

// Fetch FAQs from Google Sheet
export async function fetchFaqs(): Promise<SheetFaq[]> {
  return fetchSheetData<SheetFaq>(storeConfig.faqsSheetGid);
}

// Transform sheet data to app format
export function transformProduct(sheet: SheetProduct) {
  return {
    id: sheet.id,
    name: sheet.name,
    category: sheet.category,
    subcategory: sheet.subcategory,
    price: parseFloat(sheet.price) || 0,
    size: sheet.size,
    image: sheet.image,
    description: sheet.description,
    brand: sheet.brand,
    locations: sheet.locations?.split(',').map(l => l.trim()) || [],
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

