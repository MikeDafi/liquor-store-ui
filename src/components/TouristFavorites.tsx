import { ProductCard } from './ProductCard';
import { products } from '../data/products';

export function TouristFavorites() {
  const touristProducts = products.filter(p => p.isTouristFavorite);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-neutral-50">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl mb-2">Tourist Favorites</h2>
        <p className="text-neutral-600">
          Top picks for visitors exploring San Francisco
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {touristProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

