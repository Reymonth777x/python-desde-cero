import { describe, expect, it } from 'vitest';
import { resolveAuthCallbackUrl } from './auth-callback-url';

describe('URL de callback de autenticación', () => {
  it('construye el callback desde un origen HTTPS en producción', () => {
    expect(resolveAuthCallbackUrl('https://academy.example/', true)).toBe(
      'https://academy.example/auth/callback',
    );
  });

  it('rechaza configuración ausente, HTTP y loopback en producción', () => {
    expect(resolveAuthCallbackUrl(undefined, true)).toBeNull();
    expect(resolveAuthCallbackUrl('http://academy.example', true)).toBeNull();
    expect(resolveAuthCallbackUrl('https://localhost:3000', true)).toBeNull();
  });

  it('usa localhost solo como fallback de desarrollo', () => {
    expect(resolveAuthCallbackUrl(undefined, false)).toBe(
      'http://localhost:3000/auth/callback',
    );
  });

  it('marca la recuperación con un flujo interno fijo', () => {
    expect(
      resolveAuthCallbackUrl(
        'https://academy.example',
        true,
        'password-reset',
      ),
    ).toBe('https://academy.example/auth/callback?flow=password-reset');
  });

  it('rechaza URL de sitio con credenciales, ruta, consulta o fragmento', () => {
    expect(resolveAuthCallbackUrl('https://user:pass@academy.example', true)).toBeNull();
    expect(resolveAuthCallbackUrl('https://academy.example/subpath', true)).toBeNull();
    expect(resolveAuthCallbackUrl('https://academy.example?next=/login', true)).toBeNull();
    expect(resolveAuthCallbackUrl('https://academy.example#fragment', true)).toBeNull();
  });

  it('no permite un callback HTTP de desarrollo hacia una red remota', () => {
    expect(resolveAuthCallbackUrl('http://academy.example', false)).toBeNull();
  });
});
