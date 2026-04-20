/**
 * POC: Scrape Bing Images for 5 wine products, compress, save locally.
 * Run: npx tsx scripts/poc-test.ts
 */

import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { scrapeProductImage } from './lib/scrape-google-images';
import { compressImage, getImageInfo } from './lib/image-processor';

const TEST_WINES = [
  { name: 'jealous sisters pinot gris', code: '9421000611385', category: 'wine' },
  { name: 'fire road marlborough pinot noir', code: '9421000611392', category: 'wine' },
  { name: 'fire road sauvignon blanc', code: '9421000611408', category: 'wine' },
  { name: 'zaca mesa Z cuvée', code: '0099798244485', category: 'wine' },
  { name: 'Sterling cabernet sauvignon', code: '0088381043013', category: 'wine' },
];

async function main() {
  mkdirSync('scripts/output', { recursive: true });

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  const results: { name: string; code: string; originalSize: number; compressedSize: number; success: boolean }[] = [];

  for (const wine of TEST_WINES) {
    console.log(`\nSearching: "${wine.name}"...`);

    const rawImage = await scrapeProductImage(page, wine.name, wine.category);

    if (!rawImage) {
      console.log(`  SKIP — no image found`);
      results.push({ name: wine.name, code: wine.code, originalSize: 0, compressedSize: 0, success: false });
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }

    const originalInfo = await getImageInfo(rawImage).catch(() => ({ width: 0, height: 0, size: rawImage.length }));
    console.log(`  Raw: ${originalInfo.width}x${originalInfo.height}, ${(rawImage.length / 1024).toFixed(1)}KB`);

    const compressed = await compressImage(rawImage);
    const compressedInfo = await getImageInfo(compressed);
    console.log(`  Compressed: ${compressedInfo.width}x${compressedInfo.height}, ${(compressed.length / 1024).toFixed(1)}KB`);

    const filename = `scripts/output/${wine.code}.webp`;
    writeFileSync(filename, compressed);
    console.log(`  Saved: ${filename}`);

    results.push({
      name: wine.name,
      code: wine.code,
      originalSize: rawImage.length,
      compressedSize: compressed.length,
      success: true,
    });

    await new Promise(r => setTimeout(r, 3000));
  }

  await browser.close();

  console.log('\n=== RESULTS ===');
  for (const r of results) {
    const status = r.success ? 'OK' : 'FAIL';
    const size = r.success ? `${(r.compressedSize / 1024).toFixed(1)}KB` : 'N/A';
    console.log(`  ${status}  ${r.name} — ${size}`);
  }
  console.log(`\n${results.filter(r => r.success).length}/${results.length} images fetched successfully`);
}

main().catch(console.error);
