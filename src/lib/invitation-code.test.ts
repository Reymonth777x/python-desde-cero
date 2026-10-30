import { describe, expect, it } from 'vitest';
import { parseOptionalInvitationCode } from './invitation-code';

describe('códigos de invitación', () => {
  it('permite el registro sin invitación', () => {
    expect(parseOptionalInvitationCode('  ')).toEqual({ ok: true, code: null });
  });
  it('normaliza un código personalizado legible', () => {
    expect(parseOptionalInvitationCode(' pe1-equipo-2026 ')).toEqual({ ok: true, code: 'PE1-EQUIPO-2026' });
  });
  it('acepta un código hexadecimal generado automáticamente', () => {
    expect(parseOptionalInvitationCode('7ab93671edd3fb06')).toEqual({ ok: true, code: '7AB93671EDD3FB06' });
  });
  it('rechaza códigos demasiado cortos o largos', () => {
    expect(parseOptionalInvitationCode('ABC')).toEqual({ ok: false });
    expect(parseOptionalInvitationCode('A'.repeat(33))).toEqual({ ok: false });
  });
  it('rechaza espacios internos, símbolos y guiones mal colocados', () => {
    for (const invalid of ['PE1 EQUIPO', 'PE1_EQUIPO', '-EQUIPO2026', 'EQUIPO2026-', 'PE1--2026']) {
      expect(parseOptionalInvitationCode(invalid)).toEqual({ ok: false });
    }
  });
});
