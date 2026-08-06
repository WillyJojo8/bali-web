# Bali · web y miniblog

Documento de requisitos. Versión 0.1 — agosto 2026.

---

## 1. Qué es esto

Una web pequeña que acompaña a la cuenta de Instagram **@bali_the_poodletoy**,
un caniche toy chocolate.

**El trabajo que hace la página, en una frase:** que alguien que llega desde una
story de Instagram encuentre el código de descuento en menos de tres segundos, y
que ese código siga estando ahí la semana que viene.

Esa frase decide casi todo lo demás. Los códigos van antes que el blog, antes que
la bio y antes que los anuncios.

### Quién la usa

| Perfil | De dónde viene | Qué quiere |
|---|---|---|
| Seguidor de Instagram | Enlace de la bio o una story | El código, ya |
| Visita de Google | Busca "arnés para caniche toy opinión" | Una reseña honesta |
| Marca | Busca con quién colaborar | Ver el estilo y cómo contactar |

El tercero es el que paga las facturas, aunque sea el que menos visitas trae.

### Qué NO es

No es una tienda. No hay carrito, ni pagos, ni cuentas de usuario, ni comentarios.
Si en algún momento hace falta vender algo, se enlaza a una tienda externa.

---

## 2. Alcance

### Versión 1 — lo que hay que tener

- **Portada** con la foto, el nombre, la bio y los códigos justo debajo.
- **Página de códigos** con todos los activos. Cada uno se copia al portapapeles
  con un toque.
- **Blog** con listado y páginas de entrada. Contenido en Markdown.
- **Enlaces a redes** y correo de colaboraciones.
- **RSS** y **sitemap**.
- **Aviso legal y política de privacidad** — obligatorio en España, y AdSense no
  aprueba sin ellos.
- **Aviso de contenido patrocinado** automático en las entradas marcadas.
- Funciona bien en móvil, que es de donde va a venir el 90% del tráfico.

### Versión 2 — cuando la 1 esté rodando

- Página de una sola marca o producto (para colaboraciones concretas).
- Filtro del blog por etiqueta.
- Buscador (Pagefind: se genera en el build, sin servidor).
- Newsletter, si alguna vez tiene sentido.

### Fuera de alcance, decidido a propósito

- Comentarios. Traen spam y hay que moderarlos.
- Multiidioma. Se puede añadir después si el tráfico lo pide.
- Panel de administración con login.

---

## 3. Funciones, una por una

### 3.1 Códigos de descuento

Es la función principal. Los códigos viven en `src/data/codigos.json`:

```json
{
  "id": "mypug15",
  "marca": "My Pug & Co.",
  "valor": "15",
  "unidad": "% dto",
  "codigo": "BALI15",
  "que": "Arneses y correas, en toda la web",
  "url": "https://...",
  "destacado": true,
  "activo": true
}
```

Comportamiento:

- Solo se muestran los que tienen `activo: true`. Para retirar un código se pone
  a `false`, no se borra: así queda el histórico.
- El que tiene `destacado: true` aparece además girando alrededor de la foto de
  la portada y en la cinta de arriba.
- Al tocar **Copiar**, el código va al portapapeles y el botón cambia a
  "¡Copiado!" durante dos segundos.
- El enlace a la tienda lleva `rel="sponsored"`, que es lo que Google pide para
  enlaces pagados.

### 3.2 Blog

Cada entrada es un archivo `.md` en `src/content/posts/`. La cabecera:

```yaml
---
titulo: "Probamos el arnés de pata de gallo"
resumen: "Dos meses de uso diario. Qué aguanta y qué no."
fecha: 2026-08-20
portada: ./fotos/arnes.jpg      # opcional
portadaAlt: "Bali con el arnés"  # obligatorio si hay portada
etiquetas: ["reseña", "arneses"]
patrocinado: true                # pone el aviso legal automáticamente
borrador: false                  # true = no se publica
---
```

El esquema está validado: si te dejas un campo o pones mal una fecha, el build
falla y te dice dónde. Es a propósito — mejor que se rompa en tu máquina que
publicar una entrada rota.

### 3.3 Publicidad

**Principio: los anuncios no pueden empujar los códigos hacia abajo.**

Dónde van, y solo ahí:

