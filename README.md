# bali-web

Web y miniblog de **Bali**, caniche toy chocolate ([@bali_the_poodletoy](https://www.instagram.com/bali_the_poodletoy)).

Astro 7 · sitio estático · sin base de datos.

📄 **Los requisitos completos están en [REQUISITOS.md](./REQUISITOS.md).**

## Empezar

```bash
npm install
npm run dev      # http://localhost:4321
```

## Las dos cosas que vas a editar

| Quiero… | Voy a… |
|---|---|
| Cambiar un código de descuento | `src/data/codigos.json` |
| Escribir una entrada | crear un `.md` en `src/content/posts/` |
| Cambiar la bio o las redes | `src/data/perfil.json` |
| Cambiar los colores | las variables de arriba de `src/styles/global.css` |
| Poner el dominio | `site:` en `astro.config.mjs` |

## Antes de publicar

- [ ] Dominio comprado y puesto en `astro.config.mjs` y en `public/robots.txt`
- [ ] Datos del titular en `src/pages/aviso-legal.astro`
- [ ] Correo real en `src/data/perfil.json`
- [ ] URLs reales en `src/data/codigos.json`
- [ ] Una imagen `public/og.jpg` de 1200×630 para cuando se comparta el enlace

## Anuncios

Están apagados mientras `PUBLIC_ADSENSE_ID` esté vacío: el componente
`HuecoAnuncio` no pinta nada. Para activarlos, rellena las variables en Vercel
y redespliega. Ver el apartado 3.3 de REQUISITOS.md.

## Desplegar

Push a GitHub → importar en Vercel → detecta Astro solo. Cada push despliega.
