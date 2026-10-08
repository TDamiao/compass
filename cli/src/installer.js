import { lstat, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CliError } from './errors.js';
import { fetchPatternFiles } from './registry.js';

const packageMetadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

export async function installPattern(component, { cwd = process.cwd(), fetchImpl = fetch, source }) {
  const outputRoot = path.resolve(cwd, 'compass');
  const destination = path.resolve(outputRoot, component.id);
  if (!isInside(outputRoot, destination)) {
    throw new CliError('The component destination is outside the Compass output directory.');
  }

  await assertNotSymlink(outputRoot, 'The "compass" output path cannot be a symbolic link.');
  await assertDestinationAbsent(destination, component.name, cwd);

  const files = await fetchPatternFiles(component, { fetchImpl, source });
  const metadata = JSON.parse(files.get(`components/${component.id}/component.json`));
  const manifest = {
    source: source?.repository ?? 'TDamiao/compass',
    registryRef: source?.ref ?? 'unknown',
    component: component.id,
    componentVersion: component.version,
    installedBy: packageMetadata.name,
    cliVersion: packageMetadata.version,
  };

  let staging;
  try {
    await mkdir(outputRoot, { recursive: true });
    await assertNotSymlink(outputRoot, 'The "compass" output path cannot be a symbolic link.');
    staging = await mkdtemp(path.join(outputRoot, `.${component.id}-`));
    for (const [registryPath, content] of files) {
      const relativePath = registryPath.slice(`components/${component.id}/`.length);
      const target = path.resolve(staging, ...relativePath.split('/'));
      if (!isInside(staging, target)) {
        throw new CliError(`Unsafe destination path in registry: ${registryPath}.`);
      }
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content, { flag: 'wx' });
    }
    await writeFile(path.join(staging, 'compass-source.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
    await assertDestinationAbsent(destination, component.name, cwd);
    await rename(staging, destination);
    staging = undefined;
  } catch (error) {
    if (staging) await rm(staging, { recursive: true, force: true }).catch(() => {});
    if (error instanceof CliError) throw error;
    if (error.code === 'EEXIST' || error.code === 'ENOTEMPTY') {
      throw new CliError(`${component.name} already exists at ${path.relative(cwd, destination)}. No files were changed.`);
    }
    throw new CliError(`Could not write ${path.relative(cwd, destination)}: ${error.message}`);
  }

  const installedFiles = [...files.keys()].map((file) => file.slice(`components/${component.id}/`.length)).concat('compass-source.json');
  return { destination, files: installedFiles, metadata };
}

async function assertDestinationAbsent(destination, name, cwd) {
  try {
    await lstat(destination);
    throw new CliError(`${name} already exists at ${path.relative(cwd, destination)}. No files were changed.`);
  } catch (error) {
    if (error instanceof CliError) throw error;
    if (error.code !== 'ENOENT') throw new CliError(`Cannot inspect the destination: ${error.message}`);
  }
}

async function assertNotSymlink(target, message) {
  try {
    if ((await lstat(target)).isSymbolicLink()) throw new CliError(message);
  } catch (error) {
    if (error instanceof CliError) throw error;
    if (error.code !== 'ENOENT') throw new CliError(`Cannot inspect the output path: ${error.message}`);
  }
}

function isInside(parent, target) {
  const relative = path.relative(parent, target);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
