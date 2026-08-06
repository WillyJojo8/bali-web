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
  if (!ruta.startsWith('/admin')) return next();
  if (ruta === '/admin/login' || ruta.startsWith('/admin/callback')) return next();

  if (!haySupabase) {
    return new Response(
      'Supabase no está configurado. Copia .env.example a .env y rellena las claves.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    );
  }

  const db = clienteConSesion(context.cookies)!;
  const { data: { user } } = await db.auth.getUser();
  if (!user) return context.redirect('/admin/login');

  const { data: admin } = await db.from('admins').select('email').eq('email', user.email).maybeSingle();
  if (!admin) return context.redirect('/admin/login?error=sin-permiso');

  context.locals.usuario = { email: user.email!, nombre: user.user_metadata?.full_name ?? user.email! };
  context.locals.db = db;
  return next();
});
