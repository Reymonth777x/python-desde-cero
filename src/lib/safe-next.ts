const ALLOWED_PREFIXES = ['/academia', '/practica', '/estudiante', '/docente', '/admin'];
const MAX_DESTINATION_LENGTH = 300;

export function safeNext(value: unknown, fallback = '/academia'): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_DESTINATION_LENGTH ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  try {
    const destination = new URL(value, 'https://internal.invalid');
    if (destination.origin !== 'https://internal.invalid') return fallback;

    const isAllowed = ALLOWED_PREFIXES.some(
      (prefix) =>
        destination.pathname === prefix ||
        destination.pathname.startsWith(prefix + '/'),
    );
    if (!isAllowed) return fallback;

    return destination.pathname + destination.search + destination.hash;
  } catch {
    return fallback;
  }
}
