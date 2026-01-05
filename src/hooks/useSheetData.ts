/**
 * React hooks for fetching and caching Google Sheets data
 */

import { useState, useEffect } from 'react';
import {
  fetchProducts,
  fetchLocations,
  fetchCategories,
  fetchFaqs,
  transformProduct,
  transformLocation,
  transformCategory,
  transformFaq,
} from '../lib/sheets';
import { Product, categories as fallbackCategories } from '../data/products';
import { Location, locations as fallbackLocations } from '../data/locations';
import { FAQ, faqs as fallbackFaqs } from '../data/faqs';
import { storeConfig } from '../config/store';

// Cache for sheet data
const dataCache: {
  products?: Product[];
  locations?: Location[];
  categories?: { id: string; name: string; icon: string; image: string }[];
  faqs?: FAQ[];
  lastFetch?: number;
} = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return !!(dataCache.lastFetch && Date.now() - dataCache.lastFetch < CACHE_DURATION);
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProducts() {
      // Use cache if valid
      if (isCacheValid() && dataCache.products) {
        setProducts(dataCache.products);
        setLoading(false);
        return;
      }

      try {
        const sheetProducts = await fetchProducts();
        
        if (sheetProducts.length > 0) {
          const transformed = sheetProducts.map(transformProduct);
          dataCache.products = transformed;
          dataCache.lastFetch = Date.now();
          setProducts(transformed);
        } else {
          // Fallback to static data if sheet is empty or fails
          const { products: staticProducts } = await import('../data/products');
          setProducts(staticProducts);
        }
      } catch (err) {
        console.error('Failed to load products from sheet:', err);
        setError(err instanceof Error ? err : new Error('Failed to load products'));
        // Fallback to static data
        const { products: staticProducts } = await import('../data/products');
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>(fallbackLocations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadLocations() {
      if (isCacheValid() && dataCache.locations) {
        setLocations(dataCache.locations);
        setLoading(false);
        return;
      }

      try {
        const sheetLocations = await fetchLocations();
        
        if (sheetLocations.length > 0) {
          const transformed = sheetLocations.map(transformLocation);
          dataCache.locations = transformed;
          setLocations(transformed);
        }
      } catch (err) {
        console.error('Failed to load locations from sheet:', err);
        setError(err instanceof Error ? err : new Error('Failed to load locations'));
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  return { locations, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCategories() {
      if (isCacheValid() && dataCache.categories) {
        setCategories(dataCache.categories);
        setLoading(false);
        return;
      }

      try {
        const sheetCategories = await fetchCategories();
        
        if (sheetCategories.length > 0) {
          const transformed = sheetCategories.map(transformCategory);
          dataCache.categories = transformed;
          setCategories(transformed);
        }
      } catch (err) {
        console.error('Failed to load categories from sheet:', err);
        setError(err instanceof Error ? err : new Error('Failed to load categories'));
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      if (isCacheValid() && dataCache.faqs) {
        setFaqs(dataCache.faqs);
        setLoading(false);
        return;
      }

      try {
        const sheetFaqs = await fetchFaqs();
        
        if (sheetFaqs.length > 0) {
          const transformed = sheetFaqs.map(transformFaq);
          dataCache.faqs = transformed;
          setFaqs(transformed);
        }
      } catch (err) {
        console.error('Failed to load FAQs from sheet:', err);
        setError(err instanceof Error ? err : new Error('Failed to load FAQs'));
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  return { faqs, loading, error };
}

// Hook to get store config
export function useStoreConfig() {
  return storeConfig;
}

// Preload all data
export async function preloadAllData() {
  await Promise.all([
    fetchProducts(),
    fetchLocations(),
    fetchCategories(),
    fetchFaqs(),
  ]);
}

