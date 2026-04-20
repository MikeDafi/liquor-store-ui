/**
 * Debug: Try Bing Images instead of Google (less aggressive blocking)
 */
import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  const query = 'jealous sisters pinot gris bottle';
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;

  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: 'scripts/output/debug-bing.png', fullPage: false });
  console.log('Screenshot saved to scripts/output/debug-bing.png');

  console.log('Page title:', await page.title());
  console.log('Current URL:', page.url());

  const pageInfo = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img.mimg, img[class*="thumb"], a.iusc img, .imgpt img, img');
    const imgInfo: string[] = [];
    imgs.forEach((img, i) => {
      if (i < 25) {
        const el = img as HTMLImageElement;
        const src = (el.src || el.getAttribute('data-src') || '').substring(0, 150);
        imgInfo.push(`[${i}] ${el.naturalWidth}x${el.naturalHeight} class="${el.className}" src=${src}`);
      }
    });

    // Also check for data in anchor tags (Bing stores image URLs in metadata)
    const anchors = document.querySelectorAll('a.iusc');
    const anchorData: string[] = [];
    anchors.forEach((a, i) => {
      if (i < 5) {
        const m = a.getAttribute('m');
        if (m) {
          try {
            const parsed = JSON.parse(m);
            anchorData.push(`[${i}] murl=${(parsed.murl || '').substring(0, 150)} turl=${(parsed.turl || '').substring(0, 150)}`);
          } catch {}
        }
      }
    });

    return { imgCount: imgs.length, imgInfo, anchorData, bodySnippet: document.body.innerText.substring(0, 300) };
  });

  console.log('\nTotal images:', pageInfo.imgCount);
  console.log('\nFirst 25 images:');
  pageInfo.imgInfo.forEach(i => console.log(i));
  console.log('\nBing anchor data (contains full-res URLs):');
  pageInfo.anchorData.forEach(a => console.log(a));
  console.log('\nPage text:', pageInfo.bodySnippet.substring(0, 200));

  await browser.close();
}

main().catch(console.error);
