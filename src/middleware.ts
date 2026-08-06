import { defineMiddleware } from 'astro:middleware';
import { clienteConSesion, haySupabase } from './lib/supabase';

/**
 * Protege /admin. Dos comprobaciones:
 *   1. Hay sesión de Google válida.
 *   2. Ese correo está en la tabla `admins`.
 *
 * La segunda es la importante: sin ella, cualquiera con una cuenta
 * de Google entraría. RLS lo bloquearía igualmente en base de datos,
 * pero es mejor no llegar a enseñar el panel.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const ruta = context.url.pathname;
  const esApi = ruta.startsWith('/api');
  if (!ruta.startsWith('/admin') && !esApi) return next();
  if (ruta === '/admin/login' || ruta.startsWith('/admin/callback')) return next();
  if (ruta === '/api/sesion') return next();

  if (!haySupabase) {
    return new Response(
      'Supabase no está configurado. Copia .env.example a .env y rellena las claves.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    );
  }

  /** Las páginas mandan al login; las llamadas fetch necesitan un 401 limpio. */
  const fuera = (motivo: string, destino: string) =>
    esApi
      ? new Response(motivo, { status: 401, headers: { 'content-type': 'text/plain; charset=utf-8' } })
      : context.redirect(destino);

  const access = context.cookies.get('sb-access-token')?.value;
  if (!access) return fuera('Sin sesión', '/admin/login');

  const db = clienteConSesion(context.cookies)!;
  const { data: { user }, error } = await db.auth.getUser(access);
  if (error || !user) return fuera('Sesión caducada', '/admin/login');

  const { data: admin } = await db.from('admins').select('email').eq('email', user.email).maybeSingle();
  if (!admin) return fuera('Sin permiso', '/admin/login?error=sin-permiso');

  context.locals.usuario = { email: user.email!, nombre: user.user_metadata?.full_name ?? user.email! };
  context.locals.db = db;
  return next();
});
