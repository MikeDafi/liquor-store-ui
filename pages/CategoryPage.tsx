import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Filter, Loader2, ChevronDown } from 'lucide-react';
import { categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useCategoryProducts, useAllCategoryProducts } from '../hooks/useProductCache';

interface CategoryPageProps {
  categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use paginated products for display
  const { 
    products: paginatedProducts, 
    loading, 
    error, 
    pagination, 
    loadMore 
  } = useCategoryProducts(categoryId);

  // Use all products just for filter options (subcategories)
  const { products: allCategoryProducts } = useAllCategoryProducts(categoryId);

  const category = categories.find(cat => cat.id === categoryId);
  
  // Get unique subcategories from ALL products (not just current page)
  const subcategories = useMemo(() => {
    return Array.from(new Set(allCategoryProducts.map(p => p.subcategory))).sort();
  }, [allCategoryProducts]);

  // Filter the paginated products based on user selections
  const filteredProducts = useMemo(() => {
    let filtered = paginatedProducts;
    
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }

    return filtered;
  }, [paginatedProducts, selectedSubcategory]);

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

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1>Category not found</h1>
      </div>
    );
  }

  const getCategoryDescription = () => {
    const descriptions: Record<string, string> = {
      whiskey: 'Explore our curated selection of whiskey including Japanese whiskey, bourbon, scotch, and Irish whiskey. From everyday favorites to rare collectibles.',
      vodka: 'Premium and craft vodkas from around the world. Perfect for cocktails or enjoying neat.',
      wine: 'Featuring local California wines from Napa and Sonoma, plus international selections. Red, white, rosé, and sparkling.',
      tequila: 'Quality tequila and mezcal for margaritas and sipping. Blanco, reposado, and añejo.',
      beer: 'Local San Francisco craft beers, imports, and classic favorites. Available in singles, six-packs, and cases.',
      sake: 'Premium Japanese sake including Junmai, Daiginjo, and Nigori styles.',
      pharmacy: 'Essential pharmacy items, over-the-counter medications, and health supplies.',
      dairy: 'Fresh dairy products, frozen foods, and grocery essentials for your convenience.'
    };
    return descriptions[categoryId] || 'Browse our selection.';
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-3xl md:text-5xl">{category.name}</h1>
          </div>
          <p className="text-lg text-neutral-300 max-w-3xl">
            {getCategoryDescription()}
          </p>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        {subcategories.length > 1 && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg w-full justify-center"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          {subcategories.length > 1 && (
            <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white border border-neutral-200 rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg">Filters</h2>
                  {selectedSubcategory !== 'all' && (
                    <button
                      onClick={() => setSelectedSubcategory('all')}
                      className="text-sm text-neutral-600 hover:text-neutral-900"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                <div className="mb-6">
                  <h3 className="text-sm mb-3">Type</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubcategory === 'all'}
                        onChange={() => setSelectedSubcategory('all')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">All Types</span>
                    </label>
                    {subcategories.map(subcat => (
                      <label key={subcat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={selectedSubcategory === subcat}
                          onChange={() => setSelectedSubcategory(subcat)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{subcat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="pt-6 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">
                    All products shown are available in-store.
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-neutral-600">
                {error ? (
                  <span className="text-red-600">Error loading products</span>
                ) : (
                  <>
                    Showing {filteredProducts.length} of {pagination.total} products
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More / Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {loading && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading more products...
                </div>
              )}
              
              {!loading && pagination.hasMore && (
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                  Load More ({pagination.total - paginatedProducts.length} remaining)
                </button>
              )}
              
              {!loading && !pagination.hasMore && paginatedProducts.length > 0 && (
                <div className="text-neutral-500 text-sm">
                  All {pagination.total} products loaded
                </div>
              )}
            </div>

            {!loading && filteredProducts.length === 0 && paginatedProducts.length > 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-600 mb-4">No products found matching your filters.</p>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className="px-6 py-3 border border-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && paginatedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-600">No products in this category yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
