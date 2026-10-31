import type { EventoOrilla, ResultadoVariante, Rumbo } from './types';

export type EstadoRio = { mapa: string[]; nilo: { c: number; f: number; rumbo: Rumbo }; bitacora: string[] };
const TIPOS: Record<string, string> = { '.': 'agua', '~': 'agua baja', '#': 'orilla', J: 'junco', R: 'rama', B: 'boya', M: 'muelle', S: 'seco', '*': 'muestra', F: 'pez', L: 'luz', x: 'fuera del mapa' };
const DELTA: Record<Rumbo, [number, number]> = { norte: [0, -1], este: [1, 0], sur: [0, 1], oeste: [-1, 0] };
export function estadoInicial(mapa: string[], rumbo: Rumbo = 'este'): EstadoRio {
  let c = 0, f = 0;
  mapa.some((fila, y) => { const x = fila.indexOf('M'); if (x >= 0) { c = x; f = y; return true; } return false; });
  return { mapa, nilo: { c, f, rumbo }, bitacora: [] };
}
export function estadoFinal(v: ResultadoVariante): EstadoRio { return { mapa: v.final.mapa, nilo: v.final.nilo, bitacora: v.log }; }
export function aplicarEvento(estado: EstadoRio, ev: EventoOrilla): EstadoRio {
  switch (ev.t) {
    case 'move': return { ...estado, nilo: { c: ev.c, f: ev.f, rumbo: ev.rumbo } };
    case 'turn': return { ...estado, nilo: { ...estado.nilo, rumbo: ev.rumbo } };
    case 'cell': { const mapa = estado.mapa.slice(); const fila = mapa[ev.f]; mapa[ev.f] = fila.slice(0, ev.c) + ev.kind + fila.slice(ev.c + 1); return { ...estado, mapa }; }
    case 'say': return { ...estado, bitacora: [...estado.bitacora, ev.text] };
    default: return estado;
  }
}
export function tipoEn(estado: EstadoRio, c: number, f: number): string { const ch = estado.mapa[f]?.[c]; return ch === undefined ? 'fuera del mapa' : (TIPOS[ch] ?? 'fuera del mapa'); }
export function describirRio(estado: EstadoRio, ocultarMapa = false): string {
  const { c, f, rumbo } = estado.nilo; const [dc, df] = DELTA[rumbo]; const delante = tipoEn(estado, c + dc, f + df);
  const base = `Nilo está en la columna ${c}, fila ${f}, mirando al ${rumbo}. Delante hay ${delante}.`;
  return ocultarMapa ? base : `${base} El mapa mide ${estado.mapa[0]?.length ?? 0} por ${estado.mapa.length}.`;
}
