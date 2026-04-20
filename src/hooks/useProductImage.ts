import { useState, useEffect } from 'react';
import { getProductImage, getCategoryFallbackImage } from '../../data/imageCache';

/**
 * Hook that returns a product image URL.
 * Returns the category fallback immediately, then upgrades to the real
 * UPC-looked-up image once the API responds (if one exists).
 */
export function useProductImage(productCode: string | undefined, category: string): string {
  const fallback = getCategoryFallbackImage(category);
  const [imageUrl, setImageUrl] = useState<string>(() => {
    if (!productCode) return fallback;
    return getProductImage(productCode, category);
  });

  useEffect(() => {
    if (!productCode) {
      setImageUrl(fallback);
      return;
    }

    // getProductImage returns cached/fallback synchronously and fires
    // the callback when a real image is fetched from the API
    const initial = getProductImage(productCode, category, (realUrl) => {
      setImageUrl(realUrl);
    });
    setImageUrl(initial);
  }, [productCode, category, fallback]);

  return imageUrl;
}
