/**
 * Textos de fecha en cristiano.
 *
 * Los dos que importan en una web de cupones:
 *   - "Verificado hoy" → confianza. Es la diferencia entre esta web y las
 *     que tienen cupones de 2019 que no funcionan.
 *   - "Caduca mañana" → urgencia. Hace que la gente use el código ahora.
 */

/** Días entre hoy y una fecha (negativo = ya pasó). Ignora la hora. */
export function diasHasta(fecha: string | Date): number {
  const dia = 86_400_000;
  const objetivo = new Date(fecha);
  const hoy = new Date();
  const a = Date.UTC(objetivo.getFullYear(), objetivo.getMonth(), objetivo.getDate());
  const b = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round((a - b) / dia);
}

export interface Caducidad {
  texto: string;
  /** true cuando quedan tres días o menos: se pinta en rosa. */
  urgente: boolean;
}

export function textoCaducidad(caduca: string | null | undefined): Caducidad | null {
  if (!caduca) return null;
  const dias = diasHasta(caduca);
  if (dias < 0) return null; // RLS ya no lo devolvería, pero por si acaso.
  if (dias === 0) return { texto: 'Último día', urgente: true };
  if (dias === 1) return { texto: 'Caduca mañana', urgente: true };
  if (dias <= 3) return { texto: `Caduca en ${dias} días`, urgente: true };
  if (dias <= 30) return { texto: `Caduca en ${dias} días`, urgente: false };
  return {
    texto: `Válido hasta el ${new Date(caduca).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
    urgente: false,
  };
}

export function textoVerificado(verificado: string | null | undefined): string | null {
  if (!verificado) return null;
  const dias = -diasHasta(verificado);
  if (dias < 0) return 'Verificado hoy';
  if (dias === 0) return 'Verificado hoy';
  if (dias === 1) return 'Verificado ayer';
  if (dias < 7) return `Verificado hace ${dias} días`;
  if (dias < 14) return 'Verificado la semana pasada';
  if (dias < 60) return `Verificado hace ${Math.round(dias / 7)} semanas`;
  return `Verificado en ${new Date(verificado).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
}

export function fechaLegible(fecha: string | Date): string {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "7 de agosto" — para el titular de la página de códigos. */
export function hoyLegible(): string {
  return new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

/** "agosto de 2026" — en los títulos, le dice a Google que la página está viva. */
export function mesActual(): string {
  return new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}
