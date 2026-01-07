import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useSearchProducts } from '../hooks/useProductCache';

interface SearchPageProps {
  initialQuery?: string;
}

export function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Use paginated search
  const { 
    products: results, 
    loading, 
    error, 
    pagination, 
    loadMore,
    cacheInfo 
  } = useSearchProducts(debouncedQuery);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && pagination.hasMore && !loading) {
      loadMore();
    }
  }, [loadMore, pagination.hasMore, loading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div>
      {/* Search Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl mb-6">Search Products</h1>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, category..."
              className="w-full pl-12 pr-12 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            )}
          </div>
          
          {/* Inventory info */}
          {cacheInfo.productCount > 0 && (
            <div className="mt-2 text-xs text-neutral-500">
              Searching {cacheInfo.productCount} products in inventory
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <div className="text-neutral-600">
            {error ? (
              <span className="text-red-600">Error searching products</span>
            ) : debouncedQuery ? (
              <>Found {pagination.total} product{pagination.total !== 1 ? 's' : ''} for "{debouncedQuery}"</>
            ) : (
              <>Showing {results.length} of {pagination.total} products</>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More / Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {loading && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading more results...
                </div>
              )}
              
              {!loading && pagination.hasMore && (
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                  Load More ({pagination.total - results.length} remaining)
                </button>
              )}
              
              {!loading && !pagination.hasMore && results.length > 0 && pagination.total > pagination.pageSize && (
                <div className="text-neutral-500 text-sm">
                  All {pagination.total} results loaded
                </div>
              )}
            </div>
          </>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-100 rounded-lg h-80" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <h2 className="text-xl mb-2">No products found</h2>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search or browse our categories
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Back to Home
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
