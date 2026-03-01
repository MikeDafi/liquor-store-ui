import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list, put, head } from '@vercel/blob';

// API endpoints
const UPC_ITEM_DB_API = 'https://api.upcitemdb.com/prod/trial/lookup';
const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

// Blob storage path prefix
const BLOB_PREFIX = 'product-images/';

// Category fallback images
const CATEGORY_FALLBACKS: Record<string, string> = {
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  whiskey: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
  vodka: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400&q=80',
  tequila: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=400&q=80',
  beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
  sake: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
  pharmacy: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
  dairy: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80',
  food: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center',
};

interface CachedImage {
  url: string;
  source: 'upcitemdb' | 'openfoodfacts' | 'fallback';
  fetchedAt: number;
}

/**
 * Try to fetch image from UPC Item DB
 */
async function tryUPCItemDB(upc: string): Promise<string | null> {
  try {
    const response = await fetch(`${UPC_ITEM_DB_API}?upc=${upc}`);
    
    // Check for rate limiting
    const remaining = response.headers.get('X-RateLimit-Remaining');
    if (remaining && parseInt(remaining) <= 0) {
      console.log('UPC Item DB rate limit reached');
      return null;
    }
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.items?.[0]?.images?.[0]) {
      return data.items[0].images[0];
    }
    
    return null;
  } catch (error) {
    console.error('UPC Item DB error:', error);
    return null;
  }
}

/**
 * Try to fetch image from Open Food Facts
 */
async function tryOpenFoodFacts(upc: string): Promise<string | null> {
  try {
    const response = await fetch(`${OPEN_FOOD_FACTS_API}/${upc}.json`);
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
  } catch (error) {
    console.error('Open Food Facts error:', error);
    return null;
  }
}

/**
 * Check Vercel Blob for cached image data
 */
async function getBlobCache(upc: string): Promise<CachedImage | null> {
  try {
    const blobPath = `${BLOB_PREFIX}${upc}.json`;
    // List blobs with the specific prefix to find our file
    const { blobs } = await list({ prefix: blobPath, limit: 1 });
    
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.error('Blob cache get error:', error);
  }
  return null;
}

/**
 * Save image data to Vercel Blob
 */
async function setBlobCache(upc: string, data: CachedImage): Promise<void> {
  try {
    const blobPath = `${BLOB_PREFIX}${upc}.json`;
    await put(blobPath, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error('Blob set error:', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
  
  const upc = req.query.upc as string;
  const category = (req.query.category as string) || 'default';
  
  if (!upc) {
    return res.status(400).json({ error: 'Missing upc parameter' });
  }
  
  // Clean the UPC (remove non-digits)
  const cleanUpc = upc.replace(/\D/g, '');
  if (cleanUpc.length < 8) {
    return res.status(400).json({ error: 'Invalid UPC format' });
  }
  
  // Check if Blob storage is configured
  const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;
  
  // 1. Check Vercel Blob cache first
  if (blobConfigured) {
    const cached = await getBlobCache(cleanUpc);
    if (cached) {
      return res.status(200).json({
        url: cached.url,
        source: cached.source,
        cached: true,
      });
    }
  }
  
  // 2. Try UPC Item DB first (better images)
  let imageUrl = await tryUPCItemDB(cleanUpc);
  let source: 'upcitemdb' | 'openfoodfacts' | 'fallback' = 'upcitemdb';
  
  // Cache UPC Item DB results to Blob storage (high quality, worth persisting)
  if (imageUrl && blobConfigured) {
    const cacheData: CachedImage = {
      url: imageUrl,
      source: 'upcitemdb',
      fetchedAt: Date.now(),
    };
    await setBlobCache(cleanUpc, cacheData);
  }
  
  // 3. Fall back to Open Food Facts (don't cache - lower quality/user-submitted)
  if (!imageUrl) {
    imageUrl = await tryOpenFoodFacts(cleanUpc);
    source = 'openfoodfacts';
  }
  
  // 4. Use category fallback if nothing found
  if (!imageUrl) {
    imageUrl = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.default;
    source = 'fallback';
  }
  
  return res.status(200).json({
    url: imageUrl,
    source,
    cached: false,
  });
}
