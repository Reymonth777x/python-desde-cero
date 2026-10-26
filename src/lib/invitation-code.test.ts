import { describe, expect, it } from 'vitest';
import { parseOptionalInvitationCode } from './invitation-code';

describe('código de invitación opcional', () => {
  it('permite el registro público sin código', () => {
    expect(parseOptionalInvitationCode('  ')).toEqual({
      ok: true,
      code: null,
    });
  });

  it('normaliza y conserva un código de 16 caracteres hexadecimales', () => {
    expect(parseOptionalInvitationCode(' 7ab93671edd3fb06 ')).toEqual({
      ok: true,
      code: '7AB93671EDD3FB06',
    });
  });

  it('rechaza códigos proporcionados con un formato incorrecto', () => {
    expect(parseOptionalInvitationCode('not-a-valid-code')).toEqual({
      ok: false,
    });
  });

  it('rechaza códigos con menos de 16 caracteres', () => {
    expect(parseOptionalInvitationCode('7AB93671EDD3FB0')).toEqual({
      ok: false,
    });
  });

  it('rechaza códigos con más de 16 caracteres', () => {
    expect(parseOptionalInvitationCode('7AB93671EDD3FB06A')).toEqual({
      ok: false,
    });
  });

  it('rechaza códigos con caracteres no hexadecimales', () => {
    expect(parseOptionalInvitationCode('7AB93671EDD3FB0G')).toEqual({
      ok: false,
    });
  });

  it('acepta una cadena vacía como ausencia de invitación', () => {
    expect(parseOptionalInvitationCode('')).toEqual({
      ok: true,
      code: null,
    });
  });
});
