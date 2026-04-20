import type { Page } from 'puppeteer';

const ALCOHOL_CATEGORIES = ['wine', 'beer', 'whiskey', 'vodka', 'tequila', 'rum', 'gin', 'sake', 'champagne', 'liqueur', 'spirits'];

function buildQuery(productName: string, category: string): string {
  const isAlcohol = ALCOHOL_CATEGORIES.includes(category.toLowerCase());
  return isAlcohol ? `${productName} bottle` : `${productName} product`;
}

/**
 * Scrape Bing Images for a product image.
 * Returns the downloaded image as a Buffer, or null if not found.
 */
export async function scrapeProductImage(page: Page, productName: string, category: string): Promise<Buffer | null> {
  const query = buildQuery(productName, category);
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Wait for image results to render
    await new Promise(r => setTimeout(r, 2000));

    // Bing stores full-res image URLs in anchor tag metadata
    const imageUrl = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a.iusc');
      for (const a of anchors) {
        const m = a.getAttribute('m');
        if (!m) continue;
        try {
          const parsed = JSON.parse(m);
          const murl = parsed.murl as string;
          if (murl && murl.startsWith('http')) {
            return murl;
          }
        } catch {}
      }
      return null;
    });

    if (!imageUrl) {
      console.log(`  No image found for: ${productName}`);
      return null;
    }

    console.log(`  Found: ${imageUrl.substring(0, 80)}...`);

    // Download the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      // Try Bing's thumbnail as fallback
      const thumbUrl = await page.evaluate(() => {
        const anchors = document.querySelectorAll('a.iusc');
        for (const a of anchors) {
          const m = a.getAttribute('m');
          if (!m) continue;
          try {
            const parsed = JSON.parse(m);
            return (parsed.turl as string) || null;
          } catch {}
        }
        return null;
      });

      if (thumbUrl) {
        console.log(`  Full-res failed (${response.status}), trying Bing thumbnail...`);
        const thumbResponse = await fetch(thumbUrl, { signal: AbortSignal.timeout(10000) });
        if (thumbResponse.ok) {
          const buf = await thumbResponse.arrayBuffer();
          return Buffer.from(buf);
        }
      }

      console.log(`  Failed to download image for ${productName}: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.log(`  Error scraping image for ${productName}:`, (error as Error).message);
    return null;
  }
}
