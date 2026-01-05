import { useState } from 'react';
import { Filter } from 'lucide-react';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface CategoryPageProps {
  categoryId: string;
}

export function CategoryPage({ categoryId }: CategoryPageProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const category = categories.find(cat => cat.id === categoryId);
  const categoryProducts = products.filter(p => p.category === categoryId);
  
  // Get unique subcategories
  const subcategories = Array.from(
    new Set(categoryProducts.map(p => p.subcategory))
  );

  // Filter products
  let filteredProducts = categoryProducts;
  
  if (selectedSubcategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.subcategory === selectedSubcategory);
  }

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
                      Clear all
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                <div className="mb-6">
                  <h3 className="text-sm mb-3">Type</h3>
                  <div className="space-y-2">
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

                {/* Location Info */}
                <div className="pt-6 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">
                    All products shown are available in-store. Call ahead to confirm specific items.
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-neutral-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
