-- DEVELOPMENT-ONLY BOOTSTRAP SNAPSHOT
-- Created 2026-10-30 from a read-only inspection of the current production schema.
-- Apply ONLY to the separate project python-desde-cero-dev (fcwbkkivelsipqqrbpya).
-- Never apply this bootstrap file to production.
-- Quiz answer-key rows are intentionally seeded separately and are not stored in this public repository file.

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  full_name text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  is_used boolean NOT NULL DEFAULT false,
  used_by uuid REFERENCES auth.users(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE TABLE public.progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  module_id text NOT NULL,
  lesson_id text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  best_score numeric NOT NULL DEFAULT 0,
  last_attempt timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT progress_user_id_module_id_lesson_id_key UNIQUE (user_id,module_id,lesson_id)
);

CREATE TABLE private.quiz_answer_key (
  module_id text NOT NULL CHECK (module_id ~ '^module-[0-9]+$'),
  lesson_id text NOT NULL CHECK (lesson_id ~ '^(lesson-[0-9]+|b[0-9]+-l[0-9]+)$'),
  question_index integer NOT NULL CHECK (question_index >= 0),
  correct_option integer NOT NULL CHECK (correct_option >= 0),
  option_count integer NOT NULL CHECK (option_count >= 2),
  correct_option_v2 integer,
  CONSTRAINT quiz_answer_key_pkey PRIMARY KEY (module_id,lesson_id,question_index),
  CONSTRAINT quiz_answer_key_correct_option_range_check CHECK (correct_option < option_count),
  CONSTRAINT quiz_answer_key_v2_check CHECK (correct_option_v2 IS NULL OR (correct_option_v2 >= 0 AND correct_option_v2 < option_count))
);

CREATE TABLE private.quiz_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id text NOT NULL CHECK (module_id ~ '^module-[0-9]+$'),
  lesson_id text NOT NULL CHECK (lesson_id ~ '^(lesson-[0-9]+|b[0-9]+-l[0-9]+)$'),
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  passed boolean NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX invitations_created_by_idx ON public.invitations(created_by);
CREATE INDEX invitations_used_by_idx ON public.invitations(used_by);
CREATE INDEX quiz_attempts_submitted_at_idx ON private.quiz_attempts(submitted_at);
CREATE INDEX quiz_attempts_user_lesson_time_idx ON private.quiz_attempts(user_id,module_id,lesson_id,submitted_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.quiz_answer_key ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.quiz_attempts ENABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION private.current_user_is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND is_admin = TRUE
  );
$function$;

CREATE OR REPLACE FUNCTION private.prevent_used_invitation_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  IF OLD.is_used THEN
    RAISE EXCEPTION 'invitation_used_history_protected'
      USING ERRCODE = '23514';
  END IF;

  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_code TEXT;
    v_invitation_id UUID;
BEGIN
    v_code := NULLIF(
        upper(
            btrim(
                COALESCE(
                    NEW.raw_user_meta_data ->> 'invitation_code',
                    ''
                )
            )
        ),
        ''
    );

    IF v_code IS NOT NULL THEN
        UPDATE public.invitations
        SET
            is_used = TRUE,
            used_by = NEW.id
        WHERE code = v_code
          AND is_used = FALSE
          AND (
              expires_at IS NULL
              OR expires_at > NOW()
          )
        RETURNING id INTO v_invitation_id;

        IF v_invitation_id IS NULL THEN
            RAISE EXCEPTION
                'Invitation is invalid, expired, or already used';
        END IF;
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        full_name
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'full_name'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN NEW;
END;
$function$;

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
        'answerCorrect', v_answer_correct,
        'bestScore', COALESCE(v_best_score, 0)
    );
END;
$function$;

-- The private evaluator owns SECURITY DEFINER and validates auth.uid().
-- Both public RPCs are invoker wrappers; private schema is not exposed by the Data API.
CREATE OR REPLACE FUNCTION public.submit_quiz_v2(
  p_module_id text,
  p_lesson_id text,
  p_answers integer[]
)
RETURNS jsonb
LANGUAGE sql
SET search_path = ''
AS $function$
  SELECT private.submit_quiz_authoritative_v2(p_module_id,p_lesson_id,p_answers);
$function$;

-- Backward-compatible function name; both routes use the authoritative v2 key.
-- Backward-compatible invoker wrapper.
CREATE OR REPLACE FUNCTION public.submit_quiz(
  p_module_id text,
  p_lesson_id text,
  p_answers integer[]
)
RETURNS jsonb
LANGUAGE sql
SET search_path = ''
AS $function$
  SELECT public.submit_quiz_v2(p_module_id,p_lesson_id,p_answers);
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER invitations_prevent_used_deletion
BEFORE DELETE ON public.invitations
FOR EACH ROW EXECUTE FUNCTION private.prevent_used_invitation_deletion();

CREATE POLICY "Usuarios ven su propio perfil"
ON public.profiles
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = id OR (SELECT private.current_user_is_admin()));

CREATE POLICY "Admins gestionan invitaciones"
ON public.invitations
FOR ALL TO authenticated
USING ((SELECT private.current_user_is_admin()))
WITH CHECK ((SELECT private.current_user_is_admin()));

CREATE POLICY "Estudiantes leen su progreso"
ON public.progress
FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Estudiantes insertan su progreso"
ON public.progress
FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Estudiantes actualizan su progreso"
ON public.progress
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "No direct quiz answer key access"
ON private.quiz_answer_key
FOR ALL TO public
USING (false) WITH CHECK (false);

CREATE POLICY "No direct quiz attempt access"
ON private.quiz_attempts
FOR ALL TO public
USING (false) WITH CHECK (false);

-- Explicit Data API grants: new public tables are not automatically granted to API roles.
REVOKE ALL ON SCHEMA public FROM anon;
GRANT USAGE ON SCHEMA public TO authenticated;

REVOKE ALL ON TABLE public.profiles,public.invitations,public.progress FROM PUBLIC,anon,authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT SELECT,INSERT,DELETE ON TABLE public.invitations TO authenticated;
GRANT SELECT ON TABLE public.progress TO authenticated;
GRANT ALL ON TABLE public.profiles,public.invitations,public.progress TO service_role;

REVOKE ALL ON SCHEMA private FROM PUBLIC,anon;
GRANT USAGE ON SCHEMA private TO authenticated;
REVOKE ALL ON TABLE private.quiz_answer_key,private.quiz_attempts FROM PUBLIC,anon,authenticated,service_role;
REVOKE ALL ON FUNCTION private.current_user_is_admin() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION private.current_user_is_admin() TO authenticated;
REVOKE ALL ON FUNCTION private.prevent_used_invitation_deletion() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION private.submit_quiz_authoritative_v2(text,text,integer[]) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION private.submit_quiz_authoritative_v2(text,text,integer[]) TO authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC,anon,authenticated;

REVOKE ALL ON FUNCTION public.submit_quiz_v2(text,text,integer[]) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_v2(text,text,integer[]) TO authenticated;
REVOKE ALL ON FUNCTION public.submit_quiz(text,text,integer[]) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz(text,text,integer[]) TO authenticated;

-- Least-privilege defaults for future objects created by postgres in public.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE SELECT,INSERT,UPDATE,DELETE ON TABLES FROM anon,authenticated,service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon,authenticated,service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE USAGE,SELECT ON SEQUENCES FROM anon,authenticated,service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

NOTIFY pgrst,'reload schema';
