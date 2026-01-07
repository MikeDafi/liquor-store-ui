import { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useProduct, useCategoryProducts } from '../hooks/useProductCache';
import { getProductImage } from '../data/imageCache';

interface ProductPageProps {
  productId: string;
}

export function ProductPage({ productId }: ProductPageProps) {
  const { product, loading: productLoading } = useProduct(productId);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Load related products from the same category
  const { products: categoryProducts, loading: categoryLoading } = useCategoryProducts(
    product?.category || ''
  );

  // Update image when product loads
  useEffect(() => {
    if (product) {
      if (product.code) {
        const initialUrl = getProductImage(product.code, product.category, (newUrl) => {
          setImageUrl(newUrl);
        });
        setImageUrl(initialUrl);
      } else {
        setImageUrl(product.image);
      }
    }
  }, [product]);

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1>Product not found</h1>
      </div>
    );
  }

  const relatedProducts = categoryProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <a
            href={`/category/${product.category}`}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </a>
        </div>
      </div>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-neutral-50 rounded-lg overflow-hidden flex items-center justify-center p-8">
            <img
              src={imageUrl || product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              onError={() => setImageUrl(product.image)}
            />
          </div>

          {/* Info */}
          <div>
            <div className="text-sm text-neutral-600 mb-2">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-lg text-neutral-600">{product.size}</span>
            </div>

            <div className="prose prose-neutral mb-8">
              <p>{product.description}</p>
            </div>

            {/* Availability */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-lg mb-4">Available In-Store</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-700" />
                <div className="text-green-700">
                  This product is available in store
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="mb-3">How to Purchase</h3>
              <ol className="space-y-2 text-sm text-neutral-700">
                <li>1. Visit the store during business hours</li>
                <li>2. Present valid ID (21+ required for alcohol)</li>
                <li>3. Complete your purchase in-store</li>
              </ol>
              <div className="mt-4 text-sm text-neutral-600">
                Delivery service coming soon to your area
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h3 className="mb-4">Product Details</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-neutral-600 mb-1">Brand</dt>
                  <dd>{product.brand}</dd>
                </div>
                <div>
                  <dt className="text-neutral-600 mb-1">Size</dt>
                  <dd>{product.size}</dd>
                </div>
                <div>
                  <dt className="text-neutral-600 mb-1">Category</dt>
                  <dd className="capitalize">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-neutral-600 mb-1">Type</dt>
                  <dd>{product.subcategory}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {!categoryLoading && relatedProducts.length > 0 && (
        <section className="bg-neutral-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
