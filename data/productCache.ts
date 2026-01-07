import { Product, categories } from './products';
import { evictStaleImages } from './imageCache';

// Cache configuration
const CACHE_KEY = 'product_inventory_cache';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 24;

interface CachedData {
  products: Product[];
  timestamp: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// Category image mappings for dynamic products
const categoryImages: Record<string, string> = {
  wine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
  whiskey: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&q=80',
  vodka: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=400&q=80',
  tequila: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=400&q=80',
  beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80',
  sake: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80',
  pharmacy: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80',
  dairy: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80',
};

// Default image for unknown categories
const defaultImage = 'https://images.unsplash.com/photo-1690248387895-2db2a8072ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1b3IlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzUzODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080';

/**
 * Parse CSV content into product array
 */
function parseCSV(csvContent: string): Product[] {
  const lines = csvContent.trim().split('\n');
  const products: Product[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Handle CSV with quotes (for fields containing commas)
    const matches = line.match(/("([^"]*)"|[^,]+)/g);
    if (!matches || matches.length < 4) continue;
    
    const name = matches[0].replace(/^"|"$/g, '').trim();
    const code = matches[1].replace(/^"|"$/g, '').trim();
    // Ignore price from CSV - prices should be set separately
    const category = matches[3].replace(/^"|"$/g, '').trim().toLowerCase();
    
    if (!name || !code || !category) continue;
    
    // Extract brand from product name (first word or first two words before common patterns)
    const brand = extractBrand(name);
    
    // Generate subcategory based on name analysis
    const subcategory = generateSubcategory(name, category);
    
    // Extract size from product name if present
    const size = extractSize(name);
    
    products.push({
      id: `${category}-${code}`,
      code: code, // Store barcode for image lookups
      name: name,
      category: category,
      subcategory: subcategory,
      price: 0, // Price ignored from CSV - to be set separately
      size: size,
      image: categoryImages[category] || defaultImage,
      description: `${name} - Available in store.`,
      brand: brand,
      locations: ['main-store'],
      isTouristFavorite: false,
    });
  }
  
  return products;
}

/**
 * Extract brand name from product name
 */
function extractBrand(name: string): string {
  // Common patterns: "Brand Name Product Type"
  const words = name.split(/[\s-]+/);
  
  // For known brand patterns, extract appropriately
  if (words.length >= 2) {
    // Check if first word is a common product descriptor
    const descriptors = ['nv', 'the', 'a', 'an'];
    if (descriptors.includes(words[0].toLowerCase())) {
      return words.slice(1, 3).join(' ');
    }
    return words.slice(0, 2).join(' ');
  }
  
  return words[0] || 'Unknown';
}

/**
 * Generate subcategory based on product name and category
 */
function generateSubcategory(name: string, category: string): string {
  const nameLower = name.toLowerCase();
  
  if (category === 'wine') {
    if (nameLower.includes('cabernet') || nameLower.includes('sauvignon')) return 'Red Wine';
    if (nameLower.includes('pinot noir') || nameLower.includes('merlot')) return 'Red Wine';
    if (nameLower.includes('zinfandel') || nameLower.includes('malbec')) return 'Red Wine';
    if (nameLower.includes('syrah') || nameLower.includes('shiraz')) return 'Red Wine';
    if (nameLower.includes('chianti') || nameLower.includes('red')) return 'Red Wine';
    if (nameLower.includes('chardonnay') || nameLower.includes('pinot grigio')) return 'White Wine';
    if (nameLower.includes('sauvignon blanc') || nameLower.includes('riesling')) return 'White Wine';
    if (nameLower.includes('pinot gris') || nameLower.includes('white')) return 'White Wine';
    if (nameLower.includes('rosé') || nameLower.includes('rose')) return 'Rosé';
    if (nameLower.includes('sparkling') || nameLower.includes('champagne')) return 'Sparkling';
    if (nameLower.includes('port') || nameLower.includes('sherry')) return 'Fortified Wine';
    return 'Table Wine';
  }
  
  if (category === 'whiskey') {
    if (nameLower.includes('bourbon')) return 'Bourbon';
    if (nameLower.includes('scotch') || nameLower.includes('islay')) return 'Scotch';
    if (nameLower.includes('japanese') || nameLower.includes('yamazaki')) return 'Japanese Whiskey';
    if (nameLower.includes('irish')) return 'Irish Whiskey';
    if (nameLower.includes('rye')) return 'Rye Whiskey';
    if (nameLower.includes('fernet') || nameLower.includes('branca')) return 'Amaro';
    return 'Blended Whiskey';
  }
  
  if (category === 'vodka') {
    if (nameLower.includes('gin')) return 'Gin';
    if (nameLower.includes('premium') || nameLower.includes('grey goose')) return 'Premium Vodka';
    if (nameLower.includes('craft') || nameLower.includes('handmade')) return 'Craft Vodka';
    if (nameLower.includes('flavored')) return 'Flavored Vodka';
    return 'Standard Vodka';
  }
  
  if (category === 'tequila') {
    if (nameLower.includes('anejo') || nameLower.includes('añejo')) return 'Añejo';
    if (nameLower.includes('reposado')) return 'Reposado';
    if (nameLower.includes('blanco') || nameLower.includes('silver')) return 'Blanco';
    if (nameLower.includes('mezcal')) return 'Mezcal';
    return 'Tequila';
  }
  
  if (category === 'beer') {
    if (nameLower.includes('ipa')) return 'IPA';
    if (nameLower.includes('lager')) return 'Lager';
    if (nameLower.includes('stout') || nameLower.includes('porter')) return 'Stout';
    if (nameLower.includes('craft') || nameLower.includes('local')) return 'Craft Beer';
    return 'Beer';
  }
  
  if (category === 'sake') {
    if (nameLower.includes('daiginjo')) return 'Daiginjo';
    if (nameLower.includes('ginjo')) return 'Ginjo';
    if (nameLower.includes('junmai')) return 'Junmai';
    if (nameLower.includes('nigori')) return 'Nigori';
    return 'Sake';
  }
  
  // Default subcategory is the category name
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Extract size from product name
 */
function extractSize(name: string): string {
  // Look for common size patterns
  const sizePatterns = [
    /(\d+(?:\.\d+)?\s*(?:ml|ML|mL))/i,
    /(\d+(?:\.\d+)?\s*(?:fl\s*oz|oz))/i,
    /(\d+(?:\.\d+)?\s*(?:l|L|liter|litre))/i,
    /(\d+-pack|\d+\s*pack)/i,
  ];
  
  for (const pattern of sizePatterns) {
    const match = name.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return '750ml'; // Default size
}

/**
 * Check if cache is valid (not expired)
 */
function isCacheValid(): boolean {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;
    
    const data: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    return (now - data.timestamp) < CACHE_EXPIRY_MS;
  } catch {
    return false;
  }
}

/**
 * Get cached products
 */
function getCachedProducts(): Product[] | null {
  try {
    if (!isCacheValid()) return null;
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: CachedData = JSON.parse(cached);
    return data.products;
  } catch {
    return null;
  }
}

/**
 * Save products to cache
 */
function setCachedProducts(products: Product[]): void {
  try {
    const data: CachedData = {
      products,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache products:', error);
  }
}

/**
 * Clear the product cache
 */
export function clearProductCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Get cache info (for debugging)
 */
export function getCacheInfo(): { isValid: boolean; timestamp: number | null; productCount: number } {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return { isValid: false, timestamp: null, productCount: 0 };
    }
    
    const data: CachedData = JSON.parse(cached);
    return {
      isValid: isCacheValid(),
      timestamp: data.timestamp,
      productCount: data.products.length,
    };
  } catch {
    return { isValid: false, timestamp: null, productCount: 0 };
  }
}

// CSV content will be loaded from the file
// For client-side, we embed the CSV or fetch it
let csvContentPromise: Promise<string> | null = null;

// CSV paths to try (in order) - Vite serves public files at root
const CSV_PATHS = [
  '/Home Service Market - Categorized.csv',
  '/inventory.csv',
];

/**
 * Load CSV content (fetch from file or use embedded data)
 */
async function loadCSVContent(): Promise<string> {
  if (csvContentPromise) return csvContentPromise;
  
  csvContentPromise = (async () => {
    // Try each path in order
    for (const path of CSV_PATHS) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const text = await response.text();
          if (text.includes('Name of Product') || text.includes('Category')) {
            console.log('Loaded CSV from:', path);
            return text;
          }
        }
      } catch {
        // Try next path
      }
    }
    
