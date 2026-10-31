/** Recupera un borrador local solo si es más reciente que el último guardado en la cuenta. */
export function recuperarBorradorOrilla(
  contenido: string | null,
  guardadoEn: number,
  codigoInicial: string,
): string | null {
  if (!contenido) return null;

  try {
    const borrador: unknown = JSON.parse(contenido);
    if (typeof borrador !== 'object' || borrador === null) return null;
    const valor = borrador as Record<string, unknown>;

    if (
      typeof valor.code !== 'string' ||
      typeof valor.at !== 'number' ||
      !Number.isFinite(valor.at) ||
      !Number.isFinite(guardadoEn) ||
      valor.at <= guardadoEn ||
      valor.code === codigoInicial
    ) {
      return null;
    }

    return valor.code;
  } catch {
    return null;
  }
}
