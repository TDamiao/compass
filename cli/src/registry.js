import { CliError } from './errors.js';

const REPOSITORY = 'TDamiao/compass';
const DEFAULT_REF = 'main';
const MAX_REGISTRY_BYTES = 2 * 1024 * 1024;

export function resolveRegistrySource({ env = process.env, ref, registryUrl, componentsBaseUrl } = {}) {
  const selectedRef = ref ?? env.COMPASS_REGISTRY_REF ?? DEFAULT_REF;
  const encodedRef = String(selectedRef).split('/').map(encodeURIComponent).join('/');
  const rawRoot = `https://raw.githubusercontent.com/${REPOSITORY}/${encodedRef}/compass-components`;
  const baseUrl = trimTrailingSlash(componentsBaseUrl ?? env.COMPASS_COMPONENTS_BASE_URL ?? rawRoot);
  const resolvedRegistryUrl = registryUrl ?? env.COMPASS_REGISTRY_URL ?? `${baseUrl}/registry/registry.json`;

  return {
    repository: REPOSITORY,
    ref: selectedRef,
    registryUrl: resolvedRegistryUrl,
    componentsBaseUrl: baseUrl,
  };
}

export async function loadRegistry({ fetchImpl = fetch, source = resolveRegistrySource() } = {}) {
  let response;
  try {
    response = await fetchImpl(source.registryUrl, { headers: { accept: 'application/json' } });
  } catch {
    throw new CliError('Cannot reach the Compass registry. Check your network and try again.');
  }

  if (!response?.ok) {
    const status = response?.status ? ` (HTTP ${response.status})` : '';
    throw new CliError(`Cannot load the Compass registry${status}. Check the registry source and try again.`);
  }

  let text;
  try {
    text = await response.text();
  } catch {
    throw new CliError('The Compass registry response could not be read.');
  }
  if (Buffer.byteLength(text, 'utf8') > MAX_REGISTRY_BYTES) {
    throw new CliError('The Compass registry is larger than the supported limit.');
  }

  let registry;
  try {
    registry = JSON.parse(text);
  } catch {
    throw new CliError('The Compass registry is not valid JSON.');
  }
  validateRegistry(registry);
  return registry;
}

export function validateRegistry(registry) {
  const allowedCategories = new Set(['navigation', 'actions', 'data', 'feedback', 'overlay', 'forms', 'ai']);
  if (!isRecord(registry)
    || registry.schemaVersion !== '1.0.0'
    || registry.name !== 'compass-components'
    || typeof registry.description !== 'string'
    || !registry.description.trim()
    || !Array.isArray(registry.categories)
    || !registry.categories.length
    || !Array.isArray(registry.components)) {
    throw new CliError('The Compass registry does not match the supported registry contract.');
  }

  const categories = new Set();
  for (const category of registry.categories) {
    if (typeof category !== 'string' || !allowedCategories.has(category) || categories.has(category)) {
      throw new CliError('The Compass registry contains an invalid category list.');
    }
    categories.add(category);
  }

  const ids = new Set();
  for (const component of registry.components) {
    if (!isRecord(component)
      || typeof component.id !== 'string'
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(component.id)
      || ids.has(component.id)
      || !nonEmpty(component.name)
      || !nonEmpty(component.description)
      || !/^\d+\.\d+\.\d+$/.test(component.version ?? '')
      || !categories.has(component.category)
      || !['stable', 'draft', 'planned'].includes(component.status)
      || !nonEmpty(component.implementation)
      || !stringList(component.dependencies)
      || !stringList(component.files)) {
      throw new CliError('The Compass registry contains an invalid component entry.');
    }
    ids.add(component.id);

    if (component.status === 'planned') {
      if (component.implementation !== 'none' || component.files.length > 0) {
        throw new CliError(`The planned pattern "${component.id}" must not declare implementation files.`);
      }
      continue;
    }

    if (component.implementation === 'none' || !component.files.length) {
      throw new CliError(`The implemented pattern "${component.id}" has no reference files.`);
    }
    const requiredFiles = [
      `components/${component.id}/README.md`,
      `components/${component.id}/component.json`,
      `components/${component.id}/reference/example.html`,
      `components/${component.id}/reference/component.css`,
    ];
    if (requiredFiles.some((file) => !component.files.includes(file))) {
      throw new CliError(`The implemented pattern "${component.id}" is missing required reference files.`);
    }
    for (const file of component.files) {
      if (!isSafeRegistryPath(file, component.id)) {
        throw new CliError(`The registry contains an unsafe file path for "${component.id}".`);
      }
    }
  }
  return registry;
}

export async function fetchPatternFiles(component, { fetchImpl = fetch, source = resolveRegistrySource() } = {}) {
  const fileContents = new Map();
  for (const file of component.files) {
    const url = `${trimTrailingSlash(source.componentsBaseUrl)}/${file.split('/').map(encodeURIComponent).join('/')}`;
    let response;
    try {
      response = await fetchImpl(url);
    } catch {
      throw new CliError(`Could not download "${file}". Check your network and try again.`);
    }
    if (!response?.ok) {
      throw new CliError(`Reference file unavailable: ${file}${response?.status ? ` (HTTP ${response.status})` : ''}.`);
    }
    let content;
    try {
      content = await response.text();
    } catch {
      throw new CliError(`Reference file could not be read: ${file}.`);
    }
    if (Buffer.byteLength(content, 'utf8') > 1024 * 1024) {
      throw new CliError(`Reference file exceeds the 1 MB safety limit: ${file}.`);
    }
    fileContents.set(file, content);
  }

  const metadataPath = `components/${component.id}/component.json`;
  let metadata;
  try {
    metadata = JSON.parse(fileContents.get(metadataPath));
  } catch {
    throw new CliError(`Component metadata is invalid for "${component.id}".`);
  }
  for (const key of ['id', 'name', 'category', 'status', 'description', 'version', 'implementation', 'dependencies', 'files']) {
    if (JSON.stringify(metadata?.[key]) !== JSON.stringify(component[key])) {
      throw new CliError(`Registry metadata does not match the component files for "${component.id}" (${key}).`);
    }
  }
  return fileContents;
}

function isSafeRegistryPath(file, componentId) {
  return typeof file === 'string'
    && file.length > 0
    && !file.includes('\\')
    && !file.startsWith('/')
    && !/^[a-zA-Z]:/.test(file)
    && file.split('/').every((part) => part && part !== '.' && part !== '..')
    && file.startsWith(`components/${componentId}/`);
}

function stringList(value) {
  return Array.isArray(value)
    && value.every(nonEmpty)
    && new Set(value).size === value.length;
}

function nonEmpty(value) {
  return typeof value === 'string' && Boolean(value.trim());
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function trimTrailingSlash(value) {
  return String(value).replace(/\/+$/, '');
}
