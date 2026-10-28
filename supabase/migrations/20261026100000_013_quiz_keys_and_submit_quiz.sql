-- 013_quiz_keys_and_submit_quiz
-- Migración correctiva (no edita migraciones previas).
--
-- 1. Crea private.quiz_keys con las claves de corrección del quiz (origen de
--    verdad en la base de datos, generadas desde src/lib/course.ts).
-- 2. Crea public.submit_quiz(p_module_id, p_lesson_id, p_answers) SECURITY DEFINER
--    con search_path vacío: valida autenticación, existencia de la lección,
--    cantidad y rango de respuestas, calcula score y passed en SQL, aplica
--    límite de intentos (global y por lección), inserta quiz_attempts y hace
--    upsert de progress sin bajar best_score ni desmarcar is_completed.
-- 3. Elimina public.record_quiz_attempt y revoca EXECUTE a PUBLIC y anon.

-- --- 1. Tabla de claves de quiz en la base de datos ---
CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE private.quiz_keys (
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    question_index INTEGER NOT NULL,
    correct_index INTEGER NOT NULL,
    options_count INTEGER NOT NULL,
    PRIMARY KEY (module_id, lesson_id, question_index)
);

ALTER TABLE private.quiz_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Claves de quiz legibles por authenticated"
ON private.quiz_keys
FOR SELECT
TO authenticated
USING (true);

GRANT SELECT ON TABLE private.quiz_keys TO authenticated;

CREATE INDEX IF NOT EXISTS idx_quiz_keys_module_lesson
ON private.quiz_keys (module_id, lesson_id);

-- Claves generadas desde src/lib/course.ts (scripts/gen-quiz-keys.ts)
TRUNCATE TABLE private.quiz_keys RESTART IDENTITY CASCADE;
-- Claves generadas desde src/lib/course.ts
-- Claves generadas desde src/lib/course.ts
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-1', 'b1-l1', 0, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-1', 'b1-l1', 1, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-1', 'b1-l2', 0, 2, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-1', 'b1-l3', 0, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-1', 'b1-l4', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l1', 0, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l2', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l3', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l4', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l5', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l6', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l7', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l7', 1, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l7', 2, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l7', 3, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-2', 'b2-l7', 4, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l1', 0, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l2', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l3', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l4', 0, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l5', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l6', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l7', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l8', 0, 1, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l8', 1, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-3', 'b3-l8', 2, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l1', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l2', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l3', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l4', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l5', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l6', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l7', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l8', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l8', 1, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-4', 'b4-l8', 2, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-5', 'b5-l1', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-5', 'b5-l2', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-5', 'b5-l2', 1, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-5', 'b5-l3', 0, 0, 4);
INSERT INTO private.quiz_keys (module_id, lesson_id, question_index, correct_index, options_count) VALUES ('module-5', 'b5-l4', 0, 0, 4);


