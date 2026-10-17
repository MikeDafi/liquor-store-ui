/**
 * Sitemap Generator
 * 
 * Generates sitemap.xml with the correct base URL from environment variables.
 * Run during build: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, '..');
const env = { ...loadEnv(process.env.NODE_ENV || 'production', root, ''), ...process.env };
const stores = JSON.parse(fs.readFileSync(path.join(root, 'data/stores.json'), 'utf8'));
const storeId = env.VITE_STORE_ID || 'home-service-market';
const store = stores[storeId];
if (!store) throw new Error(`Unknown VITE_STORE_ID: ${storeId}`);
// Deployment URLs can be protected by Vercel login. Always use the public store URL.
const configuredUrl = new URL(env.VITE_SITE_URL || store.url);
if (!['https:', 'http:'].includes(configuredUrl.protocol) || configuredUrl.username || configuredUrl.password) {
  throw new Error('VITE_SITE_URL must be a public HTTP(S) URL without credentials');
}
const BASE_URL = configuredUrl.origin;
const escapeXml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/faq', priority: '0.7', changefreq: 'weekly' },
  { path: `/location/${store.id}`, priority: '0.9', changefreq: 'monthly' },
];

// Category pages
const categories = [
  'beer',
  'wine', 
  'whiskey',
  'vodka',
  'tequila',
  'sake',
  'food',
  'drinks',
  'dairy',
  'tobacco',
  'pharmacy',
];

const categoryPages = categories.map(cat => ({
  path: `/category/${cat}`,
  priority: '0.8',
  changefreq: 'daily',
}));

// Combine all pages
const allPages = [...staticPages, ...categoryPages];

// Generate XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${escapeXml(BASE_URL + page.path)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// Write to public directory
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Write to public (for dev)
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✓ Generated public/sitemap.xml');

// Also write to dist if it exists (for production builds)
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  console.log('✓ Generated dist/sitemap.xml');
}

// Update robots.txt with correct sitemap URL
const robotsTxt = `# Robots.txt for Liquor Store UI

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Block search result pages from indexing
Disallow: /search

# Block any API endpoints
Disallow: /api/
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
console.log('✓ Generated public/robots.txt');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
  console.log('✓ Generated dist/robots.txt');
}

console.log(`\nSitemap base URL: ${BASE_URL}`);

// The live entry point uses the root App, not src/App. Publish store facts in
// initial HTML as well, so discovery does not depend on JavaScript execution.
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  const title = `${store.name} | ${store.address.street}, ${store.address.city}`;
  const description = `Find ${store.name} at ${store.address.full}. Browse wine, beer, spirits and everyday essentials. Visit the store website for current information.`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LiquorStore',
    '@id': `${BASE_URL}/#store`,
    name: store.name,
    url: BASE_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address.street,
      addressLocality: store.address.city,
      addressRegion: store.address.state,
      postalCode: store.address.zip,
      addressCountry: 'US',
    },
    ...(store.phone ? { telephone: store.phone } : {}),
  };
  const metadata = `<meta name="description" content="${escapeXml(description)}" />
    <meta property="og:title" content="${escapeXml(title)}" />
    <meta property="og:description" content="${escapeXml(description)}" />
    <meta property="og:type" content="website" />
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
  const fallback = `<section><h1>${escapeXml(store.name)}</h1><p>${escapeXml(store.address.full)}</p><p>Wine, beer, spirits and everyday essentials.</p>${store.phone ? `<p>${escapeXml(store.phone)}</p>` : ''}<p>Enable JavaScript to browse current products and store information.</p></section>`;
  const file = path.join(distDir, 'index.html');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<title>.*?<\/title>/s, `<title>${escapeXml(title)}</title>`)
    .replace('</head>', `${metadata}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
  fs.writeFileSync(file, html);
  console.log('✓ Generated initial HTML store metadata and business schema (hours omitted pending verification)');
}

