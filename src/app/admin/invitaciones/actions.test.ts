import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

import { createClient } from '@/lib/supabase/server';
import { createInvitation, deleteInvitation } from './actions';

function adminClient(extraFrom: (table: string) => unknown) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'admin-1' } },
        error: null,
      }),
    },
    from: vi.fn(extraFrom),
  } as unknown as Awaited<ReturnType<typeof createClient>>;
}

describe('acciones de invitaciones', () => {
  beforeEach(() => vi.clearAllMocks());

  it('guarda el código personalizado normalizado en la invitación', async () => {
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null }),
    };
    const insert = vi.fn().mockResolvedValue({ error: null });
    const invitationQuery = { insert };
    vi.mocked(createClient).mockResolvedValue(
      adminClient((table) => table === 'profiles' ? profileQuery : invitationQuery),
    );

    const formData = new FormData();
    formData.set('code', '  equipo-oct-26  ');

    const result = await createInvitation(formData);

    expect(result).toEqual({ error: null });
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      code: 'EQUIPO-OCT-26',
      is_used: false,
      used_by: null,
      created_by: 'admin-1',
    }));
  });

  it('genera y persiste un código aleatorio cuando el campo está vacío', async () => {
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null }),
    };
    const insert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createClient).mockResolvedValue(
      adminClient((table) => table === 'profiles' ? profileQuery : { insert }),
    );

    const result = await createInvitation(new FormData());

    expect(result).toEqual({ error: null });
    const saved = insert.mock.calls[0]?.[0] as { code: string };
    expect(saved.code).toMatch(/^[A-F0-9]{16}$/);
  });

  it('rechaza códigos personalizados inválidos sin intentar insertarlos', async () => {
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null }),
    };
    const insert = vi.fn();
    vi.mocked(createClient).mockResolvedValue(
      adminClient((table) => table === 'profiles' ? profileQuery : { insert }),
    );

    const formData = new FormData();
    formData.set('code', 'BAD_CODE');

    const result = await createInvitation(formData);

    expect(result.error).toContain('8 y 32 caracteres');
    expect(insert).not.toHaveBeenCalled();
  });

  it('conserva una invitación utilizada y no ejecuta DELETE', async () => {
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { is_admin: true }, error: null }),
    };
    const lookupQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { is_used: true }, error: null }),
    };
    const deleteQuery = { delete: vi.fn() };
    const from = vi.fn((table: string) => {
      if (table === 'profiles') return profileQuery;
      return lookupQuery;
    });
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'admin-1' } },
          error: null,
        }),
      },
      from,
    } as unknown as Awaited<ReturnType<typeof createClient>>);

    const result = await deleteInvitation('11111111-1111-4111-8111-111111111111');

    expect(result.error).toContain('se conserva como historial');
    expect(deleteQuery.delete).not.toHaveBeenCalled();
  });
});
