# SEO · qué búsquedas queremos ganar y cómo

Documento de estrategia. Agosto de 2026.

Esto no es una lista de trucos. Es el mapa de qué página compite por qué
búsqueda, para que al escribir un cupón o una entrada sepas dónde encaja.

---

## 1. La idea en un párrafo

**No vamos a ganar «cupones descuento perros» y no hay que intentarlo.** Esa
búsqueda la copan Chollometro, Cupones.es, RadarCupón y Cupon.es: agregadores
con miles de tiendas, años de antigüedad y presupuesto. Pelear ahí es tirar el
tiempo.

Lo que sí podemos ganar, y rápido:

| Tipo de búsqueda | Ejemplo | Por qué la ganamos |
|---|---|---|
| **Marca propia** | «bali the poodletoy código» | Nadie más compite por ella |
| **Tienda pequeña + código** | «código descuento The Doog Life» | Somos la fuente oficial del código |
| **Duda concreta con calculadora** | «cuánta comida darle a mi perro» | Herramienta útil > artículo de relleno |
| **Reseña honesta de producto** | «opinión arnés para caniche toy» | Nicho estrecho, poca competencia |

Las cuatro tienen algo en común: **poca competencia y mucha intención**. Quien
busca «código descuento The Doog Life» ya tiene el carrito lleno.

---

## 2. Qué página compite por qué

| Página | Búsqueda objetivo | Estado |
|---|---|---|
| `/` | «bali the poodletoy», «bali caniche toy» | Marca |
| `/codigos/` | «cupones descuento para perros», «códigos tiendas de perros» | Difícil, va de refuerzo |
| `/codigos/[tienda]/` | «código descuento *tienda*», «cupón *tienda*» | **La joya. Una por tienda** |
| `/tiendas/` | «tiendas de perros con descuento» | Enlaza a todas las anteriores |
| `/opiniones/` | «opiniones productos para perros», «reseñas arneses perro» | Media |
| `/herramientas/racion-diaria/` | «cuánta comida darle a mi perro al día», «calculadora ración perro» | **Mucho volumen** |
| `/herramientas/edad-perro/` | «edad de perro a humano», «calculadora edad perro» | **Muchísimo volumen** |
| `/herramientas/talla-arnes/` | «qué talla de arnés para mi perro» | Volumen medio, compra detrás |
| `/herramientas/chocolate/` | «mi perro ha comido chocolate» | Urgente y muy buscada |
| `/blog/[slug]/` | La búsqueda concreta de cada entrada | Depende de lo que escribas |
| `/blog/etiqueta/[tema]/` | «arnés perro pequeño», «peluquería caniche» | Agrupa el blog por tema |

La página de una tienda se crea sola en cuanto añades un cupón de esa marca en
el panel. No hay que tocar código: se genera con su título, su descripción, sus
preguntas propias y sus datos estructurados.

---

## 3. Las palabras, escritas

Están en `src/lib/seo.ts` (constante `CLAVES`) para poder cambiarlas en un
sitio. Las que se están usando ahora mismo:

**Cupones**
- cupones de descuento para perros
- códigos descuento tiendas de perros
- descuentos accesorios para perros
- cupones tienda de mascotas
- código descuento *(nombre de cada tienda)*

**Producto y reseña**
- opiniones productos para perros
- reseñas accesorios para perros
- mejor arnés para perro pequeño
- arnés para caniche toy

**Calculadoras**
- cuánta comida darle a mi perro al día
- calculadora ración perro
- edad de perro a humano
- qué talla de arnés para mi perro
- chocolate tóxico para perros

**Cola larga que sale gratis del blog** (una entrada por cada una, cuando
tengas algo que contar): «cortar el pelo a un caniche toy», «cuánto cuesta
mantener un perro pequeño», «cama para perro que no destroce», «mi perro no
come pienso», «arnés antiescape para perro pequeño».

### Cómo se usan sin que cante

Cada página usa su palabra en cuatro sitios: el `<title>`, el `<h1>`, la
primera frase del texto y el nombre de algún enlace interno. Y ya. Repetirla
quince veces no sube posiciones desde hace más de una década, y sí hace que la
página se lea fatal.

Los títulos llevan el mes (`· agosto de 2026`) porque en cupones la frescura es
media posición gratis, y se genera solo con `mesActual()`.

---

## 4. El dominio

### Qué importa de verdad

Poco. Google dejó de dar peso a las palabras clave en el dominio en 2012 (la
actualización *EMD*). Un dominio como `cupones-perros-baratos.com` no sube nada
y encima da mala espina a quien lo ve.

Lo que sí importa:

1. **Que se recuerde al oírlo en una story.** Es tu principal fuente de tráfico.
2. **Que sea corto y se escriba sin dudar.** Nada de guiones ni números.
3. **`.com` o `.es`.** El `.es` ayuda un pelín en búsquedas desde España; el
   `.com` se recuerda mejor. Cualquiera de los dos vale.
4. **Que aguante.** El dominio no se cambia luego sin perder posiciones.

### Candidatos

Ordenados por lo que recomendaría:

