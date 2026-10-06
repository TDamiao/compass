import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runCli } from '../cli/src/commands.js';
import { resolveRegistrySource } from '../cli/src/registry.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const registry = JSON.parse(await readFile(path.join(root, 'compass-components', 'registry', 'registry.json'), 'utf8'));
const registryUrl = 'https://registry.test/compass-components/registry/registry.json';
const componentsBaseUrl = 'https://registry.test/compass-components';
const source = { repository: 'TDamiao/compass', ref: 'test-ref', registryUrl, componentsBaseUrl };

test('registry source and ref are centralized and replaceable', () => {
  const versioned = resolveRegistrySource({ ref: 'v1.1.0' });
  assert.match(versioned.registryUrl, /\/v1\.1\.0\/compass-components\/registry\/registry\.json$/);
  assert.match(versioned.componentsBaseUrl, /\/v1\.1\.0\/compass-components$/);
  const custom = resolveRegistrySource({
    env: { COMPASS_REGISTRY_URL: 'https://example.test/registry.json', COMPASS_COMPONENTS_BASE_URL: 'https://example.test/bundle' },
  });
  assert.equal(custom.registryUrl, 'https://example.test/registry.json');
  assert.equal(custom.componentsBaseUrl, 'https://example.test/bundle');
});

test('help and version work without network access', async () => {
  const help = await invoke(['--help'], { fetchImpl: () => assert.fail('help must not fetch') });
  assert.equal(help.code, 0);
  assert.match(help.out, /compass add <component>/);
  const version = await invoke(['--version'], { fetchImpl: () => assert.fail('version must not fetch') });
  assert.equal(version.code, 0);
  assert.equal(version.out, JSON.parse(await readFile(path.join(root, 'cli', 'package.json'), 'utf8')).version);
});

function localFetch({ registryOverride = registry, unavailable = new Set(), reject = false } = {}) {
  return async (url) => {
    if (reject) throw new Error('network offline');
    if (url === registryUrl) return response(JSON.stringify(registryOverride));
    const relative = decodeURIComponent(String(url).slice(`${componentsBaseUrl}/`.length));
    if (unavailable.has(relative)) return { ok: false, status: 404, text: async () => '' };
    try {
      return response(await readFile(path.join(root, 'compass-components', ...relative.split('/')), 'utf8'));
    } catch {
      return { ok: false, status: 404, text: async () => '' };
    }
  };
}

function response(body) {
  return { ok: true, status: 200, text: async () => body };
}

async function invoke(args, options = {}) {
  const out = [];
  const errors = [];
  const code = await runCli(args, {
    cwd: options.cwd ?? process.cwd(),
    source: options.source ?? source,
    fetchImpl: options.fetchImpl ?? localFetch(options),
    stdout: (message) => out.push(message),
    stderr: (message) => errors.push(message),
  });
  return { code, out: out.join('\n'), errors: errors.join('\n') };
}

test('list derives categories and statuses from the source registry', async () => {
  const result = await invoke(['list']);
  assert.equal(result.code, 0);
  assert.match(result.out, /Navigation[\s\S]*\[stable\] Sidebar[\s\S]*\[planned\] Tabs/);
  assert.match(result.out, /Actions[\s\S]*\[stable\] Button/);
  assert.match(result.out, /\nAI\n/);
  for (const category of registry.categories) {
    const first = registry.components.find((component) => component.category === category);
    if (first) assert.ok(result.out.includes(first.name), `missing ${first.name} under ${category}`);
  }
  assert.equal(result.out.includes('undefined'), false);
});

test('info describes stable and planned patterns without implying planned files exist', async () => {
  const stable = await invoke(['info', 'sidebar']);
  assert.equal(stable.code, 0);
  assert.match(stable.out, /Name|Sidebar/);
  assert.match(stable.out, /ID: sidebar/);
  assert.match(stable.out, /Status: stable/);
  assert.match(stable.out, /components\/sidebar\/reference\/example.html/);

  const planned = await invoke(['info', 'tabs']);
  assert.equal(planned.code, 0);
  assert.match(planned.out, /Status: planned/);
  assert.match(planned.out, /No reference implementation is available yet\./);
  assert.match(planned.out, /Files: none/);

  const missing = await invoke(['info', 'no-such-pattern']);
  assert.equal(missing.code, 1);
  assert.match(missing.errors, /Pattern not found: no-such-pattern/);
});

