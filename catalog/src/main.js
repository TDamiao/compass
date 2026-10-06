import './style.css';
import 'highlight.js/styles/github.css';
import { escapeHtml, highlightSource, removeDocumentTitle, renderMarkdown } from './lib/markdown.js';
import { buildComponentPageModel } from './lib/component-page.js';
import { canonicalUrl, routeHref } from './lib/urls.js';
import {
  getComponent,
  getComponents,
  getComponentsByCategory,
  getStableComponents,
  getStats,
  loadRegistry,
  searchComponents,
} from './lib/registry.js';
import {
  getAiCategoryIntroduction,
  getComponentExamples,
  getComponentGuide,
  getComponentMetadata,
  getFoundationIntroduction,
  getFoundationSection,
  getFoundationSections,
  slugify,
  splitMarkdownSections,
} from './lib/content.js';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const root = document.querySelector('#app');
const registry = loadRegistry();
const categories = registry.categories;
const foundations = getFoundationSections();
const guidesForSearch = Object.fromEntries(
  getComponents().map((component) => [component.id, getComponentGuide(component.id)]),
);

function href(route = '') {
  return routeHref(baseUrl, route);
}

function parseRoute() {
  let path = window.location.pathname;
  if (baseUrl !== '/' && path.startsWith(baseUrl)) path = path.slice(baseUrl.length);
  path = path.replace(/^\/+|\/+$/g, '');
  const [section, id] = path.split('/');
  if (!section) return { type: 'home' };
  if (section === 'components' && id) return { type: 'component', id };
  if (section === 'categories' && id) return { type: 'category', id };
  if (section === 'foundations' && id) return { type: 'foundation', id };
  return { type: 'not-found' };
}

