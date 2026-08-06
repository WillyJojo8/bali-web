import type { APIRoute } from 'astro';
import { getPosts, getTiendas, getEtiquetas, getOpiniones } from '../lib/contenido';
import { HERRAMIENTAS } from '../lib/herramientas';

export const prerender = false;

/**
 * Mapa del sitio generado en cada petición.
 *
 * Por qué no usamos @astrojs/sitemap: esa integración escribe el XML en el
 * momento del build, y aquí no hay ninguna página estática — todo se
 * renderiza en el servidor y el contenido vive en Supabase. El resultado
 * sería un mapa con cuatro URLs fijas y ninguna entrada del blog.
 *
 * Así, en cuanto se publica algo desde el panel, ya está en el mapa.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://bali.example.com');
  const url = (ruta: string) => new URL(ruta, base).toString();

  const [posts, tiendas, opiniones] = await Promise.all([
    getPosts(),
    getTiendas(),
    getOpiniones(),
  ]);
  const etiquetas = await getEtiquetas(posts);

  const ultimaEntrada = posts[0]?.fecha ?? new Date().toISOString();

  interface Entrada {
    ruta: string;
    cambia: string;
    prioridad: string;
    fecha?: string;
  }

  const entradas: Entrada[] = [
    { ruta: '/', cambia: 'daily', prioridad: '1.0', fecha: ultimaEntrada },
    { ruta: '/codigos/', cambia: 'daily', prioridad: '0.9' },
    { ruta: '/tiendas/', cambia: 'weekly', prioridad: '0.7' },
    { ruta: '/blog/', cambia: 'weekly', prioridad: '0.8', fecha: ultimaEntrada },
    { ruta: '/herramientas/', cambia: 'monthly', prioridad: '0.8' },
    { ruta: '/aviso-legal/', cambia: 'yearly', prioridad: '0.2' },
    { ruta: '/privacidad/', cambia: 'yearly', prioridad: '0.2' },
    ...HERRAMIENTAS.map((h) => ({ ruta: h.ruta, cambia: 'monthly', prioridad: '0.7' })),
    ...tiendas.map((t) => ({ ruta: `/codigos/${t.slug}/`, cambia: 'weekly', prioridad: '0.8' })),
    ...etiquetas.map((e) => ({ ruta: `/blog/etiqueta/${e.slug}/`, cambia: 'weekly', prioridad: '0.5' })),
    ...posts.map((p) => ({
      ruta: `/blog/${p.slug}/`,
      cambia: 'monthly',
      prioridad: '0.7',
      fecha: p.fecha,
    })),
  ];

  if (opiniones.length > 0) {
    entradas.splice(3, 0, { ruta: '/opiniones/', cambia: 'weekly', prioridad: '0.8' });
  }

  const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradas
  .map(
    (e) => `  <url>
    <loc>${url(e.ruta)}</loc>${e.fecha ? `\n    <lastmod>${new Date(e.fecha).toISOString()}</lastmod>` : ''}
    <changefreq>${e.cambia}</changefreq>
    <priority>${e.prioridad}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(cuerpo, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      // Una hora de caché: los buscadores no lo piden tan a menudo, pero
      // evita consultar Supabase en cada rastreo.
      'cache-control': 'public, max-age=3600',
    },
  });
};
