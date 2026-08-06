import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.db;
  if (!db) return new Response('Sin sesión', { status: 401 });

  const cuerpo = await request.json();
  cuerpo.autor_email = locals.usuario?.email;

  const { error } = await db.from('posts').insert(cuerpo);
  if (error) {
    if (error.code === '23505') return new Response('Ya existe una entrada con esa dirección web.', { status: 409 });
    return new Response(error.message, { status: 400 });
  }
  return new Response(null, { status: 201 });
};