| Dominio | A favor | En contra |
|---|---|---|
| **balithepoodletoy.com** | Idéntico a Instagram y TikTok. Quien te ve en una story lo teclea bien a la primera | Largo de escribir |
| **bali.dog** | Cortísimo, se recuerda solo, `.dog` dice el tema sin decirlo | Los `.dog` cortos suelen ser de pago alto |
| **balipoodle.com** | Corto, une marca y raza | Pierde el «the toy» del usuario de Instagram |
| **cuponesdebali.com** | Dice exactamente lo que hay dentro | Encierra la web en los cupones; el blog y las calculadoras se quedan fuera |
| **elmundodebali.com** | Da sitio a todo lo que hay | No dice nada del contenido |

**Recomendación:** `balithepoodletoy.com` si sigue libre — que el dominio
coincida con el nombre de las redes vale más que cualquier palabra clave
metida a la fuerza. Si te parece largo, `bali.dog`.

Comprueba disponibilidad en cualquier registrador (Namecheap, Porkbun,
Dinahosting si lo quieres en España). Unos 11 €/año, y ojo con el precio de
renovación, que suele ser el doble del primer año.

### El día que lo compres

1. Ponlo en Vercel → Settings → Domains.
2. Añade la variable `PUBLIC_SITE_URL` con el dominio, sin barra final.
3. Redespliega. Las URLs canónicas, el mapa del sitio, el RSS y todo el JSON-LD
   se actualizan solos: no hay nada más que tocar en el código.

---

## 5. Qué hacer el día del lanzamiento

En orden, todo gratis:

1. **Google Search Console** — añade la propiedad, verifica con el registro DNS
   y envía `https://tudominio/sitemap.xml`. Sin esto, Google tarda semanas en
   encontrarte; con esto, días.
2. **Bing Webmaster Tools** — se importa desde Search Console en dos clics. Es
   el buscador de ChatGPT y de Copilot, y ahí hay menos cola.
3. **Enlace en la bio de Instagram y de TikTok.** Es tu primer enlace y el que
   más tráfico va a traer el primer mes.
4. **Pide que te enlacen las tiendas con las que colaboras.** Muchas tienen
   página de «embajadores» o «colaboradores». Un enlace desde una tienda real
   vale más que cien de directorios.
5. **Date de alta en agregadores de códigos de influencer** (Influcódigos y
   similares). Te mandan tráfico y te dan un enlace.
6. **Perfil de empresa en Google** no aplica: no hay local físico.

---

## 6. Qué hacer cada semana (quince minutos)

- **Repasar los cupones y tocar «Comprobado el».** Es lo que mantiene el
  «verificado hace dos días» en la web, y es la única ventaja real frente a los
  agregadores grandes: ellos tienen cupones muertos de 2019.
- **Retirar los que ya no valen** desmarcando «Activo» en vez de borrarlos.
- **Mirar Search Console** → Rendimiento → Consultas. Las búsquedas por las que
  ya sales en la posición 8-15 son las que más barato se suben: escribe una
  entrada centrada en esa búsqueda concreta.

Y cada mes, una entrada. Una de verdad, con fotos propias y opinión. Es lo que
sostiene todo lo demás.

---

## 7. Lo que no vamos a hacer

- **Repetir palabras clave** hasta que el texto no se pueda leer.
- **Inventarnos notas ni descuentos** en los datos estructurados. Marcar algo
  que no está visible en la página es motivo de penalización manual, y las
  manuales cuestan meses de quitar.
- **Comprar enlaces.** Es la vía rápida a una penalización.
- **Copiar descripciones de las tiendas.** Contenido duplicado: la página no se
  indexa y encima queda peor escrita.
- **Publicar entradas de relleno generadas a destajo.** Desde la actualización
  de contenido útil de 2022, eso arrastra hacia abajo al sitio entero, no solo
  a esas páginas.

---

## 8. Qué ya está hecho en el código

Para que no lo rehagas sin querer:

- **Datos estructurados** en todas las páginas (`src/lib/jsonld.ts`): identidad
  del sitio, migas de pan, ofertas de cada cupón, artículos del blog, reseñas
  con nota y preguntas frecuentes. Todo en un solo bloque `@graph` por página.
- **Mapa del sitio dinámico** en `/sitemap.xml`, con todas las entradas,
  etiquetas, tiendas y calculadoras. Se actualiza al publicar, sin desplegar.
- **`robots.txt` generado**, con el panel y la API fuera y el mapa apuntando al
  dominio que haya en `PUBLIC_SITE_URL`.
- **Canónicas, Open Graph y Twitter Cards** en todas las páginas, con
  `max-image-preview:large` para que Google pueda usar la foto grande.
- **Imagen de compartir** en `public/og.jpg`, que se regenera con
  `node scripts/og.mjs`.
- **Una página por tienda y una por etiqueta**, creadas solas a partir de lo
  que haya en la base de datos.
- **Enlaces internos** desde el pie, el menú, las entradas relacionadas y las
  llamadas al final de cada artículo y calculadora.

---

## 9. Cómo saber si funciona

A los 30 días: que Search Console diga que hay páginas indexadas y que
aparezcan las primeras impresiones. Todavía no habrá visitas de Google, y es
normal.

A los 90: entre 100 y 500 visitas al mes desde buscadores, casi todas a las
calculadoras y a las páginas de tienda. Si a los 90 días no hay ninguna, algo
está mal configurado — mira primero que el sitio no esté en `noindex` y que el
mapa esté enviado.

Al año, con una entrada al mes y los cupones al día, lo razonable son unas
mil visitas mensuales desde Google. No es una cifra emocionante; es una cifra
real para un sitio nuevo en un nicho pequeño, y da para que las colaboraciones
salgan solas.
