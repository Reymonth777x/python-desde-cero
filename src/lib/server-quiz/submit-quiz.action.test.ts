import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('./quiz-answers.server', () => ({
  getCorrectAnswers: vi.fn(() => [0]),
  getExplanations: vi.fn(() => ['La opción elegida es correcta.']),
}));

import { createClient } from '@/lib/supabase/server';
import { getCorrectAnswers, getExplanations } from './quiz-answers.server';
import { submitQuiz } from './submit-quiz.action';

function formData(expectedUserId = 'student-1', answers = [0]) {
  const data = new FormData();
  data.set('moduleId', 'module-1');
  data.set('lessonId', 'b1-l1');
  data.set('expectedUserId', expectedUserId);
  data.set('answers', JSON.stringify(answers));
  return data;
}

function mockClient(options?: {
  userId?: string | null;
  authError?: { message: string } | null;
  rpcResult?: unknown;
  rpcError?: { code?: string; message?: string } | null;
}) {
  const rpc = vi.fn().mockResolvedValue({
    data: options?.rpcResult ?? {
      score: 100,
      passed: true,
      correct: 1,
      total: 1,
    },
    error: options?.rpcError ?? null,
  });
  const getUser = vi.fn().mockResolvedValue({
    data: { user: options?.userId === null ? null : { id: options?.userId ?? 'student-1' } },
    error: options?.authError ?? null,
  });

  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser },
    rpc,
  } as unknown as Awaited<ReturnType<typeof createClient>>);

  return { rpc, getUser };
}

describe('submitQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCorrectAnswers).mockReturnValue([0]);
    vi.mocked(getExplanations).mockReturnValue(['La opción elegida es correcta.']);
  });

  it('guarda la evaluación solo si la sesión coincide con el usuario que abrió la lección', async () => {
    const { rpc } = mockClient({ userId: 'student-1' });

    const result = await submitQuiz(null, formData('student-1', [0]));

    expect(rpc).toHaveBeenCalledWith('submit_quiz_v2', {
      p_module_id: 'module-1',
      p_lesson_id: 'b1-l1',
      p_answers: [0],
    });
    expect(result).toMatchObject({
      score: 100,
      passed: true,
      correct: 1,
      total: 1,
      completed: true,
      explanations: ['La opción elegida es correcta.'],
    });
  });

  it('rechaza el envío si falta la identidad esperada de la lección', async () => {
    const { rpc } = mockClient({ userId: 'student-1' });
    const data = new FormData();
    data.set('moduleId', 'module-1');
    data.set('lessonId', 'b1-l1');
    data.set('answers', JSON.stringify([0]));

    const result = await submitQuiz(null, data);

    expect(result.error).toContain('No se pudo validar la sesión');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('rechaza el envío si la sesión cambió a otra cuenta', async () => {
    const { rpc } = mockClient({ userId: 'student-2' });

    const result = await submitQuiz(null, formData('student-1', [0]));

    expect(result.error).toContain('La sesión cambió de cuenta');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('explica cuando la sesión ya no está autenticada', async () => {
    const { rpc } = mockClient({ userId: null });

    const result = await submitQuiz(null, formData());

    expect(result.error).toContain('Tu sesión expiró');
    expect(rpc).not.toHaveBeenCalled();
  });

  it('explica el límite temporal de intentos en lugar de mostrar un error genérico', async () => {
    mockClient({
      rpcResult: null,
      rpcError: { code: 'P0001', message: 'quiz_rate_limited' },
    });

    const result = await submitQuiz(null, formData());

    expect(result.error).toContain('demasiados intentos');
  });

  it('rechaza una cantidad de respuestas distinta a las preguntas', async () => {
    const { rpc } = mockClient();

    const result = await submitQuiz(null, formData('student-1', [0, 1]));

    expect(result.error).toBe('Número de respuestas incorrecto');
    expect(rpc).not.toHaveBeenCalled();
  });
});
