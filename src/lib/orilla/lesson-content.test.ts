import { describe, expect, it } from 'vitest';
import { TODOS_LOS_TRAMOS } from './catalog';
import { MICROLECCIONES_ORILLA } from './lesson-content';

describe('microlecciones narrativas de Orilla', () => {
  it('explica un concepto de Python en cada uno de los 15 escenarios', () => {
    expect(Object.keys(MICROLECCIONES_ORILLA).sort()).toEqual([...TODOS_LOS_TRAMOS].sort());
    for (const id of TODOS_LOS_TRAMOS) {
      const leccion = MICROLECCIONES_ORILLA[id];
      expect(leccion.historia.trim().length, id).toBeGreaterThan(35);
      expect(leccion.explicacion.trim().length, id).toBeGreaterThan(60);
      expect(leccion.ejemplo.trim(), id).not.toBe('');
      expect(leccion.pregunta.trim(), id).not.toBe('');
      expect(leccion.respuesta.trim(), id).not.toBe('');
      expect(leccion.reto.trim(), id).not.toBe('');
    }
  });

  it('incluye ejemplos enfocados en el concepto, no una solución completa automática', () => {
    expect(MICROLECCIONES_ORILLA.c01.ejemplo).toContain('avanzar()');
    expect(MICROLECCIONES_ORILLA.c06.ejemplo).toContain('if');
    expect(MICROLECCIONES_ORILLA.c07.ejemplo).toContain('while');
    expect(MICROLECCIONES_ORILLA.c08.ejemplo).toContain('for');
    expect(MICROLECCIONES_ORILLA.c10.ejemplo).toContain('def');
    expect(MICROLECCIONES_ORILLA.c11.ejemplo).toContain('registrar');
  });
});
