import { useEffect, useRef } from 'react';
import { getCurrentStore } from '../data/storeConfig';
import { cleanAnalyticsUrl, trackStoreEvent } from '../lib/measurement';

export function StoreMeasurement({ path }: { path: string }) {
  const previousPath = useRef<string>();
  const previousUrl = useRef<string>();
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (/^G-[A-Z0-9]+$/.test(measurementId || '') && !document.getElementById('store-google-tag')) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function (...args: unknown[]) { window.dataLayer!.push(args); };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, { send_page_view: false });
      const script = document.createElement('script');
      script.id = 'store-google-tag';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a');
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      const source = target?.closest('footer') ? 'footer' : 'content';
      if (url.protocol === 'tel:' && url.pathname) trackStoreEvent('phone_click', { source });
      else if (['maps.google.com', 'www.google.com', 'maps.apple.com'].includes(url.hostname) && /maps|directions/.test(url.href)) {
        trackStoreEvent('directions_click', { source });
      } else if (url.origin === window.location.origin && /^\/product\/[^/]+$/.test(url.pathname)) {
        trackStoreEvent('product_click', { source: window.location.pathname === '/search' ? 'search' : 'catalog', product_id: url.pathname.split('/')[2] });
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  useEffect(() => {
    if (previousPath.current === path) return;
    const url = cleanAnalyticsUrl(window.location.href);
    window.gtag?.('event', 'page_view', {
      page_location: url,
      page_title: document.title,
      page_referrer: previousUrl.current || (document.referrer ? cleanAnalyticsUrl(document.referrer) : ''),
      store_id: getCurrentStore().id,
    });
    previousPath.current = path;
    previousUrl.current = url;
  }, [path]);
  return null;
}
