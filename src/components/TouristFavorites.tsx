import { ProductCard } from './ProductCard';
import { useProducts } from '../hooks/useSheetData';
import { getCurrentStore } from '../../data/storeConfig';

export function TouristFavorites() {
  const { products, loading } = useProducts();
  const store = getCurrentStore();
  
  // Get tourist favorites by matching UPC codes from store config
  const touristFavoriteUPCs = new Set(store.touristFavorites || []);
  
  // Find products matching the store's tourist favorites UPCs
  let touristProducts = products.filter(p => p.code && touristFavoriteUPCs.has(p.code));
  
  // If no matches found (or not enough), fall back to first 4 products
  if (touristProducts.length < 4) {
    const existingIds = new Set(touristProducts.map(p => p.id));
    const fallbackProducts = products.filter(p => !existingIds.has(p.id)).slice(0, 4 - touristProducts.length);
    touristProducts = [...touristProducts, ...fallbackProducts];
  }

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





