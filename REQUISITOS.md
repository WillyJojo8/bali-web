# Bali · web y miniblog

Documento de requisitos. Versión 0.2 — agosto 2026.

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

No es una tienda. No hay carrito ni pagos: si hace falta vender algo, se enlaza
a una tienda externa. Tampoco hay cuentas para el público ni comentarios — el
único inicio de sesión es el de los dos administradores.

---

## 2. Alcance

### Versión 1 — lo que hay que tener

**Parte pública**

- **Portada** con la foto, el nombre, la bio y los códigos justo debajo.
- **Página de códigos** con todos los activos. Cada uno se copia con un toque.
- **Blog** con listado y páginas de entrada.
- **Enlaces a redes** y correo de colaboraciones.
- **RSS** y **sitemap**.
- **Aviso legal y política de privacidad** — obligatorio en España, y AdSense no
  aprueba sin ellos.
- **Aviso de contenido patrocinado** automático en las entradas marcadas.

**Panel de administración** (en `/admin`, dos personas)

- **Inicio de sesión con Google.** Solo entran los correos de una lista blanca.
- **Cupones**: crear, editar, retirar, eliminar, marcar destacado, fecha de caducidad.
- **Entradas**: crear, editar, eliminar, guardar como borrador, publicar.
- **Fotos**: subir desde el móvil, con vista previa.
- **Opiniones**: producto, nota de 1 a 5, texto y foto.

### Versión 2 — cuando la 1 esté rodando

- Página de una sola marca o producto (para colaboraciones concretas).
- Filtro del blog por tipo de contenido.
- Buscador.
- Programar una entrada para que se publique sola en una fecha.
- Vista previa del Markdown mientras se escribe.

### Fuera de alcance, decidido a propósito

- Comentarios del público. Traen spam y hay que moderarlos.
- Multiidioma. Se puede añadir después si el tráfico lo pide.
- Registro abierto: nadie de fuera crea cuenta. La lista de admins se toca a mano
  en la base de datos, y son dos personas.
- Editor visual tipo Word. El campo de texto es Markdown.

---

## 3. Funciones, una por una

### 3.1 Cupones de descuento

Es la función principal. Viven en la tabla `cupones` y se gestionan desde
`/admin/cupones/`.

Campos: marca, valor, unidad (`% dto` o `€ menos`), código, sobre qué aplica,
enlace, destacado, activo, fecha de caducidad.

Comportamiento:

- Solo se muestran los `activo = true` y no caducados. **Esto lo impone la base
  de datos**, no el código de la web: la política de lectura pública filtra por
  esas dos condiciones. Aunque alguien se saltara la interfaz, no vería un cupón
  retirado.
- Para retirar un cupón se desmarca "Activo", no se borra: así queda el histórico.
- El marcado como destacado sale además girando alrededor de la foto de la portada
  y en la cinta superior.
- Al tocar **Copiar**, el código va al portapapeles y el botón confirma dos segundos.
- El enlace a la tienda lleva `rel="sponsored"`, que es lo que pide Google para
  enlaces pagados.

### 3.2 Blog

Las entradas viven en la tabla `posts` y se escriben desde `/admin/posts/nueva/`.

Campos: título, dirección web, resumen, texto (Markdown), foto de portada,
descripción de la foto, etiquetas, tipo, patrocinada, publicada, fecha.

Detalles que importan:

- **La dirección web se genera sola** desde el título, quitando acentos y
  pasando a guiones. Si la editas a mano, deja de autocompletarse — para que no
  te la cambie sin avisar cuando corriges una errata del título.
- **Borrador y publicada son estados separados.** Puedes dejar algo a medias sin
  que salga en la web. Un borrador no es visible para nadie de fuera, y tampoco
  a través de su dirección directa.
- **"Patrocinada"** añade el aviso legal de colaboración al principio del
  artículo. Es una casilla porque olvidarse de escribirlo es fácil, y es
  obligatorio.
- El **tipo** clasifica la entrada en reseña, día a día, consejos o colaboración.
  Sirve para filtrar más adelante sin tener que reetiquetar nada.

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

### 3.6 Panel de administración

En `/admin`. No aparece en el menú público ni lo indexa Google (`noindex`).

**Quién entra.** Inicio de sesión con Google, y después una segunda comprobación:
el correo tiene que estar en la tabla `admins`. Las dos hacen falta. Sin la
segunda, cualquiera con una cuenta de Gmail entraría.

La lista de admins se edita a mano en Supabase. Son dos personas y no va a
cambiar: no merece la pena una pantalla para gestionarla.

**Tres capas de seguridad, no una:**

