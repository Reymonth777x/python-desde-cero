const ALLOWED_PREFIXES = ['/academia', '/practica', '/admin'];

export function safeNext(value: unknown, fallback = '/academia'): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 300) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  if (value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return fallback;
  const path = value.split(/[?#]/)[0];
  return ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)) ? value : fallback;
}
