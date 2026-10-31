-- Server-authoritative quiz grading. Keys are private; only the selected correctness booleans leave the database.
CREATE SCHEMA IF NOT EXISTS private;
CREATE TABLE IF NOT EXISTS private.quiz_answer_key (
  module_id text NOT NULL CHECK (module_id ~ '^module-[0-9]+$'),
  lesson_id text NOT NULL CHECK (lesson_id ~ '^lesson-[0-9]+$'),
  question_index integer NOT NULL CHECK (question_index >= 0),
  correct_option integer NOT NULL CHECK (correct_option >= 0),
  option_count integer NOT NULL CHECK (option_count >= 2),
  PRIMARY KEY (module_id, lesson_id, question_index),
  CHECK (correct_option < option_count)
);
ALTER TABLE private.quiz_answer_key ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.quiz_answer_key FROM PUBLIC, anon, authenticated;
INSERT INTO private.quiz_answer_key (module_id, lesson_id, question_index, correct_option, option_count) VALUES
('module-1','lesson-1',0,0,3),
('module-1','lesson-2',0,1,3),
('module-1','lesson-3',0,2,3),
('module-1','lesson-4',0,0,3),
('module-1','lesson-4',1,1,3),
('module-1','lesson-4',2,2,3),
('module-1','lesson-4',3,0,3),
('module-2','lesson-1',0,1,3),
('module-2','lesson-2',0,2,3),
('module-2','lesson-3',0,0,3),
('module-2','lesson-4',0,1,3),
('module-2','lesson-5',0,2,3),
('module-2','lesson-6',0,0,3),
('module-2','lesson-7',0,1,3),
('module-2','lesson-7',1,2,3),
('module-2','lesson-7',2,0,3),
('module-2','lesson-7',3,1,3),
('module-3','lesson-1',0,2,3),
('module-3','lesson-2',0,0,3),
('module-3','lesson-3',0,1,3),
('module-3','lesson-4',0,2,3),
('module-3','lesson-5',0,0,3),
('module-3','lesson-6',0,1,3),
('module-3','lesson-7',0,2,3),
('module-3','lesson-8',0,0,3),
('module-3','lesson-8',1,1,3),
('module-3','lesson-8',2,2,3),
('module-3','lesson-8',3,0,3),
('module-4','lesson-1',0,1,3),
('module-4','lesson-2',0,2,3),
('module-4','lesson-3',0,0,3),
('module-4','lesson-4',0,1,3),
('module-4','lesson-5',0,2,3),
('module-4','lesson-6',0,0,3),
('module-4','lesson-7',0,1,3),
('module-4','lesson-8',0,2,3),
('module-4','lesson-8',1,0,3),
('module-4','lesson-8',2,1,3),
('module-4','lesson-8',3,2,3),
('module-5','lesson-1',0,0,3),
('module-5','lesson-2',0,1,3),
('module-5','lesson-3',0,2,3),
('module-5','lesson-4',0,0,3)
ON CONFLICT (module_id, lesson_id, question_index) DO UPDATE
SET correct_option = EXCLUDED.correct_option, option_count = EXCLUDED.option_count;
CREATE TABLE IF NOT EXISTS private.quiz_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id text NOT NULL CHECK (module_id ~ '^module-[0-9]+$'),
  lesson_id text NOT NULL CHECK (lesson_id ~ '^lesson-[0-9]+$'),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed boolean NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE private.quiz_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.quiz_attempts FROM PUBLIC, anon, authenticated;
