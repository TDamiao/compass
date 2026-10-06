export function normalizeBasePath(value = '/') {
  const path = String(value || '/').trim();
  const rooted = path.startsWith('/') ? path : `/${path}`;
  const normalized = rooted.replace(/\/{2,}/g, '/');
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

export function routeHref(basePath, route = '') {
  const base = normalizeBasePath(basePath);
  const suffix = String(route).replace(/^\/+|\/+$/g, '');
  return suffix ? `${base}${suffix}/` : base;
}

export function canonicalUrl(siteUrl, route = '') {
  if (!siteUrl) return null;
  const base = new URL(siteUrl);
  if (!['http:', 'https:'].includes(base.protocol)) throw new TypeError('Catalog canonical URL must use HTTP or HTTPS.');
  base.pathname = normalizeBasePath(base.pathname);
  base.search = '';
  base.hash = '';
  return new URL(routeHref(base.pathname, route).slice(base.pathname.length), base).href;
}
