import { getProductImageUrl, getCategoryFallbackImage } from '../../data/imageCache';

/**
 * Returns the blob image URL if configured, otherwise the category fallback.
 * Components should use onError on the <img> to fall back to the category image.
 */
export function useProductImage(productCode: string | undefined, category: string): {
  src: string;
  fallback: string;
} {
  const fallback = getCategoryFallbackImage(category);
  const blobUrl = productCode ? getProductImageUrl(productCode) : null;

  return {
    src: blobUrl || fallback,
    fallback,
  };
}
