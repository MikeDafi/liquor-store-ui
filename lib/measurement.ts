import { track } from '@vercel/analytics';
import { getCurrentStore } from '../data/storeConfig';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type StoreEvent = 'directions_click' | 'phone_click' | 'product_click' | 'search_results';

/** No raw search text or unfiltered query-string URLs are included. */
export function trackStoreEvent(name: StoreEvent, properties: Record<string, string | number | boolean> = {}) {
  const data = { store_id: getCurrentStore().id, ...properties };
  // Makes local verification possible without sending fake events to production analytics.
  window.dispatchEvent(new CustomEvent('store:measurement', { detail: { name, data } }));
  try { window.gtag?.('event', name, data); } catch { /* Analytics must not interrupt shopping. */ }
  // Vercel custom events require an eligible plan; do not enable a paid feature implicitly.
  if (import.meta.env.VITE_VERCEL_CUSTOM_EVENTS === 'true') {
    try { track(name, data); } catch { /* Analytics must not interrupt shopping. */ }
  }
}

export function cleanAnalyticsUrl(value: string) {
  const url = new URL(value, window.location.origin);
  const campaign = new URLSearchParams();
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const value = url.searchParams.get(key);
    if (value && /^[a-z0-9_-]{1,64}$/i.test(value)) campaign.set(key, value);
  }
  url.search = '';
  url.hash = '';
  url.search = campaign.toString();
  return url.href;
}
