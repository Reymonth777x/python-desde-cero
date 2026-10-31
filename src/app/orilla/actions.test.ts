import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), getUser: vi.fn() }));

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser }, rpc: mocks.rpc }),
}));

import { guardarOrilla, vaciarNotasOrilla } from './actions';

const valida = {
  chapterId: 'c03',
  code: 'avanzar()',
  passed: true,
  stars: 2,
  steps: 6,
  notas: null,
  esIntento: true,
};

describe('guardarOrilla', () => {
  beforeEach(() => {
    mocks.rpc.mockReset();
    mocks.getUser.mockReset();
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mocks.rpc.mockResolvedValue({
      data: { passed: true, stars: 2, best_steps: 6, attempts: 3 },
      error: null,
    });
  });

  it('guarda con la RPC y devuelve lo que quedó en la fila', async () => {
    const r = await guardarOrilla(valida);
    expect(r).toEqual({ ok: true, passed: true, stars: 2, bestSteps: 6, attempts: 3 });
    expect(mocks.rpc).toHaveBeenCalledWith('record_orilla_run', {
      p_chapter_id: 'c03',
      p_code: 'avanzar()',
      p_passed: true,
      p_stars: 2,
      p_steps: 6,
      p_notes: null,
      p_es_intento: true,
    });
  });

  it('sin sesión no llama a la RPC', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    const r = await guardarOrilla(valida);
    expect(r.ok).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('rechaza un tramo que no existe', async () => {
    const r = await guardarOrilla({ ...valida, chapterId: 'c13' });
    expect(r.ok).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('rechaza código de más de 20000 caracteres', async () => {
    const r = await guardarOrilla({ ...valida, code: 'a'.repeat(20001) });
    expect(r.ok).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('rechaza estrellas fuera de rango y pasos negativos', async () => {
    expect((await guardarOrilla({ ...valida, stars: 4 })).ok).toBe(false);
    expect((await guardarOrilla({ ...valida, steps: -1 })).ok).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('rechaza notas demasiado largas', async () => {
    const r = await guardarOrilla({ ...valida, chapterId: 'abierta', notas: ['x'.repeat(20001)] });
    expect(r.ok).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('el río abierto nunca guarda estrellas', async () => {
    await guardarOrilla({ ...valida, chapterId: 'abierta', stars: 3, notas: ['listo'] });
    expect(mocks.rpc).toHaveBeenCalledWith(
      'record_orilla_run',
      expect.objectContaining({ p_stars: 0, p_notes: 'listo' }),
    );
  });

  it('traduce el error de tramo bloqueado', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { message: 'orilla:bloqueado' } });
    const r = await guardarOrilla(valida);
    expect(r).toEqual({ ok: false, error: 'Este tramo sigue cerrado: supera el anterior.' });
  });
});

describe('vaciarNotasOrilla', () => {
  beforeEach(() => {
    mocks.rpc.mockReset();
    mocks.getUser.mockReset();
  });

  it('exige sesión', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    expect((await vaciarNotasOrilla()).ok).toBe(false);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('llama a clear_orilla_notes', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mocks.rpc.mockResolvedValue({ data: null, error: null });
    expect(await vaciarNotasOrilla()).toEqual({ ok: true });
    expect(mocks.rpc).toHaveBeenCalledWith('clear_orilla_notes');
  });
});
