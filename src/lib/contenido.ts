/**
 * Capa de lectura del sitio público.
 *
 * Si Supabase está configurado, lee de la base de datos.
 * Si no, cae a los JSON de src/data/ para que puedas trabajar
 * en local (y desplegar) sin haber montado nada todavía.
 */
import { clientePublico, haySupabase } from './supabase';
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

export async function getPost(slug: string): Promise<Post | null> {
  const db = clientePublico();
  if (!db) return null;
  const { data } = await db.from('posts').select('*').eq('slug', slug).maybeSingle();
  return data ?? null;
}

export { haySupabase };
