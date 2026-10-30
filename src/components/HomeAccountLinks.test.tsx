import { Fragment, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/app/login/actions', () => ({ logout: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import HomeAccountLinks from './HomeAccountLinks';

describe('HomeAccountLinks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra Mi progreso y cerrar sesión cuando existe una sesión válida', async () => {
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { is_admin: false }, error: null }),
    };
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'student-1' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(profileQuery),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const element = (await HomeAccountLinks()) as ReactElement;
    expect(element.type).toBe(Fragment);

    const children = (element.props as { children: ReactElement[] }).children;
    expect((children[0].props as { href: string }).href).toBe('/#progreso');
    expect(children[1].type).toBe('form');
    expect((children[1].props as { action?: unknown }).action).toBeDefined();
  });

  it('muestra el panel de administración únicamente a una cuenta administradora', async () => {
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null }),
    };
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'admin-1' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(profileQuery),
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const element = (await HomeAccountLinks()) as ReactElement;
    const children = (element.props as { children: ReactElement[] }).children;
    expect((children[0].props as { href: string }).href).toBe('/admin');
    expect((children[1].props as { href: string }).href).toBe('/#progreso');
  });

  it('muestra iniciar sesión cuando no existe una sesión', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const element = (await HomeAccountLinks()) as ReactElement;
    expect((element.props as { href: string }).href).toBe('/login');
  });
});
