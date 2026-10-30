export type OptionalInvitationCodeResult =
  | { ok: true; code: string | null }
  | { ok: false };

const INVITATION_CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{6,30}[A-Z0-9]$/;

export function normalizeInvitationCode(input: string): string | null {
  const code = input.trim().toUpperCase();
  if (code.length < 8 || code.length > 32) return null;
  if (!INVITATION_CODE_PATTERN.test(code) || code.includes('--')) return null;
  return code;
}

export function parseOptionalInvitationCode(
  input: string,
): OptionalInvitationCodeResult {
  if (!input.trim()) return { ok: true, code: null };
  const code = normalizeInvitationCode(input);
  return code ? { ok: true, code } : { ok: false };
}
