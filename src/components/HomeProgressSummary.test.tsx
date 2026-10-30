import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import HomeProgressSummary from './HomeProgressSummary';

describe('HomeProgressSummary', () => {
  beforeEach(() => vi.clearAllMocks());

  it('consulta el avance del usuario autenticado y muestra progreso PE1 y extensión', async () => {
    const eq = vi.fn().mockResolvedValue({
      data: [
        { module_id: 'module-1', is_completed: true },
        { module_id: 'module-2', is_completed: false },
        { module_id: 'module-5', is_completed: true },
      ],
      error: null,
    });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'student-1' } },
      error: null,
    });

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser },
      from,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const element = await HomeProgressSummary();
    expect(element).not.toBeNull();

    const html = renderToStaticMarkup(element as React.ReactElement);
    expect(html).toContain('1/30 lecciones');
    expect(html).toContain('Extensión práctica opcional: 1/4 actividades');
    expect(eq).toHaveBeenCalledWith('user_id', 'student-1');
    expect(from).toHaveBeenCalledWith('progress');
  });

  it('no consulta progreso cuando no hay usuario autenticado', async () => {
    const from = vi.fn();
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
      from,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    expect(await HomeProgressSummary()).toBeNull();
    expect(from).not.toHaveBeenCalled();
  });

  it('explica cuando Supabase no puede consultar el progreso', async () => {
    const eq = vi.fn().mockResolvedValue({ data: null, error: { message: 'network error' } });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'student-1' } },
          error: null,
        }),
      },
      from,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const element = await HomeProgressSummary();
    const html = renderToStaticMarkup(element as React.ReactElement);
    expect(html).toContain('no se pudo consultar el avance');
    expect(html).toContain('/academia');
  });
});
