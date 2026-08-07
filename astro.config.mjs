// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';

/**
 * El dominio sale de la variable PUBLIC_SITE_URL. Cuando compres el dominio
 * definitivo, lo pones en Vercel (Settings → Environment Variables) y en tu
 * .env local: no hay que tocar este archivo ni acordarse de nada más.
 *
 * De él dependen las URLs canónicas, el mapa del sitio, el RSS, las imágenes
 * de compartir y todo el JSON-LD. Si está mal, Google indexa mal.
 *
 * Hace falta loadEnv porque este archivo se ejecuta antes de que Astro cargue
 * el .env: con process.env a secas funcionaría en Vercel pero no en local.
 */
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const site = PUBLIC_SITE_URL || 'https://bali.example.com';

export default defineConfig({
  site,
  output: 'server',       // hace falta para el panel y el login
  adapter: vercel(),
  // Sin @astrojs/sitemap a propósito: genera el XML en el build y aquí no
  // hay páginas estáticas. El mapa lo sirve src/pages/sitemap.xml.ts.
  integrations: [mdx()],
  image: { responsiveStyles: true },
});
