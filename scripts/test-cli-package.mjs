import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const npmCli = findNpmCli();
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'compass-package-rc-'));
const project = path.join(temporaryRoot, 'external-consumer');
const npmEnvironment = { ...process.env, npm_config_cache: path.join(temporaryRoot, 'npm-cache') };
const registryRoot = path.join(root, 'compass-components');
const registry = JSON.parse(await readFile(path.join(registryRoot, 'registry', 'registry.json'), 'utf8'));
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const prefix = '/compass-components/';
  if (!pathname.startsWith(prefix)) {
    response.writeHead(404);
    response.end();
    return;
  }
  const relative = pathname.slice(prefix.length);
  try {
    const contents = relative === 'registry/registry.json'
      ? JSON.stringify(registry)
      : await readFile(path.join(registryRoot, ...relative.split('/')), 'utf8');
    response.writeHead(200, { 'content-type': relative.endsWith('.json') ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8' });
    response.end(contents);
  } catch {
    response.writeHead(404);
    response.end();
  }
});

try {
  const pack = await run(process.execPath, [npmCli, 'pack', './cli', '--json', '--pack-destination', temporaryRoot], { cwd: root, env: npmEnvironment });
  assert.equal(pack.status, 0, pack.stderr || pack.stdout);
  const packed = JSON.parse(pack.stdout)[0];
  assert.equal(packed.name, 'components-compass');
  assert.equal(packed.version, '0.1.1');
  const tarball = path.join(temporaryRoot, packed.filename);
  const contents = packed.files.map(({ path: file }) => file).sort();
  const expected = [
    'LICENSE', 'README.md', 'bin/compass.js', 'package.json',
    'src/commands.js', 'src/errors.js', 'src/installer.js', 'src/registry.js',
  ].sort();
  assert.deepEqual(contents, expected, 'tarball must include only the CLI runtime files and package metadata');
  assert.ok(packed.size > 0);

  await mkdir(project);
  const install = await run(process.execPath, [npmCli, 'install', tarball, '--no-audit', '--no-fund', '--offline'], { cwd: project, env: npmEnvironment });
  assert.equal(install.status, 0, install.stderr || install.stdout);
  const installedManifest = JSON.parse(await readFile(path.join(project, 'node_modules', 'components-compass', 'package.json'), 'utf8'));
  assert.deepEqual(installedManifest.bin, { compass: 'bin/compass.js' }, 'installed package must retain its normalized compass executable mapping');
  const executableDir = path.join(project, 'node_modules', '.bin');
  assert.ok(['compass', 'compass.cmd', 'compass.ps1'].some((name) => existsSync(path.join(executableDir, name))), 'npm must install the compass executable shim');
  const ephemeral = await run(process.execPath, [npmCli, 'exec', '--yes', '--offline', `--package=${tarball}`, '--', 'compass', '--version'], { cwd: project, env: npmEnvironment });
  assert.equal(ephemeral.status, 0, ephemeral.stderr || ephemeral.stdout);
  assert.equal(ephemeral.stdout.trim(), '0.1.1', 'npx package mode must execute the compass binary from the tarball');
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/compass-components`;
  const env = {
    ...npmEnvironment,
    npm_config_offline: 'true',
    COMPASS_REGISTRY_URL: `${base}/registry/registry.json`,
    COMPASS_COMPONENTS_BASE_URL: base,
  };
  const commands = [
    ['--version', (result) => assert.equal(result.stdout.trim(), packed.version)],
    ['--help', (result) => assert.match(result.stdout, /compass search <query>/)],
    ['list', (result) => assert.match(result.stdout, /Sidebar/)],
    ['search', 'sidebar', (result) => assert.match(result.stdout, /\[stable\] Sidebar/)],
    ['search', 'planned', (result) => assert.match(result.stdout, /\[planned\]/)],
    ['info', 'sidebar', (result) => assert.match(result.stdout, /ID: sidebar/)],
    ['info', 'tabs', (result) => assert.match(result.stdout, /Status: planned/)],
    ['add', 'sidebar', (result) => assert.match(result.stdout, /compass[\\/]sidebar[\\/]README\.md/)],
  ];
  for (const [command, ...rest] of commands) {
    const verify = rest.at(-1);
    const args = rest.slice(0, -1);
    // `npx` is npm exec; invoking npm's CLI entry directly avoids a shell on Windows.
    const result = await run(process.execPath, [npmCli, 'exec', '--offline', '--', 'compass', command, ...args], { cwd: project, env });
    assert.equal(result.status, 0, `npx compass ${[command, ...args].join(' ')} failed:\n${result.stderr || result.stdout}`);
    assert.equal(result.stderr.trim(), '', `unexpected stderr from compass ${command}`);
    verify(result);
  }

  const installedRoot = path.join(project, 'compass', 'sidebar');
  const installedFiles = [
    'README.md', 'component.json', 'reference/example.html', 'reference/component.css',
    'reference/component.js', 'compass-source.json',
  ];
  for (const file of installedFiles) {
    const text = await readFile(path.join(installedRoot, file), 'utf8');
    assert.ok(text.length > 0, `missing or empty installed file ${file}`);
  }
  const provenance = JSON.parse(await readFile(path.join(installedRoot, 'compass-source.json'), 'utf8'));
  assert.deepEqual(provenance, {
    source: 'TDamiao/compass',
    registryRef: 'v1.1.0',
    component: 'sidebar',
    componentVersion: '1.0.0',
    installedBy: 'components-compass',
    cliVersion: packed.version,
  });
  console.log(`PASS: packed CLI ${packed.version}, ${contents.length} files, ${packed.size} bytes; installed and invoked through npx in ${project}`);
} finally {
  await new Promise((resolve) => server.listening ? server.close(resolve) : resolve());
  await rm(temporaryRoot, { recursive: true, force: true });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, windowsHide: true });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (status) => resolve({ status, stdout, stderr }));
  });
}

function findNpmCli() {
  const nodeDirectory = path.dirname(process.execPath);
  const candidates = [
    process.env.npm_execpath,
    path.join(nodeDirectory, 'node_modules', 'npm', 'bin', 'npm-cli.js'),
    path.resolve(nodeDirectory, '..', 'lib', 'node_modules', 'npm', 'bin', 'npm-cli.js'),
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error('Could not locate npm-cli.js for the installed-package smoke test.');
  return found;
}
