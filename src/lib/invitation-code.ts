export type OptionalInvitationCodeResult =
  | { ok: true; code: string | null }
  | { ok: false };

/**
 * Acepta códigos generados automáticamente (hexadecimales) y códigos legibles
 * definidos por el administrador. Los códigos se normalizan a mayúsculas.
 */
export function parseOptionalInvitationCode(input: string): OptionalInvitationCodeResult {
  const code = input.trim().toUpperCase();
  if (!code) return { ok: true, code: null };
  if (code.length < 4 || code.length > 32) return { ok: false };
  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(code)) return { ok: false };
  return { ok: true, code };
}
