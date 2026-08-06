import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/** true si el proyecto está conectado a Supabase. */
export const haySupabase = Boolean(URL && ANON);

/** Cliente anónimo: solo ve lo publicado (lo impone RLS). */
export function clientePublico(): SupabaseClient | null {
  if (!haySupabase) return null;
  return createClient(URL, ANON, { auth: { persistSession: false } });
}

/**
 * Cliente con la sesión del usuario, leída de las cookies.
 * Con él, las políticas RLS de administrador se aplican solas.
 */
export function clienteConSesion(cookies: AstroCookies): SupabaseClient | null {
  if (!haySupabase) return null;
  const access = cookies.get('sb-access-token')?.value;
  const refresh = cookies.get('sb-refresh-token')?.value;
  const c = createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
  if (access && refresh) c.auth.setSession({ access_token: access, refresh_token: refresh });
  return c;
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