function categoryLabel(category) {
  if (category === 'ai') return 'AI';
  return category.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function statusLabel(status) {
  return status === 'stable' ? 'Stable' : categoryLabel(status);
}

function renderSidebar() {
  const categorySections = categories.map((category) => {
    const components = getComponentsByCategory(category);
    const links = components.map((component) => `
      <li>
        <a class="sidebar-link" href="${href(`components/${component.id}`)}">
          <span>${escapeHtml(component.name)}</span>
          ${component.status === 'stable' ? '' : `<span class="sidebar-status">${escapeHtml(statusLabel(component.status))}</span>`}
        </a>
      </li>`).join('');
    return `
      <section class="sidebar-group" aria-labelledby="nav-${escapeHtml(category)}">
        <h2 id="nav-${escapeHtml(category)}"><a href="${href(`categories/${category}`)}">${escapeHtml(categoryLabel(category))}</a></h2>
        <ul>${links}</ul>
      </section>`;
  }).join('');

  const foundationLinks = foundations.map((foundation) => {
    const id = slugify(foundation.title);
    return `<li><a class="sidebar-link" href="${href(`foundations/${id}`)}">${escapeHtml(foundation.title)}</a></li>`;
  }).join('');

  return `
    <aside class="sidebar" id="catalog-nav" aria-label="Catalog navigation">
      <button class="sidebar-close" type="button" data-menu-close>Close navigation</button>
      <nav>
        <a class="sidebar-home" href="${href()}">Catalog overview</a>
        <section class="sidebar-group" aria-labelledby="nav-foundations">
          <h2 id="nav-foundations">Foundations</h2>
          <ul>${foundationLinks}</ul>
        </section>
        ${categorySections}
      </nav>
      <div class="sidebar-layers" aria-label="Compass layers">
        <span>Compass <small>Product decisions</small></span>
        <span>Interface <small>Visual decisions</small></span>
        <span aria-current="page">Components <small>Reusable patterns</small></span>
      </div>
    </aside>`;
}

function renderShell(content) {
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="topbar">
      <div class="brand-area">
        <button class="icon-button menu-toggle" type="button" aria-label="Open catalog navigation" aria-expanded="false" aria-controls="catalog-nav" data-menu-toggle>
          <span aria-hidden="true">☰</span>
        </button>
        <a class="brand" href="${href()}" aria-label="Compass Components home">
          <span class="brand-mark" aria-hidden="true">C</span>
          <span><strong>Compass Components</strong><small>Reusable product interface patterns</small></span>
        </a>
      </div>
      <div class="top-actions">
        <div class="search-wrap" role="search">
          <label class="visually-hidden" for="catalog-search">Search patterns</label>
          <input id="catalog-search" type="search" autocomplete="off" placeholder="Search components…" aria-controls="search-results" aria-describedby="search-status">
          <span class="search-shortcut" aria-hidden="true">/</span>
          <div class="search-results" id="search-results" hidden></div>
          <p class="visually-hidden" id="search-status" role="status" aria-live="polite"></p>
        </div>
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Color theme: system">System</button>
      </div>
    </header>
    <div class="page-layout">
      <div class="nav-scrim" aria-hidden="true" hidden data-nav-scrim></div>
      ${renderSidebar()}
      <main class="main-content" id="main-content" tabindex="-1">${content}</main>
    </div>
    <footer class="site-footer">
      <span>Compass Components is the pattern catalog for the Compass product intelligence ecosystem.</span>
      <a href="https://github.com/TDamiao/compass/tree/main/compass-components">View source bundle</a>
    </footer>`;
}

function renderStatus(status) {
  const className = status === 'stable' ? 'stable' : 'planned';
  return `<span class="status status-${className}"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(statusLabel(status))}</span>`;
}

function renderComponentList(components) {
  if (!components.length) return '<p class="quiet-note">No patterns are listed in this category yet.</p>';
  return `<ul class="pattern-list">${components.map((component) => `
    <li>
      <a href="${href(`components/${component.id}`)}">
        <span class="pattern-list-copy"><strong>${escapeHtml(component.name)}</strong><span>${escapeHtml(component.description)}</span></span>
        ${component.status === 'stable' ? '<span class="list-status stable-text">Stable</span>' : `<span class="list-status">${escapeHtml(statusLabel(component.status))}</span>`}
      </a>
    </li>`).join('')}
  </ul>`;
}

function renderHome() {
  const stats = getStats();
  const categoryLinks = categories.map((category) => {
    const components = getComponentsByCategory(category);
    const stableCount = components.filter((component) => component.status === 'stable').length;
    return `
      <li><a href="${href(`categories/${category}`)}">
        <span><strong>${escapeHtml(categoryLabel(category))}</strong><small>${components.length} ${components.length === 1 ? 'pattern' : 'patterns'}</small></span>
        <span class="category-meta">${stableCount} stable <span aria-hidden="true">→</span></span>
      </a></li>`;
  }).join('');

  return `
    <div class="content-wrap home-page">
      <p class="eyebrow">Compass / Components</p>
      <h1>Reusable patterns, chosen with product judgment.</h1>
      <p class="lead">Production-oriented interface patterns with guidance on when they fit, how they behave, and how to adapt them to an existing product.</p>
      <div class="registry-stats" aria-label="Registry summary">
        <div><strong>${stats.total}</strong><span>patterns</span></div>
        <div><strong>${stats.stable}</strong><span>stable</span></div>
        <div><strong>${stats.planned}</strong><span>planned</span></div>
      </div>
      <section class="home-section" aria-labelledby="browse-heading">
        <div class="section-heading"><div><p class="eyebrow">Browse</p><h2 id="browse-heading">Categories</h2></div></div>
        <ul class="category-list">${categoryLinks}</ul>
      </section>
      <section class="home-section" aria-labelledby="stable-heading">
        <div class="section-heading"><div><p class="eyebrow">Implemented</p><h2 id="stable-heading">Stable patterns</h2></div><span class="section-count">${stats.stable} references</span></div>
        ${renderComponentList(getStableComponents())}
      </section>
      <section class="layer-note" aria-labelledby="sequence-heading">
        <p class="eyebrow">How the layers connect</p>
        <h2 id="sequence-heading">Need → Pattern → Adaptation → Implementation → Validation</h2>
        <p>Compass frames product decisions. Compass Interface shapes their visual expression. Compass Components helps teams adapt an appropriate reusable pattern to the project they already have.</p>
      </section>
    </div>`;
}

function renderCategory(id) {
  if (!categories.includes(id)) return renderNotFound();
  const components = getComponentsByCategory(id);
  const aiIntroduction = id === 'ai'
    ? `<div class="prose ai-principles">${renderMarkdown(getAiCategoryIntroduction())}</div>`
    : '';
  return `
    <div class="content-wrap category-page">
      ${renderBreadcrumbs([{ label: 'Categories', href: href() }, { label: categoryLabel(id) }])}
      <p class="eyebrow">Category</p>
      <h1>${escapeHtml(categoryLabel(id))}</h1>
      <p class="lead">${components.length} ${components.length === 1 ? 'pattern' : 'patterns'} in this category.</p>
      ${aiIntroduction}
      ${renderComponentList(components)}
    </div>`;
}

function renderBreadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.map((item) => `<li>${item.href ? `<a href="${item.href}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`}</li>`).join('')}</ol></nav>`;
}

