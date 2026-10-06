import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildComponentPageModel } from '../catalog/src/lib/component-page.js';
import { createRegistryStore } from '../catalog/src/lib/registry-store.js';
import { canonicalUrl, normalizeBasePath, routeHref } from '../catalog/src/lib/urls.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const registry = JSON.parse(await readFile(path.join(root, 'compass-components', 'registry', 'registry.json'), 'utf8'));
const store = createRegistryStore(registry);

test('registry accessors use the source registry and derive the statistics', () => {
  assert.equal(store.loadRegistry(), registry);
  assert.equal(store.getComponents().length, registry.components.length);
  const expectedStats = { total: registry.components.length };
  for (const status of ['stable', 'planned', 'draft']) {
    expectedStats[status] = registry.components.filter((component) => component.status === status).length;
  }
  assert.deepEqual(store.getStats(), expectedStats);
  assert.equal(store.getStableComponents().length, expectedStats.stable);
  for (const category of registry.categories) {
    assert.equal(
      store.getComponentsByCategory(category).length,
      registry.components.filter((component) => component.category === category).length,
    );
  }
  assert.equal(store.getComponent('data-table').name, 'Data Table');
});

test('catalog URLs preserve a project base, route directories and public canonical paths', () => {
  assert.equal(normalizeBasePath('/compass'), '/compass/');
  assert.equal(normalizeBasePath('/'), '/');
  assert.equal(routeHref('/compass/', 'components/sidebar'), '/compass/components/sidebar/');
  assert.equal(routeHref('/compass/', ''), '/compass/');
  assert.equal(canonicalUrl('https://tdamiao.github.io/compass/', 'components/sidebar'), 'https://tdamiao.github.io/compass/components/sidebar/');
  assert.equal(canonicalUrl('https://tdamiao.github.io/compass/', ''), 'https://tdamiao.github.io/compass/');
});

test('catalog navigation and preview keep base-aware URLs and the isolated sandbox', async () => {
  const source = await readFile(path.join(root, 'catalog', 'src', 'main.js'), 'utf8');
  assert.match(source, /return routeHref\(baseUrl, route\);/);
  assert.match(source, /canonicalUrl\(siteUrl, routePath\)/);
  assert.match(source, /sandbox="allow-scripts"/);
  assert.doesNotMatch(source, /sandbox="[^"]*allow-same-origin/);
  assert.match(source, /default-src \\'none\\'/);
});

test('search covers metadata, category and component guidance', () => {
  assert.equal(store.searchComponents('nav').some((component) => component.id === 'sidebar'), true);
  assert.equal(store.searchComponents('tool action')[0].id, 'tool-call');
  assert.equal(store.searchComponents('workspace', { sidebar: 'workspace persistent application navigation' })[0].id, 'sidebar');
  assert.deepEqual(store.searchComponents('not-a-pattern'), []);
});

test('stable entries have the source files their catalog pages expose', async () => {
  for (const component of store.getStableComponents()) {
    assert.ok(component.files.includes(`components/${component.id}/README.md`));
    assert.ok(component.files.includes(`components/${component.id}/reference/example.html`));
    for (const file of component.files) await readFile(path.join(root, 'compass-components', file), 'utf8');
  }
});

test('planned entries render without attempting to load implementation files', () => {
  for (const planned of store.getComponents().filter((component) => component.status === 'planned')) {
    const page = buildComponentPageModel(planned, {
      getGuide() { assert.fail(`${planned.id} must not load documentation files`); },
      getExamples() { assert.fail(`${planned.id} must not load preview/source files`); },
      getMetadata() { assert.fail(`${planned.id} must not load component metadata files`); },
    });
    assert.equal(page.component, planned);
    assert.equal(page.guide, null);
    assert.equal(page.examples, null);
    assert.equal(page.metadata, null);
  }
});

test('foundation pages are generated from headings in the existing foundations document', async () => {
  const markdown = await readFile(path.join(root, 'compass-components', 'references', 'foundations.md'), 'utf8');
  const headings = [...markdown.matchAll(/^##\s+(.+)\s*$/gm)].map(([, heading]) => heading.toLowerCase());
  for (const expected of ['color', 'typography', 'spacing', 'radius', 'motion', 'layout']) {
    assert.ok(headings.includes(expected), `missing foundation route source: ${expected}`);
  }
});
