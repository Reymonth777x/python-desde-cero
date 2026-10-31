import { describe, expect, it } from 'vitest';
import { aplicarEvento, describirRio, estadoInicial } from './replay';

describe('replay de eventos', () => {
  it('Nilo empieza en el muelle y los eventos mueven el estado sin mutar el anterior', () => {
    const inicio = estadoInicial(['######', '#M..B#', '######']);
    expect(inicio.nilo).toEqual({ c: 1, f: 1, rumbo: 'este' });
    const movido = aplicarEvento(inicio, { t: 'move', c: 2, f: 1, rumbo: 'este', step: 1 });
    expect(movido.nilo.c).toBe(2);
    expect(inicio.nilo.c).toBe(1);
  });
  it('las celdas cambian y la bitácora crece', () => {
    let e = estadoInicial(['######', '#M~~B#', '######']);
    e = aplicarEvento(e, { t: 'cell', c: 2, f: 1, kind: 'J', step: 1 });
    e = aplicarEvento(e, { t: 'say', text: 'hola', step: 2 });
    expect(e.mapa[1]).toBe('#MJ~B#');
    expect(e.bitacora).toEqual(['hola']);
  });
  it('describe dónde está Nilo y qué tiene delante', () => {
    const e = estadoInicial(['######', '#M..B#', '######']);
    expect(describirRio(e)).toContain('columna 1, fila 1, mirando al este. Delante hay agua.');
    expect(describirRio(e, true)).not.toContain('El mapa mide');
  });
});
