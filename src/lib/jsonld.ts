/**
 * Constructores de datos estructurados (JSON-LD).
 *
 * Para qué sirve esto: Google lee el HTML y adivina. El JSON-LD no le deja
 * adivinar — le dice "esto es un cupón del 15% de esta tienda, caduca este
 * día". Es lo que hace que un resultado salga con estrellas, con la fecha o
 * con las preguntas desplegables, y eso multiplica los clics sin necesidad
 * de subir de posición.
 *
 * Todo lo que se genere aquí tiene que ser CIERTO y estar visible en la
 * página. Marcar cosas que el usuario no ve es motivo de penalización.
 */
import type { Cupon, Post, Opinion, Tienda } from './contenido';
import { categoria, descuento } from './seo';

type Nodo = Record<string, unknown>;

const abs = (base: URL | undefined, ruta: string) =>
  new URL(ruta, base ?? 'https://bali.example.com').toString();

/** Identidad del sitio. Va en todas las páginas: le da a Google una entidad estable. */
export function sitio(base: URL | undefined, perfil: any): Nodo[] {
  const raiz = abs(base, '/');
  return [
    {
      '@type': 'WebSite',
      '@id': `${raiz}#web`,
      url: raiz,
      name: perfil.titulo,
      description: perfil.descripcion,
      inLanguage: 'es-ES',
      publisher: { '@id': `${raiz}#marca` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${raiz}buscar/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${raiz}#marca`,
      name: perfil.nombre,
      url: raiz,
      description: perfil.descripcion,
      logo: abs(base, '/og.jpg'),
      sameAs: (perfil.redes ?? []).map((r: any) => r.url),
    },
  ];
}

/** Migas de pan. Google las pinta en vez de la URL cruda del resultado. */
export function migas(base: URL | undefined, items: { nombre: string; url: string }[]): Nodo {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nombre,
      item: abs(base, it.url),
    })),
  };
}

/**
 * Un cupón como Offer.
 *
 * `price: 0` con `priceCurrency` no aplica aquí (el cupón no se vende), así
 * que se describe con `discount` y `priceSpecification`, que es lo que
 * schema.org define para descuentos.
 */
export function oferta(base: URL | undefined, c: Cupon, urlTienda: string): Nodo {
  const dto = descuento(c.valor, c.unidad);
  const nodo: Nodo = {
    '@type': 'Offer',
    name: dto ? `${dto} de descuento en ${c.marca}` : `Código de descuento en ${c.marca}`,
    description: c.que ?? `Código de descuento para ${c.marca}`,
    url: abs(base, urlTienda),
    availability: 'https://schema.org/InStock',
    category: categoria(c.categoria).nombre,
    seller: { '@type': 'Organization', name: c.marca, ...(c.url ? { url: c.url } : {}) },
    eligibleTransactionVolume: {
      '@type': 'PriceSpecification',
      priceCurrency: 'EUR',
    },
  };
  // Sin valor no hay `discount`: no se marca lo que no está escrito en la página.
  if (dto) nodo.discount = dto;
  if (c.caduca) nodo.validThrough = c.caduca;
  if (c.verificado_en) nodo.validFrom = c.verificado_en;
  return nodo;
}

/** Lista de cupones: le dice a Google que la página es un listado, no un artículo. */
export function listaOfertas(base: URL | undefined, cupones: Cupon[], urlDe: (c: Cupon) => string): Nodo {
  return {
    '@type': 'ItemList',
    numberOfItems: cupones.length,
    itemListElement: cupones.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: oferta(base, c, urlDe(c)),
    })),
  };
}

/** Página de una tienda concreta: la entidad es la tienda y sus ofertas. */
export function tiendaConOfertas(base: URL | undefined, t: Tienda): Nodo {
  return {
    '@type': 'Organization',
    name: t.nombre,
    ...(t.mejor.url ? { url: t.mejor.url } : {}),
    makesOffer: t.cupones.map((c) => oferta(base, c, `/codigos/${t.slug}/`)),
  };
}

export function articulo(base: URL | undefined, p: Post): Nodo {
  const raiz = abs(base, '/');
  return {
    '@type': 'BlogPosting',
    headline: p.titulo.slice(0, 110),
    description: p.resumen,
    datePublished: p.fecha,
    dateModified: p.fecha,
    inLanguage: 'es-ES',
    mainEntityOfPage: abs(base, `/blog/${p.slug}/`),
    ...(p.portada_url ? { image: p.portada_url } : {}),
    ...(p.etiquetas?.length ? { keywords: p.etiquetas.join(', ') } : {}),
    author: { '@id': `${raiz}#marca` },
    publisher: { '@id': `${raiz}#marca` },
  };
}

/** Preguntas frecuentes. Pueden salir desplegables bajo el resultado. */
export function faq(preguntas: { p: string; r: string }[]): Nodo {
  return {
    '@type': 'FAQPage',
    mainEntity: preguntas.map((x) => ({
      '@type': 'Question',
      name: x.p,
      acceptedAnswer: { '@type': 'Answer', text: x.r },
    })),
  };
}

/**
 * Una opinión sobre un producto. La nota es la que se ve en la página:
 * inventarla aquí sería justo lo que Google penaliza.
 */
export function producto(base: URL | undefined, o: Opinion): Nodo {
  const raiz = abs(base, '/');
  return {
    '@type': 'Product',
    name: o.producto,
    ...(o.marca ? { brand: { '@type': 'Brand', name: o.marca } } : {}),
    ...(o.foto_url ? { image: o.foto_url } : {}),
    review: {
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: o.nota, bestRating: 5, worstRating: 1 },
      reviewBody: o.texto,
      datePublished: o.creado_en,
      author: { '@id': `${raiz}#marca` },
    },
  };
}

/** Envuelve todo en un solo <script> con @graph: menos peso y menos duplicados. */
export function grafo(nodos: Nodo[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodos })
    // Evita que un "</script>" dentro de un texto cierre la etiqueta antes de tiempo.
    .replace(/</g, '\\u003c');
}
