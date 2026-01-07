import { ProductCard } from './ProductCard';
import { useFeaturedProducts } from '../hooks/useProductCache';
import { Loader2 } from 'lucide-react';

export function TouristFavorites() {
  const { products: touristProducts, loading, error } = useFeaturedProducts(8);

  if (error) {
    return null; // Silently fail if products can't be loaded
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-neutral-50">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl mb-2">Tourist Favorites</h2>
        <p className="text-neutral-600">
          Top picks for visitors exploring San Francisco
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        </div>
      ) : touristProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {touristProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500">
          Check back soon for our featured products
        </div>
      )}
    </section>
  );
}
