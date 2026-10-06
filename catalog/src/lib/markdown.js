import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';

hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

function createMarkdownIt() {
  return new MarkdownIt({
    html: false,
    linkify: true,
    highlight(code, language) {
      if (!language || !hljs.getLanguage(language)) return '';
      try {
        return hljs.highlight(code, { language, ignoreIllegals: true }).value;
      } catch {
        return '';
      }
    },
  });
}

export function renderMarkdown(markdown, { componentId = null } = {}) {
  const md = createMarkdownIt();
  const defaultLinkOpen = md.renderer.rules.link_open
    ?? ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));

  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const href = token.attrGet('href') ?? '';
    if (componentId && href && !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) {
      const file = href.split('/').at(-1);
      const sourceAnchor = {
        'example.html': 'source-example-html',
        'component.css': 'source-component-css',
        'component.js': 'source-component-js',
      }[file];
      if (sourceAnchor) token.attrSet('href', `#${sourceAnchor}`);
    }
    return defaultLinkOpen(tokens, index, options, env, self);
  };

  return md.render(markdown);
}

export function highlightSource(code, language) {
  if (!hljs.getLanguage(language)) return escapeHtml(code);
  return hljs.highlight(code, { language, ignoreIllegals: true }).value;
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function removeDocumentTitle(markdown) {
  return markdown.replace(/^#\s+.+\r?\n+(?=##\s)/, '');
}
