'use server';

import { createClient } from '@/lib/supabase/server';
import { esChapterId } from '@/lib/orilla/catalog';

const MAX_CODIGO = 20000;
const MAX_NOTAS = 20000;

export type GuardarOrillaResultado =
  | { ok: true; passed: boolean; stars: number; bestSteps: number | null; attempts: number }
  | { ok: false; error: string };

export type VaciarNotasResultado = { ok: true } | { ok: false; error: string };

type Entrada = {
  chapterId: string;
  code: string;
  passed: boolean;
  stars: number;
  steps: number | null;
  notas: string | null;
  esIntento: boolean;
};

function leerEntrada(valor: unknown): Entrada | string {
  if (typeof valor !== 'object' || valor === null) return 'Datos inválidos.';
  const v = valor as Record<string, unknown>;
  if (!esChapterId(v.chapterId)) return 'Ese tramo no existe.';
  if (typeof v.code !== 'string' || v.code.length > MAX_CODIGO) {
    return 'El programa es demasiado largo para guardarlo.';
  }
  if (typeof v.passed !== 'boolean' || typeof v.esIntento !== 'boolean') return 'Datos inválidos.';
  if (!Number.isInteger(v.stars) || (v.stars as number) < 0 || (v.stars as number) > 3) {
    return 'Datos inválidos.';
  }
  let steps: number | null = null;
  if (v.steps !== null && v.steps !== undefined) {
    if (!Number.isInteger(v.steps) || (v.steps as number) < 0 || (v.steps as number) > 100000) {
      return 'Datos inválidos.';
    }
    steps = v.steps as number;
  }
  let notas: string | null = null;
  if (v.notas !== null && v.notas !== undefined) {
    if (!Array.isArray(v.notas) || !v.notas.every((n) => typeof n === 'string')) return 'Datos inválidos.';
    notas = (v.notas as string[]).join('\n');
    if (notas.length > MAX_NOTAS) return 'Las notas son demasiado largas para guardarlas.';
  }
  return {
    chapterId: v.chapterId,
    code: v.code,
    passed: v.passed,
    // El río abierto no tiene estrellas.
    stars: v.chapterId === 'abierta' ? 0 : (v.stars as number),
    steps,
    notas,
    esIntento: v.esIntento,
  };
}

function mensajeDe(error: { message?: string } | null): string {
  const texto = error?.message ?? '';
  if (texto.includes('orilla:bloqueado')) return 'Este tramo sigue cerrado: supera el anterior.';
  if (texto.includes('orilla:no_autenticado')) return 'Tu sesión terminó. Entra de nuevo.';
  if (texto.includes('orilla:codigo_invalido') || texto.includes('orilla:notas_largas')) {
    return 'El programa o las notas son demasiado largos para guardarlos.';
  }
  return 'No se pudo guardar tu avance.';
}

/** Guarda el borrador (esIntento falso) o el resultado de una ejecución (esIntento verdadero). */
export async function guardarOrilla(entrada: unknown): Promise<GuardarOrillaResultado> {
  const datos = leerEntrada(entrada);
  if (typeof datos === 'string') return { ok: false, error: datos };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return { ok: false, error: 'Tu sesión terminó. Entra de nuevo.' };

  const { data, error } = await supabase.rpc('record_orilla_run', {
    p_chapter_id: datos.chapterId,
    p_code: datos.code,
    p_passed: datos.passed,
    p_stars: datos.stars,
    p_steps: datos.steps,
    p_notes: datos.notas,
    p_es_intento: datos.esIntento,
  });
  if (error) return { ok: false, error: mensajeDe(error) };

  const fila = (data ?? {}) as Record<string, unknown>;
  return {
    ok: true,
    passed: fila.passed === true,
    stars: typeof fila.stars === 'number' ? fila.stars : 0,
    bestSteps: typeof fila.best_steps === 'number' ? fila.best_steps : null,
    attempts: typeof fila.attempts === 'number' ? fila.attempts : 0,
  };
}

/** Borra solo las notas del río abierto de esta cuenta. */
export async function vaciarNotasOrilla(): Promise<VaciarNotasResultado> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return { ok: false, error: 'Tu sesión terminó. Entra de nuevo.' };
  const { error } = await supabase.rpc('clear_orilla_notes');
  if (error) return { ok: false, error: mensajeDe(error) };
  return { ok: true };
}
