export type OptionalInvitationCodeResult =
  | { ok: true; code: string | null }
  | { ok: false };

export function parseOptionalInvitationCode(
  input: string,
): OptionalInvitationCodeResult {
  const code = input.trim().toUpperCase();

  if (!code) return { ok: true, code: null };
  if (!/^[A-F0-9]{16}$/.test(code)) return { ok: false };

  return { ok: true, code };
}
