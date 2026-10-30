import { describe, expect, it } from 'vitest';
import { normalizeInvitationCode, parseOptionalInvitationCode } from './invitation-code';

describe('códigos de invitación', () => {
  it('permite crear una cuenta sin invitación', () => {
    expect(parseOptionalInvitationCode('  ')).toEqual({ ok: true, code: null });
  });

  it('normaliza un código personalizado legible', () => {
    expect(parseOptionalInvitationCode('  curso-2026 ')).toEqual({
      ok: true,
      code: 'CURSO-2026',
    });
  });

  it('conserva los códigos aleatorios de 16 caracteres', () => {
    expect(parseOptionalInvitationCode('7ab93671edd3fb06')).toEqual({
      ok: true,
      code: '7AB93671EDD3FB06',
    });
  });

  it('permite códigos de 8 a 32 caracteres con letras, números y guiones', () => {
    expect(normalizeInvitationCode('AULA2026')).toBe('AULA2026');
    expect(normalizeInvitationCode('EQUIPO-PYTHON-2026')).toBe('EQUIPO-PYTHON-2026');
    expect(normalizeInvitationCode('GRUPO-ABCDEFGHIJKLMNO-2026')).toBe('GRUPO-ABCDEFGHIJKLMNO-2026');
  });

  it('rechaza códigos demasiado cortos, demasiado largos o con símbolos', () => {
    expect(normalizeInvitationCode('ABC123')).toBeNull();
    expect(normalizeInvitationCode('A'.repeat(33))).toBeNull();
    expect(normalizeInvitationCode('CURSO_2026')).toBeNull();
    expect(normalizeInvitationCode('CURSO--2026')).toBeNull();
    expect(normalizeInvitationCode('-CURSO2026')).toBeNull();
    expect(normalizeInvitationCode('CURSO2026-')).toBeNull();
  });

  it('acepta cadena vacía como ausencia de invitación', () => {
    expect(parseOptionalInvitationCode('')).toEqual({ ok: true, code: null });
  });
});
