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

function friendlyQuizError(code: string | undefined, message: string | undefined): string {
  const m = (message ?? '').toLowerCase();
  if (m.includes('quiz_rate_limited')) return 'Hiciste demasiados intentos seguidos. Espera unos minutos y vuelve a intentarlo.';
  if (m.includes('quiz_auth_required') || code === 'PGRST301' || m.includes('jwt')) return 'Tu sesión expiró o ya no es válida. Vuelve a iniciar sesión.';
  if (m.includes('quiz_invalid')) return 'La evaluación no coincide con la versión activa del curso. Actualiza la página y vuelve a intentarlo.';
  if (code === 'PGRST202' || m.includes('could not find the function') || m.includes('schema cache')) return 'El guardado de evaluaciones no está sincronizado con la base de datos. La actualización debe revisarse antes de continuar.';
  if (code === '42501' || m.includes('permission denied') || m.includes('row-level security')) return 'La base de datos rechazó el guardado por permisos. No se perdió tu respuesta; informa al equipo para revisar el acceso de esta cuenta.';
  if (m.includes('network') || m.includes('fetch') || m.includes('timeout')) return 'Se perdió la conexión al guardar. Revisa tu internet y vuelve a comprobar las respuestas.';
  return code
    ? `No se pudo guardar tu resultado (referencia ${code}). Inténtalo de nuevo; si continúa, comparte solo esa referencia.`
    : 'No se pudo guardar tu resultado. Inténtalo de nuevo.';
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
    return { ...EMPTY_RESULT, error: 'Tu sesión expiró o ya no es válida. Vuelve a iniciar sesión.' };
  }

  const expectedUserId = String(formData.get('expectedUserId') ?? '');
  if (!expectedUserId) {
    return { ...EMPTY_RESULT, error: 'No se pudo validar la sesión de esta lección. Recarga la página e inténtalo de nuevo.' };
  }
  if (expectedUserId !== user.id) {
    return { ...EMPTY_RESULT, error: 'La sesión cambió de cuenta. Recarga la lección antes de guardar el resultado.' };
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
      error: friendlyQuizError(rpcError.code, rpcError.message),
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
