# bali-web

Web y miniblog de **Bali**, caniche toy chocolate ([@bali_the_poodletoy](https://www.instagram.com/bali_the_poodletoy)).

Astro 7 · Supabase · Vercel. Todo en capa gratuita.

📄 Requisitos completos en [REQUISITOS.md](./REQUISITOS.md) · estrategia de
posicionamiento en [SEO.md](./SEO.md).

## Qué hay dentro

| Zona | Para qué |
|---|---|
| `/` | Portada: foto, códigos, calculadoras, opiniones y últimas entradas |
| `/codigos/` | Todos los cupones, con buscador y filtros por categoría |
| `/codigos/[tienda]/` | Una página por tienda, creada sola con sus cupones |
| `/tiendas/` | Índice de tiendas con código activo |
| `/opiniones/` | Reseñas con nota, en datos estructurados de tipo Review |
| `/herramientas/` | Cuatro calculadoras: ración, edad, talla de arnés, chocolate |
| `/blog/` · `/blog/etiqueta/[tema]/` | Entradas, por fecha y por tema |
| `/buscar/` | Buscador propio sobre cupones, entradas y calculadoras |
| `/admin/` | Panel, solo para los correos de la tabla `admins` |

## Puesta en marcha

**1. Supabase.** Crea un proyecto en [supabase.com](https://supabase.com) (gratis).

**2. Base de datos.** SQL Editor → New query → pega `supabase/schema.sql` → Run.
⚠️ Antes cambia el correo del `insert into admins` por el vuestro.

Si el proyecto ya estaba creado antes de agosto de 2026, ejecuta además
`supabase/migracion-002-cupones.sql`, que añade la categoría y la fecha de
comprobación de los cupones.

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

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build
npm run check    # tipos y plantillas
node scripts/og.mjs   # regenera public/og.jpg (la imagen de compartir)
```

## El día a día

Todo desde `/admin` en el móvil. No hace falta tocar el código.

| Quiero… | Voy a… |
|---|---|
| Añadir un cupón | `/admin/cupones/nuevo/` |
| Marcar que un cupón sigue funcionando | editarlo y poner la fecha de hoy en «Comprobado el» |
| Escribir una entrada | `/admin/posts/nueva/` |
| Añadir una opinión | `/admin/opiniones/nueva/` |
| Dar acceso a alguien | tabla `admins` en Supabase |

Al añadir un cupón de una marca nueva, su página `/codigos/esa-marca/` aparece
sola, con su título, sus preguntas y sus datos estructurados. No hay que crear
nada a mano.

Cambios que sí tocan el código:

| Quiero… | Voy a… |
|---|---|
| Cambiar la bio o las redes | `src/data/perfil.json` |
| Cambiar los colores | variables de arriba de `src/styles/global.css` |
| Poner el dominio | variable `PUBLIC_SITE_URL` (en Vercel y en `.env`) |
| Tocar las categorías de cupón o las preguntas frecuentes | `src/lib/seo.ts` |
| Añadir una calculadora | `src/lib/herramientas.ts` + página en `src/pages/herramientas/` |

## Antes de publicar

- [ ] Correos reales en la tabla `admins`
- [ ] Dominio en `PUBLIC_SITE_URL` (Vercel y `.env`)
- [ ] Datos del titular en `src/pages/aviso-legal.astro`
- [ ] Correo real en `src/data/perfil.json`
- [ ] `supabase/migracion-002-cupones.sql` ejecutado
- [ ] Mapa del sitio enviado en Google Search Console (ver [SEO.md](./SEO.md))

## Anuncios

Apagados mientras `PUBLIC_ADSENSE_ID` esté vacía: `HuecoAnuncio` no pinta nada.
Ver apartado 3.3 de REQUISITOS.md.

**Ojo:** AdSense no aprueba subdominios de plataforma. Con `algo.vercel.app` los
ingresos por publicidad son cero. Hace falta dominio propio (~11 €/año).
