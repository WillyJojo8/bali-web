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

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build
npm run check
```
