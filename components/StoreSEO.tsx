import { useEffect } from 'react';
import { getCurrentStore } from '../data/storeConfig';

interface StoreSEOProps {
  page: string;
  label?: string;
}

/** Metadata for the active root app. Build-time metadata supports non-JS readers. */
export function StoreSEO({ page, label }: StoreSEOProps) {
  const store = getCurrentStore();
  const path = window.location.pathname;
  useEffect(() => {
    const base = new URL(import.meta.env.VITE_SITE_URL || store.url).origin;
    const title = label
      ? `${label} | ${store.name}`
      : `${store.name} | ${store.address.street}, ${store.address.city}`;
    const description = `Find ${store.name} at ${store.address.full}. Browse wine, beer, spirits and everyday essentials. Visit the store website for current information.`;
    document.title = title;
    const meta = (attribute: string, key: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    meta('name', 'description', description);
    meta('name', 'robots', page === 'search' ? 'noindex, follow' : 'index, follow');
    meta('property', 'og:title', title);
    meta('property', 'og:description', description);
    meta('property', 'og:url', new URL(path, base).href);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = new URL(path, base).href;
  }, [store, page, label, path]);
  return null;
}
