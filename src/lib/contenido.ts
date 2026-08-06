/**
 * Capa de lectura del sitio público.
 *
 * Si Supabase está configurado, lee de la base de datos.
 * Si no, cae a los JSON de src/data/ para que puedas trabajar
 * en local (y desplegar) sin haber montado nada todavía.
 *
 * Regla de oro: aquí NO se filtra por "activo" ni por "publicado".
 * Eso lo hace RLS en Postgres (ver supabase/schema.sql). Si algún día
 * este archivo se equivoca, la base de datos sigue sin enseñar de más.
 */
import { clientePublico, haySupabase } from './supabase';
import { slug } from './seo';
import cuponesSemilla from '../data/codigos.json';

export interface Cupon {
  id: string;
  marca: string;
  valor: string;
  unidad: string;
  codigo: string;
  que: string | null;
  url: string | null;
  destacado: boolean;
  /** Una de las de CATEGORIAS en lib/seo.ts. Puede faltar en filas antiguas. */
  categoria?: string | null;
  /** null = no caduca. */
  caduca?: string | null;
  /** Última vez que se comprobó a mano que el código funciona. */
  verificado_en?: string | null;
}

export interface Post {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  cuerpo: string;
  portada_url: string | null;
  portada_alt: string | null;
  etiquetas: string[];
  tipo: string;
  patrocinado: boolean;
  fecha: string;
}

export interface Opinion {
  id: string;
  producto: string;
  marca: string | null;
  nota: number;
  texto: string;
  foto_url: string | null;
  cupon_id: string | null;
  creado_en: string;
}

/** Una tienda con todos sus cupones. Se calcula, no se guarda. */
export interface Tienda {
  nombre: string;
  slug: string;
  cupones: Cupon[];
  /** El descuento más alto de la tienda, para el titular de su página. */
  mejor: Cupon;
}

export async function getCupones(): Promise<Cupon[]> {
  const db = clientePublico();
  if (!db) return cuponesSemilla as unknown as Cupon[];

  const { data, error } = await db
    .from('cupones')
    .select('*')
    .order('destacado', { ascending: false })
    .order('orden', { ascending: true });

  if (error) {
    console.error('[cupones]', error.message);
    return cuponesSemilla as unknown as Cupon[];
  }
  return data ?? [];
}

/**
 * Agrupa los cupones por tienda. Cada grupo es una página propia
 * (/codigos/[tienda]/), que es lo que se posiciona para búsquedas del
 * tipo "cupón descuento <tienda>".
 */
export async function getTiendas(cupones?: Cupon[]): Promise<Tienda[]> {
  const lista = cupones ?? (await getCupones());
  const mapa = new Map<string, Tienda>();

  for (const c of lista) {
    const s = slug(c.marca);
    if (!s) continue;
    const ya = mapa.get(s);
    if (ya) {
      ya.cupones.push(c);
      if (valorNumerico(c) > valorNumerico(ya.mejor)) ya.mejor = c;
    } else {
      mapa.set(s, { nombre: c.marca, slug: s, cupones: [c], mejor: c });
    }
  }

  return [...mapa.values()].sort((a, b) => b.cupones.length - a.cupones.length);
}

export async function getTienda(s: string): Promise<Tienda | null> {
  const tiendas = await getTiendas();
  return tiendas.find((t) => t.slug === s) ?? null;
}

/** "15" en "% dto" pesa más que "5" en "€ menos" solo a efectos de ordenar. */
function valorNumerico(c: Cupon): number {
  const n = parseFloat(String(c.valor).replace(',', '.'));
  if (Number.isNaN(n)) return 0;
  return c.unidad.includes('€') ? n * 1.5 : n;
}

export async function getPosts(limite?: number): Promise<Post[]> {
  const db = clientePublico();
  if (!db) return [];

  let q = db.from('posts').select('*').order('fecha', { ascending: false });
  if (limite) q = q.limit(limite);

  const { data, error } = await q;
  if (error) {
    console.error('[posts]', error.message);
    return [];
  }
  return data ?? [];
}

export async function getPost(s: string): Promise<Post | null> {
  const db = clientePublico();
  if (!db) return null;
  const { data } = await db.from('posts').select('*').eq('slug', s).maybeSingle();
  return data ?? null;
}

/**
 * Entradas de una etiqueta. Se filtra en memoria y no en SQL porque las
 * etiquetas se guardan con acentos y mayúsculas ("Arnés"), y la URL va en
 * minúsculas y sin acentos ("arnes").
 */
export async function getPostsPorEtiqueta(etiqueta: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => (p.etiquetas ?? []).some((e) => slug(e) === slug(etiqueta)));
}

export interface Etiqueta {
  nombre: string;
  slug: string;
  cuantas: number;
}

export async function getEtiquetas(posts?: Post[]): Promise<Etiqueta[]> {
  const lista = posts ?? (await getPosts());
  const mapa = new Map<string, Etiqueta>();

  for (const p of lista) {
    for (const e of p.etiquetas ?? []) {
      const s = slug(e);
      if (!s) continue;
      const ya = mapa.get(s);
      if (ya) ya.cuantas++;
      else mapa.set(s, { nombre: e, slug: s, cuantas: 1 });
    }
  }

  return [...mapa.values()].sort((a, b) => b.cuantas - a.cuantas);
}

/**
 * Entradas parecidas a una dada: primero las que comparten etiquetas,
 * después las del mismo tipo. Sin repetir y sin incluirse a sí misma.
 */
export async function getRelacionados(post: Post, cuantos = 3): Promise<Post[]> {
  const todos = await getPosts();
  const suyas = new Set((post.etiquetas ?? []).map(slug));

  const puntuados = todos
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const comunes = (p.etiquetas ?? []).filter((e) => suyas.has(slug(e))).length;
      return { p, puntos: comunes * 10 + (p.tipo === post.tipo ? 3 : 0) };
    })
    .filter((x) => x.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos);

  return puntuados.slice(0, cuantos).map((x) => x.p);
}

export async function getOpiniones(limite?: number): Promise<Opinion[]> {
  const db = clientePublico();
  if (!db) return [];

  let q = db.from('opiniones').select('*').order('creado_en', { ascending: false });
  if (limite) q = q.limit(limite);

  const { data, error } = await q;
  if (error) {
    console.error('[opiniones]', error.message);
    return [];
  }
  return data ?? [];
}

export { haySupabase };
