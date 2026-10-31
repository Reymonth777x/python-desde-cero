import { describe, expect, it } from 'vitest';
import { courseCatalog } from '@/lib/course-catalog';
import { APERTURAS, CAMPANA, TODOS_LOS_TRAMOS, TRAMOS, abiertosPara, estaDesbloqueado, siguienteTramo, tramoDeLeccion } from './catalog';
import { DATOS, construirPayload } from './chapters';

const lecciones = new Set(courseCatalog.flatMap((m) => m.lessons.map((l) => l.id)));

describe('catálogo de Orilla', () => {
  it('cada tramo enlaza una lección que existe en el curso', () => {
    for (const id of TODOS_LOS_TRAMOS) expect(lecciones.has(TRAMOS[id].lessonId)).toBe(true);
  });
  it('toda apertura apunta a un tramo conocido', () => {
    const conocidos = new Set<string>(TODOS_LOS_TRAMOS);
    for (const tabla of Object.values(APERTURAS)) for (const tramo of Object.values(tabla)) expect(conocidos.has(tramo)).toBe(true);
  });
  it('lo abierto crece tramo a tramo y los extras no se filtran a la campaña', () => {
    expect(abiertosPara('c01').verbos).toEqual(['avanzar']);
    expect(abiertosPara('c07').verbos).toContain('frente_libre');
    expect(abiertosPara('c07').verbos).not.toContain('sembrar');
    expect(abiertosPara('c12').verbos).not.toContain('anotar');
    expect(abiertosPara('abierta').verbos).toContain('anotar');
    expect(abiertosPara('reto-luces').verbos).toContain('brillo');
    expect(abiertosPara('reto-luces').verbos).not.toContain('registrar');
    expect(abiertosPara('c05').constructos).not.toContain('while');
  });
  it('cada tramo pide el anterior y los extras piden c12', () => {
    expect(estaDesbloqueado('c01', new Set())).toBe(true);
    expect(estaDesbloqueado('c02', new Set())).toBe(false);
    expect(estaDesbloqueado('c02', new Set(['c01']))).toBe(true);
    expect(estaDesbloqueado('abierta', new Set(['c11']))).toBe(false);
    expect(estaDesbloqueado('abierta', new Set(['c12']))).toBe(true);
    expect(siguienteTramo('c12')).toBeNull();
    expect(siguienteTramo('c03')).toBe('c04');
  });
  it('cada lección de la campaña resuelve a su tramo', () => {
    expect(tramoDeLeccion('b3-l4')).toBe('c07');
    expect(tramoDeLeccion('b1-l4')).toBeNull();
  });
});

describe('datos de los tramos', () => {
  it('cada mapa es rectangular y tiene un solo muelle', () => {
    for (const id of TODOS_LOS_TRAMOS) for (const variante of DATOS[id].variantes) {
      const ancho = variante.mapa[0].length;
      expect(variante.mapa.every((fila) => fila.length === ancho)).toBe(true);
      expect(variante.mapa.join('').split('M').length - 1).toBe(1);
    }
  });
  it('los patrones de mapa_igual miden lo mismo que su mapa', () => {
    for (const id of TODOS_LOS_TRAMOS) for (const variante of DATOS[id].variantes) {
      for (const objetivo of [...DATOS[id].objetivos, ...(variante.objetivos ?? [])]) {
        if (objetivo.t !== 'mapa_igual') continue;
        expect(objetivo.patron.length).toBe(variante.mapa.length);
        objetivo.patron.forEach((fila, i) => expect(fila.length).toBe(variante.mapa[i].length));
      }
    }
  });
  it('el campo id de cada tramo coincide con su clave', () => {
    for (const id of TODOS_LOS_TRAMOS) expect(DATOS[id].id).toBe(id);
    expect(CAMPANA).toHaveLength(12);
  });
  it('el payload del motor no lleva textos de interfaz', () => {
    const payload = construirPayload('c07') as unknown as Record<string, unknown>;
    expect(payload.andamiaje).toBeUndefined();
    expect(payload.ayuda).toBeUndefined();
    expect(payload.abiertos).toBeDefined();
  });
});
