import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl, normalizeBasePath } from '../catalog/src/lib/urls.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const registry = JSON.parse(await readFile(path.join(root, 'compass-components', 'registry', 'registry.json'), 'utf8'));
const foundations = await readFile(path.join(root, 'compass-components', 'references', 'foundations.md'), 'utf8');
const foundationSlugs = [...foundations.matchAll(/^##\s+(.+)\s*$/gm)].map(([, title]) => title
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
const paths = [
  ...registry.components.map((component) => `components/${component.id}`),
  ...registry.categories.map((category) => `categories/${category}`),
  ...foundationSlugs.map((slug) => `foundations/${slug}`),
];
const rootHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const base = normalizeBasePath(process.env.CATALOG_BASE || '/');
const siteUrl = process.env.VITE_CATALOG_URL;
assert.match(rootHtml, /<title>Compass Components/);
const assets = [...rootHtml.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map(([, asset]) => asset);
assert.ok(assets.length > 0, 'built entry should reference generated assets');
for (const asset of assets) {
  assert.ok(asset.startsWith(base), `asset must respect configured base ${base}: ${asset}`);
  const relativeAsset = asset.slice(base.length);
  await access(path.join(dist, relativeAsset));
}

const requiredRoutes = [
  'components/sidebar',
  'components/button',
  'components/data-table',
  'components/tabs',
  'categories/navigation',
  'categories/ai',
  'foundations/color',
];
for (const route of requiredRoutes) assert.ok(paths.includes(route), `required static route missing from source data: ${route}`);

const homeCanonical = rootHtml.match(/<link rel="canonical" href="([^"]+)">/);
if (siteUrl) assert.equal(homeCanonical?.[1], canonicalUrl(siteUrl));
else assert.equal(homeCanonical, null, 'canonical should remain absent without a configured public URL');

for (const route of paths) {
  const routeHtml = await readFile(path.join(dist, route, 'index.html'), 'utf8');
  assert.ok(routeHtml.includes('<div id="app"></div>'), `app shell missing on /${route}`);
  for (const asset of assets) assert.ok(routeHtml.includes(asset), `built asset missing on /${route}: ${asset}`);
  assert.ok(routeHtml.match(/<title>[^<]+<\/title>/), `static title missing on /${route}`);
  assert.ok(routeHtml.match(/<meta name="description" content="[^"]+">/), `static description missing on /${route}`);
  const canonical = routeHtml.match(/<link rel="canonical" href="([^"]+)">/);
  if (siteUrl) assert.equal(canonical?.[1], canonicalUrl(siteUrl, route), `wrong canonical URL for /${route}`);
  else assert.equal(canonical, null, `unexpected canonical URL for /${route}`);
}

const appSource = await readFile(path.join(root, 'catalog', 'src', 'main.js'), 'utf8');
assert.match(appSource, /sandbox="allow-scripts"/);
assert.doesNotMatch(appSource, /sandbox="[^"]*allow-same-origin/);
assert.match(appSource, /default-src \\'none\\'/, 'iframe preview CSP should remain enabled');

console.log(`Verified base ${base}, canonical URLs, the static shell, ${paths.length} routes and their built assets.`);
