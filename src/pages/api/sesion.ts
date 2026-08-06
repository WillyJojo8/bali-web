import type { APIRoute } from 'astro';
import { guardaSesion, borraSesion } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const { access_token, refresh_token } = await request.json();
  if (!access_token || !refresh_token) {
    return new Response('Faltan tokens', { status: 400 });
  }
  guardaSesion(cookies, access_token, refresh_token);
  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  borraSesion(cookies);
  return new Response(null, { status: 204 });
};
