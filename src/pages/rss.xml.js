import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import perfil from '../data/perfil.json';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.borrador))
    .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());

  return rss({
    title: perfil.titulo,
    description: perfil.descripcion,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.titulo,
      description: p.data.resumen,
      pubDate: p.data.fecha,
      link: `/blog/${p.id}/`,
    })),
    customData: '<language>es-es</language>',
  });
}
