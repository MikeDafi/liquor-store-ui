import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, ChevronDown, Filter } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useSearchProducts } from '../hooks/useProductCache';
import { categories } from '../data/products';

interface SearchPageProps {
  initialQuery?: string;
}

export function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
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
    products: allResults, 
    loading, 
    error, 
    pagination, 
    loadMore,
    cacheInfo 
  } = useSearchProducts(debouncedQuery);

  // Filter by category
  const results = selectedCategory 
    ? allResults.filter(p => p.category === selectedCategory)
    : allResults;

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

  // Get unique categories from results for filtering
  const availableCategories = [...new Set(allResults.map(p => p.category))];

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

      {/* Category Filters */}
      <div className="bg-white border-b border-neutral-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors lg:hidden"
            >
              <Filter className="w-4 h-4" />
              Filters
              {selectedCategory && <span className="bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full">1</span>}
            </button>

            {/* Desktop category pills */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              <span className="text-sm text-neutral-600 mr-2">Category:</span>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-neutral-900 text-white' 
                    : 'bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.id 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filters dropdown */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-neutral-50 rounded-lg">
              <div className="mb-3 text-sm font-medium">Category</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory(''); setShowFilters(false); }}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-white border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setShowFilters(false); }}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedCategory === cat.id 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
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
              <>
                Found {results.length} product{results.length !== 1 ? 's' : ''} 
                {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
                {' '}for "{debouncedQuery}"
              </>
            ) : selectedCategory ? (
              <>Showing {results.length} products in {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}</>
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
              
              {!loading && pagination.hasMore && !selectedCategory && (
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                  Load More ({pagination.total - allResults.length} remaining)
                </button>
              )}
              
              {!loading && !pagination.hasMore && results.length > 0 && pagination.total > pagination.pageSize && !selectedCategory && (
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
              {selectedCategory 
                ? `No products in ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}. Try a different category.`
                : 'Try adjusting your search or browse our categories'
              }
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="inline-block px-6 py-3 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors mr-4"
              >
                Clear Filter
              </button>
            )}
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
