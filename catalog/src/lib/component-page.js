export function buildComponentPageModel(component, contentSource) {
  if (!component || component.status !== 'stable') {
    return { component, guide: null, examples: null, metadata: null };
  }
  return {
    component,
    guide: contentSource.getGuide(component.id),
    examples: contentSource.getExamples(component.id),
    metadata: contentSource.getMetadata(component.id),
  };
}