    // Fallback: return empty CSV if all fetches fail
    console.warn('Could not fetch CSV file from any path, using empty inventory');
    return 'Name of Product,Code,Price in Store,Category\n';
  })();
  
  return csvContentPromise;
}

/**
 * Load and cache products from CSV
 */
export async function loadProducts(): Promise<Product[]> {
  // Check cache first
  const cached = getCachedProducts();
  if (cached && cached.length > 0) {
    console.log('Using cached products:', cached.length, 'items');
    return cached;
  }
  
  // Load from CSV
  console.log('Loading products from CSV...');
  const csvContent = await loadCSVContent();
  const products = parseCSV(csvContent);
  
  // Cache the results
  if (products.length > 0) {
    setCachedProducts(products);
    console.log('Cached', products.length, 'products');
    
    // Evict stale images for products no longer in inventory
    const currentProductCodes = new Set(
      products.map(p => p.code).filter((c): c is string => !!c)
    );
    evictStaleImages(currentProductCodes);
  }
  
  return products;
}

/**
 * Paginate an array of items
 */
function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const validPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    items: items.slice(startIndex, endIndex),
    total,
    page: validPage,
    pageSize,
    totalPages,
    hasMore: validPage < totalPages,
  };
}

/**
 * Get products by category (paginated)
 */
