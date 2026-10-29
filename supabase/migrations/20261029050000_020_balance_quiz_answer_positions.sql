-- Migration 020: add a compatible second quiz key version.
-- Keep correct_option unchanged so the currently deployed app continues grading correctly.
-- The new app version uses submit_quiz_v2 and correct_option_v2 after this migration is applied.

ALTER TABLE private.quiz_answer_key
  ADD COLUMN IF NOT EXISTS correct_option_v2 integer
  CHECK (correct_option_v2 IS NULL OR (correct_option_v2 >= 0 AND correct_option_v2 < option_count));

COMMENT ON COLUMN private.quiz_answer_key.correct_option_v2 IS
  'Answer index for the balanced quiz option order, used by public.submit_quiz_v2.';

DO $$
DECLARE
  v_updated integer;
BEGIN
  UPDATE private.quiz_answer_key AS key
     SET correct_option_v2 = mapping.correct_option_v2
    FROM (VALUES
    ('module-1', 'b1-l1', 0, 2, 1),
    ('module-1', 'b1-l1', 1, 3, 1),
    ('module-1', 'b1-l2', 0, 0, 2),
    ('module-1', 'b1-l3', 0, 2, 1),
    ('module-1', 'b1-l4', 0, 3, 0),
    ('module-2', 'b2-l1', 0, 2, 1),
    ('module-2', 'b2-l2', 0, 1, 0),
    ('module-2', 'b2-l3', 0, 0, 0),
    ('module-2', 'b2-l4', 0, 1, 0),
    ('module-2', 'b2-l5', 0, 2, 0),
    ('module-2', 'b2-l6', 0, 3, 0),
    ('module-2', 'b2-l7', 0, 1, 0),
    ('module-2', 'b2-l7', 1, 0, 0),
    ('module-2', 'b2-l7', 2, 1, 0),
    ('module-2', 'b2-l7', 3, 2, 0),
    ('module-2', 'b2-l7', 4, 3, 0),
    ('module-3', 'b3-l1', 0, 3, 1),
    ('module-3', 'b3-l2', 0, 0, 0),
    ('module-3', 'b3-l3', 0, 0, 0),
    ('module-3', 'b3-l4', 0, 3, 1),
    ('module-3', 'b3-l5', 0, 0, 0),
    ('module-3', 'b3-l6', 0, 0, 0),
    ('module-3', 'b3-l7', 0, 0, 0),
    ('module-3', 'b3-l8', 0, 3, 1),
    ('module-3', 'b3-l8', 1, 0, 0),
    ('module-3', 'b3-l8', 2, 0, 0),
    ('module-4', 'b4-l1', 0, 1, 0),
    ('module-4', 'b4-l2', 0, 1, 0),
    ('module-4', 'b4-l3', 0, 1, 0),
    ('module-4', 'b4-l4', 0, 2, 0),
    ('module-4', 'b4-l5', 0, 2, 0),
    ('module-4', 'b4-l6', 0, 3, 0),
    ('module-4', 'b4-l7', 0, 3, 0),
    ('module-4', 'b4-l8', 0, 1, 0),
    ('module-4', 'b4-l8', 1, 2, 0),
    ('module-4', 'b4-l8', 2, 3, 0),
    ('module-5', 'b5-l1', 0, 1, 0),
    ('module-5', 'b5-l2', 0, 2, 0),
    ('module-5', 'b5-l2', 1, 0, 0),
    ('module-5', 'b5-l3', 0, 1, 0),
    ('module-5', 'b5-l4', 0, 2, 0)
    ) AS mapping(module_id, lesson_id, question_index, correct_option_v2, original_correct_option)
   WHERE key.module_id = mapping.module_id
     AND key.lesson_id = mapping.lesson_id
     AND key.question_index = mapping.question_index;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  IF v_updated <> 41 THEN
    RAISE EXCEPTION 'Expected to configure 41 v2 quiz answer keys, updated %', v_updated;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION private.submit_quiz_authoritative_v2(p_module_id text, p_lesson_id text, p_answers integer[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
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
       OR p_lesson_id IS NULL OR p_lesson_id !~ '^(lesson-[0-9]+|b[0-9]+-l[0-9]+)$'
       OR p_answers IS NULL
       OR COALESCE(array_ndims(p_answers), 0) <> 1
       OR COALESCE(array_lower(p_answers, 1), 0) <> 1
       OR cardinality(p_answers) = 0
       OR cardinality(p_answers) > 100
       OR array_position(p_answers, NULL) IS NOT NULL THEN
        RAISE EXCEPTION 'quiz_invalid_input' USING ERRCODE = '22023';
    END IF;

    SELECT count(*)::integer
      INTO v_total
      FROM private.quiz_answer_key AS answer_key
     WHERE answer_key.module_id = p_module_id
       AND answer_key.lesson_id = p_lesson_id;

    IF v_total = 0 OR cardinality(p_answers) <> v_total THEN
        RAISE EXCEPTION 'quiz_invalid_lesson_or_answer_count' USING ERRCODE = '22023';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM private.quiz_answer_key AS answer_key
         WHERE answer_key.module_id = p_module_id
           AND answer_key.lesson_id = p_lesson_id
           AND answer_key.correct_option_v2 IS NULL
    ) THEN
        RAISE EXCEPTION 'quiz_v2_not_configured' USING ERRCODE = '22023';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM private.quiz_answer_key AS answer_key
         WHERE answer_key.module_id = p_module_id
           AND answer_key.lesson_id = p_lesson_id
           AND (
               p_answers[answer_key.question_index + 1] < 0
               OR p_answers[answer_key.question_index + 1] >= answer_key.option_count
           )
    ) THEN
        RAISE EXCEPTION 'quiz_invalid_option' USING ERRCODE = '22023';
    END IF;

    PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(
            v_user_id::text || ':' || p_module_id || ':' || p_lesson_id,
            0
        )
    );

    SELECT count(*)::integer
      INTO v_recent_attempts
      FROM private.quiz_attempts AS attempt
     WHERE attempt.user_id = v_user_id
       AND attempt.module_id = p_module_id
       AND attempt.lesson_id = p_lesson_id
       AND attempt.submitted_at > now() - interval '5 minutes';

    IF v_recent_attempts >= 5 THEN
        RAISE EXCEPTION 'quiz_rate_limited' USING ERRCODE = 'P0001';
    END IF;

    SELECT
        count(*) FILTER (
            WHERE p_answers[answer_key.question_index + 1] = answer_key.correct_option_v2
        )::integer,
        COALESCE(
            jsonb_agg(
                p_answers[answer_key.question_index + 1] = answer_key.correct_option_v2
                ORDER BY answer_key.question_index
            ),
            '[]'::jsonb
        )
      INTO v_correct, v_answer_correct
      FROM private.quiz_answer_key AS answer_key
     WHERE answer_key.module_id = p_module_id
       AND answer_key.lesson_id = p_lesson_id;

    v_score := round((v_correct::numeric / v_total) * 100)::integer;
    v_passed := v_score >= 75;

    INSERT INTO private.quiz_attempts (user_id, module_id, lesson_id, score, passed)
    VALUES (v_user_id, p_module_id, p_lesson_id, v_score, v_passed);

    DELETE FROM private.quiz_attempts
     WHERE submitted_at < now() - interval '30 days';

    IF v_passed THEN
        INSERT INTO public.progress (
            user_id, module_id, lesson_id, is_completed, best_score, last_attempt
        ) VALUES (
            v_user_id, p_module_id, p_lesson_id, TRUE, v_score, now()
        )
        ON CONFLICT (user_id, module_id, lesson_id)
        DO UPDATE SET
            is_completed = public.progress.is_completed OR EXCLUDED.is_completed,
            best_score = GREATEST(public.progress.best_score, EXCLUDED.best_score),
            last_attempt = EXCLUDED.last_attempt
        RETURNING best_score INTO v_best_score;
    ELSE
        SELECT COALESCE(progress.best_score, 0)
          INTO v_best_score
          FROM public.progress AS progress
         WHERE progress.user_id = v_user_id
           AND progress.module_id = p_module_id
           AND progress.lesson_id = p_lesson_id;
        v_best_score := COALESCE(v_best_score, 0);
    END IF;

    RETURN jsonb_build_object(
        'correct', v_correct,
        'total', v_total,
        'score', v_score,
        'passed', v_passed,
        'answerCorrect', v_answer_correct,
        'bestScore', COALESCE(v_best_score, 0)
    );
END;
$function$;

-- Keep the implementation function private; calls go through the authenticated public RPC.
REVOKE ALL ON FUNCTION private.submit_quiz_authoritative_v2(text, text, integer[]) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_quiz_v2(
  p_module_id text,
  p_lesson_id text,
  p_answers integer[]
)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT private.submit_quiz_authoritative_v2(p_module_id, p_lesson_id, p_answers);
$function$;

REVOKE ALL ON FUNCTION public.submit_quiz_v2(text, text, integer[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_v2(text, text, integer[]) TO authenticated;

-- Rollback plan: revoke/drop public.submit_quiz_v2 and private.submit_quiz_authoritative_v2,
-- then drop correct_option_v2. The legacy correct_option column is unchanged throughout.
