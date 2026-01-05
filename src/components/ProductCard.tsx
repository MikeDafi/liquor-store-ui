import { MapPin } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={`/product/${product.id}`}
      className="group block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <div className="text-sm text-neutral-600 mb-1">{product.brand}</div>
        <h3 className="mb-2 group-hover:text-neutral-600 transition-colors">{product.name}</h3>
        
        <div className="mb-3">
          <span className="text-sm text-neutral-600">{product.size}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-neutral-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-green-700">Available in store</div>
          </div>
        </div>
      </div>
    </a>
  );
}