1. El *middleware* corta la petición antes de renderizar nada si no eres admin.
2. Las rutas de la API vuelven a comprobar la sesión en cada petición.
3. Las políticas RLS de PostgreSQL rechazan la escritura aunque alguien llame
   directamente a la base de datos con la clave pública.

La tercera es la que de verdad protege. Las dos primeras existen para que el
error se vea antes y mejor.

**Sesión.** Los tokens se guardan en cookies `httpOnly`: JavaScript no puede
leerlas, lo que evita el robo de sesión por XSS. Duran 30 días.

**Fotos.** Se suben a Supabase Storage y quedan públicas por URL. Límite de 8 MB
y solo JPG, PNG, WebP o AVIF. El nombre se genera con marca de tiempo más
identificador aleatorio, para que dos fotos con el mismo nombre del móvil no se
pisen — que es justo lo que pasó con los `FullSizeRender.jpeg` de iOS.

**Escribir desde el móvil** es el caso normal, no la excepción: los campos usan
tamaño de fuente 16px para que iOS no haga zoom al enfocarlos, y los formularios
son de una sola columna en pantallas estrechas.

---

## 4. Stack

**Astro 7 + Supabase, desplegado en Vercel.** Todo en capa gratuita.

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | Astro 7 (modo servidor) | HTML plano, casi cero JavaScript |
| Base de datos | Supabase (PostgreSQL) | Postgres de verdad, no un invento |
| Autenticación | Supabase Auth con Google | Login con Google en tres clics de configuración |
| Fotos | Supabase Storage | 1 GB gratis, URLs públicas |
| Estilos | CSS propio con variables | Sin build extra |
| Hosting | Vercel | Gratis, despliega en cada push |
| Markdown | marked | Convierte el texto del panel a HTML |
| Anuncios | AdSense, en huecos fijos | Ver 3.3 |

### Por qué este cambio

La versión anterior era estática con el contenido en el repositorio. Eso deja de
valer en cuanto quieres formularios: para que la otra persona publique tendría
que usar GitHub, y subir una foto sería un commit. Con panel, base de datos y
subida de archivos, hace falta un servidor.

### Por qué Supabase y no otra cosa

- **No Firebase**: Firestore no es SQL y te obliga a pensar en documentos. Ya
  sabes PostgreSQL — aprovéchalo.
- **No una base de datos propia**: habría que pagar hosting y mantenerla.
- **No un CMS externo** (Sanity, Contentful): el contenido acabaría fuera de tu
  control y la capa gratuita es más caprichosa.
- **No montar la autenticación a mano**: es exactamente el sitio donde no
  conviene improvisar.

Supabase te da Postgres, autenticación y almacenamiento en un solo proyecto
gratuito. Y las políticas RLS son lo que hace que la seguridad viva en la base
de datos y no en el código de la web.

### Lo que hay que saber para tocarlo

Un `.astro` es HTML con un bloque de JavaScript arriba entre `---`. Nada de
hooks ni ciclo de vida. Las consultas son `db.from('posts').select()`, y las
tablas las diseñas en SQL normal.

### Límites de la capa gratuita

| Servicio | Gratis | Cuándo te quedarías corto |
|---|---|---|
| Supabase | 500 MB de base de datos, 1 GB de fotos | Unas 800 fotos a 1 MB. Lejísimos |
| Vercel | 100 GB de tráfico al mes | Decenas de miles de visitas |
| AdSense | — | Requiere dominio propio (ver aviso) |

Un detalle: **Supabase pausa los proyectos gratuitos tras un tiempo sin
actividad.** Con visitas normales no pasa; si la web se queda parada meses, hay
que reactivarlo desde su panel.

---

## 5. Estructura del repositorio

```
bali-web/
├── astro.config.mjs          ← el dominio se pone aquí
├── .env.example              ← copiar a .env
├── REQUISITOS.md             ← este documento
├── supabase/
│   └── schema.sql            ← EJECUTAR ESTO EN SUPABASE, PASO 1
├── public/
└── src/
    ├── middleware.ts         ← protege /admin
    ├── lib/
    │   ├── supabase.ts       ← clientes y sesión
    │   ├── contenido.ts      ← lectura del sitio público
    │   └── markdown.ts
    ├── data/perfil.json      ← nombre, bio, redes, correo
    ├── components/
    │   ├── Cabecera · PieDePagina · TicketCodigo · TarjetaPost
    │   ├── HuecoAnuncio.astro
    │   ├── FormCupon · FormPost · FormOpinion
    │   └── SubirFoto.astro
    ├── layouts/
    │   ├── Base.astro        ← sitio público
    │   └── Admin.astro       ← panel
    ├── pages/
    │   ├── index · codigos · aviso-legal · privacidad · rss.xml.js
    │   ├── blog/index.astro · blog/[slug].astro
    │   ├── admin/
    │   │   ├── login · callback · index
    │   │   ├── cupones/    (index · nuevo · [id])
    │   │   ├── posts/      (index · nueva · [id])
    │   │   └── opiniones/  (index · nueva · [id])
    │   └── api/
    │       ├── sesion.ts · subir-foto.ts
    │       ├── cupones/    (index · [id])
    │       ├── posts/      (index · [id])
    │       └── opiniones/  (index · [id])
    └── styles/global.css     ← los colores están arriba del todo
```

