import { readFile } from 'node:fs/promises';
import { CliError } from './errors.js';
import { installPattern } from './installer.js';
import { loadRegistry, resolveRegistrySource } from './registry.js';

const packageMetadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const CLI_VERSION = packageMetadata.version;

export async function runCli(args, options = {}) {
  const stdout = options.stdout ?? ((message) => console.log(message));
  const stderr = options.stderr ?? ((message) => console.error(message));
  const fetchImpl = options.fetchImpl ?? fetch;
  const cwd = options.cwd ?? process.cwd();

  if (args.length === 1 && ['--help', '-h', 'help'].includes(args[0])) {
    stdout(helpText());
    return 0;
  }
  if (args.length === 1 && ['--version', '-v'].includes(args[0])) {
    stdout(CLI_VERSION);
    return 0;
  }

  const [command, id, ...extra] = args;
  try {
    const source = options.source ?? resolveRegistrySource({ env: options.env ?? process.env });
    if (command === 'list' && id === undefined && extra.length === 0) {
      const registry = await loadRegistry({ fetchImpl, source });
      stdout(formatList(registry));
      return 0;
    }
    if (command === 'search') {
      const query = [id, ...extra].filter((part) => typeof part === 'string').join(' ').trim();
      if (!query) throw new CliError('Usage: compass search <query>');
      const registry = await loadRegistry({ fetchImpl, source });
      const matches = searchComponents(registry, query);
      stdout(matches.length ? formatSearch(query, matches) : `No Compass patterns found for "${query}".`);
      return 0;
    }
    if ((command === 'info' || command === 'add') && id && extra.length === 0) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new CliError('Pattern IDs must use lowercase letters, numbers and hyphens.');
      const registry = await loadRegistry({ fetchImpl, source });
      const component = registry.components.find((entry) => entry.id === id);
      if (!component) throw new CliError(`Pattern not found: ${id}. Run "compass list" to browse available patterns.`);
      if (command === 'info') {
        stdout(formatInfo(component));
        return 0;
      }
      if (component.status !== 'stable') {
        throw new CliError(`${component.name} is ${component.status}. No reference implementation is available yet.`);
      }
      const installed = await installPattern(component, { cwd, fetchImpl, source });
      stdout(`Installed ${component.name} reference pattern to ${installed.files.map((file) => `compass/${id}/${file}`).join(', ')}.\nAdapt it to your product, tokens and project conventions before use.`);
      return 0;
    }
    throw new CliError(`Unknown command or arguments.\n${helpText()}`);
  } catch (error) {
    stderr(error instanceof CliError ? `Error: ${error.message}` : 'Error: Compass could not complete the command. Try again or check the registry source.');
    return error instanceof CliError ? error.code : 1;
  }
}

export function formatList(registry) {
  const lines = ['Compass Components'];
  for (const category of registry.categories) {
    const components = registry.components.filter((component) => component.category === category);
    if (!components.length) continue;
    lines.push('', titleCase(category));
    for (const component of components) {
      const status = component.status === 'stable' ? 'stable' : component.status;
      lines.push(`  ${component.status === 'stable' ? '[stable]' : `[${status}]`} ${component.name}`);
    }
  }
  return lines.join('\n');
}

export function formatInfo(component) {
  const lines = [
    component.name,
    `ID: ${component.id}`,
    `Category: ${titleCase(component.category)}`,
    `Status: ${component.status}`,
    `Version: ${component.version}`,
    `Description: ${component.description}`,
    `Implementation: ${component.implementation}`,
    `Dependencies: ${component.dependencies.length ? component.dependencies.join(', ') : 'none'}`,
  ];
  if (component.status === 'planned') {
    lines.push('Files: none', 'No reference implementation is available yet.');
  } else {
    lines.push('Files available:', ...component.files.map((file) => `  ${file}`));
  }
  return lines.join('\n');
}

export function searchComponents(registry, query) {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';
  if (!normalizedQuery) return [];

  return registry.components
    .map((component, index) => {
      const id = component.id.toLowerCase();
      const name = component.name.toLowerCase();
      const textFields = [id, name, component.description].map((value) => value.toLowerCase());
      const facets = [component.category, component.status].map((value) => value.toLowerCase());
      let rank = 4;
      if (id === normalizedQuery) rank = 0;
      else if (name === normalizedQuery) rank = 1;
      else if (id.startsWith(normalizedQuery)) rank = 2;
      else if (name.startsWith(normalizedQuery)) rank = 3;
      else if (textFields.some((value) => value.includes(normalizedQuery))) rank = 4;
      // Category and status remain searchable without making "table" match "stable".
      else if (facets.some((value) => value === normalizedQuery || value.startsWith(normalizedQuery))) rank = 5;
      else return null;
      return { component, index, rank };
    })
    .filter(Boolean)
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map(({ component }) => component);
}

function formatSearch(query, matches) {
  const lines = [`Search results for "${query}"`];
  for (const component of matches) {
    const status = component.status === 'stable' ? '[stable]' : `[${component.status}]`;
    lines.push(`  ${status} ${component.name} — ${titleCase(component.category)}`);
    lines.push(`    ${component.description}`);
  }
  return lines.join('\n');
}

function helpText() {
  return [
    'Compass Components',
    '',
    'Usage:',
    '  compass list',
    '  compass search <query>',
    '  compass info <component>',
    '  compass add <component>',
    '',
    'Commands:',
    '  list    List available patterns',
    '  search <query>    Search available patterns',
    '  info    Inspect a pattern',
    '  add     Add a reference pattern',
    '',
    'Options:',
    '  --help',
    '  --version',
  ].join('\n');
}

function titleCase(value) {
  if (value === 'ai') return 'AI';
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}
