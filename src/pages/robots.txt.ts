import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * robots.txt generado, no escrito a mano: la URL del mapa del sitio sale de
 * `site` en astro.config.mjs. Así, el día que se compre el dominio bueno,
 * no hay que acordarse de cambiarlo en dos sitios.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://bali.example.com');

  const cuerpo = `# Bienvenidos los buscadores.
User-agent: *
Allow: /

# El panel y la API no pintan nada en Google.
Disallow: /admin
Disallow: /api/
Disallow: /buscar

Sitemap: ${new URL('/sitemap.xml', base).toString()}
`;

  return new Response(cuerpo, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
