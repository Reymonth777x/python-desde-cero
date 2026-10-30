-- Manual regression check for migrations 027-028.
-- Run against a database where migrations 024-027 are applied:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/sql/verify-quiz-prerequisites.sql
-- Uses a synthetic auth.uid() and rolls the transaction back; no user, attempt or progress row is retained.

BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000270', true);
SELECT set_config('request.jwt.claim.role', 'authenticated', true);

DO $checks$
DECLARE
  v_public_security_definer boolean;
  v_private_security_definer boolean;
  v_definition text;
BEGIN
  IF auth.uid() IS DISTINCT FROM '00000000-0000-0000-0000-000000000270'::uuid THEN
    RAISE EXCEPTION 'Synthetic auth.uid() was not established';
  END IF;

  SELECT prosecdef INTO v_public_security_definer
    FROM pg_catalog.pg_proc
   WHERE oid = 'public.submit_quiz_v2(text,text,integer[])'::regprocedure;
  SELECT prosecdef INTO v_private_security_definer
    FROM pg_catalog.pg_proc
   WHERE oid = 'private.submit_quiz_authoritative_v2(text,text,integer[])'::regprocedure;

  IF v_public_security_definer IS DISTINCT FROM false THEN
    RAISE EXCEPTION 'Public RPC must remain SECURITY INVOKER';
  END IF;
  IF v_private_security_definer IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Private grader must remain SECURITY DEFINER';
  END IF;

  v_definition := pg_catalog.pg_get_functiondef(
    'private.submit_quiz_authoritative_v2(text,text,integer[])'::regprocedure
  );
  IF v_definition ILIKE '%answerCorrect%' OR v_definition ILIKE '%answer_correct%' THEN
    RAISE EXCEPTION 'Per-question correctness still appears in the private grader response';
  END IF;
  IF v_definition NOT ILIKE '%quiz_prerequisite_required%' THEN
    RAISE EXCEPTION 'Prerequisite checks are missing from the private grader';
  END IF;
  IF v_definition NOT ILIKE '%existing_module_progress%' THEN
    RAISE EXCEPTION 'Existing target-module progress must preserve access for returning students';
  END IF;
  IF v_definition NOT ILIKE '%existing_project_progress%' OR v_definition NOT ILIKE '%existing_exam_progress%' THEN
    RAISE EXCEPTION 'Existing project and exam progress must also remain accessible';
  END IF;

  IF has_function_privilege('anon', 'public.submit_quiz_v2(text,text,integer[])', 'EXECUTE') THEN
    RAISE EXCEPTION 'anon must not execute the public quiz RPC';
  END IF;
  IF NOT has_function_privilege('authenticated', 'public.submit_quiz_v2(text,text,integer[])', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated must execute the public quiz RPC';
  END IF;
  IF has_table_privilege('authenticated', 'private.quiz_answer_key', 'SELECT') THEN
    RAISE EXCEPTION 'authenticated must not read private answer keys';
  END IF;
  IF has_table_privilege('authenticated', 'private.quiz_attempts', 'INSERT') THEN
    RAISE EXCEPTION 'authenticated must not insert attempts directly';
  END IF;
  IF has_table_privilege('authenticated', 'public.progress', 'INSERT') THEN
    RAISE EXCEPTION 'authenticated must not insert progress directly';
  END IF;
END
$checks$;

-- Module 2 must not be callable until M1's final assessment is complete.
DO $test$
BEGIN
  BEGIN
    PERFORM public.submit_quiz_v2('module-2', 'b2-l9', ARRAY[1]);
    RAISE EXCEPTION 'Module 2 bypassed the M1 assessment gate' USING ERRCODE = 'P0002';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'quiz_prerequisite_required' THEN RAISE; END IF;
  END;
END
$test$;

-- The authenticated role can call the private function directly, so the
-- same gate must also reject a direct call to the SECURITY DEFINER grader.
DO $test$
BEGIN
  BEGIN
    PERFORM private.submit_quiz_authoritative_v2('module-2', 'b2-l9', ARRAY[1]);
    RAISE EXCEPTION 'Direct grader call bypassed M1 assessment gate' USING ERRCODE = 'P0002';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'quiz_prerequisite_required' THEN RAISE; END IF;
  END;
END
$test$;

DO $test$
BEGIN
  BEGIN
    PERFORM public.submit_quiz_v2('module-3', 'b3-l8', ARRAY[0]);
    RAISE EXCEPTION 'Module 3 bypassed the M2 assessment gate' USING ERRCODE = 'P0002';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'quiz_prerequisite_required' THEN RAISE; END IF;
  END;
END
$test$;

DO $test$
BEGIN
  BEGIN
    PERFORM public.submit_quiz_v2('module-4', 'b4-l10', ARRAY[0,0,0,0,0]);
    RAISE EXCEPTION 'Project bypassed the M4 assessment gate' USING ERRCODE = 'P0002';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'quiz_prerequisite_required' THEN RAISE; END IF;
  END;
END
$test$;

DO $test$
BEGIN
  BEGIN
    PERFORM public.submit_quiz_v2('module-4', 'b4-l11', ARRAY[0,0,0,0,0,0,0,0,0,0,0,0]);
    RAISE EXCEPTION 'Final PE1 exam bypassed the project gate' USING ERRCODE = 'P0002';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'quiz_prerequisite_required' THEN RAISE; END IF;
  END;
END
$test$;

DO $test$
BEGIN
  BEGIN
    PERFORM public.submit_quiz_v2('module-5', 'b5-l4', ARRAY[0]);
    RAISE EXCEPTION 'Optional module bypassed the final PE1 exam gate' USING ERRCODE = 'P0002';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'quiz_prerequisite_required' THEN RAISE; END IF;
  END;
END
$test$;

SELECT 'PASS: ACLs, aggregate-only results, and all six prerequisite bypass paths' AS verification;
ROLLBACK;
