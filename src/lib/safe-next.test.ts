import { describe, expect, it } from 'vitest';
import { safeNext } from './safe-next';

describe('safeNext', () => {
  it('accepts internal destinations within allowed sections', () => {
    expect(safeNext('/academia/module-1/b1-l1?from=login')).toBe('/academia/module-1/b1-l1?from=login');
    expect(safeNext('/practica')).toBe('/practica');
    expect(safeNext('/admin/invitaciones')).toBe('/admin/invitaciones');
  });

  it('rejects open redirects and malformed destinations', () => {
    for (const value of [
      'https://evil.example',
      '//evil.example/path',
      '/\\\\evil.example/path',
      'javascript:alert(1)',
      '/unknown/area',
      '/academia/\nheader',
      'x'.repeat(301),
    ]) {
      expect(safeNext(value)).toBe('/academia');
    }
    expect(safeNext(null)).toBe('/academia');
    expect(safeNext('/outside', '')).toBe('');
  });
});
