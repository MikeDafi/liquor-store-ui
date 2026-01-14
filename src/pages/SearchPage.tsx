import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface SearchPageProps {
  initialQuery?: string;
}

export function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState(products);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
      setResults(filtered);
    }
  }, [searchQuery]);

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
        </div>
      </div>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <div className="text-neutral-600">
            {searchQuery ? (
              <>
                Found {results.length} product{results.length !== 1 ? 's' : ''} for "{searchQuery}"
              </>
            ) : (
              <>Showing all {results.length} products</>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
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


