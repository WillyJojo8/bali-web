import rss from '@astrojs/rss';
import perfil from '../data/perfil.json';
import { getPosts } from '../lib/contenido';

export const prerender = false;

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: perfil.titulo,
    description: perfil.descripcion,
    site: context.site,
    items: posts.map((p) => ({
      title: p.titulo,
      description: p.resumen,
      pubDate: new Date(p.fecha),
      link: `/blog/${p.slug}/`,
    })),
    customData: '<language>es-es</language>',
  });
}
