import { describe, expect, it } from 'vitest';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it.each([
    '/academia',
    '/academia/b1-l1?tab=contenido',
    '/practica',
    '/estudiante',
    '/docente',
    '/admin/invitaciones',
  ])('acepta una ruta interna permitida: %s', (destination) => {
    expect(safeNext(destination)).toBe(destination);
  });

  it.each([
    'https://evil.example',
    '//evil.example',
    '/\\\\evil.example',
    '\\\\evil.example',
    '/login',
    '/academia/../../login',
    '/academia\u0000evil',
    '/' + 'a'.repeat(301),
  ])('rechaza destinos no permitidos: %s', (destination) => {
    expect(safeNext(destination, '/academia')).toBe('/academia');
  });

  it('usa el fallback para valores que no son texto', () => {
    expect(safeNext(null, '/estudiante')).toBe('/estudiante');
    expect(safeNext(undefined, '/estudiante')).toBe('/estudiante');
    expect(safeNext('', '/estudiante')).toBe('/estudiante');
  });
});
