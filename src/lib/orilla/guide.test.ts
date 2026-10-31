import { describe, expect, it } from 'vitest';
import { TODOS_LOS_TRAMOS, abiertosPara } from './catalog';
import { DOC_VERBOS } from './ayuda-verbos';
import { GUIA_ORILLA, SIMBOLOS_ORILLA } from './guide';

describe('guía inicial de Orilla', () => {
  it('incluye una misión y pasos claros para los 15 tramos', () => {
    expect(Object.keys(GUIA_ORILLA).sort()).toEqual([...TODOS_LOS_TRAMOS].sort());
    for (const id of TODOS_LOS_TRAMOS) {
      const guia = GUIA_ORILLA[id];
      expect(guia.mision.trim().length, id).toBeGreaterThan(35);
      expect(guia.pasos.length, id).toBeGreaterThanOrEqual(3);
      expect(guia.idea.trim(), id).not.toBe('');
      expect(guia.pista.trim(), id).not.toBe('');
      expect(guia.comandos.length, id).toBeGreaterThan(0);
    }
  });

  it('solo explica comandos que ya están habilitados en cada tramo', () => {
    for (const id of TODOS_LOS_TRAMOS) {
      const abiertos = abiertosPara(id);
      const permitidos = new Set([...abiertos.verbos, ...abiertos.builtins]);
      for (const comando of GUIA_ORILLA[id].comandos) {
        expect(permitidos.has(comando), `${id}: ${comando} no está abierto`).toBe(true);
        expect(DOC_VERBOS[comando], `${id}: falta explicación de ${comando}`).toBeTruthy();
      }
    }
  });

  it('el primer tramo ofrece un ejemplo que lleva hasta la boya', () => {
    expect(GUIA_ORILLA.c01.ejemplo).toBe('avanzar()\\navanzar()\\navanzar()');
  });

  it('la leyenda no repite símbolos y explica los elementos del río', () => {
    const codigos = SIMBOLOS_ORILLA.map((item) => item.simbolo);
    expect(new Set(codigos).size).toBe(codigos.length);
    for (const item of SIMBOLOS_ORILLA) {
      expect(item.nombre).not.toBe('');
      expect(item.detalle).not.toBe('');
    }
  });
});
