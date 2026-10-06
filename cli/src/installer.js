import { lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CliError } from './errors.js';
import { fetchPatternFiles } from './registry.js';

export async function installPattern(component, { cwd = process.cwd(), fetchImpl = fetch, source }) {
  const outputRoot = path.resolve(cwd, 'compass');
  const destination = path.resolve(outputRoot, component.id);
  if (!isInside(outputRoot, destination)) {
    throw new CliError('The component destination is outside the Compass output directory.');
  }

  await assertNotSymlink(outputRoot, 'The "compass" output path cannot be a symbolic link.');
  try {
    await lstat(destination);
    throw new CliError(`${component.name} already exists at ${path.relative(cwd, destination)}. No files were changed.`);
  } catch (error) {
    if (error instanceof CliError) throw error;
    if (error.code !== 'ENOENT') throw new CliError(`Cannot inspect the destination: ${error.message}`);
  }

  const files = await fetchPatternFiles(component, { fetchImpl, source });
  const metadata = JSON.parse(files.get(`components/${component.id}/component.json`));
  const manifest = {
    source: 'TDamiao/compass',
    component: component.id,
    version: component.version,
    registryRef: source?.ref ?? 'main',
  };

  let created = false;
  try {
    await mkdir(outputRoot, { recursive: true });
    await assertNotSymlink(outputRoot, 'The "compass" output path cannot be a symbolic link.');
    await mkdir(destination);
    created = true;
    for (const [registryPath, content] of files) {
      const relativePath = registryPath.slice(`components/${component.id}/`.length);
      const target = path.resolve(destination, ...relativePath.split('/'));
      if (!isInside(destination, target)) {
        throw new CliError(`Unsafe destination path in registry: ${registryPath}.`);
      }
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content, { flag: 'wx' });
    }
    await writeFile(path.join(destination, 'compass-source.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
  } catch (error) {
    if (created) await rm(destination, { recursive: true, force: true }).catch(() => {});
    if (error instanceof CliError) throw error;
    throw new CliError(`Could not write ${path.relative(cwd, destination)}: ${error.message}`);
  }

  const installedFiles = [...files.keys()].map((file) => file.slice(`components/${component.id}/`.length)).concat('compass-source.json');
  return { destination, files: installedFiles, metadata };
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
