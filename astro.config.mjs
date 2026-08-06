// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// CAMBIA `site` cuando tengas el dominio definitivo.
export default defineConfig({
  site: 'https://bali.example.com',
  output: 'server',       // hace falta para el panel y el login
  adapter: vercel(),
  integrations: [mdx(), sitemap()],
  image: { responsiveStyles: true },
});
