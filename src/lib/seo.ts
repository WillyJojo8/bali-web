/**
 * Todo lo que tiene que ver con posicionamiento vive aquí.
 *
 * La idea: las páginas no inventan textos de SEO por su cuenta. Piden
 * el que les toca a este archivo, para que las palabras clave estén
 * escritas en un solo sitio y se puedan cambiar de una vez.
 *
 * Ver SEO.md para la estrategia completa.
 */

/** Convierte "My Pug & Co." en "my-pug-co". Sin acentos, sin símbolos. */
export function slug(texto: string): string {
  return (texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Dominio del sitio. `Astro.site` sale de astro.config.mjs; si algún día
 * falta, esto evita URLs rotas en el JSON-LD (Google las descarta enteras).
 */
export const DOMINIO_POR_DEFECTO = 'https://bali.example.com';

export function urlAbsoluta(ruta: string, site?: URL | undefined): string {
  const base = site?.toString() ?? DOMINIO_POR_DEFECTO;
  return new URL(ruta, base).toString();
}

/**
 * Palabras clave por página.
 *
 * No van en <meta name="keywords"> — Google lo ignora desde 2009. Están
 * aquí para que los títulos, los H1 y los textos de cada página las usen
 * de verdad, que es lo único que cuenta.
 */
export const CLAVES = {
  codigos: [
    'cupones de descuento para perros',
    'códigos descuento tiendas de perros',
    'descuentos accesorios para perros',
    'cupones tienda de mascotas',
  ],
  opiniones: [
    'opiniones productos para perros',
    'reseñas accesorios para perros',
    'mejor arnés para perro pequeño',
  ],
  herramientas: [
    'calculadora ración perro',
    'edad de perro a humano',
    'talla de arnés para perro',
    'chocolate tóxico para perros',
  ],
} as const;

/**
 * Categorías de cupón. El valor `id` es lo que se guarda en base de datos;
 * cambiarlo obliga a migrar filas, así que se toca poco.
 */
export interface Categoria {
  id: string;
  nombre: string;
  emoji: string;
  /** Texto que sale en la cabecera de /codigos/categoria/… y en el <title>. */
  gancho: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: 'accesorios', nombre: 'Accesorios', emoji: '🎀', gancho: 'Arneses, correas, collares y ropa' },
  { id: 'comida', nombre: 'Comida y snacks', emoji: '🦴', gancho: 'Pienso, húmedo, premios y suplementos' },
  { id: 'higiene', nombre: 'Higiene y cuidado', emoji: '🫧', gancho: 'Champús, cepillos y peluquería' },
  { id: 'juguetes', nombre: 'Juguetes', emoji: '🎾', gancho: 'Mordedores, pelotas y juegos de olfato' },
  { id: 'camas', nombre: 'Camas y transporte', emoji: '🛏️', gancho: 'Camas, mantas, bolsos y transportines' },
  { id: 'salud', nombre: 'Salud', emoji: '💊', gancho: 'Antiparasitarios, seguros y veterinario' },
  { id: 'otros', nombre: 'Otros', emoji: '✨', gancho: 'Todo lo demás' },
];

export function categoria(id: string | null | undefined): Categoria {
  return CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[CATEGORIAS.length - 1];
}

/**
 * Preguntas frecuentes de la página de códigos.
 *
 * Salen en la página Y en el JSON-LD de tipo FAQPage. Google puede
 * mostrarlas desplegables debajo del resultado, que ocupa el doble de
 * alto en la página de resultados. Por eso las respuestas son cortas:
 * las largas se cortan con puntos suspensivos.
 */
export const FAQ_CODIGOS = [
  {
    p: '¿Cómo uso un código de descuento?',
    r: 'Toca el código para copiarlo, entra en la tienda desde el botón y pégalo en la casilla de "cupón" o "código promocional" antes de pagar. El descuento se aplica en el resumen del pedido.',
  },
  {
    p: '¿Los cupones caducan?',
    r: 'Algunos sí. Cada código muestra su fecha de caducidad si la tiene, y los caducados desaparecen solos de la web ese mismo día. Si no ves fecha, es que no caduca.',
  },
  {
    p: '¿El código no funciona, qué hago?',
    r: 'Comprueba que lo has pegado sin espacios y que tu pedido llega al mínimo de compra de la tienda. Muchos cupones no se pueden juntar con rebajas ya aplicadas. Si aun así falla, escríbeme y lo reviso.',
  },
  {
    p: '¿Gano algo si compro con estos códigos?',
    r: 'Algunos enlaces son de afiliado: la tienda me paga una comisión pequeña. A ti no te cuesta más, y de hecho pagas menos que sin el código. Solo enlazo cosas que Bali ha probado.',
  },
  {
    p: '¿Cada cuánto se actualizan?',
    r: 'Los reviso cada semana. Cada cupón lleva la fecha de la última comprobación, para que sepas si es de hoy o del mes pasado.',
  },
];
