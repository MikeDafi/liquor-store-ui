import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useSheetData';

export function TouristFavorites() {
  const { products, loading } = useProducts();
  
  // Show first 4 products as "favorites" since sheet doesn't have isTouristFavorite column
  const touristProducts = products.slice(0, 4);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12 bg-neutral-50">
        <div className="text-center text-neutral-600">Loading favorites...</div>
      </section>
    );
  }

  if (touristProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-neutral-50">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl mb-2">Popular Products</h2>
        <p className="text-neutral-600">
          Top picks from our selection
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





