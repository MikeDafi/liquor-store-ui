import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/measurement.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace(/^import .*$/gm, '')
  .replaceAll('export ', '')
  .replaceAll('import.meta.env', 'env');

function setup(env = {}, fail = false) {
  const events = [], sent = [], vercel = [];
  const window = {
    location: { origin: 'https://town-country-market.vercel.app' },
    dispatchEvent: event => events.push(event.detail),
    gtag: (...args) => { if (fail) throw new Error('provider unavailable'); sent.push(args); },
  };
  class CustomEvent { constructor(name, { detail }) { this.detail = detail; } }
  const methods = new Function('window', 'CustomEvent', 'track', 'getCurrentStore', 'env', `${js}; return {cleanAnalyticsUrl,trackStoreEvent}`)(
    window, CustomEvent, (...args) => { if (fail) throw new Error('provider unavailable'); vercel.push(args); }, () => ({ id: 'town-country-market' }), env);
  return { ...methods, events, sent, vercel };
}

test('search text, arbitrary query parameters, fragments, and unsafe campaign values are removed', () => {
  const { cleanAnalyticsUrl } = setup();
  const output = new URL(cleanAnalyticsUrl('/search?q=private%40email.com&email=a%40b.com&utm_source=hotel_a&utm_medium=front_desk&utm_campaign=person%40email.com#secret'));
  assert.equal(output.pathname, '/search');
  assert.equal(output.search, '?utm_source=hotel_a&utm_medium=front_desk');
  assert.equal(output.hash, '');
});

test('events retain store identity and send no Vercel custom events by default', () => {
  const { trackStoreEvent, events, sent, vercel } = setup();
  trackStoreEvent('search_results', { result_count: 0, zero_results: true, query_length: 8 });
  assert.equal(events[0].data.store_id, 'town-country-market');
  assert.equal(events[0].data.zero_results, true);
  assert.equal(sent[0][1], 'search_results');
  assert.equal(vercel.length, 0);
});

test('optional Vercel delivery and provider failures do not block the shopping action', () => {
  const enabled = setup({ VITE_VERCEL_CUSTOM_EVENTS: 'true' });
  enabled.trackStoreEvent('directions_click', { source: 'home' });
  assert.equal(enabled.vercel.length, 1);
  const failing = setup({ VITE_VERCEL_CUSTOM_EVENTS: 'true' }, true);
  assert.doesNotThrow(() => failing.trackStoreEvent('phone_click', { source: 'mobile' }));
});
