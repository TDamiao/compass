import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
assert.match(rootHtml, /<title>Compass Components/);
const assets = [...rootHtml.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map(([, asset]) => asset);
assert.ok(assets.length > 0, 'built entry should reference generated assets');
for (const asset of assets) {
  const relativeAsset = asset.replace(/^\//, '').replace(/^.*?assets\//, 'assets/');
  await access(path.join(dist, relativeAsset));
}

for (const route of paths) {
  const routeHtml = await readFile(path.join(dist, route, 'index.html'), 'utf8');
  assert.ok(routeHtml.includes('<div id="app"></div>'), `app shell missing on /${route}`);
  for (const asset of assets) assert.ok(routeHtml.includes(asset), `built asset missing on /${route}: ${asset}`);
  assert.ok(routeHtml.match(/<title>[^<]+<\/title>/), `static title missing on /${route}`);
  assert.ok(routeHtml.match(/<meta name="description" content="[^"]+">/), `static description missing on /${route}`);
}

console.log(`Verified the static shell, ${paths.length} routes and their built assets.`);
