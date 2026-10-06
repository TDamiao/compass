const guides = import.meta.glob('../../../compass-components/components/*/README.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const examples = import.meta.glob('../../../compass-components/components/*/reference/*', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const metadataFiles = import.meta.glob('../../../compass-components/components/*/component.json', {
  eager: true,
  import: 'default',
});

const foundationFiles = import.meta.glob('../../../compass-components/references/foundations.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const aiFiles = import.meta.glob('../../../compass-components/references/ai-patterns.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function findRawFile(files, suffix) {
  const entry = Object.entries(files).find(([path]) => path.endsWith(suffix));
  return typeof entry?.[1] === 'string' ? entry[1] : '';
}

export function getComponentGuide(id) {
  return findRawFile(guides, `/components/${id}/README.md`);
}

export function getComponentMetadata(id) {
  const entry = Object.entries(metadataFiles).find(([path]) => path.endsWith(`/components/${id}/component.json`));
  return entry?.[1] ?? null;
}

export function getComponentExamples(id) {
  const prefix = `/components/${id}/reference/`;
  const files = {};
  for (const [path, content] of Object.entries(examples)) {
    if (!path.includes(prefix)) continue;
    const name = path.slice(path.lastIndexOf('/') + 1);
    if (typeof content === 'string') files[name] = content;
  }
  return files;
}

export function getFoundationDocument() {
  return findRawFile(foundationFiles, '/references/foundations.md');
}

export function getFoundationSections() {
  const document = getFoundationDocument();
  return splitMarkdownSections(document).sections;
}

export function getFoundationSection(id) {
  return getFoundationSections().find((section) => slugify(section.title) === id) ?? null;
}

export function getFoundationIntroduction() {
  return splitMarkdownSections(getFoundationDocument()).introduction;
}

export function getAiCategoryIntroduction() {
  const document = findRawFile(aiFiles, '/references/ai-patterns.md');
  return document.split(/^\| Observation \|/m)[0].trim();
}

export function splitMarkdownSections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const introduction = [];
  const sections = [];
  let current = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)\s*$/);
    if (heading) {
      current = { title: heading[1].trim(), markdown: '' };
      sections.push(current);
      continue;
    }
    if (current) current.markdown += `${line}\n`;
    else introduction.push(line);
  }

  return {
    introduction: introduction.join('\n').trim(),
    sections: sections.map((section) => ({ ...section, markdown: section.markdown.trim() })),
  };
}

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
