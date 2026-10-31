-- 027: Close the public per-question correctness oracle and enforce course gates in the RPC.
-- The public RPC is SECURITY INVOKER; the authoritative grader stays private and SECURITY DEFINER.
-- No answer keys, attempts or progress rows are deleted or rewritten by this migration.

CREATE OR REPLACE FUNCTION private.submit_quiz_authoritative_v2(
  p_module_id text,
  p_lesson_id text,
  p_answers integer[]
)
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
    v_best_score numeric := 0;
    v_previous_module_id text;
    v_previous_lesson_id text;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'quiz_auth_required' USING ERRCODE = '28000';
    END IF;

    -- Enforce module prerequisites inside the SECURITY DEFINER grader itself.
    -- Authenticated users can execute this function directly, so the public
    -- wrapper cannot be the only place that performs these checks.
    CASE p_module_id
        WHEN 'module-2' THEN
            v_previous_module_id := 'module-1';
            v_previous_lesson_id := 'b1-l4';
        WHEN 'module-3' THEN
            v_previous_module_id := 'module-2';
            v_previous_lesson_id := 'b2-l7';
        WHEN 'module-4' THEN
            v_previous_module_id := 'module-3';
            v_previous_lesson_id := 'b3-l8';
        WHEN 'module-5' THEN
            v_previous_module_id := 'module-4';
            v_previous_lesson_id := 'b4-l11';
        ELSE
            v_previous_module_id := NULL;
            v_previous_lesson_id := NULL;
    END CASE;

    IF v_previous_lesson_id IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
             FROM public.progress AS progress
            WHERE progress.user_id = v_user_id
              AND progress.module_id = v_previous_module_id
              AND progress.lesson_id = v_previous_lesson_id
              AND progress.is_completed IS TRUE
       ) THEN
        RAISE EXCEPTION 'quiz_prerequisite_required' USING ERRCODE = 'P0001';
    END IF;

    IF p_module_id = 'module-4' AND p_lesson_id = 'b4-l10'
       AND NOT EXISTS (
           SELECT 1
             FROM public.progress AS progress
            WHERE progress.user_id = v_user_id
              AND progress.module_id = 'module-4'
              AND progress.lesson_id = 'b4-l8'
              AND progress.is_completed IS TRUE
       ) THEN
        RAISE EXCEPTION 'quiz_prerequisite_required' USING ERRCODE = 'P0001';
    END IF;

    IF p_module_id = 'module-4' AND p_lesson_id = 'b4-l11'
       AND NOT EXISTS (
           SELECT 1
             FROM public.progress AS progress
            WHERE progress.user_id = v_user_id
              AND progress.module_id = 'module-4'
              AND progress.lesson_id = 'b4-l10'
              AND progress.is_completed IS TRUE
       ) THEN
        RAISE EXCEPTION 'quiz_prerequisite_required' USING ERRCODE = 'P0001';
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

    -- Only the aggregate score is returned. Per-question booleans would let an
    -- authenticated caller probe the private answer key through repeated RPC calls.
    SELECT
        count(*) FILTER (
            WHERE p_answers[answer_key.question_index + 1] = answer_key.correct_option_v2
        )::integer
      INTO v_correct
      FROM private.quiz_answer_key AS answer_key
     WHERE answer_key.module_id = p_module_id
       AND answer_key.lesson_id = p_lesson_id;

    v_score := round((v_correct::numeric / v_total) * 100)::integer;
    v_passed := v_score >= 75;

    INSERT INTO private.quiz_attempts (user_id, module_id, lesson_id, score, passed)
    VALUES (v_user_id, p_module_id, p_lesson_id, v_score, v_passed);

    DELETE FROM private.quiz_attempts
     WHERE user_id = v_user_id
       AND submitted_at < now() - interval '30 days';

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
        'bestScore', COALESCE(v_best_score, 0)
    );
END;
$function$;

CREATE OR REPLACE FUNCTION public.submit_quiz_v2(
    p_module_id text,
    p_lesson_id text,
    p_answers integer[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO ''
AS $function$
DECLARE
    v_user_id uuid := auth.uid();
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'quiz_auth_required' USING ERRCODE = '28000';
    END IF;

    RETURN private.submit_quiz_authoritative_v2(
        p_module_id,
        p_lesson_id,
        p_answers
    );
END;
$function$;

-- Preserve the intended RPC ACL: only authenticated sessions may use the public wrapper.
GRANT USAGE ON SCHEMA private TO authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION public.submit_quiz_v2(text, text, integer[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_v2(text, text, integer[]) TO authenticated;

-- The private grader must remain callable by the authenticated invoker wrapper, not anon/public.
REVOKE ALL PRIVILEGES ON FUNCTION private.submit_quiz_authoritative_v2(text, text, integer[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.submit_quiz_authoritative_v2(text, text, integer[]) TO authenticated;

COMMENT ON FUNCTION public.submit_quiz_v2(text, text, integer[]) IS
  'Authenticated RPC. Enforces course prerequisites and returns aggregate grading only; private answer keys and per-question correctness stay server-side.';