export async function getProductsByCategory(
  categoryId: string,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<Product>> {
  const products = await loadProducts();
  const filtered = products.filter(p => p.category === categoryId);
  return paginate(filtered, page, pageSize);
}

/**
 * Get all products by category (non-paginated, for backward compat)
 */
export async function getAllProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(p => p.category === categoryId);
}

/**
 * Search products by query (paginated)
 */
export async function searchProducts(
  query: string,
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<PaginatedResult<Product>> {
  const products = await loadProducts();
  
  let filtered = products;
  
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    filtered = products.filter(product => {
      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.subcategory,
        product.description,
      ].join(' ').toLowerCase();
      
      // Match if all search terms are found
      return searchTerms.every(term => searchableText.includes(term));
    });
  }
  
  return paginate(filtered, page, pageSize);
}

/**
 * Search all products (non-paginated, for backward compat)
 */
export async function searchAllProducts(query: string): Promise<Product[]> {
  const products = await loadProducts();
  
  if (!query.trim()) {
    return products;
  }
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      product.description,
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
}

/**
 * Get all unique categories from products
 */
export async function getCategories(): Promise<typeof categories> {
  const products = await loadProducts();
  const productCategories = new Set(products.map(p => p.category));
  
  // Return categories that have products, plus existing categories
  return categories.filter(cat => 
    productCategories.has(cat.id) || cat.id === 'pharmacy' || cat.id === 'dairy'
  );
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const products = await loadProducts();
  return products.find(p => p.id === productId) || null;
}

/**
 * Get featured/tourist favorite products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const products = await loadProducts();
  
  // Select diverse products from different categories
  const categoryProducts = new Map<string, Product[]>();
  
  products.forEach(p => {
    if (!categoryProducts.has(p.category)) {
      categoryProducts.set(p.category, []);
    }
    categoryProducts.get(p.category)!.push(p);
  });
  
  const featured: Product[] = [];
  const categoriesArray = Array.from(categoryProducts.keys());
  let categoryIndex = 0;
  
  while (featured.length < limit && categoryProducts.size > 0) {
    const category = categoriesArray[categoryIndex % categoriesArray.length];
    const catProducts = categoryProducts.get(category);
    
    if (catProducts && catProducts.length > 0) {
      // Pick a random product from this category
      const randomIndex = Math.floor(Math.random() * catProducts.length);
      const product = { ...catProducts[randomIndex], isTouristFavorite: true };
      featured.push(product);
      catProducts.splice(randomIndex, 1);
      
      if (catProducts.length === 0) {
        categoryProducts.delete(category);
      }
    }
    
    categoryIndex++;
  }
  
  return featured;
}