-- --- 2. Función submit_quiz (SECURITY DEFINER, search_path vacío) ---
CREATE OR REPLACE FUNCTION public.submit_quiz(
    p_module_id TEXT,
    p_lesson_id TEXT,
    p_answers INTEGER[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS Parte 1 escrita
DECLARE
    v_user_id UUID;
    v_question_count INTEGER := 0;
    v_correct INTEGER := 0;
    v_score NUMERIC := 0;
    v_passed BOOLEAN := FALSE;
    v_attempt_count INTEGER := 0;
    v_global_attempt_count INTEGER := 0;
    v_completed BOOLEAN := FALSE;
    v_key RECORD;
    v_idx INTEGER := 0;
    v_answers JSONB := '[]'::jsonb;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado';
    END IF;

    -- Validar que la lección exista y tenga preguntas
    SELECT COUNT(*) INTO v_question_count
    FROM private.quiz_keys
    WHERE module_id = p_module_id AND lesson_id = p_lesson_id;

    IF v_question_count = 0 THEN
        RAISE EXCEPTION 'Lección no encontrada o sin quiz';
    END IF;

    -- Validar cantidad de respuestas
    IF array_length(p_answers, 1) IS DISTINCT FROM v_question_count THEN
        RAISE EXCEPTION 'Número de respuestas incorrecto';
    END IF;

    -- Validar rango de cada respuesta (0 a options_count - 1)
    FOR v_idx IN 1 .. array_length(p_answers, 1) LOOP
        SELECT correct_index, options_count INTO v_key
        FROM private.quiz_keys
        WHERE module_id = p_module_id
          AND lesson_id = p_lesson_id
          AND question_index = v_idx
        LIMIT 1;

        IF p_answers[v_idx] < 0 OR p_answers[v_idx] >= v_key.options_count THEN
            RAISE EXCEPTION 'Respuesta fuera de rango en la pregunta %', v_idx;
        END IF;

        IF p_answers[v_idx] = v_key.correct_index THEN
            v_correct := v_correct + 1;
        END IF;
    END LOOP;

    v_score := CASE WHEN v_question_count > 0
        THEN round((v_correct::numeric / v_question_count) * 100)
        ELSE 0 END;

    v_passed := v_question_count > 0 AND v_score >= 75;

    -- Límite de intentos: máximo 5 por minuto por usuario y lección
    SELECT COUNT(*) INTO v_attempt_count
    FROM public.quiz_attempts
    WHERE user_id = v_user_id
      AND module_id = p_module_id
      AND lesson_id = p_lesson_id
      AND created_at > NOW() - INTERVAL '1 minute';

    IF v_attempt_count >= 5 THEN
        RAISE EXCEPTION 'Demasiados intentos por lección. Inténtalo de nuevo en un minuto.';
    END IF;

    -- Límite global: máximo 20 intentos por minuto por usuario
    SELECT COUNT(*) INTO v_global_attempt_count
    FROM public.quiz_attempts
    WHERE user_id = v_user_id
      AND created_at > NOW() - INTERVAL '1 minute';

    IF v_global_attempt_count >= 20 THEN
        RAISE EXCEPTION 'Demasiados intentos globales. Inténtalo de nuevo en un minuto.';
    END IF;

    -- Preparar answers como JSONB para almacenar
    v_answers := p_answers::jsonb;

    -- Insertar el intento
    INSERT INTO public.quiz_attempts (user_id, module_id, lesson_id, score, answers)
    VALUES (v_user_id, p_module_id, p_lesson_id, v_score, v_answers);

    -- Upsert en progress: completed solo se pone true (nunca se desmarca),
    -- best_score es el máximo (nunca baja).
    INSERT INTO public.progress (user_id, module_id, lesson_id, is_completed, best_score, last_attempt)
    VALUES (v_user_id, p_module_id, p_lesson_id, v_passed, v_score, NOW())
    ON CONFLICT (user_id, module_id, lesson_id) DO UPDATE
    SET
        is_completed = public.progress.is_completed OR v_passed,
        best_score = GREATEST(public.progress.best_score, v_score),
        last_attempt = NOW()
    RETURNING is_completed INTO v_completed;

    RETURN jsonb_build_object(
        'completed', v_completed,
        'score', v_score,
        'passed', v_passed,
        'correct', v_correct,
        'total', v_question_count
    );
END;
Parte 1 escrita;

-- --- 3. Eliminar record_quiz_attempt y revocar permisos ---
REVOKE ALL ON FUNCTION public.record_quiz_attempt FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_quiz_attempt FROM anon;
REVOKE ALL ON FUNCTION public.record_quiz_attempt FROM authenticated;

DROP FUNCTION IF EXISTS public.record_quiz_attempt(TEXT, TEXT, NUMERIC, BOOLEAN, JSONB);

-- --- 4. Conceder EXECUTE solo a authenticated en submit_quiz ---
GRANT EXECUTE ON FUNCTION public.submit_quiz(TEXT, TEXT, INTEGER[]) TO authenticated;
