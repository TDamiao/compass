import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildComponentPageModel } from '../catalog/src/lib/component-page.js';
import { createRegistryStore } from '../catalog/src/lib/registry-store.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const registry = JSON.parse(await readFile(path.join(root, 'compass-components', 'registry', 'registry.json'), 'utf8'));
const store = createRegistryStore(registry);

test('registry accessors use the source registry and derive the statistics', () => {
  assert.equal(store.loadRegistry(), registry);
  assert.equal(store.getComponents().length, registry.components.length);
  assert.deepEqual(store.getStats(), { total: 26, stable: 6, planned: 20, draft: 0 });
  assert.equal(store.getStableComponents().length, 6);
  assert.equal(store.getComponentsByCategory('ai').length, 12);
  assert.equal(store.getComponent('data-table').name, 'Data Table');
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
