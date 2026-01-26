/**
 * SEO Head Component
 * 
 * Dynamically injects Open Graph and Twitter meta tags based on store config.
 * These tags control how the site appears when shared on social media.
 */

import { useEffect } from 'react';
import { storeConfig } from '../config/store';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export function SEOHead({ 
  title,
  description,
  image,
  url,
  type = 'website'
}: SEOHeadProps) {
  const siteTitle = title || `${storeConfig.name} | ${storeConfig.seo.title}`;
  const siteDescription = description || storeConfig.seo.description;
  const siteImage = image || storeConfig.heroImage;
  const siteUrl = url || window.location.href;

  useEffect(() => {
    // Update document title
    document.title = siteTitle;

    // Helper to set or update meta tags
    const setMetaTag = (attribute: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic SEO meta tags
    setMetaTag('name', 'description', siteDescription);
    setMetaTag('name', 'keywords', storeConfig.seo.keywords.join(', '));

    // Open Graph tags (Facebook, LinkedIn, iMessage, Slack, Discord, etc.)
    setMetaTag('property', 'og:title', siteTitle);
    setMetaTag('property', 'og:description', siteDescription);
    setMetaTag('property', 'og:image', siteImage);
    setMetaTag('property', 'og:url', siteUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', storeConfig.name);
    setMetaTag('property', 'og:locale', 'en_US');

    // Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', siteTitle);
    setMetaTag('name', 'twitter:description', siteDescription);
    setMetaTag('name', 'twitter:image', siteImage);

    // Additional SEO tags
    setMetaTag('name', 'robots', 'index, follow');
    setMetaTag('name', 'author', storeConfig.name);

    // Geo tags for local SEO
    setMetaTag('name', 'geo.region', 'US-CA');
    setMetaTag('name', 'geo.placename', 'San Francisco');
    setMetaTag('name', 'geo.position', `${storeConfig.lat};${storeConfig.lng}`);
    setMetaTag('name', 'ICBM', `${storeConfig.lat}, ${storeConfig.lng}`);

  }, [siteTitle, siteDescription, siteImage, siteUrl, type]);

  return null;
}

/**
 * Product-specific SEO for product pages
 */
interface ProductSEOProps {
  productName: string;
  productDescription: string;
  productImage: string;
  productCategory: string;
}

export function ProductSEO({ 
  productName, 
  productDescription, 
  productImage,
  productCategory 
}: ProductSEOProps) {
  const title = `${productName} | ${storeConfig.name}`;
  const description = `${productDescription} Available at ${storeConfig.name} in San Francisco.`;

  return (
    <SEOHead 
      title={title}
      description={description}
      image={productImage}
      type="product"
    />
  );
}

/**
 * Category-specific SEO for category pages
 */
interface CategorySEOProps {
  categoryName: string;
  categoryDescription: string;
}

export function CategorySEO({ categoryName, categoryDescription }: CategorySEOProps) {
  const title = `${categoryName} | ${storeConfig.name}`;
  const description = `${categoryDescription} Shop ${categoryName.toLowerCase()} at ${storeConfig.name} in San Francisco.`;

  return (
    <SEOHead 
      title={title}
      description={description}
    />
  );
}

