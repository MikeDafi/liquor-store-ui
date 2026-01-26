/**
 * Schema.org Structured Data Components
 * 
 * Provides JSON-LD markup for better SEO and rich snippets in search results.
 */

import { storeConfig } from '../config/store';

/**
 * LocalBusiness schema for the liquor store
 * Enables rich snippets with business info, hours, location
 */
export function LocalBusinessSchema() {
  // Parse hours into schema.org format
  // Example: "Mon-Thu: 9 AM - 9 PM" -> "Mo-Th 09:00-21:00"
  const parseHours = (weekday: string, weekend: string): string[] => {
    const hours: string[] = [];
    
    // Simplified parsing - in production you'd want more robust parsing
    // For now, return a reasonable default based on typical store hours
    if (weekday.includes('9 AM') && weekday.includes('9 PM')) {
      hours.push('Mo-Th 09:00-21:00');
    }
    if (weekday.includes('10 PM')) {
      hours.push('Fr 09:00-22:00');
    }
    if (weekend.includes('10 PM')) {
      hours.push('Sa 09:00-22:00');
    }
    if (weekend.includes('9 PM')) {
      hours.push('Su 09:00-21:00');
    }
    
    // Fallback if parsing fails
    if (hours.length === 0) {
      hours.push('Mo-Su 09:00-21:00');
    }
    
    return hours;
  };

  // Parse address from single string "123 Main St, San Francisco, CA 94102"
  const parseAddress = (address: string) => {
    const parts = address.split(',').map(p => p.trim());
    const streetAddress = parts[0] || '';
    const city = parts[1] || '';
    const stateZip = parts[2] || '';
    const [state, postalCode] = stateZip.split(' ').filter(Boolean);
    
    return {
      streetAddress,
      addressLocality: city,
      addressRegion: state || 'CA',
      postalCode: postalCode || '',
      addressCountry: 'US',
    };
  };

  const address = parseAddress(storeConfig.address);
  const openingHours = parseHours(storeConfig.hoursWeekday, storeConfig.hoursWeekend);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LiquorStore',
    '@id': `${window.location.origin}/#organization`,
    name: storeConfig.name,
    description: storeConfig.seo.description,
    url: window.location.origin,
    telephone: storeConfig.phone,
    email: storeConfig.email || undefined,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(storeConfig.lat),
      longitude: parseFloat(storeConfig.lng),
    },
    openingHoursSpecification: openingHours.map(hours => {
      const [days, times] = hours.split(' ');
      const [opens, closes] = times.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split('-').map(d => {
          const dayMap: Record<string, string> = {
            'Mo': 'Monday', 'Tu': 'Tuesday', 'We': 'Wednesday',
            'Th': 'Thursday', 'Fr': 'Friday', 'Sa': 'Saturday', 'Su': 'Sunday'
          };
          return dayMap[d] || d;
        }),
        opens,
        closes,
      };
    }),
    priceRange: '$$',
    image: storeConfig.heroImage,
    sameAs: [
      storeConfig.socialLinks.facebook,
      storeConfig.socialLinks.instagram,
      storeConfig.socialLinks.twitter,
      storeConfig.socialLinks.yelp,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

/**
 * WebSite schema with search action
 * Enables sitelinks search box in Google
 */
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: storeConfig.name,
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqs: FAQItem[];
}

/**
 * FAQPage schema for FAQ content
 * Enables FAQ rich snippets in search results
 */
export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList schema for navigation
 * Helps search engines understand site structure
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}

