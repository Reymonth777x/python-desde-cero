-- 013_quiz_keys_and_submit_quiz
-- Keys are server-only; the RPC grades choices and records attempts/progress.
-- Supports fresh installs (public.quiz_attempts) and the hardened hosted schema
-- (private.quiz_attempts) while using the current course lesson identifiers.

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.quiz_keys (
  module_id TEXT NOT NULL CHECK (module_id ~ '^module-[0-9]+$'),
  lesson_id TEXT NOT NULL CHECK (lesson_id ~ '^b[0-9]+-l[0-9]+$'),
  question_index INTEGER NOT NULL CHECK (question_index >= 0),
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0),
  options_count INTEGER NOT NULL CHECK (options_count >= 2),
  PRIMARY KEY (module_id, lesson_id, question_index),
  CHECK (correct_index < options_count)
);

ALTER TABLE private.quiz_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.quiz_keys FROM PUBLIC, anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_quiz_keys_module_lesson
  ON private.quiz_keys (module_id, lesson_id);

-- Generated from src/lib/course.ts; this is server-only answer metadata.
TRUNCATE TABLE private.quiz_keys;
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

CREATE OR REPLACE FUNCTION private.submit_quiz_authoritative(
  p_module_id TEXT,
  p_lesson_id TEXT,
  p_answers INTEGER[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_question_count INTEGER := 0;
  v_correct INTEGER := 0;
  v_score INTEGER := 0;
  v_passed BOOLEAN := FALSE;
  v_attempt_count INTEGER := 0;
  v_global_attempt_count INTEGER := 0;
  v_completed BOOLEAN := FALSE;
  v_best_score NUMERIC := 0;
  v_key RECORD;
  v_index INTEGER;
  v_is_correct BOOLEAN;
  v_answers_json JSONB := '[]'::jsonb;
  v_answer_correct JSONB := '[]'::jsonb;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'quiz_auth_required' USING ERRCODE = '28000';
  END IF;

  IF p_module_id IS NULL OR p_module_id !~ '^module-[0-9]+$'
    OR p_lesson_id IS NULL OR p_lesson_id !~ '^b[0-9]+-l[0-9]+$'
    OR p_answers IS NULL
    OR COALESCE(array_ndims(p_answers), 0) <> 1
    OR COALESCE(array_lower(p_answers, 1), 0) <> 1
    OR COALESCE(cardinality(p_answers), 0) = 0
    OR cardinality(p_answers) > 100
    OR array_position(p_answers, NULL) IS NOT NULL
  THEN
    RAISE EXCEPTION 'quiz_invalid_input' USING ERRCODE = '22023';
  END IF;

  SELECT count(*)::integer
    INTO v_question_count
    FROM private.quiz_keys AS key
   WHERE key.module_id = p_module_id
     AND key.lesson_id = p_lesson_id;

  IF v_question_count = 0 OR cardinality(p_answers) <> v_question_count THEN
    RAISE EXCEPTION 'quiz_invalid_lesson_or_answer_count' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text || ':' || p_module_id || ':' || p_lesson_id, 0)
  );

  FOR v_index IN 1..v_question_count LOOP
    SELECT key.correct_index, key.options_count
      INTO v_key
      FROM private.quiz_keys AS key
     WHERE key.module_id = p_module_id
       AND key.lesson_id = p_lesson_id
       AND key.question_index = v_index - 1;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'quiz_key_incomplete' USING ERRCODE = '22023';
    END IF;

    IF p_answers[v_index] < 0 OR p_answers[v_index] >= v_key.options_count THEN
      RAISE EXCEPTION 'quiz_invalid_option' USING ERRCODE = '22023';
    END IF;

    v_is_correct := p_answers[v_index] = v_key.correct_index;
    IF v_is_correct THEN
      v_correct := v_correct + 1;
    END IF;
    v_answer_correct := v_answer_correct || pg_catalog.jsonb_build_array(v_is_correct);
  END LOOP;

  v_score := round((v_correct::numeric / v_question_count) * 100)::integer;
  v_passed := v_score >= 75;
  v_answers_json := pg_catalog.to_jsonb(p_answers);

  -- Hosted projects created before this migration may use the hardened private
  -- attempt table. Fresh installs start with the original public table.
  IF pg_catalog.to_regclass('private.quiz_attempts') IS NOT NULL THEN
    EXECUTE
      'SELECT count(*) FROM private.quiz_attempts
        WHERE user_id = $1 AND module_id = $2 AND lesson_id = $3
          AND submitted_at > pg_catalog.now() - interval ''1 minute'''
      INTO v_attempt_count
      USING v_user_id, p_module_id, p_lesson_id;
    EXECUTE
      'SELECT count(*) FROM private.quiz_attempts
        WHERE user_id = $1 AND submitted_at > pg_catalog.now() - interval ''1 minute'''
      INTO v_global_attempt_count
      USING v_user_id;
  ELSE
    EXECUTE
      'SELECT count(*) FROM public.quiz_attempts
        WHERE user_id = $1 AND module_id = $2 AND lesson_id = $3
          AND created_at > pg_catalog.now() - interval ''1 minute'''
      INTO v_attempt_count
      USING v_user_id, p_module_id, p_lesson_id;
    EXECUTE
      'SELECT count(*) FROM public.quiz_attempts
        WHERE user_id = $1 AND created_at > pg_catalog.now() - interval ''1 minute'''
      INTO v_global_attempt_count
      USING v_user_id;
  END IF;

  IF v_attempt_count >= 5 OR v_global_attempt_count >= 20 THEN
    RAISE EXCEPTION 'quiz_rate_limited' USING ERRCODE = 'P0001';
  END IF;

  IF pg_catalog.to_regclass('private.quiz_attempts') IS NOT NULL THEN
    EXECUTE
      'INSERT INTO private.quiz_attempts (user_id, module_id, lesson_id, score, passed)
       VALUES ($1, $2, $3, $4, $5)'
      USING v_user_id, p_module_id, p_lesson_id, v_score, v_passed;
    EXECUTE
      'DELETE FROM private.quiz_attempts WHERE submitted_at < pg_catalog.now() - interval ''30 days''';
  ELSE
    EXECUTE
      'INSERT INTO public.quiz_attempts (user_id, module_id, lesson_id, score, answers)
       VALUES ($1, $2, $3, $4, $5)'
      USING v_user_id, p_module_id, p_lesson_id, v_score, v_answers_json;
    EXECUTE
      'DELETE FROM public.quiz_attempts WHERE created_at < pg_catalog.now() - interval ''30 days''';
  END IF;

  IF v_passed THEN
    INSERT INTO public.progress (
      user_id, module_id, lesson_id, is_completed, best_score, last_attempt
    )
    VALUES (v_user_id, p_module_id, p_lesson_id, TRUE, v_score, pg_catalog.now())
    ON CONFLICT (user_id, module_id, lesson_id) DO UPDATE
      SET is_completed = public.progress.is_completed OR EXCLUDED.is_completed,
          best_score = GREATEST(public.progress.best_score, EXCLUDED.best_score),
          last_attempt = EXCLUDED.last_attempt
    RETURNING is_completed, best_score INTO v_completed, v_best_score;
  ELSE
    SELECT progress.is_completed, progress.best_score
      INTO v_completed, v_best_score
      FROM public.progress AS progress
     WHERE progress.user_id = v_user_id
       AND progress.module_id = p_module_id
       AND progress.lesson_id = p_lesson_id;
    v_completed := COALESCE(v_completed, FALSE);
    v_best_score := COALESCE(v_best_score, 0);
  END IF;

  RETURN pg_catalog.jsonb_build_object(
    'correct', v_correct,
    'total', v_question_count,
    'score', v_score,
    'passed', v_passed,
    'answerCorrect', v_answer_correct,
    'bestScore', COALESCE(v_best_score, 0),
    'completed', COALESCE(v_completed, FALSE)
  );
END;
$function$;

REVOKE ALL ON FUNCTION private.submit_quiz_authoritative(TEXT, TEXT, INTEGER[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.submit_quiz_authoritative(TEXT, TEXT, INTEGER[]) TO authenticated;

CREATE OR REPLACE FUNCTION public.submit_quiz(
  p_module_id TEXT,
  p_lesson_id TEXT,
  p_answers INTEGER[]
)
RETURNS JSONB
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $function$
  SELECT private.submit_quiz_authoritative(p_module_id, p_lesson_id, p_answers);
$function$;

REVOKE ALL ON FUNCTION public.submit_quiz(TEXT, TEXT, INTEGER[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz(TEXT, TEXT, INTEGER[]) TO authenticated;

REVOKE ALL ON FUNCTION public.record_quiz_attempt(TEXT, TEXT, NUMERIC, BOOLEAN, JSONB) FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.record_quiz_attempt(TEXT, TEXT, NUMERIC, BOOLEAN, JSONB);

-- The progress row is updated only by the authenticated server-side quiz RPC.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.progress FROM PUBLIC, anon, authenticated;
