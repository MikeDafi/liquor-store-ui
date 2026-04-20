/**
 * Bulk Product Image Fetcher
 *
 * Scrapes Bing Images for product photos, compresses with sharp,
 * uploads to Vercel Blob at predictable URLs: product-images/{upc}.webp
 *
 * Usage:
 *   npx tsx scripts/fetch-product-images.ts                     # all products
 *   npx tsx scripts/fetch-product-images.ts --limit 10          # first 10
 *   npx tsx scripts/fetch-product-images.ts --category wine     # wines only
 *   npx tsx scripts/fetch-product-images.ts --force             # re-fetch all
 *   npx tsx scripts/fetch-product-images.ts --dry-run           # save locally only
 *
 * Env:
 *   BLOB_READ_WRITE_TOKEN  — from Vercel project settings
 */

import puppeteer from 'puppeteer';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { scrapeProductImage } from './lib/scrape-google-images';
import { compressImage } from './lib/image-processor';
import { uploadImage } from './lib/blob-uploader';

// --- CLI args ---
const args = process.argv.slice(2);
const limit = parseInt(args[args.indexOf('--limit') + 1]) || Infinity;
const categoryFilter = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');

// --- Config ---
const DELAY_MS = 3000;
const PROGRESS_FILE = 'scripts/.image-progress.json';
const SPREADSHEET_ID = '1NH20t073dWNihFY49p5WYxiGTf0_ui1GBVN9UxPklh4';
const SHEET_GID = '2011133176';

interface Product {
  name: string;
  code: string;
  category: string;
}

interface Progress {
  processed: Record<string, string>; // code → blobUrl or 'dry-run'
  failed: string[];
  lastRun: string;
}

// --- Load products from Google Sheet CSV ---
async function loadProducts(): Promise<Product[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;
  console.log('Fetching products from Google Sheet...');
  const response = await fetch(url);
  const csv = await response.text();

  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().trim());
  const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('product'));
  const codeIdx = headers.findIndex(h => h.includes('code'));
  const categoryIdx = headers.findIndex(h => h.includes('category'));
  const availableIdx = headers.findIndex(h => h.includes('available'));

  const products: Product[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const available = availableIdx >= 0 ? values[availableIdx]?.trim().toLowerCase() : 'true';
    if (available !== 'true' && available !== '1') continue;

    const name = values[nameIdx]?.trim() || '';
    const code = values[codeIdx]?.trim() || '';
    const category = values[categoryIdx]?.trim().toLowerCase() || '';

    if (name && code) {
      products.push({ name, code, category });
    }
  }

  return products;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

// --- Progress tracking ---
function loadProgress(): Progress {
  if (existsSync(PROGRESS_FILE)) {
    return JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { processed: {}, failed: [], lastRun: '' };
}

function saveProgress(progress: Progress): void {
  progress.lastRun = new Date().toISOString();
  writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// --- Main ---
async function main() {
  console.log('=== Bulk Product Image Fetcher ===');
  console.log(`Options: limit=${limit === Infinity ? 'all' : limit}, category=${categoryFilter || 'all'}, force=${force}, dryRun=${dryRun}\n`);

  if (!dryRun && !process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('ERROR: BLOB_READ_WRITE_TOKEN env variable required for uploads.');
    console.error('Get it from: Vercel Dashboard > Project > Settings > Environment Variables');
    console.error('Run with --dry-run to test without uploading.');
    process.exit(1);
  }

  // Load products
  let products = await loadProducts();
  console.log(`Loaded ${products.length} products from sheet`);

  if (categoryFilter) {
    products = products.filter(p => p.category === categoryFilter.toLowerCase());
    console.log(`Filtered to ${products.length} ${categoryFilter} products`);
  }

  // Load progress
  const progress = force ? { processed: {}, failed: [], lastRun: '' } : loadProgress();

  // Filter to unprocessed
  const toProcess = products.filter(p => {
    if (force) return true;
    return !progress.processed[p.code];
  }).slice(0, limit);

  console.log(`Products to process: ${toProcess.length}\n`);

  if (toProcess.length === 0) {
    console.log('Nothing to do!');
    return;
  }

  // Launch browser
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  mkdirSync('scripts/output', { recursive: true });

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const product = toProcess[i];
    const pct = ((i + 1) / toProcess.length * 100).toFixed(1);
    console.log(`[${i + 1}/${toProcess.length}] (${pct}%) "${product.name}" (${product.code})...`);

    try {
      const rawImage = await scrapeProductImage(page, product.name, product.category);

      if (!rawImage) {
        console.log('  SKIP — no image found');
        progress.failed.push(product.code);
        failCount++;
        await new Promise(r => setTimeout(r, DELAY_MS));
        continue;
      }

      const compressed = await compressImage(rawImage);
      console.log(`  Compressed: ${(compressed.length / 1024).toFixed(1)}KB`);

      if (dryRun) {
        writeFileSync(`scripts/output/${product.code}.webp`, compressed);
        console.log(`  Saved locally (dry run)`);
        progress.processed[product.code] = 'dry-run';
      } else {
        const blobUrl = await uploadImage(product.code, compressed);
        console.log(`  Uploaded: ${blobUrl}`);
        progress.processed[product.code] = blobUrl;
      }

      successCount++;
    } catch (error) {
      console.log(`  ERROR: ${(error as Error).message}`);
      progress.failed.push(product.code);
      failCount++;
    }

    saveProgress(progress);

    if (i < toProcess.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  await browser.close();

  console.log('\n=== SUMMARY ===');
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed:  ${failCount}`);
  console.log(`  Total processed: ${Object.keys(progress.processed).length}`);
  if (dryRun) {
    console.log('  (dry run — nothing uploaded to Blob)');
  } else if (successCount > 0) {
    console.log(`\nSet VITE_BLOB_BASE_URL to the blob store base URL in your Vercel env vars.`);
    console.log(`Example: https://xxxxxx.public.blob.vercel-storage.com`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
