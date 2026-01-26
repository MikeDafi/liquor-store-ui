/**
 * Sitemap Generator
 * 
 * Generates sitemap.xml with the correct base URL from environment variables.
 * Run during build: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base URL from environment or use default
const BASE_URL = process.env.VITE_SITE_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://home-service-market.vercel.app';

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/faq', priority: '0.7', changefreq: 'weekly' },
  { path: '/location/main', priority: '0.9', changefreq: 'monthly' },
];

// Category pages
const categories = [
  'beer',
  'wine', 
  'spirits',
  'sake',
  'mixers',
  'snacks',
  'grocery',
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
const today = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
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

