import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://filippetrovic.github.io',
  base: '/egradjanin-korak-po-korak',
  trailingSlash: 'always',
  image: { layout: 'constrained' },
});
