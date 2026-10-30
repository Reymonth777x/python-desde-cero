import { Fragment, type ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/app/login/actions', () => ({ logout: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import HomeAccountLinks from './HomeAccountLinks';

describe('HomeAccountLinks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra Mi progreso y cerrar sesión cuando existe una sesión válida', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'student-1' } },
          error: null,
        }),
      },
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const element = (await HomeAccountLinks()) as ReactElement;
    expect(element.type).toBe(Fragment);

    const children = element.props.children as ReactElement[];
    expect(children[0].props.href).toBe('/academia');
    expect(children[1].type).toBe('form');
    expect(children[1].props.action).toBeDefined();
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
    expect(element.props.href).toBe('/login');
  });
});
