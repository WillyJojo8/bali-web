import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** true si el proyecto está conectado a Supabase. */
export const haySupabase = Boolean(URL && ANON);

/** Cliente anónimo: solo ve lo publicado (lo impone RLS). */
export function clientePublico(): SupabaseClient | null {
  if (!haySupabase) return null;
  return createClient(URL, ANON, { auth: { persistSession: false } });
}

/**
 * Cliente con la sesión del usuario, leída de las cookies.
 * El token viaja en la cabecera Authorization de cada consulta, así que
 * RLS recibe el JWT del usuario y las políticas de administrador se
 * aplican solas. No usamos setSession porque es asíncrona y el cliente
 * se quedaría sin sesión durante la misma petición.
 */
export function clienteConSesion(cookies: AstroCookies): SupabaseClient | null {
  if (!haySupabase) return null;
  const access = cookies.get('sb-access-token')?.value;
  return createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: access ? { headers: { Authorization: `Bearer ${access}` } } : {},
  });
}

export function guardaSesion(cookies: AstroCookies, access: string, refresh: string) {
  const opciones = {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
  };
  cookies.set('sb-access-token', access, { ...opciones, maxAge: 60 * 60 });
  cookies.set('sb-refresh-token', refresh, { ...opciones, maxAge: 60 * 60 * 24 * 30 });
}

export function borraSesion(cookies: AstroCookies) {
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
}
