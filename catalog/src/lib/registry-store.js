export function createRegistryStore(registry) {
  const components = Array.isArray(registry?.components) ? registry.components : [];

  function loadRegistry() {
    return registry;
  }

  function getComponents() {
    return [...components];
  }

  function getComponent(id) {
    return components.find((component) => component.id === id) ?? null;
  }

  function getComponentsByCategory(category) {
    return components.filter((component) => component.category === category);
  }

  function getStableComponents() {
    return components.filter((component) => component.status === 'stable');
  }

  function getStats() {
    return components.reduce((stats, component) => {
      stats.total += 1;
      stats[component.status] = (stats[component.status] ?? 0) + 1;
      return stats;
    }, { total: 0, stable: 0, planned: 0, draft: 0 });
  }

  function searchComponents(query, guidance = {}) {
    const term = normalizeSearch(query);
    if (!term) return [];
    return components.filter((component) => {
      const searchable = [
        component.id,
        component.name,
        component.category,
        component.description,
        guidance[component.id] ?? '',
      ].join(' ');
      return normalizeSearch(searchable).includes(term);
    });
  }

  return {
    loadRegistry,
    getComponents,
    getComponent,
    getComponentsByCategory,
    getStableComponents,
    getStats,
    searchComponents,
  };
}

function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();
}
