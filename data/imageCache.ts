/**
 * Image Cache with Open Food Facts API
 * - Stores image URLs in localStorage permanently (no expiry)
 * - Only evicts images when product is removed from inventory
 * - Free: localStorage + Open Food Facts API
 */

const IMAGE_CACHE_KEY = 'product_image_cache';
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

interface ImageCacheEntry {
  imageUrl: string | null;
  found: boolean;
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
 * Query Open Food Facts API for product image
 */
async function queryOpenFoodFacts(barcode: string): Promise<string | null> {
  try {
    const cleanBarcode = barcode.replace(/\D/g, '');
    if (!cleanBarcode || cleanBarcode.length < 8) {
      return null;
    }

    const response = await fetch(`${OPEN_FOOD_FACTS_API}/${cleanBarcode}.json`);
    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      return (
        data.product.image_front_url ||
        data.product.image_front_small_url ||
        data.product.image_url ||
        data.product.image_small_url ||
        null
      );
    }
    
    return null;
  } catch {
    return null;
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

  // If cached with image, return it
  if (entry?.found && entry.imageUrl) {
    return entry.imageUrl;
  }

  // If already queried and not found, return fallback
  if (entry && !entry.found) {
    return fallback;
  }

  // Not in cache - query API in background
  queryOpenFoodFacts(productCode).then(imageUrl => {
    const newCache = getImageCache();
    newCache[productCode] = {
      imageUrl,
      found: !!imageUrl,
    };
    saveImageCache(newCache);

    if (imageUrl && onImageLoaded) {
      onImageLoaded(imageUrl);
    }
  });

  return fallback;
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
    console.log(`Evicted ${evictedCount} stale product images`);
  }

  return evictedCount;
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
    withImages: entries.filter(e => e.found).length,
    withoutImages: entries.filter(e => !e.found).length,
  };
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  localStorage.removeItem(IMAGE_CACHE_KEY);
}
