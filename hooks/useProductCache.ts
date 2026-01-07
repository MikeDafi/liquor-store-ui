import { useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';
import {
  loadProducts,
  getProductsByCategory,
  getAllProductsByCategory,
  searchProducts,
  searchAllProducts,
  getProductById,
  getFeaturedProducts,
  clearProductCache,
  getCacheInfo,
  PaginatedResult,
  DEFAULT_PAGE_SIZE,
} from '../data/productCache';

interface UsePaginatedProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  loadMore: () => void;
  loadPage: (page: number) => void;
  refresh: () => void;
  cacheInfo: { isValid: boolean; timestamp: number | null; productCount: number };
}

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for paginated category products
 */
export function useCategoryProducts(
  categoryId: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): UsePaginatedProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [cacheInfo, setCacheInfo] = useState(getCacheInfo());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    clearProductCache();
    setProducts([]);
    setPage(1);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const loadMore = useCallback(() => {
    if (paginationInfo.hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [paginationInfo.hasMore, loading]);

  const loadPage = useCallback((newPage: number) => {
    setProducts([]);
    setPage(newPage);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!categoryId) return;
      
      setLoading(true);
      setError(null);

      try {
        const result = await getProductsByCategory(categoryId, page, pageSize);
        
        if (mounted) {
          // Append products for infinite scroll, replace for page navigation
          setProducts(prev => 
            page === 1 ? result.items : [...prev, ...result.items]
          );
          setPaginationInfo({
            total: result.total,
            totalPages: result.totalPages,
            hasMore: result.hasMore,
          });
          setCacheInfo(getCacheInfo());
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load products'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [categoryId, page, pageSize, refreshTrigger]);

  return {
    products,
    loading,
    error,
    pagination: {
      page,
      pageSize,
      ...paginationInfo,
    },
    loadMore,
    loadPage,
    refresh,
    cacheInfo,
  };
}

/**
 * Hook for paginated search results
 */
export function useSearchProducts(
  query: string,
  pageSize: number = DEFAULT_PAGE_SIZE
): UsePaginatedProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [cacheInfo, setCacheInfo] = useState(getCacheInfo());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    clearProductCache();
    setProducts([]);
    setPage(1);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const loadMore = useCallback(() => {
    if (paginationInfo.hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [paginationInfo.hasMore, loading]);

  const loadPage = useCallback((newPage: number) => {
    setProducts([]);
    setPage(newPage);
  }, []);

  // Reset page when query changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
  }, [query]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const result = await searchProducts(query, page, pageSize);
        
        if (mounted) {
          setProducts(prev => 
            page === 1 ? result.items : [...prev, ...result.items]
          );
          setPaginationInfo({
            total: result.total,
            totalPages: result.totalPages,
            hasMore: result.hasMore,
          });
          setCacheInfo(getCacheInfo());
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to search products'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [query, page, pageSize, refreshTrigger]);

  return {
    products,
    loading,
    error,
    pagination: {
      page,
      pageSize,
      ...paginationInfo,
    },
    loadMore,
    loadPage,
    refresh,
    cacheInfo,
  };
}

/**
 * Hook for single product lookup
 */
export function useProduct(productId: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!productId) return;
      
      setLoading(true);
      setError(null);

      try {
        const result = await getProductById(productId);
        if (mounted) {
          setProduct(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load product'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [productId]);

  return { product, loading, error };
}

/**
 * Hook for featured products (non-paginated, limited set)
 */
export function useFeaturedProducts(limit: number = 8) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const result = await getFeaturedProducts(limit);
        if (mounted) {
          setProducts(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load featured products'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { products, loading, error };
}

/**
 * Hook for all products in a category (non-paginated)
 * Use sparingly - only when you need all products at once (e.g., for filters)
 */
export function useAllCategoryProducts(categoryId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!categoryId) return;
      
      setLoading(true);
      setError(null);

      try {
        const result = await getAllProductsByCategory(categoryId);
        if (mounted) {
          setProducts(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load products'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [categoryId]);

  return { products, loading, error };
}
