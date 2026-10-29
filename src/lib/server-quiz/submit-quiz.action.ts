'use server';

import { createClient } from '@/lib/supabase/server';
import { getCorrectAnswers, getExplanations } from './quiz-answers.server';

export interface SubmitQuizResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  explanations: string[];
  completed: boolean;
  error?: string;
}

const EMPTY_RESULT: SubmitQuizResult = {
  score: 0,
  passed: false,
  correct: 0,
  total: 0,
  explanations: [],
  completed: false,
};

function friendlyQuizError(message: string | undefined): string {
  const m = message ?? '';
  if (m.includes('quiz_rate_limited')) return 'Hiciste demasiados intentos seguidos. Espera unos minutos y vuelve a intentarlo.';
  if (m.includes('quiz_auth_required')) return 'Tu sesión expiró. Inicia sesión de nuevo.';
  if (m.includes('quiz_invalid')) return 'Esta evaluación no está disponible en este momento. Avísanos si el problema continúa.';
  return 'No se pudo guardar tu resultado. Inténtalo de nuevo.';
}

function parseAnswers(formData: FormData): number[] | null {
  const raw = formData.get('answers');
  if (typeof raw !== 'string') return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((a) => Number.isInteger(a) && a >= 0)) return null;
    return parsed as number[];
  } catch {
    return null;
  }
}

export async function submitQuiz(
  _prevState: SubmitQuizResult | null,
  formData: FormData,
): Promise<SubmitQuizResult> {
  const supabase = await createClient();
  const moduleId = String(formData.get('moduleId') ?? '');
  const lessonId = String(formData.get('lessonId') ?? '');
  const answers = parseAnswers(formData);

  if (!moduleId || !lessonId) {
    return { ...EMPTY_RESULT, error: 'Datos de la lección incompletos' };
  }
  if (answers === null) {
    return { ...EMPTY_RESULT, error: 'Respuestas inválidas' };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ...EMPTY_RESULT, error: 'No autenticado' };
  }

  let correctAnswers: number[];
  let total: number;
  try {
    correctAnswers = getCorrectAnswers(moduleId, lessonId);
    total = correctAnswers.length;
  } catch {
    return { ...EMPTY_RESULT, error: 'Lección no encontrada' };
  }

  if (answers.length !== total) {
    return { ...EMPTY_RESULT, total, error: 'Número de respuestas incorrecto' };
  }

  const { data: rpcResult, error: rpcError } = await supabase.rpc('submit_quiz_v2', {
    p_module_id: moduleId,
    p_lesson_id: lessonId,
    p_answers: answers,
  });

  if (rpcError) {
    return {
      score: 0,
      passed: false,
      correct: 0,
      total,
      explanations: [],
      completed: false,
      error: friendlyQuizError(rpcError.message),
    };
  }

  if (!rpcResult || typeof rpcResult !== 'object') {
    return { ...EMPTY_RESULT, total, error: 'No se pudo calificar la evaluación. Inténtalo de nuevo.' };
  }

  const rpcPassed = Boolean(rpcResult.passed);
  return {
    score: Number(rpcResult.score ?? 0),
    passed: rpcPassed,
    correct: Number(rpcResult.correct ?? 0),
    total: Number(rpcResult.total ?? total),
    explanations: getExplanations(moduleId, lessonId),
    completed: rpcPassed,
  };
}
