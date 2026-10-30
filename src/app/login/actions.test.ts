import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: (path: string): never => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  },
}));

import { createClient } from '@/lib/supabase/server';
import { login, requestPasswordReset, signup } from './actions';

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function mockAuth(method: 'signInWithPassword' | 'signUp' | 'resetPasswordForEmail') {
  const auth = {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'captcha_failed' },
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'captcha_failed' },
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({
      data: {},
      error: { message: 'captcha_failed' },
    }),
  };

  vi.mocked(createClient).mockResolvedValue({
    auth,
  } as unknown as Awaited<ReturnType<typeof createClient>>);

  return auth[method];
}

describe('acciones de autenticación con Turnstile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'turnstile-test-sitekey');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000');
    vi.stubEnv('NODE_ENV', 'test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('muestra un error de CAPTCHA claro en el inicio de sesión', async () => {
    const signIn = mockAuth('signInWithPassword');

    await expect(login({}, form({
      email: 'student@example.test',
      password: 'test-password',
      captchaToken: 'expired-token',
    }))).resolves.toEqual({ error: 'captcha', attempt: 1 });

    expect(signIn).toHaveBeenCalledOnce();
  });

  it('devuelve un error tipado sin redirigir cuando faltan credenciales', async () => {
    await expect(login({}, form({ email: '', password: '' }))).resolves.toEqual({ error: 'missing', attempt: 1 });
    expect(createClient).not.toHaveBeenCalled();
  });

  it('muestra un error de CAPTCHA antes que el mensaje de invitación al registrar', async () => {
    const signUp = mockAuth('signUp');

    await expect(signup(form({
      full_name: 'Estudiante de prueba',
      email: 'student@example.test',
      password: 'test-password',
      captchaToken: 'expired-token',
    }))).rejects.toThrow('NEXT_REDIRECT:/login?error=captcha');

    expect(signUp).toHaveBeenCalledOnce();
  });

  it('muestra un error de CAPTCHA en la recuperación de contraseña', async () => {
    const reset = mockAuth('resetPasswordForEmail');

    await expect(requestPasswordReset(form({
      email: 'student@example.test',
      captchaToken: 'expired-token',
    }))).rejects.toThrow('NEXT_REDIRECT:/login/forgot-password?error=captcha');

    expect(reset).toHaveBeenCalledOnce();
  });
});