function renderComponent(id) {
  const component = getComponent(id);
  if (!component) return renderNotFound();
  const page = buildComponentPageModel(component, {
    getGuide: getComponentGuide,
    getExamples: getComponentExamples,
    getMetadata: getComponentMetadata,
  });
  const top = `
    ${renderBreadcrumbs([{ label: 'Components', href: href() }, { label: categoryLabel(component.category), href: href(`categories/${component.category}`) }, { label: component.name }])}
    <header class="component-header">
      <p class="eyebrow">${escapeHtml(categoryLabel(component.category))}</p>
      <div class="title-line"><h1>${escapeHtml(component.name)}</h1>${renderStatus(component.status)}</div>
      <p class="lead">${escapeHtml(component.description)}</p>
    </header>`;

  if (component.status === 'planned') {
    return `<div class="content-wrap component-page">${top}
      <section class="planned-panel" aria-labelledby="planned-heading">
        <p class="eyebrow">Roadmap</p><h2 id="planned-heading">Planned pattern</h2>
        <p>This pattern is part of the Compass Components roadmap but does not yet have a reference implementation.</p>
        <dl><div><dt>Intended category</dt><dd>${escapeHtml(categoryLabel(component.category))}</dd></div><div><dt>Planned guidance</dt><dd>${escapeHtml(component.description)}</dd></div></dl>
      </section>
      <p class="quiet-note">No preview or source files are published for this entry.</p>
    </div>`;
  }

  const guide = page.guide;
  const sections = splitMarkdownSections(removeDocumentTitle(guide)).sections;
  const examples = page.examples;
  return `<div class="content-wrap component-page">
      ${top}
      <section class="preview-section" aria-labelledby="preview-heading">
        <div class="section-heading"><div><p class="eyebrow">Live example</p><h2 id="preview-heading">Preview</h2></div>
          <div class="viewport-controls" role="group" aria-label="Preview viewport width">
            <button type="button" data-preview-width="100%" aria-pressed="true">Desktop</button>
            <button type="button" data-preview-width="768px" aria-pressed="false">Tablet</button>
            <button type="button" data-preview-width="390px" aria-pressed="false">Mobile</button>
          </div>
        </div>
        <div class="preview-canvas" data-preview-canvas><iframe class="component-preview" title="Interactive ${escapeHtml(component.name)} reference preview" loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts" data-component-preview></iframe></div>
        <p class="preview-caption">Interactive reference example, isolated from the catalog. Use the controls to change its viewport width.</p>
      </section>
      <div class="component-documentation">
        ${sections.map((section) => {
          const agentSection = section.title.toLowerCase().startsWith('ai agent guidance');
          return `<section class="doc-section${agentSection ? ' agent-guidance' : ''}" aria-label="${escapeHtml(section.title)}"><div class="prose">${renderMarkdown(section.markdown, { componentId: component.id })}</div></section>`;
        }).join('')}
      </div>
      ${renderSource(examples, component.id, page.metadata)}
    </div>`;
}

function renderSource(examples, id, metadata) {
  const sourceFiles = [
    { file: 'example.html', title: 'HTML', language: 'html', anchor: 'source-example-html' },
    { file: 'component.css', title: 'CSS', language: 'css', anchor: 'source-component-css' },
    { file: 'component.js', title: 'JavaScript', language: 'javascript', anchor: 'source-component-js' },
  ].filter((source) => typeof examples[source.file] === 'string');

  const entries = sourceFiles.map((source, index) => `
    <details class="source-file" id="${source.anchor}" ${index === 0 ? 'open' : ''}>
      <summary><span>${source.title}</span><code>${source.file}</code></summary>
      <div class="source-body">
        <div class="source-tools"><span>Reference source</span><button type="button" class="copy-button" data-copy-file="${source.file}">Copy ${source.title}</button></div>
        <pre><code class="hljs language-${source.language}">${highlightSource(examples[source.file], source.language)}</code></pre>
        <textarea class="visually-hidden" readonly tabindex="-1" aria-hidden="true" data-source-value="${source.file}">${escapeHtml(examples[source.file])}</textarea>
      </div>
    </details>`).join('');

  const dependencies = metadata?.dependencies?.length ? metadata.dependencies.join(', ') : 'None';
  const implementation = metadata?.implementation?.replaceAll('-', ' ') ?? 'reference';
  return `<section class="source-section" id="reference-source" aria-labelledby="source-heading">
    <div class="section-heading"><div><p class="eyebrow">Reference implementation</p><h2 id="source-heading">Source</h2></div></div>
    <p class="source-note">This is the catalog's framework-neutral reference example (${escapeHtml(implementation)}). Runtime dependencies: ${escapeHtml(dependencies)}. It is not an installable package or a promise of a project-specific API.</p>
    ${entries}
  </section>`;
}

