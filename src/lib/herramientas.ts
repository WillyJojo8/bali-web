/**
 * Índice de las calculadoras.
 *
 * Están en un archivo aparte porque las usan tres sitios: la página
 * /herramientas/, el mapa del sitio y los enlaces del pie. Añadir una
 * herramienta es añadir una entrada aquí y su página en
 * src/pages/herramientas/.
 *
 * Por qué existen: son las páginas que traen visitas de Google sin depender
 * de que nadie publique nada. Alguien busca "cuánta comida darle a mi perro",
 * llega, usa la calculadora, y de paso ve los códigos de descuento.
 */
export interface Herramienta {
  ruta: string;
  titulo: string;
  /** Título corto para las tarjetas. */
  corto: string;
  descripcion: string;
  emoji: string;
  /** La búsqueda concreta que se quiere ganar con esta página. */
  busqueda: string;
}

export const HERRAMIENTAS: Herramienta[] = [
  {
    ruta: '/herramientas/edad-perro/',
    titulo: 'Calculadora de edad de perro a humano',
    corto: 'Edad del perro',
    descripcion:
      'Cuántos años humanos tiene tu perro, según su tamaño. Un caniche toy de 7 años no está en el mismo momento vital que un mastín de 7.',
    emoji: '🎂',
    busqueda: 'edad de perro a humano',
  },
  {
    ruta: '/herramientas/racion-diaria/',
    titulo: 'Calculadora de ración diaria de pienso',
    corto: 'Ración diaria',
    descripcion:
      'Cuántos gramos de pienso al día necesita tu perro por peso, edad y actividad. Con la fórmula veterinaria estándar, no con la tabla del saco.',
    emoji: '🥣',
    busqueda: 'cuánta comida darle a mi perro al día',
  },
  {
    ruta: '/herramientas/talla-arnes/',
    titulo: 'Calculadora de talla de arnés y collar',
    corto: 'Talla de arnés',
    descripcion:
      'Mide el contorno de pecho y cuello de tu perro y te decimos qué talla pedir, para que no tengas que devolver el arnés.',
    emoji: '📏',
    busqueda: 'qué talla de arnés para mi perro',
  },
  {
    ruta: '/herramientas/chocolate/',
    titulo: '¿Cuánto chocolate es peligroso para un perro?',
    corto: 'Chocolate y perros',
    descripcion:
      'Ha comido chocolate. Calcula si la cantidad es preocupante según el tipo, el peso del perro y lo que se ha comido.',
    emoji: '🍫',
    busqueda: 'mi perro ha comido chocolate qué hago',
  },
];
