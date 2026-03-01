/**
 * Image Cache with Server-Side Caching via /api/product-image
 * 
 * Architecture:
 * 1. Check localStorage for cached URLs (instant)
 * 2. If not cached, call /api/product-image which:
 *    - Checks Upstash Redis cache
 *    - Tries UPC Item DB (rate limited)
 *    - Falls back to Open Food Facts
 *    - Caches result in Redis for future requests
 * 3. Store result in localStorage for instant access
 * 
 * This gives us:
 * - SEO-friendly server-side image URLs
 * - Progressive DB population via user browsing
 * - Graceful fallbacks when APIs are rate limited
 */

const IMAGE_CACHE_KEY = 'product_image_cache_v2';

// Use production API in dev mode since Vercel serverless functions don't run locally
const PRODUCT_IMAGE_API = import.meta.env.DEV 
  ? 'https://liquor-store-ui.vercel.app/api/product-image'
  : '/api/product-image';

interface ImageCacheEntry {
  imageUrl: string;
  source: 'upcitemdb' | 'openfoodfacts' | 'fallback';
  fetchedAt: number;
}

interface ImageCache {
  [productCode: string]: ImageCacheEntry;
}

// Category fallback images (properly framed product shots)
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  whiskey: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
  vodka: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400&q=80',
  tequila: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=400&q=80',
  beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
  sake: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
  pharmacy: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
  dairy: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80',
  food: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center';

/**
 * Get the image cache from localStorage
 */
function getImageCache(): ImageCache {
  try {
    const cached = localStorage.getItem(IMAGE_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch {
    return {};
  }
}

/**
 * Save the image cache to localStorage
 */
function saveImageCache(cache: ImageCache): void {
  try {
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save image cache:', error);
  }
}

/**
 * Get fallback image for a category
 */
export function getCategoryFallbackImage(category: string): string {
  return CATEGORY_FALLBACK_IMAGES[category] || DEFAULT_FALLBACK;
}

/**
 * Query the server-side API for product image
 * The API handles:
 * - Redis caching
 * - UPC Item DB lookup (with rate limit handling)
 * - Open Food Facts fallback
 * - Category fallback images
 */
async function queryProductImageAPI(barcode: string, category: string): Promise<{ imageUrl: string; source: 'upcitemdb' | 'openfoodfacts' | 'fallback' }> {
  try {
    const cleanBarcode = barcode.replace(/\D/g, '');
    if (!cleanBarcode || cleanBarcode.length < 8) {
      return { imageUrl: getCategoryFallbackImage(category), source: 'fallback' };
    }

    const response = await fetch(`${PRODUCT_IMAGE_API}?upc=${cleanBarcode}&category=${encodeURIComponent(category)}`);
    
    if (!response.ok) {
      console.warn('Product image API error:', response.status);
      return { imageUrl: getCategoryFallbackImage(category), source: 'fallback' };
    }

    const data = await response.json();
    return {
      imageUrl: data.url || getCategoryFallbackImage(category),
      source: data.source || 'fallback',
    };
  } catch (error) {
    console.warn('Product image API fetch failed:', error);
    return { imageUrl: getCategoryFallbackImage(category), source: 'fallback' };
  }
}

/**
 * Get image URL for a product
 * Returns fallback immediately, fetches from API in background if needed
 */
export function getProductImage(
  productCode: string,
  category: string,
  onImageLoaded?: (imageUrl: string) => void
): string {
  const fallback = getCategoryFallbackImage(category);
  const cache = getImageCache();
  const entry = cache[productCode];

  // If cached locally, return it (even fallbacks are cached to avoid re-fetching)
  if (entry?.imageUrl) {
    // Check if cache is less than 7 days old
    const cacheAge = Date.now() - (entry.fetchedAt || 0);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (cacheAge < maxAge) {
      return entry.imageUrl;
    }
  }

  // Not in cache or cache expired - query API in background
  queryProductImageAPI(productCode, category).then(result => {
    const newCache = getImageCache();
    newCache[productCode] = {
      imageUrl: result.imageUrl,
      source: result.source,
      fetchedAt: Date.now(),
    };
    saveImageCache(newCache);

    // Only call callback if we got a real image (not fallback)
    if (result.source !== 'fallback' && onImageLoaded) {
      onImageLoaded(result.imageUrl);
    }
  });

  return fallback;
}

/**
 * Fetch image for a single product (for testing)
 */
export async function fetchProductImage(barcode: string, category: string = 'default'): Promise<{ imageUrl: string; source: string }> {
  return queryProductImageAPI(barcode, category);
}

/**
 * Evict images for products no longer in inventory
 */
export function evictStaleImages(currentProductCodes: Set<string>): number {
  const cache = getImageCache();
  const cacheKeys = Object.keys(cache);
  let evictedCount = 0;

  const newCache: ImageCache = {};
  
  for (const code of cacheKeys) {
    if (currentProductCodes.has(code)) {
      newCache[code] = cache[code];
    } else {
      evictedCount++;
    }
  }

  if (evictedCount > 0) {
    saveImageCache(newCache);
    console.log(`Evicted ${evictedCount} stale product images from local cache`);
  }

  return evictedCount;
}

/**
 * Prefetch images for a batch of products (call this on page load)
 * Fetches images in small batches to avoid overwhelming the API
 */
export async function prefetchProductImages(
  products: Array<{ code: string; category: string }>,
  batchSize: number = 5,
  delayMs: number = 500
): Promise<void> {
  const cache = getImageCache();
  const uncached = products.filter(p => p.code && !cache[p.code]);
  
  if (uncached.length === 0) return;
  
  console.log(`Prefetching images for ${uncached.length} products...`);
  
  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async ({ code, category }) => {
        const result = await queryProductImageAPI(code, category);
        const newCache = getImageCache();
        newCache[code] = {
          imageUrl: result.imageUrl,
          source: result.source,
          fetchedAt: Date.now(),
        };
        saveImageCache(newCache);
      })
    );
    
    // Small delay between batches to be nice to the API
    if (i + batchSize < uncached.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  console.log('Image prefetch complete');
}

/**
 * Get cache statistics
 */
export function getImageCacheStats(): {
  totalEntries: number;
  withImages: number;
  withoutImages: number;
} {
  const cache = getImageCache();
  const entries = Object.values(cache);
  
  return {
    totalEntries: entries.length,
    withImages: entries.filter(e => e.source !== 'fallback').length,
    withoutImages: entries.filter(e => e.source === 'fallback').length,
  };
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  localStorage.removeItem(IMAGE_CACHE_KEY);
}
