// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// CAMBIA ESTO cuando tengas el dominio definitivo.
// Se usa para el sitemap, el RSS y las etiquetas Open Graph.
export default defineConfig({
  site: 'https://bali.example.com',
  integrations: [mdx(), sitemap()],
  image: { responsiveStyles: true },
});
