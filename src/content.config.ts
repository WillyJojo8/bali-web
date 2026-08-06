import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      resumen: z.string(),
      fecha: z.coerce.date(),
      portada: image().optional(),
      portadaAlt: z.string().optional(),
      etiquetas: z.array(z.string()).default([]),
      // Si la entrada lleva enlaces pagados o de afiliado, ponlo a true:
      // la web añade sola el aviso legal arriba del artículo.
      patrocinado: z.boolean().default(false),
      borrador: z.boolean().default(false),
    }),
});

export const collections = { posts };