| Sitio | Formato |
|---|---|
| Portada, entre códigos y blog | Un bloque |
| Listado del blog, tras la 5ª entrada | Un bloque |
| Dentro de una entrada, al final del texto | Un bloque |

Lo que no habrá, decidido de antemano:

- Nada pegajoso que persiga al scroll.
- Nada que tape el contenido: ni interstitial, ni pop-up, ni vídeo automático.
- Ningún anuncio por encima de los códigos.
- Ningún anuncio en portada por encima del pliegue.

Implementación: el componente `HuecoAnuncio.astro` **no pinta nada** si la
variable `PUBLIC_ADSENSE_ID` está vacía. Puedes desplegar hoy sin anuncios y
activarlos el día que te aprueben, sin tocar plantillas. Cuando se muestra,
reserva su altura para que el texto no dé un salto al cargar.

Cada hueco lleva la etiqueta "Publicidad" encima. AdSense lo exige y además es
lo honesto.

### 3.4 Legal

- Aviso legal con los datos del titular (la LSSI lo exige en España).
- Política de privacidad y cookies.
- Aviso de afiliación visible en toda entrada marcada como patrocinada.
- **Banner de consentimiento**: obligatorio antes de servir anuncios a tráfico
  del EEE. Google exige un CMP certificado. El más rápido es el propio
  *Privacy & messaging* de AdSense, que se configura desde su panel sin tocar
  código. Ver el apartado 6.

### 3.5 Rendimiento y accesibilidad

Objetivos, no aspiraciones:

- Menos de 100 KB de JavaScript en la portada. Ahora mismo son unos 2 KB: solo
  el script de copiar.
- Lighthouse por encima de 95 en móvil, sin contar los anuncios.
- Imágenes servidas en WebP y con varios tamaños. Astro lo hace en el build.
- Foco de teclado visible, textos alternativos en las fotos, `prefers-reduced-motion`
  respetado (la cinta y el sello dejan de girar).

---

## 4. Stack

**Astro 7 + Markdown + despliegue estático.** Sin base de datos, sin backend,
sin CMS.

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | Astro | Genera HTML plano. Cero JavaScript por defecto |
| Contenido | Markdown con esquema validado | Sin base de datos que mantener |
| Estilos | CSS propio con variables | Sin build extra, sin clases de utilidad |
| Hosting | Vercel o Cloudflare Pages | Gratis, despliegue al hacer push |
| Imágenes | `astro:assets` | WebP y tamaños múltiples automáticos |
| Anuncios | AdSense, en huecos fijos | Ver 3.3 |

### Por qué Astro y no otra cosa

- **No Next.js**: está pensado para aplicaciones. Aquí sobra el 90%.
- **No WordPress**: hay que mantenerlo, actualizarlo y pagar hosting.
- **No un HTML a mano**: a la décima entrada estarías copiando y pegando la
  cabecera.

Astro está en el punto medio: escribes Markdown, sale HTML estático.

### Lo que hay que saber para tocarlo

Un `.astro` es HTML con un bloque de JavaScript arriba entre `---`. Eso es todo.
Nada de hooks ni de ciclo de vida. Con lo que ya sabes vas sobrado.

---

## 5. Estructura del repositorio

```
bali-web/
├── astro.config.mjs          ← el dominio se pone aquí
├── .env.example              ← copiar a .env
├── REQUISITOS.md             ← este documento
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── data/
    │   ├── codigos.json      ← LOS CÓDIGOS SE EDITAN AQUÍ
    │   └── perfil.json       ← nombre, bio, redes, correo
    ├── content/
    │   └── posts/            ← una entrada = un .md
    ├── content.config.ts     ← esquema de las entradas
    ├── components/
    │   ├── Cabecera.astro
    │   ├── PieDePagina.astro
    │   ├── TicketCodigo.astro
    │   ├── TarjetaPost.astro
    │   └── HuecoAnuncio.astro
    ├── layouts/Base.astro    ← <head>, SEO, Open Graph
    ├── pages/
    │   ├── index.astro
    │   ├── codigos.astro
    │   ├── blog/index.astro
    │   ├── blog/[...slug].astro
    │   ├── aviso-legal.astro
    │   ├── privacidad.astro
    │   └── rss.xml.js
    └── styles/global.css     ← los colores están todos aquí arriba
```

