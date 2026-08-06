import type { APIRoute } from 'astro';
export const prerender = false;

const MAX = 8 * 1024 * 1024; // 8 MB
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.db;
  if (!db) return new Response('Sin sesión', { status: 401 });

  const form = await request.formData();
  const archivo = form.get('archivo');
  if (!(archivo instanceof File)) return new Response('Falta el archivo', { status: 400 });
  if (archivo.size > MAX) return new Response('La foto pesa más de 8 MB', { status: 413 });
  if (!TIPOS.includes(archivo.type)) return new Response('Formato no admitido', { status: 415 });

  const ext = archivo.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const nombre = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await db.storage.from('fotos').upload(nombre, archivo, {
    contentType: archivo.type,
    cacheControl: '31536000',
  });
  if (error) return new Response(error.message, { status: 400 });

  const { data } = db.storage.from('fotos').getPublicUrl(nombre);
  return new Response(JSON.stringify({ url: data.publicUrl }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};
