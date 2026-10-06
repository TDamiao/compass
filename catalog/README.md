# Compass Components Catalog

The static discovery interface for the `compass-components` registry. Registry metadata, component guides, reference examples and foundations stay in the sibling bundle as the source of truth; this app loads them during the Vite build and does not maintain a second component list.

## Run locally

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

The build emits a static site to `dist/`. It writes route entry files for each registry component/category and each foundation heading. Local preview normalizes `/components/sidebar` to its directory-index route; a static host must serve directory `index.html` files (or provide its usual trailing-slash redirect). No backend is needed. Publish the contents of `dist/` as a static site.

For a host that serves the site below a path such as `/compass/`, build with a matching base path:

```powershell
$env:CATALOG_BASE = "/compass/"
npm run build
```

The default base is `/`, suitable for a root domain or custom domain. `VITE_CATALOG_URL` may be set to the canonical site origin/path to enable canonical URLs; it is intentionally unset until the catalog has a public URL.

## Source architecture

- `src/lib/registry.js` centralizes registry access, grouping, stats and search.
- `src/lib/content.js` imports component Markdown, existing reference files and foundations directly from `compass-components/`.
- `src/main.js` renders the home, category, foundation, stable and planned routes.
- `scripts/generate-catalog-routes.mjs` creates static route shells from registry IDs and foundation headings.
- `scripts/verify-catalog-build.mjs` checks that the emitted route shells and assets exist.

Stable previews run inside sandboxed iframes. The HTML, CSS and JavaScript are read from the current reference files; inline example CSS and scripts are isolated from the catalog document. Planned entries load neither previews nor source files. Source snippets are syntax-highlighted and can be copied from the component page.

The interface uses Vite without a component framework, plus `markdown-it` and `highlight.js`. There is no API, database, analytics, authentication, CMS or CLI. See the [Vite static deployment guide](https://vite.dev/guide/static-deploy.html) for host-specific settings.
