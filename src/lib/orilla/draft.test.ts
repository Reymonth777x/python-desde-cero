import { describe, expect, it } from 'vitest';
import { recuperarBorradorOrilla } from './draft';

describe('recuperarBorradorOrilla', () => {
  it('recupera un borrador móvil más reciente que el guardado remoto', () => {
    expect(recuperarBorradorOrilla(
      JSON.stringify({ code: 'avanzar()\navanzar()', at: 2000 }),
      1000,
      '# Escribe aquí',
    )).toBe('avanzar()\navanzar()');
  });

  it('no reemplaza el avance remoto por un borrador antiguo o de la misma versión', () => {
    const contenido = JSON.stringify({ code: 'print("antiguo")', at: 900 });
    expect(recuperarBorradorOrilla(contenido, 1000, '# Inicio')).toBeNull();
    expect(recuperarBorradorOrilla(
      JSON.stringify({ code: '# Inicio', at: 2000 }),
      1000,
      '# Inicio',
    )).toBeNull();
  });

  it('conserva un borrador vacío si es una edición nueva y válida', () => {
    expect(recuperarBorradorOrilla(
      JSON.stringify({ code: '', at: 2000 }),
      1000,
      '# Inicio',
    )).toBe('');
  });

  it('ignora JSON corrupto y fechas no válidas sin romper la partida', () => {
    expect(recuperarBorradorOrilla('{no es json', 0, '')).toBeNull();
    expect(recuperarBorradorOrilla(
      JSON.stringify({ code: 'avanzar()', at: Number.NaN }),
      0,
      '',
    )).toBeNull();
  });
});
