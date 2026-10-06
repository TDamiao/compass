import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const repositoryRoot = path.dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(path.join(repositoryRoot, 'compass-components', 'registry', 'registry.json'), 'utf8'));
const foundationDocument = readFileSync(path.join(repositoryRoot, 'compass-components', 'references', 'foundations.md'), 'utf8');
const base = process.env.CATALOG_BASE || '/';

function slugify(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const knownRoutes = new Set([
  ...registry.components.map((component) => `components/${component.id}`),
  ...registry.categories.map((category) => `categories/${category}`),
  ...[...foundationDocument.matchAll(/^##\s+(.+)\s*$/gm)].map(([, title]) => `foundations/${slugify(title)}`),
]);

function getCatalogRoute(requestUrl) {
  const url = new URL(requestUrl, 'http://catalog.local');
  let pathname = url.pathname;
  if (base !== '/') {
    if (!pathname.startsWith(base)) return null;
    pathname = pathname.slice(base.length);
  } else {
    pathname = pathname.replace(/^\//, '');
  }
  return { url, route: pathname.replace(/\/+$/, '') };
}

const catalogRoutePlugin = {
  name: 'compass-catalog-routes',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      if (!request.url || request.method !== 'GET') return next();
      const match = getCatalogRoute(request.url);
      if (match && knownRoutes.has(match.route)) {
        request.url = `${base}index.html${match.url.search}`;
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      if (!request.url || !['GET', 'HEAD'].includes(request.method)) return next();
      const match = getCatalogRoute(request.url);
      const hadTrailingSlash = match?.url.pathname.endsWith('/');
      if (match && knownRoutes.has(match.route) && !hadTrailingSlash) {
        response.statusCode = 308;
        response.setHeader('Location', `${match.url.pathname}/${match.url.search}`);
        response.end();
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  root: path.join(repositoryRoot, 'catalog'),
  base,
  appType: 'mpa',
  plugins: [catalogRoutePlugin],
  build: {
    outDir: path.join(repositoryRoot, 'dist'),
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    host: '127.0.0.1',
    open: false,
  },
});
