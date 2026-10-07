import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { base, site } from './site.config.mjs';

/**
 * Every link to another site in a screen body opens in a new tab, so the guide stays open behind
 * it. Content authors write plain Markdown links; the HTML attributes are added here at build.
 */
const externalLinksPlugin = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener');
      }
    },
  },
};

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  image: { layout: 'constrained' },
  markdown: {
    processor: satteri({ hastPlugins: [externalLinksPlugin] }),
  },
});