function renderFoundation(id) {
  const section = getFoundationSection(id);
  if (!section) return renderNotFound();
  const intro = getFoundationIntroduction();
  return `<div class="content-wrap foundation-page">
    ${renderBreadcrumbs([{ label: 'Foundations', href: href() }, { label: section.title }])}
    <p class="eyebrow">Adaptable foundations</p>
    <h1>${escapeHtml(section.title)}</h1>
    <div class="prose foundation-intro">${renderMarkdown(intro)}</div>
    <div class="prose foundation-content">${renderMarkdown(section.markdown)}</div>
  </div>`;
}

function renderNotFound() {
  return `<div class="content-wrap not-found"><p class="eyebrow">Catalog</p><h1>Page not found</h1><p class="lead">This route does not match a pattern, category or foundation in the current registry.</p><a class="text-link" href="${href()}">Return to the catalog overview</a></div>`;
}

function updateMetadata(route) {
  let title = 'Compass Components — Product interface patterns';
  let description = 'Explore reusable interface patterns with product guidance, accessible behavior, responsive previews and reference source.';
  if (route.type === 'component') {
    const component = getComponent(route.id);
    if (component) {
      title = `${component.name} — Compass Components`;
      description = component.description;
    }
  } else if (route.type === 'category' && categories.includes(route.id)) {
    title = `${categoryLabel(route.id)} — Compass Components`;
    description = `Browse ${categoryLabel(route.id).toLowerCase()} interface patterns in the Compass Components registry.`;
  } else if (route.type === 'foundation') {
    const section = getFoundationSection(route.id);
    if (section) {
      title = `${section.title} foundations — Compass Components`;
      description = `Adaptable ${section.title.toLowerCase()} roles for existing product design systems.`;
    }
  }
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);

  const siteUrl = import.meta.env.VITE_CATALOG_URL;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (siteUrl && route.type !== 'not-found') {
    const routePath = route.type === 'component' ? `components/${route.id}`
      : route.type === 'category' ? `categories/${route.id}`
        : route.type === 'foundation' ? `foundations/${route.id}` : '';
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = canonicalUrl(siteUrl, routePath);
  } else {
    canonical?.remove();
  }
}

function mountPreview(componentId) {
  const frame = document.querySelector('[data-component-preview]');
  if (!frame) return;
  const examples = getComponentExamples(componentId);
  const html = examples['example.html'];
  const css = examples['component.css'];
  const javascript = examples['component.js'] ?? '';
  if (!html || !css) return;

  const policy = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; connect-src \'none\'; form-action \'none\'; frame-src \'none\'; object-src \'none\'; base-uri \'none\'">';
  let preview = html
    .replace(/<link\b[^>]*href=["']component\.css["'][^>]*>/i, '')
    .replace(/<script\b[^>]*src=["']component\.js["'][^>]*>\s*<\/script>/i, '');
  preview = preview.replace(/<head(\s[^>]*)?>/i, (match) => `${match}${policy}<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`);
  if (javascript) {
    preview = preview.replace(/<\/body>/i, `<script>${javascript.replace(/<\/script/gi, '<\\/script')}</script></body>`);
  }
  frame.srcdoc = preview;

  document.querySelectorAll('[data-preview-width]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.previewWidth;
      frame.style.width = selected;
      document.querySelectorAll('[data-preview-width]').forEach((option) => {
        option.setAttribute('aria-pressed', String(option === button));
      });
    });
  });
}

function bindSourceCopy() {
  document.querySelectorAll('[data-copy-file]').forEach((button) => {
    button.addEventListener('click', async () => {
      const file = button.dataset.copyFile;
      const source = document.querySelector(`[data-source-value="${file}"]`)?.value;
      const initialLabel = `Copy ${button.textContent.replace(/^Copy\s+/, '')}`;
      try {
        await navigator.clipboard.writeText(source ?? '');
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy unavailable';
      }
      window.setTimeout(() => { button.textContent = initialLabel; }, 1800);
    });
  });
}

function bindSearch() {
  const input = document.querySelector('#catalog-search');
  const panel = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  if (!input || !panel || !status) return;

  function closeResults() {
    panel.hidden = true;
  }

  input.addEventListener('input', () => {
    const query = input.value.trim();
    if (!query) {
      closeResults();
      status.textContent = '';
      return;
    }
    const results = searchComponents(query, guidesForSearch);
    status.textContent = results.length === 1 ? '1 pattern found.' : `${results.length} patterns found.`;
    const shown = results.slice(0, 12);
    panel.innerHTML = shown.length
      ? `<ul>${shown.map((component) => `<li><a href="${href(`components/${component.id}`)}"><span><strong>${escapeHtml(component.name)}</strong><small>${escapeHtml(categoryLabel(component.category))}</small></span>${component.status === 'stable' ? '' : `<span class="sidebar-status">${escapeHtml(statusLabel(component.status))}</span>`}</a></li>`).join('')}</ul>${results.length > shown.length ? `<p class="search-more">Showing ${shown.length} of ${results.length}; refine your search.</p>` : ''}`
      : '<p class="search-empty">No patterns match that search.</p>';
    panel.hidden = false;
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      input.value = '';
      closeResults();
      status.textContent = '';
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('.search-wrap')) closeResults();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
      && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      input.focus();
    }
  });
}

