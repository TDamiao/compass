import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl } from '../catalog/src/lib/urls.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const registryPath = path.join(root, 'compass-components', 'registry', 'registry.json');
const foundationsPath = path.join(root, 'compass-components', 'references', 'foundations.md');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const foundations = await readFile(foundationsPath, 'utf8');
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const siteUrl = process.env.VITE_CATALOG_URL;

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeAttribute(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function categoryLabel(value) {
  if (value === 'ai') return 'AI';
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

const routes = [
  ...registry.components.map((component) => ({
    path: `components/${component.id}`,
    title: `${component.name} — Compass Components`,
    description: component.description,
  })),
  ...registry.categories.map((category) => ({
    path: `categories/${category}`,
    title: `${categoryLabel(category)} — Compass Components`,
    description: `Browse ${categoryLabel(category).toLowerCase()} interface patterns in the Compass Components registry.`,
  })),
  ...[...foundations.matchAll(/^##\s+(.+)\s*$/gm)].map(([, title]) => ({
    path: `foundations/${slugify(title)}`,
    title: `${title} foundations — Compass Components`,
    description: `Adaptable ${title.toLowerCase()} roles for existing product design systems.`,
  })),
];

if (siteUrl) {
  const canonical = canonicalUrl(siteUrl);
  const home = html.replace('</head>', `    <link rel="canonical" href="${escapeAttribute(canonical)}">\n  </head>`);
  await writeFile(path.join(dist, 'index.html'), home, 'utf8');
}

for (const route of routes) {
  const directory = path.join(dist, route.path);
  await mkdir(directory, { recursive: true });
  let page = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(route.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttribute(route.description)}">`);
  if (siteUrl) {
    const canonical = canonicalUrl(siteUrl, route.path);
    page = page.replace('</head>', `    <link rel="canonical" href="${escapeAttribute(canonical)}">\n  </head>`);
  }
  await writeFile(path.join(directory, 'index.html'), page, 'utf8');
}

console.log(`Generated ${routes.length} static catalog routes from registry and foundations.`);
