# bali-web

Web y miniblog de Bali (caniche toy). Astro 7 · Supabase · Vercel, capa gratuita.

## Commits

**Nunca firmes los commits en tu nombre.** Sin `Co-Authored-By: Claude`, sin
menciones a Claude Code ni a Anthropic en el mensaje ni en el pie. Autor único:

```
WillyJojo8 <WillyJojo8@users.noreply.github.com>
```

Es el email *noreply* de GitHub a propósito: da atribución en el perfil sin
exponer el correo real. No lo cambies por el personal.

Mensajes en español, formato Conventional Commits (`fix:`, `feat:`, `docs:`…).

## Repositorio

Público: https://github.com/WillyJojo8/bali-web · rama `main`.
Al ser público, antes de subir nada: sin claves, sin correos personales en el
código. El correo del `insert into admins` de `supabase/schema.sql` va como
marcador de posición.

## Cómo está montado

- `output: 'server'` — hace falta para el panel y el login. Todo se renderiza
  en cada petición, así que las páginas públicas pueden leer cookies.
- `src/middleware.ts` protege `/admin` y `/api`. Las páginas van al login;
  las llamadas fetch reciben un 401 limpio.
- `src/lib/supabase.ts` — el access token viaja en la cabecera `Authorization`,
  no por `setSession` (es asíncrona y dejaba al cliente sin sesión durante la
  misma petición, y RLS rechazaba al administrador).
- Variable de la clave pública: `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (antes se
  llamaba `ANON`).
- El dominio sale de `PUBLIC_SITE_URL`, que `astro.config.mjs` lee con
  `loadEnv` (con `process.env` a secas funcionaría en Vercel pero no en local).

## SEO

Ver [SEO.md](./SEO.md) para la estrategia. En el código:

- `src/lib/seo.ts` — `slug()`, `descuento()`, categorías de cupón y textos de
  preguntas frecuentes. Las palabras clave se escriben aquí, no en cada página.
- `src/lib/jsonld.ts` — datos estructurados. **Regla dura: solo se marca lo que
  está visible en la página.** Un descuento sin cifra no lleva `discount`, y una
  nota no se redondea. Inventarlo es motivo de penalización manual.
- `/sitemap.xml` y `/robots.txt` son rutas de servidor (`src/pages/`), no
  archivos estáticos: el contenido vive en Supabase y no existe en el build.
- Las páginas de tienda (`/codigos/[tienda]/`) y de etiqueta
  (`/blog/etiqueta/[etiqueta]/`) se generan solas a partir de los datos.

## Base de datos

`supabase/schema.sql` es el esquema para una instalación nueva; las
migraciones van aparte y numeradas (`migracion-002-cupones.sql`). Como el
schema usa `create table if not exists`, no corrige tablas ya creadas: todo
cambio sobre algo existente tiene que ir además en una migración.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build
npm run check
node scripts/og.mjs   # regenera public/og.jpg
```
