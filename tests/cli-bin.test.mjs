import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bin = path.join(root, 'cli', 'bin', 'compass.js');
const registryRoot = path.join(root, 'compass-components');
const registry = await readFile(path.join(registryRoot, 'registry', 'registry.json'));
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relative = pathname === '/registry.json' ? 'registry/registry.json' : pathname.slice(1);
  try {
    const content = await readFile(path.join(registryRoot, ...relative.split('/')));
    response.writeHead(200, { 'content-type': relative.endsWith('.json') ? 'application/json' : 'text/plain; charset=utf-8' });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

test.after(async () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));

test('real CLI entry point routes output and uses stable exit codes', async (t) => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'compass-cli-bin-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const help = await invoke(['--help'], cwd);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Compass Components\n\nUsage:/);
  assert.equal(help.stderr, '');

  const version = await invoke(['--version'], cwd);
  const metadata = JSON.parse(await readFile(path.join(root, 'cli', 'package.json'), 'utf8'));
  assert.equal(version.status, 0);
  assert.equal(version.stdout.trim(), metadata.version);
  assert.equal(version.stderr, '');

  const list = await invoke(['list'], cwd);
  assert.equal(list.status, 0);
  assert.match(list.stdout, /Sidebar/);
  assert.equal(list.stderr, '');

  const info = await invoke(['info', 'sidebar'], cwd);
  assert.equal(info.status, 0);
  assert.match(info.stdout, /ID: sidebar/);
  assert.equal(info.stderr, '');

  for (const args of [['info', 'nonexistent'], ['info'], ['add', 'tabs'], ['planned'], ['unknown-command']]) {
    const failure = await invoke(args, cwd);
    assert.equal(failure.status, 1, args.join(' '));
    assert.equal(failure.stdout, '', `stdout for ${args.join(' ')}`);
    assert.match(failure.stderr, /^Error:/, `stderr for ${args.join(' ')}`);
  }
});

test('real CLI entry point rejects an unsupported registry schema explicitly', async () => {
  const unsupported = JSON.parse(registry.toString('utf8'));
  unsupported.schemaVersion = '2.0.0';
  const customServer = createServer((request, response) => {
    if (request.url === '/registry.json') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify(unsupported));
    } else {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise((resolve) => customServer.listen(0, '127.0.0.1', resolve));
  try {
    const result = await runBin(['list'], root, {
      ...process.env,
      COMPASS_REGISTRY_URL: `http://127.0.0.1:${customServer.address().port}/registry.json`,
      COMPASS_COMPONENTS_BASE_URL: `http://127.0.0.1:${customServer.address().port}`,
    });
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /Unsupported Compass registry schema: 2\.0\.0/);
    assert.match(result.stderr, /This CLI supports: 1\.0\.0/);
  } finally {
    await new Promise((resolve, reject) => customServer.close((error) => error ? reject(error) : resolve()));
  }
});

function invoke(args, cwd) {
  return runBin(args, cwd, {
    ...process.env,
    COMPASS_REGISTRY_URL: `${baseUrl}/registry.json`,
    COMPASS_COMPONENTS_BASE_URL: baseUrl,
  });
}

function runBin(args, cwd, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [bin, ...args], { cwd, env, windowsHide: true });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (status) => resolve({ status, stdout, stderr }));
  });
}