test('add installs every registered Sidebar reference file and provenance', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'compass-cli-add-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const result = await invoke(['add', 'sidebar'], { cwd });
  assert.equal(result.code, 0, result.errors);
  assert.match(result.out, /compass\/sidebar\/README\.md/);
  const destination = path.join(cwd, 'compass', 'sidebar');
  for (const file of registry.components.find((component) => component.id === 'sidebar').files) {
    const installed = file.slice('components/sidebar/'.length);
    const content = await readFile(path.join(destination, ...installed.split('/')), 'utf8');
    assert.ok(content.length > 0, `empty installed file: ${installed}`);
  }
  const provenance = JSON.parse(await readFile(path.join(destination, 'compass-source.json'), 'utf8'));
  assert.deepEqual(provenance, {
    source: 'TDamiao/compass',
    component: 'sidebar',
    version: '1.0.0',
    registryRef: 'test-ref',
  });
});

test('add refuses planned and unknown patterns without downloading or writing files', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'compass-cli-reject-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const fetched = [];
  const fetchImpl = async (url) => {
    fetched.push(url);
    return localFetch()(url);
  };

  const planned = await invoke(['add', 'tabs'], { cwd, fetchImpl });
  assert.equal(planned.code, 1);
  assert.match(planned.errors, /Tabs is planned/);
  assert.deepEqual(fetched, [registryUrl]);
  assert.equal(await exists(path.join(cwd, 'compass')), false);

  const missing = await invoke(['add', 'missing-pattern'], { cwd });
  assert.equal(missing.code, 1);
  assert.match(missing.errors, /Pattern not found/);
  assert.equal(await exists(path.join(cwd, 'compass')), false);
});

test('add refuses an existing destination without changing its files', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'compass-cli-conflict-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const destination = path.join(cwd, 'compass', 'sidebar');
  await mkdir(destination, { recursive: true });
  await writeFile(path.join(destination, 'keep.txt'), 'keep');

  const result = await invoke(['add', 'sidebar'], { cwd });
  assert.equal(result.code, 1);
  assert.match(result.errors, /already exists.*No files were changed/);
  assert.equal(await readFile(path.join(destination, 'keep.txt'), 'utf8'), 'keep');
});

test('registry and download failures are short errors with no partial installation', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'compass-cli-network-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const network = await invoke(['list'], { cwd, fetchImpl: localFetch({ reject: true }) });
  assert.equal(network.code, 1);
  assert.match(network.errors, /Cannot reach the Compass registry/);

  const invalid = await invoke(['list'], { fetchImpl: async () => response('{invalid') });
  assert.equal(invalid.code, 1);
  assert.match(invalid.errors, /not valid JSON/);

  const filePath = 'components/sidebar/reference/component.css';
  const unavailable = await invoke(['add', 'sidebar'], { cwd, unavailable: new Set([filePath]) });
  assert.equal(unavailable.code, 1);
  assert.match(unavailable.errors, /Reference file unavailable/);
  assert.equal(await exists(path.join(cwd, 'compass')), false);
});

test('path traversal IDs and unsafe registry file paths are rejected before writing', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'compass-cli-path-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const traversal = await invoke(['add', '../outside'], { cwd });
  assert.equal(traversal.code, 1);
  assert.match(traversal.errors, /Pattern IDs must use lowercase/);

  const unsafeRegistry = structuredClone(registry);
  const sidebar = unsafeRegistry.components.find((component) => component.id === 'sidebar');
  sidebar.files.push('components/sidebar/../../outside.txt');
  const unsafe = await invoke(['add', 'sidebar'], { cwd, registryOverride: unsafeRegistry });
  assert.equal(unsafe.code, 1);
  assert.match(unsafe.errors, /unsafe file path/);
  assert.equal(await exists(path.join(cwd, 'compass')), false);
});

test('runtime registry must satisfy the existing v1 metadata contract', async () => {
  const malformed = structuredClone(registry);
  malformed.components[0].status = 'unexpected';
  const result = await invoke(['list'], { registryOverride: malformed });
  assert.equal(result.code, 1);
  assert.match(result.errors, /invalid component entry/);
});

async function exists(pathname) {
  try {
    await readFile(pathname);
    return true;
  } catch (error) {
    if (error.code === 'EISDIR') return true;
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}
