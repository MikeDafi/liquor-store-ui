/**
 * Image Cache — Vercel Blob with predictable URLs
 *
 * Images are stored at: {BLOB_BASE}/product-images/{upc}.webp
 * The app constructs the URL directly from the UPC code.
 * If the image doesn't exist, the <img> onerror falls back to a category image.
 */

// Category fallback images
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
  drinks: 'https://images.unsplash.com/photo-1558645836-e44122a743ee?w=400&q=80',
  tobacco: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center';

// Vercel Blob base URL
const BLOB_BASE = 'https://j9aoxfppfmk8c42g.public.blob.vercel-storage.com';

/**
 * Get the blob URL for a product image
 */
export function getProductImageUrl(productCode: string): string | null {
  if (!BLOB_BASE || !productCode) return null;
  return `${BLOB_BASE}/product-images/${productCode}.webp`;
}

/**
 * Get fallback image for a category
 */
export function getCategoryFallbackImage(category: string): string {
  return CATEGORY_FALLBACK_IMAGES[category.toLowerCase()] || DEFAULT_FALLBACK;
}

/**
 * Evict images for products no longer in inventory
 */
export function evictStaleImages(_currentProductCodes: Set<string>): number {
  // No-op — blob images are permanent, no local cache to evict
  return 0;
}
