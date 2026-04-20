import { MapPin } from 'lucide-react';
import { Product } from '../data/products';
import { getProductImageUrl, getCategoryFallbackImage } from '../data/imageCache';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = (product.code ? getProductImageUrl(product.code) : null) || product.image;
  const fallback = getCategoryFallbackImage(product.category);

  return (
    <a
      href={`/product/${product.id}`}
      className="group block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-neutral-50 overflow-hidden relative flex items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
        />
      </div>
      
      <div className="p-4">
        <div className="text-sm text-neutral-600 mb-1 truncate">{product.brand}</div>
        <h3 className="mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        
        <div className="flex items-baseline justify-between mb-3">
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
