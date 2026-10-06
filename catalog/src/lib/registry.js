import registrySource from '../../../compass-components/registry/registry.json';
import { createRegistryStore } from './registry-store.js';

export { createRegistryStore } from './registry-store.js';

export const registryStore = createRegistryStore(registrySource);
export const {
  loadRegistry,
  getComponents,
  getComponent,
  getComponentsByCategory,
  getStableComponents,
  getStats,
  searchComponents,
} = registryStore;
