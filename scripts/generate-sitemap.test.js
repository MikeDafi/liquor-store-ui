import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stores = JSON.parse(fs.readFileSync(path.join(root, 'data/stores.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'data/products.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { categories } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);

function generate(t, overrides) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'store-seo-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const name of ['scripts', 'data', 'public', 'dist']) fs.mkdirSync(path.join(dir, name));
  fs.copyFileSync(path.join(root, 'scripts/generate-sitemap.js'), path.join(dir, 'scripts/generate-sitemap.js'));
  fs.copyFileSync(path.join(root, 'data/stores.json'), path.join(dir, 'data/stores.json'));
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}');
  fs.writeFileSync(path.join(dir, 'dist/index.html'), '<html><head><title>Old title</title></head><body><div id="root"></div></body></html>');
  const env = { ...process.env };
  for (const key of ['VITE_STORE_ID', 'VITE_SITE_URL', 'VERCEL_URL']) delete env[key];
  const result = spawnSync(process.execPath, ['scripts/generate-sitemap.js'], { cwd: dir, env: { ...env, ...overrides }, encoding: 'utf8' });
  return { result, read: file => fs.readFileSync(path.join(dir, file), 'utf8') };
}

for (const [storeId, store] of Object.entries(stores)) {
  test(`${storeId}: public origin, real categories, store identity, and initial metadata`, t => {
    const { result, read } = generate(t, { VITE_STORE_ID: storeId, VERCEL_URL: 'protected-preview.vercel.app' });
    assert.equal(result.status, 0, result.stderr);
    const xml = read('dist/sitemap.xml');
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]));
    assert.ok(urls.every(url => url.origin === store.url));
    assert.ok(urls.some(url => url.pathname === `/location/${storeId}`));
    assert.deepEqual(urls.filter(url => url.pathname.startsWith('/category/')).map(url => url.pathname).sort(), categories.map(c => `/category/${c.id}`).sort());
    assert.ok(!xml.includes('<lastmod>'), 'Build time is not a content modification date');
    assert.ok(read('dist/robots.txt').includes(`Sitemap: ${store.url}/sitemap.xml`));
    const html = read('dist/index.html');
    assert.ok(html.includes(store.address.street));
    assert.ok(html.includes('name="description"'));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema.name, store.name);
    assert.equal(schema.url, store.url);
    assert.equal(schema.address.streetAddress, store.address.street);
    assert.ok(!schema.openingHours && !schema.aggregateRating && !schema.review);
    if (storeId === 'town-country-market') {
      assert.equal(schema.telephone, '(415) 776-4067');
      assert.deepEqual(schema.openingHoursSpecification, [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '00:00',
      }]);
    } else {
      assert.equal(schema.openingHoursSpecification, undefined, 'Do not publish unconfirmed hours for another store');
    }
  });
}

test('explicit public URL wins over the deployment URL and removes trailing path', t => {
  const { result, read } = generate(t, { VITE_STORE_ID: 'town-country-market', VITE_SITE_URL: 'https://store.example/', VERCEL_URL: 'private.vercel.app' });
  assert.equal(result.status, 0, result.stderr);
  assert.ok(read('dist/sitemap.xml').includes('<loc>https://store.example/</loc>'));
  assert.ok(!read('dist/sitemap.xml').includes('private.vercel.app'));
});

test('invalid store IDs fail instead of silently generating another store sitemap', t => {
  assert.notEqual(generate(t, { VITE_STORE_ID: 'typo' }).result.status, 0);
});

test('non-HTTP site URLs fail', t => {
  assert.notEqual(generate(t, { VITE_SITE_URL: 'javascript:alert(1)' }).result.status, 0);
});