CREATE INDEX IF NOT EXISTS quiz_attempts_user_lesson_time_idx ON private.quiz_attempts (user_id, module_id, lesson_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS quiz_attempts_submitted_at_idx ON private.quiz_attempts (submitted_at);
COMMENT ON TABLE private.quiz_answer_key IS 'Server-only answer key for lesson quizzes; never expose through the Data API.';
COMMENT ON TABLE private.quiz_attempts IS 'Server-only quiz attempt audit and rate-limit source.';
CREATE OR REPLACE FUNCTION public.submit_quiz(p_module_id text, p_lesson_id text, p_answers integer[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_total integer;
  v_correct integer;
  v_score integer;
  v_passed boolean;
  v_recent_attempts integer;
  v_answer_correct jsonb;
  v_best_score numeric := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'quiz_auth_required' USING ERRCODE = '28000';
  END IF;
  IF p_module_id IS NULL OR p_module_id !~ '^module-[0-9]+$'
     OR p_lesson_id IS NULL OR p_lesson_id !~ '^lesson-[0-9]+$'
     OR p_answers IS NULL
     OR COALESCE(array_ndims(p_answers), 0) <> 1
     OR COALESCE(array_lower(p_answers, 1), 0) <> 1
     OR cardinality(p_answers) = 0 OR cardinality(p_answers) > 100
     OR array_position(p_answers, NULL) IS NOT NULL THEN
    RAISE EXCEPTION 'quiz_invalid_input' USING ERRCODE = '22023';
  END IF;
  SELECT count(*)::integer INTO v_total
  FROM private.quiz_answer_key AS k
  WHERE k.module_id = p_module_id AND k.lesson_id = p_lesson_id;
  IF v_total = 0 OR cardinality(p_answers) <> v_total THEN
    RAISE EXCEPTION 'quiz_invalid_lesson_or_answer_count' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1 FROM private.quiz_answer_key AS k
    WHERE k.module_id = p_module_id AND k.lesson_id = p_lesson_id
      AND (p_answers[k.question_index + 1] < 0 OR p_answers[k.question_index + 1] >= k.option_count)
  ) THEN
    RAISE EXCEPTION 'quiz_invalid_option' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
    v_user_id::text || ':' || p_module_id || ':' || p_lesson_id, 0
  ));
  SELECT count(*)::integer INTO v_recent_attempts
  FROM private.quiz_attempts AS a
  WHERE a.user_id = v_user_id AND a.module_id = p_module_id AND a.lesson_id = p_lesson_id
    AND a.submitted_at > now() - interval '5 minutes';
  IF v_recent_attempts >= 5 THEN
    RAISE EXCEPTION 'quiz_rate_limited' USING ERRCODE = 'P0001';
  END IF;
  SELECT
    count(*) FILTER (WHERE p_answers[k.question_index + 1] = k.correct_option)::integer,
    COALESCE(jsonb_agg(p_answers[k.question_index + 1] = k.correct_option ORDER BY k.question_index), '[]'::jsonb)
  INTO v_correct, v_answer_correct
  FROM private.quiz_answer_key AS k
  WHERE k.module_id = p_module_id AND k.lesson_id = p_lesson_id;
  v_score := round((v_correct::numeric / v_total) * 100)::integer;
  v_passed := v_score >= 75;
  INSERT INTO private.quiz_attempts (user_id, module_id, lesson_id, score, passed)
  VALUES (v_user_id, p_module_id, p_lesson_id, v_score, v_passed);
  DELETE FROM private.quiz_attempts WHERE submitted_at < now() - interval '30 days';
  IF v_passed THEN
    INSERT INTO public.progress (user_id, module_id, lesson_id, is_completed, best_score, last_attempt)
    VALUES (v_user_id, p_module_id, p_lesson_id, TRUE, v_score, now())
    ON CONFLICT (user_id, module_id, lesson_id) DO UPDATE SET
      is_completed = public.progress.is_completed OR EXCLUDED.is_completed,
      best_score = GREATEST(public.progress.best_score, EXCLUDED.best_score),
      last_attempt = EXCLUDED.last_attempt
    RETURNING best_score INTO v_best_score;
  ELSE
    SELECT COALESCE(p.best_score, 0) INTO v_best_score
    FROM public.progress AS p
    WHERE p.user_id = v_user_id AND p.module_id = p_module_id AND p.lesson_id = p_lesson_id;
    v_best_score := COALESCE(v_best_score, 0);
  END IF;
  RETURN jsonb_build_object(
    'correct', v_correct, 'total', v_total, 'score', v_score, 'passed', v_passed,
    'answerCorrect', v_answer_correct, 'bestScore', COALESCE(v_best_score, 0)
  );
END;
$function$;
REVOKE ALL ON FUNCTION public.submit_quiz(text, text, integer[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_quiz(text, text, integer[]) TO authenticated;
-- Direct INSERT/UPDATE remains temporarily for compatibility until the frontend cutover.
