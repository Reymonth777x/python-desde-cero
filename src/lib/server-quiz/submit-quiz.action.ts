'use server';

import { createClient } from '@/lib/supabase/server';
import {
  getCorrectAnswers,
  getExplanations,
  getQuestionCount,
} from './quiz-answers.server';

export interface SubmitQuizResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  explanations: string[];
  completed: boolean;
  error?: string;
}

const MAX_ATTEMPTS_PER_MINUTE = 5;
const PASSING_SCORE = 75;

function parseAnswers(formData: FormData): number[] | null {
  const raw = formData.get('answers');
  if (typeof raw !== 'string') {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.filter((a): a is number => typeof a === 'number');
  } catch {
    return null;
  }
}

/**
 * Server Action: califica el quiz del lado del servidor y registra el intento.
 * Se invoca desde el cliente mediante <form action={submitQuiz}>.
 * Las respuestas correctas viven en quiz-answers.server.ts (server-only) y
 * nunca viajan al cliente. La escritura en progress y quiz_attempts se hace
 * a través de una función RPC SECURITY DEFINER, nunca directamente desde el cliente.
 */
export async function submitQuiz(
  _prevState: SubmitQuizResult | null,
  formData: FormData
): Promise<SubmitQuizResult> {
  const supabase = await createClient();

  const moduleId = String(formData.get('moduleId') ?? '');
  const lessonId = String(formData.get('lessonId') ?? '');
  const answers = parseAnswers(formData);

  if (!moduleId || !lessonId) {
    return {
      score: 0,
      passed: false,
      correct: 0,
      total: 0,
      explanations: [],
      completed: false,
      error: 'Datos de la lección incompletos',
    };
  }

  if (answers === null) {
    return {
      score: 0,
      passed: false,
      correct: 0,
      total: 0,
      explanations: [],
      completed: false,
      error: 'Respuestas inválidas',
    };
  }

  // 1. Autenticar usuario
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      score: 0,
      passed: false,
      correct: 0,
      total: 0,
      explanations: [],
      completed: false,
      error: 'No autenticado',
    };
  }

  // 2. Obtener respuestas correctas desde el módulo server-only
  let correctAnswers: number[];
  let total: number;
  try {
    correctAnswers = getCorrectAnswers(moduleId, lessonId);
    total = correctAnswers.length;
  } catch {
    return {
      score: 0,
      passed: false,
      correct: 0,
      total: 0,
      explanations: [],
      completed: false,
      error: 'Lección no encontrada',
    };
  }

  // 3. Validar cantidad de respuestas
  if (answers.length !== total) {
    return {
      score: 0,
      passed: false,
      correct: 0,
      total,
      explanations: [],
      completed: false,
      error: 'Número de respuestas incorrecto',
    };
  }

  // 4. Calcular puntuación real
  let correct = 0;
  for (let i = 0; i < total; i++) {
    if (answers[i] === correctAnswers[i]) {
      correct += 1;
    }
  }
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = score >= PASSING_SCORE;

  // 5. Obtener explicaciones (solo se devuelven tras enviar)
  const explanations = getExplanations(moduleId, lessonId);

  // 6. Registrar intento y progreso vía RPC SECURITY DEFINER
  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    'record_quiz_attempt',
    {
      p_module_id: moduleId,
      p_lesson_id: lessonId,
      p_score: score,
      p_passed: passed,
      p_answers: answers,
    }
  );

  if (rpcError) {
    return {
      score,
      passed,
      correct,
      total,
      explanations,
      completed: false,
      error: rpcError.message,
    };
  }

  const completed = Boolean(rpcResult?.completed);

  return {
    score,
    passed,
    correct,
    total,
    explanations,
    completed,
  };
}
