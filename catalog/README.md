# Compass Components Catalog

The static discovery interface for the `compass-components` registry. Registry metadata, component guides, reference examples and foundations stay in the sibling bundle as the source of truth; this app loads them during the Vite build and does not maintain a second component list.

## Development and validation

From the repository root:

```bash
npm install
npm run dev
```

Vite prints the local address. The catalog also supports:

```bash
npm test
npm run build
npm run preview
```

The build emits a static site to `dist/`. It writes route entry files for each registry component/category and each foundation heading. No backend is needed. `dist/` is generated during validation and deployment and stays out of Git.

For GitHub Pages at `https://tdamiao.github.io/compass/`, the Actions workflow builds with the matching base path and canonical URL. For another host serving the site below a path, configure both values to match:

```powershell
$env:CATALOG_BASE = "/compass/"
$env:VITE_CATALOG_URL = "https://tdamiao.github.io/compass/"
npm run build
```

The default base is `/`, suitable for local development or a root domain. Without `VITE_CATALOG_URL`, pages do not emit canonical links.

## GitHub Pages deployment

`.github/workflows/catalog-pages.yml` runs on pushes to `main` and supports manual runs with `workflow_dispatch`. It installs the lockfile with `npm ci`, runs `npm test`, builds with `/compass/` and the public URL, then uploads and deploys `dist/` using GitHub's Pages Actions. No deploy secret or custom domain is required.

For the first deployment, set the repository's Pages source to **GitHub Actions** in **Settings → Pages → Build and deployment → Source**. After that, successful pushes to `main` publish automatically. The expected URL is `https://tdamiao.github.io/compass/`.

Every component, category and foundation has a generated directory `index.html`, so direct requests resolve on GitHub Pages without relying on a client-side SPA fallback. Navigation links include the configured base and a trailing slash; canonical URLs are generated from the public base plus the logical route.

## Source architecture

- `src/lib/registry.js` centralizes registry access, grouping, stats and search.
- `src/lib/content.js` imports component Markdown, existing reference files and foundations directly from `compass-components/`.
- `src/main.js` renders the home, category, foundation, stable and planned routes.
- `scripts/generate-catalog-routes.mjs` creates static route shells from registry IDs and foundation headings.
- `scripts/verify-catalog-build.mjs` checks that the emitted route shells and assets exist.

Stable previews run inside sandboxed iframes. The HTML, CSS and JavaScript are read from the current reference files; inline example CSS and scripts are isolated from the catalog document. Planned entries load neither previews nor source files. Source snippets are syntax-highlighted and can be copied from the component page.

The interface uses Vite without a component framework, plus `markdown-it` and `highlight.js`. There is no API, database, analytics, authentication, CMS or CLI. See the [Vite static deployment guide](https://vite.dev/guide/static-deploy.html) for host-specific settings.