Las dos rutas que vas a tocar el 95% de las veces: `src/data/codigos.json` y
`src/content/posts/`.

---

## 6. Puesta en marcha

### Orden recomendado

1. **Comprar el dominio.** Unos 11 €/año en Porkbun o Cloudflare. No es opcional
   si quieres anuncios: ver el aviso de abajo.
2. **Subir el repo a GitHub** e importarlo en Vercel. Detecta Astro solo.
3. **Apuntar el dominio** a Vercel y actualizar `site:` en `astro.config.mjs`.
4. **Publicar entradas.** Entre 10 y 15 antes de solicitar AdSense.
5. **Configurar el banner de consentimiento** desde AdSense.
6. **Solicitar AdSense.** Tarda de unos días a cuatro semanas.
7. Rellenar el ID en las variables de entorno de Vercel y redesplegar.

### Aviso importante sobre los anuncios

<cite index="13-1">AdSense no aprueba sitios alojados en subdominios de plataforma. Vercel, Netlify, GitHub Pages sin dominio propio, Render — todos chocan con el mismo muro, y el rechazo que recibes habla de calidad del contenido, no de la causa real. En todos los casos documentados la solución fue la misma: añadir un dominio propio.</cite> Y no es solo AdSense:
<cite index="13-1">Mediavine, Ezoic, Media.net y Raptive también exigen dominio propio o fallan sus comprobaciones automáticas contra URLs de subdominio.</cite>

Traducido: **`bali.vercel.app` gratis sirve para tener la web en pie, pero con
esa URL los ingresos por publicidad son cero.** Los 11 € del dominio no son un
gasto opcional, son el peaje de entrada.

Lo que sí funciona desde el día uno sin dominio propio son los **códigos de
afiliado**. Y para una cuenta de mascota con seguidores fieles, casi seguro que
dan más dinero que AdSense: una comisión del 10% sobre un arnés de 40 € son 4 €,
lo mismo que te pagarían mil visitas de anuncios.

**Sugerencia de prioridad:** compra el dominio, monta la web, céntrate en las
colaboraciones, y deja AdSense como algo secundario que activas cuando tengas
contenido suficiente.

### Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # ver el resultado del build
```

---

## 7. Cómo se publica una entrada desde el móvil

1. Abrir github.com en el navegador (la app no deja crear archivos con soltura).
2. `src/content/posts/` → **Add file** → **Create new file**.
3. Nombrarlo `titulo-de-la-entrada.md`.
4. Pegar la cabecera del apartado 3.2 y escribir debajo.
5. **Commit**.
6. Vercel despliega solo en un minuto.

Las fotos se suben a `src/content/posts/fotos/` con **Add file → Upload files**,
desde la galería del móvil.

Si con el tiempo la persona que escribe no quiere ver GitHub, se puede añadir
Decap CMS: un panel de edición que sigue guardando en el repo, sin base de datos.
Se puede hacer más adelante sin cambiar nada de lo que ya hay.

---

## 8. Decisiones tomadas y pendientes

### Tomadas

- Estático, sin backend ni base de datos.
- Contenido en Markdown dentro del repo, no en un CMS externo.
- Sin comentarios.
- Afiliación como ingreso principal, anuncios como secundario.
- Español únicamente, de momento.
- Los códigos retirados se marcan `activo: false`, no se borran.

### Pendientes

- Nombre del dominio.
- Datos del titular para el aviso legal.
- Quién escribe las entradas y con qué frecuencia.
- Si hace falta Decap CMS o basta con GitHub.
- Ritmo de publicación objetivo.

---

## 9. Riesgos

| Riesgo | Qué hacer |
|---|---|
| AdSense rechaza el sitio | Esperado sin dominio propio. Comprarlo antes de solicitar |
| El blog se queda sin actualizar | Mejor una entrada al mes sostenida que cinco de golpe y nada más |
| Un código caduca y sigue publicado | Añadir campo `caduca` y ocultarlo solo en el build |
| Instagram cambia las reglas | Es justamente el motivo de tener web propia |
| Los anuncios estropean la experiencia | Las reglas del 3.3 son el límite. Si molestan, se quitan |
