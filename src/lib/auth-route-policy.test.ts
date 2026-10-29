import { describe, expect, it } from 'vitest';
import { isGuestOnlyAuthPage } from './auth-route-policy';

describe('isGuestOnlyAuthPage', () => {
  it.each(['/login', '/login/forgot-password'])(
    'redirige a usuarios que ya tienen sesión desde %s',
    (pathname) => {
      expect(isGuestOnlyAuthPage(pathname)).toBe(true);
    },
  );

  it.each([
    '/auth/callback',
    '/auth/callback?code=abc',
    '/login/reset-password',
    '/login/reset-password?error=update',
    '/login/forgot-password/extra',
    '/login/anything-else',
    '/academia',
  ])('no bloquea el flujo de autenticación en %s', (pathname) => {
    expect(isGuestOnlyAuthPage(pathname)).toBe(false);
  });
});
