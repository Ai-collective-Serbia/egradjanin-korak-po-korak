import { defineConfig } from 'astro/config';
import { base, site } from './site.config.mjs';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  image: { layout: 'constrained' },
});
