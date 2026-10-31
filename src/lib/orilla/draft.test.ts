import { describe, expect, it } from 'vitest';
import { recuperarBorradorOrilla, timestampGuardadoOrilla } from './draft';

describe('timestampGuardadoOrilla', () => {
  it('usa cero solo cuando no existe un guardado remoto', () => {
    expect(timestampGuardadoOrilla(null)).toBe(0);
  });

  it('convierte una fecha remota válida a milisegundos', () => {
    const fecha = '2026-10-31T06:00:00.000Z';
    expect(timestampGuardadoOrilla(fecha)).toBe(Date.parse(fecha));
  });

  it('rechaza fechas presentes pero inválidas, sin degradarlas a cero', () => {
    expect(timestampGuardadoOrilla('fecha-no-válida')).toBeNull();
    expect(timestampGuardadoOrilla('')).toBeNull();
  });
});

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

  it('ignora JSON corrupto y fechas locales o remotas no válidas sin romper la partida', () => {
    expect(recuperarBorradorOrilla('{no es json', 0, '')).toBeNull();
    expect(recuperarBorradorOrilla(
      JSON.stringify({ code: 'avanzar()', at: Number.NaN }),
      0,
      '',
    )).toBeNull();
    expect(recuperarBorradorOrilla(
      JSON.stringify({ code: 'avanzar()', at: 2000 }),
      Number.NaN,
      '',
    )).toBeNull();
  });
});
