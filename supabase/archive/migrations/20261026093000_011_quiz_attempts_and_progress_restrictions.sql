-- 011_quiz_attempts_and_progress_restrictions
-- Crea la tabla quiz_attempts con RLS de solo lectura propia,
-- quita INSERT/UPDATE de progress a authenticated (solo escritura vía servidor)
-- y añade la función RPC SECURITY DEFINER record_quiz_attempt.

-- Tabla de intentos de quiz (solo lectura para el cliente; el servidor escribe vía RPC)
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    score NUMERIC NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS: cada estudiante solo lee sus propios intentos
CREATE POLICY "Estudiantes leen sus propios intentos de quiz"
ON public.quiz_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Grants: solo SELECT para authenticated en quiz_attempts
GRANT SELECT ON TABLE public.quiz_attempts TO authenticated;

-- Índices para consultas de rate limiting y progreso
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_module_lesson_created
ON public.quiz_attempts (user_id, module_id, lesson_id, created_at);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_created
ON public.quiz_attempts (user_id, created_at);

-- Quitar escritura directa de progress a authenticated; solo SELECT permanece.
-- El servidor escribe a través de record_quiz_attempt (SECURITY DEFINER).
REVOKE INSERT, UPDATE ON TABLE public.progress FROM authenticated;

-- Función RPC SECURITY DEFINER: registra el intento y actualiza el progreso.
-- Se ejecuta con privilegios del propietario (postgres), por lo que puede escribir
-- en progress y quiz_attempts aunque authenticated no tenga INSERT/UPDATE directos.
CREATE OR REPLACE FUNCTION public.record_quiz_attempt(
    p_module_id TEXT,
    p_lesson_id TEXT,
    p_score NUMERIC,
    p_passed BOOLEAN,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_user_id UUID;
    v_attempt_count INTEGER;
    v_completed BOOLEAN := FALSE;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado';
    END IF;

    -- Límite de intentos: máximo 5 por minuto por usuario y lección
    SELECT COUNT(*) INTO v_attempt_count
    FROM public.quiz_attempts
    WHERE user_id = v_user_id
      AND module_id = p_module_id
      AND lesson_id = p_lesson_id
      AND created_at > NOW() - INTERVAL '1 minute';

    IF v_attempt_count >= 5 THEN
        RAISE EXCEPTION 'Demasiados intentos. Inténtalo de nuevo en un minuto.';
    END IF;

    -- Insertar el intento
    INSERT INTO public.quiz_attempts (user_id, module_id, lesson_id, score, answers)
    VALUES (v_user_id, p_module_id, p_lesson_id, p_score, p_answers);

    -- Upsert en progress: completar solo si aprobó, best_score es el máximo
    INSERT INTO public.progress (user_id, module_id, lesson_id, is_completed, best_score, last_attempt)
    VALUES (v_user_id, p_module_id, p_lesson_id, p_passed, p_score, NOW())
    ON CONFLICT (user_id, module_id, lesson_id) DO UPDATE
    SET
        is_completed = public.progress.is_completed OR p_passed,
        best_score = GREATEST(public.progress.best_score, p_score),
        last_attempt = NOW()
    RETURNING is_completed INTO v_completed;

    RETURN jsonb_build_object(
        'completed', v_completed,
        'score', p_score,
        'passed', p_passed
    );
END;
$$;

REVOKE ALL ON FUNCTION public.record_quiz_attempt FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_quiz_attempt TO authenticated;
