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
});
