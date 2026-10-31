import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({
  redirect: (path: string): never => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  },
}));

import { revalidatePath } from 'next/cache';
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

  it('no contacta Supabase cuando no existe un token Turnstile', async () => {
    await expect(login({}, form({
      email: 'student@example.test',
      password: 'test-password',
    }))).resolves.toEqual({ error: 'captcha', attempt: 1 });

    expect(createClient).not.toHaveBeenCalled();
  });

  it('devuelve un error de credenciales tipado y aumenta el contador de intento', async () => {
    const signIn = mockAuth('signInWithPassword');
    signIn.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    });

    await expect(login({ attempt: 1 }, form({
      email: 'student@example.test',
      password: 'wrong-password',
      captchaToken: 'valid-shaped-test-token',
    }))).resolves.toEqual({ error: 'login', attempt: 2 });

    expect(signIn).toHaveBeenCalledOnce();
  });



  it('inicia sesión y redirige al destino interno solicitado', async () => {
    const signIn = vi.fn().mockResolvedValue({
      data: { user: { id: 'student-1' }, session: { access_token: 'test-session' } },
      error: null,
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: { signInWithPassword: signIn },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    await expect(login({}, form({
      email: 'student@example.test',
      password: 'test-password',
      captchaToken: 'valid-test-token',
      next: '/practica',
    }))).rejects.toThrow('NEXT_REDIRECT:/practica');

    expect(signIn).toHaveBeenCalledWith({
      email: 'student@example.test',
      password: 'test-password',
      options: { captchaToken: 'valid-test-token' },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('no permite que un login exitoso redirija fuera del sitio', async () => {
    const signIn = vi.fn().mockResolvedValue({
      data: { user: { id: 'student-1' }, session: { access_token: 'test-session' } },
      error: null,
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: { signInWithPassword: signIn },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    await expect(login({}, form({
      email: 'student@example.test',
      password: 'test-password',
      captchaToken: 'valid-test-token',
      next: 'https://example.invalid',
    }))).rejects.toThrow('NEXT_REDIRECT:/academia');
  });

  it('registra una cuenta y usa el callback local configurado cuando requiere confirmación', async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { user: { id: 'student-2' }, session: null },
      error: null,
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: { signUp },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    await expect(signup(form({
      full_name: 'Estudiante de prueba',
      email: 'signup@example.test',
      password: 'test-password',
      captchaToken: 'valid-test-token',
      next: '/practica',
    }))).rejects.toThrow('NEXT_REDIRECT:/login?message=check-email');

    expect(signUp).toHaveBeenCalledWith({
      email: 'signup@example.test',
      password: 'test-password',
      options: {
        data: { full_name: 'Estudiante de prueba' },
        emailRedirectTo: 'http://localhost:3000/auth/callback',
        captchaToken: 'valid-test-token',
      },
    });
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