Una vez montado, **el día a día no toca el repositorio**: se hace todo desde
`/admin` en el móvil. El código solo se abre para cambiar el diseño.

---

## 6. Puesta en marcha

### Orden recomendado

1. **Crear el proyecto en Supabase** (gratis, sin tarjeta). Apunta la URL y la
   clave *publishable*.
2. **Ejecutar `supabase/schema.sql`** en SQL Editor → New query → Run. Antes,
   cambia el correo del `insert into admins` por el vuestro.
3. **Activar Google** en Authentication → Providers → Google. Pide un Client ID
   de Google Cloud; el propio Supabase enlaza al sitio donde sacarlo.
4. **Comprar el dominio.** Unos 11 €/año. No es opcional si quieres anuncios.
5. **Subir el repo a GitHub** e importarlo en Vercel. Detecta Astro solo.
6. **Poner las variables de entorno** en Vercel (las de `.env.example`) y
   actualizar `site:` en `astro.config.mjs`.
7. **Entrar en `/admin`** con Google y comprobar que te deja pasar.
8. **Publicar contenido.** Entre 10 y 15 entradas antes de pedir AdSense.
9. **Configurar el banner de consentimiento** desde AdSense.
10. **Solicitar AdSense.** De unos días a cuatro semanas.
11. Rellenar el ID de AdSense en Vercel y redesplegar.

Del 1 al 3 son unos veinte minutos. El resto se hace en un rato.

### Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # ver el resultado del build
```

---

## 7. El día a día

Ritmo previsto:

| Qué | Cada cuánto | Dónde |
|---|---|---|
| Cupones | cuando surja | `/admin/cupones/` |
| Reseñas | 1 o 2 al mes | `/admin/posts/` |
| Fotos y mensajes cortos | ~1 a la semana | `/admin/posts/` |

Publicar una entrada desde el móvil:

1. Abrir la web y entrar en `/admin` (merece la pena guardarla en la pantalla de
   inicio: se abre como una app).
2. **Escribir entrada**.
3. Título, resumen, foto de portada desde la galería, texto.
4. Marcar **Publicada** y guardar. Sale al momento.

Si es algo a medias, guardar sin marcar "Publicada" y seguir otro día.

Sobre las cuatro entradas semanales de fotos: el campo de texto admite Markdown,
pero para una foto y dos frases no hace falta usarlo. Título, foto, dos líneas y
listo.

## 8. Decisiones tomadas y pendientes

### Tomadas

- Astro en modo servidor sobre Supabase, desplegado en Vercel. Todo gratis.
- Inicio de sesión con Google, con lista blanca de correos en base de datos.
- Seguridad en la base de datos (RLS), no solo en el código de la web.
- Contenido en Markdown, en un campo de texto. Sin editor visual.
- Los cupones retirados se desactivan, no se borran.
- Sin comentarios del público.
- Español únicamente, de momento.
- Afiliación como ingreso principal, anuncios como secundario.

### Pendientes

- Nombre del dominio.
- Datos del titular para el aviso legal.
- Los dos correos de Google que entran al panel.
- Si las opiniones deben salir en la portada o solo dentro de las reseñas.

---

## 9. Riesgos

| Riesgo | Qué hacer |
|---|---|
| AdSense rechaza el sitio | Esperado sin dominio propio. Comprarlo antes de solicitar |
| Alguien no autorizado entra al panel | Tres capas: middleware, API y RLS. La de base de datos es la que cuenta |
| Se borra una entrada sin querer | Ahora mismo no hay papelera. Es el hueco más claro de la v1 |
| Supabase pausa el proyecto por inactividad | Solo si la web se queda meses parada. Se reactiva desde su panel |
| El blog se queda sin actualizar | Mejor una entrada al mes sostenida que cinco de golpe y nada más |
| Los anuncios estropean la experiencia | Las reglas del 3.3 son el límite. Si molestan, se quitan |