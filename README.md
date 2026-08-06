# bali-web

Web y miniblog de **Bali**, caniche toy chocolate ([@bali_the_poodletoy](https://www.instagram.com/bali_the_poodletoy)).

Astro 7 · Supabase · Vercel. Todo en capa gratuita.

📄 **Requisitos completos en [REQUISITOS.md](./REQUISITOS.md).**

## Puesta en marcha

**1. Supabase.** Crea un proyecto en [supabase.com](https://supabase.com) (gratis).

**2. Base de datos.** SQL Editor → New query → pega `supabase/schema.sql` → Run.
⚠️ Antes cambia el correo del `insert into admins` por el vuestro.

**3. Google.** Authentication → Providers → Google → activar.
En URL Configuration añade como redirect: `https://TU-DOMINIO/admin/callback`
y `http://localhost:4321/admin/callback`.

**4. Variables.**

```bash
cp .env.example .env   # y rellena URL y clave publishable
npm install
npm run dev            # http://localhost:4321
```

**5. Vercel.** Importa el repo. Mete las mismas variables en
Settings → Environment Variables. Cada push despliega.

## El día a día

Todo desde `/admin` en el móvil. No hace falta tocar el código.

| Quiero… | Voy a… |
|---|---|
| Añadir un cupón | `/admin/cupones/nuevo/` |
| Escribir una entrada | `/admin/posts/nueva/` |
| Añadir una opinión | `/admin/opiniones/nueva/` |
| Dar acceso a alguien | tabla `admins` en Supabase |

Cambios que sí tocan el código:

| Quiero… | Voy a… |
|---|---|
| Cambiar la bio o las redes | `src/data/perfil.json` |
| Cambiar los colores | variables de arriba de `src/styles/global.css` |
| Poner el dominio | `site:` en `astro.config.mjs` |

## Antes de publicar

- [ ] Correos reales en la tabla `admins`
- [ ] Dominio en `astro.config.mjs` y en `public/robots.txt`
- [ ] Datos del titular en `src/pages/aviso-legal.astro`
- [ ] Correo real en `src/data/perfil.json`
- [ ] Imagen `public/og.jpg` de 1200×630 para cuando se comparta el enlace

## Anuncios

Apagados mientras `PUBLIC_ADSENSE_ID` esté vacía: `HuecoAnuncio` no pinta nada.
Ver apartado 3.3 de REQUISITOS.md.

**Ojo:** AdSense no aprueba subdominios de plataforma. Con `algo.vercel.app` los
ingresos por publicidad son cero. Hace falta dominio propio (~11 €/año).
