import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.db;
  if (!db) return new Response('Sin sesión', { status: 401 });

  const cuerpo = await request.json();
  const { error } = await db.from('cupones').insert(cuerpo);
  if (error) return new Response(error.message, { status: 400 });
  return new Response(null, { status: 201 });
};
