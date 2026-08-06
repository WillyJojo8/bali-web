import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

/** Convierte el markdown del panel en HTML. */
export function aHtml(md: string): string {
  return marked.parse(md ?? '', { async: false }) as string;
}