function bindMobileNavigation() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const closeButton = document.querySelector('[data-menu-close]');
  const navigation = document.querySelector('#catalog-nav');
  const scrim = document.querySelector('[data-nav-scrim]');
  const header = document.querySelector('.topbar');
  const main = document.querySelector('#main-content');
  const footer = document.querySelector('.site-footer');
  if (!toggle || !closeButton || !navigation || !scrim || !header || !main || !footer) return;
  const mobile = window.matchMedia('(max-width: 52rem)');

  function close(restoreFocus = false) {
    navigation.classList.remove('is-open');
    scrim.hidden = true;
    header.inert = false;
    main.inert = false;
    footer.inert = false;
    document.body.classList.remove('navigation-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open catalog navigation');
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const open = !navigation.classList.contains('is-open');
    navigation.classList.toggle('is-open', open);
    scrim.hidden = !open;
    header.inert = open;
    main.inert = open;
    footer.inert = open;
    document.body.classList.toggle('navigation-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close catalog navigation' : 'Open catalog navigation');
    if (open) closeButton.focus();
  });
  closeButton.addEventListener('click', () => close(true));
  scrim.addEventListener('pointerdown', () => close(true));
  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close(true);
    if (event.key !== 'Tab') return;
    const focusable = [...navigation.querySelectorAll('a[href], button:not([disabled])')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) close();
  });
  mobile.addEventListener('change', (event) => {
    if (!event.matches) close();
  });
}

function bindTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  const options = ['system', 'light', 'dark'];
  let current = 'system';
  try {
    current = localStorage.getItem('compass-catalog-theme') || 'system';
  } catch {
    // System preference remains the fallback when storage is unavailable.
  }
  if (!options.includes(current)) current = 'system';

  function applyTheme() {
    if (current === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = current;
    toggle.textContent = current.charAt(0).toUpperCase() + current.slice(1);
    toggle.setAttribute('aria-label', `Color theme: ${current}`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', current === 'dark' ? '#171a1d' : '#f5f6f3');
  }

  applyTheme();
  toggle.addEventListener('click', () => {
    current = options[(options.indexOf(current) + 1) % options.length];
    try { localStorage.setItem('compass-catalog-theme', current); } catch { /* Keep this session's choice. */ }
    applyTheme();
  });
}

function render() {
  const route = parseRoute();
  let content;
  switch (route.type) {
    case 'home': content = renderHome(); break;
    case 'component': content = renderComponent(route.id); break;
    case 'category': content = renderCategory(route.id); break;
    case 'foundation': content = renderFoundation(route.id); break;
    default: content = renderNotFound();
  }
  root.innerHTML = renderShell(content);
  updateMetadata(route);
  if (route.type === 'component' && getComponent(route.id)?.status === 'stable') mountPreview(route.id);
  bindSearch();
  bindSourceCopy();
  bindMobileNavigation();
  bindTheme();
}

render();
