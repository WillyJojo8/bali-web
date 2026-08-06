import type { APIRoute } from 'astro';
export const prerender = false;

export const PATCH: APIRoute = async ({ request, params, locals }) => {
  const db = locals.db;
  if (!db) return new Response('Sin sesión', { status: 401 });

  const cuerpo = await request.json();
  const { error } = await db.from('cupones').update(cuerpo).eq('id', params.id);
  if (error) return new Response(error.message, { status: 400 });
  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const db = locals.db;
  if (!db) return new Response('Sin sesión', { status: 401 });

  const { error } = await db.from('cupones').delete().eq('id', params.id);
  if (error) return new Response(error.message, { status: 400 });
  return new Response(null, { status: 204 });
};
