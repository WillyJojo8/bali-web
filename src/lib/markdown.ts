import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

/** Convierte el markdown del panel en HTML. */
export function aHtml(md: string): string {
  return marked.parse(md ?? '', { async: false }) as string;
}

/**
 * Minutos de lectura. 200 palabras por minuto es la media de lectura en
 * pantalla en español; nunca devuelve menos de uno para que no salga
 * "0 min" en una entrada de dos frases.
 */
export function minutosLectura(md: string): number {
  const palabras = (md ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}
