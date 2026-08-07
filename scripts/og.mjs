/**
 * Genera public/og.jpg — la imagen que sale cuando alguien comparte la web
 * en WhatsApp, Instagram, X o Telegram.
 *
 *   node scripts/og.mjs
 *
 * Se ejecuta a mano, no en cada build: la imagen cambia una vez al año como
 * mucho y no merece la pena pagar el coste en cada despliegue.
 *
 * Mide 1200×630, que es lo que piden Open Graph y Twitter Cards. Con otra
 * proporción, WhatsApp recorta por donde le parece.
 *
 * Usa sharp, que ya viene con Astro para optimizar imágenes: no hace falta
 * instalar nada. Las tipografías son las del sistema porque sharp no carga
 * las de Google Fonts; el parecido con la web se consigue con los colores.
 */
import sharp from 'sharp';

const ANCHO = 1200;
const ALTO = 630;
const FOTO = 'src/assets/bali-1.jpg';
const SALIDA = 'public/og.jpg';

const COLORES = {
  fondo: '#1B0F0A',
  crema: '#FFF3E9',
  cremaApagada: '#C6A895',
  rosa: '#FF2E63',
  naranja: '#FF9F1C',
};

// --- La foto, recortada en círculo -------------------------------------
const DIAMETRO = 400;

const mascara = Buffer.from(
  `<svg width="${DIAMETRO}" height="${DIAMETRO}">
     <circle cx="${DIAMETRO / 2}" cy="${DIAMETRO / 2}" r="${DIAMETRO / 2}" fill="#fff"/>
   </svg>`,
);

const circulo = await sharp(FOTO)
  // `attention` centra el recorte en la zona con más contraste, que en esta
  // foto es la cara del perro. Con 'top' salía media cesta.
  .resize(DIAMETRO, DIAMETRO, { fit: 'cover', position: sharp.strategy.attention })
  .composite([{ input: mascara, blend: 'dest-in' }])
  .png()
  .toBuffer();

// --- El fondo con los textos -------------------------------------------
const fondo = Buffer.from(`
<svg width="${ANCHO}" height="${ALTO}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${ANCHO}" height="${ALTO}" fill="${COLORES.fondo}"/>
  <circle cx="230" cy="315" r="212" fill="none" stroke="${COLORES.rosa}" stroke-width="7"/>
  <text x="500" y="250" font-family="Arial Black, Arial, sans-serif" font-size="112"
        font-weight="900" fill="${COLORES.crema}" letter-spacing="-3">BALI</text>
  <text x="500" y="320" font-family="Arial, sans-serif" font-size="34" fill="${COLORES.naranja}">
    Códigos de descuento para perros
  </text>
  <text x="500" y="374" font-family="Arial, sans-serif" font-size="27" fill="${COLORES.cremaApagada}">
    Reseñas honestas · calculadoras gratis
  </text>
  <rect x="500" y="424" width="300" height="58" rx="29" fill="${COLORES.rosa}"/>
  <text x="530" y="462" font-family="Courier New, monospace" font-size="24"
        font-weight="bold" fill="#FFFFFF">CANICHE TOY</text>
</svg>
`);

await sharp(await sharp(fondo).png().toBuffer())
  .composite([{ input: circulo, left: 30, top: 115 }])
  .jpeg({ quality: 86 })
  .toFile(SALIDA);

console.log(`Escrito ${SALIDA} (${ANCHO}×${ALTO})`);
