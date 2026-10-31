-- pgTAP acceptance tests for the current Python desde cero schema.
-- Run only against the local Supabase database:
--   npx supabase start
--   npx supabase test db
--
-- This file creates three temporary Auth users and sample rows inside one
-- transaction. The final ROLLBACK removes every fixture and test result.
-- It must never be executed against a hosted DEV or PROD database.

BEGIN;
SELECT plan(69);

-- ---------------------------------------------------------------------------
-- Current schema, RLS, and table-level ACLs (run as the test database owner).
-- ---------------------------------------------------------------------------

SELECT ok(to_regclass('public.profiles') IS NOT NULL, 'profiles table exists');
SELECT ok(to_regclass('public.invitations') IS NOT NULL, 'invitations table exists');
SELECT ok(to_regclass('public.progress') IS NOT NULL, 'progress table exists');
SELECT ok(to_regclass('private.quiz_answer_key') IS NOT NULL, 'private quiz answer key exists');
SELECT ok(to_regclass('private.quiz_attempts') IS NOT NULL, 'private quiz attempts table exists');
SELECT ok(to_regclass('public.orilla_runs') IS NOT NULL, 'Orilla runs table exists');

SELECT ok((SELECT relrowsecurity FROM pg_class WHERE oid = 'public.profiles'::regclass), 'profiles has RLS enabled');
SELECT ok((SELECT relrowsecurity FROM pg_class WHERE oid = 'public.invitations'::regclass), 'invitations has RLS enabled');
SELECT ok((SELECT relrowsecurity FROM pg_class WHERE oid = 'public.progress'::regclass), 'progress has RLS enabled');
SELECT ok((SELECT relrowsecurity FROM pg_class WHERE oid = 'private.quiz_answer_key'::regclass), 'quiz answer key has RLS enabled');
SELECT ok((SELECT relrowsecurity FROM pg_class WHERE oid = 'private.quiz_attempts'::regclass), 'quiz attempts has RLS enabled');
SELECT ok((SELECT relrowsecurity FROM pg_class WHERE oid = 'public.orilla_runs'::regclass), 'Orilla runs has RLS enabled');

SELECT ok(has_schema_privilege('authenticated', 'private', 'USAGE'), 'authenticated can use the private schema for approved RPCs');
SELECT ok(NOT has_schema_privilege('anon', 'private', 'USAGE'), 'anon cannot use the private schema');

SELECT ok(has_table_privilege('authenticated', 'public.profiles', 'SELECT'), 'authenticated can read profiles subject to RLS');
SELECT ok(NOT has_table_privilege('authenticated', 'public.profiles', 'INSERT'), 'authenticated cannot insert profiles directly');
SELECT ok(NOT has_table_privilege('authenticated', 'public.profiles', 'UPDATE'), 'authenticated cannot update profiles directly');

SELECT ok(has_table_privilege('authenticated', 'public.invitations', 'SELECT'), 'authenticated has invitation SELECT privilege, subject to admin RLS');
SELECT ok(has_table_privilege('authenticated', 'public.invitations', 'INSERT'), 'authenticated has invitation INSERT privilege, subject to admin RLS');
SELECT ok(NOT has_table_privilege('authenticated', 'public.invitations', 'UPDATE'), 'authenticated cannot update invitations directly');
SELECT ok(NOT has_table_privilege('authenticated', 'public.invitations', 'DELETE'), 'authenticated cannot delete invitations directly');

SELECT ok(has_table_privilege('authenticated', 'public.progress', 'SELECT'), 'authenticated can read progress subject to owner RLS');
SELECT ok(NOT has_table_privilege('authenticated', 'public.progress', 'INSERT'), 'authenticated cannot insert progress directly');
SELECT ok(NOT has_table_privilege('authenticated', 'public.progress', 'UPDATE'), 'authenticated cannot update progress directly');
SELECT ok(NOT has_table_privilege('authenticated', 'public.progress', 'DELETE'), 'authenticated cannot delete progress directly');

SELECT ok(NOT has_table_privilege('authenticated', 'private.quiz_answer_key', 'SELECT'), 'authenticated cannot read private answer keys');
SELECT ok(NOT has_table_privilege('authenticated', 'private.quiz_attempts', 'SELECT'), 'authenticated cannot read private quiz attempts');
SELECT ok(NOT has_table_privilege('authenticated', 'private.quiz_attempts', 'INSERT'), 'authenticated cannot insert private quiz attempts');

SELECT ok(has_table_privilege('authenticated', 'public.orilla_runs', 'SELECT'), 'authenticated can read Orilla runs subject to owner RLS');
SELECT ok(NOT has_table_privilege('authenticated', 'public.orilla_runs', 'INSERT'), 'authenticated cannot insert Orilla runs directly');
SELECT ok(NOT has_table_privilege('authenticated', 'public.orilla_runs', 'UPDATE'), 'authenticated cannot update Orilla runs directly');
SELECT ok(NOT has_table_privilege('authenticated', 'public.orilla_runs', 'DELETE'), 'authenticated cannot delete Orilla runs directly');

SELECT ok(has_function_privilege('authenticated', 'public.submit_quiz_v2(text,text,integer[])', 'EXECUTE'), 'authenticated can execute the current quiz RPC');
SELECT ok(NOT has_function_privilege('anon', 'public.submit_quiz_v2(text,text,integer[])', 'EXECUTE'), 'anon cannot execute the current quiz RPC');
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_proc
    WHERE oid = to_regprocedure('public.submit_quiz_v2(text,text,integer[])')
      AND NOT prosecdef
  ),
  'public quiz RPC is SECURITY INVOKER'
);
SELECT ok(has_function_privilege('authenticated', 'private.submit_quiz_authoritative_v2(text,text,integer[])', 'EXECUTE'), 'authenticated can invoke the private quiz grader through the approved RPC');
SELECT ok(NOT has_function_privilege('anon', 'private.submit_quiz_authoritative_v2(text,text,integer[])', 'EXECUTE'), 'anon cannot execute the private quiz grader');
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_proc
    WHERE oid = to_regprocedure('private.submit_quiz_authoritative_v2(text,text,integer[])')
      AND prosecdef
  ),
  'private quiz grader is SECURITY DEFINER'
);

SELECT ok(has_function_privilege('authenticated', 'public.record_orilla_run(text,text,boolean,integer,integer,text,boolean)', 'EXECUTE'), 'authenticated can execute the Orilla RPC');
SELECT ok(NOT has_function_privilege('anon', 'public.record_orilla_run(text,text,boolean,integer,integer,text,boolean)', 'EXECUTE'), 'anon cannot execute the Orilla RPC');
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_proc
    WHERE oid = to_regprocedure('public.record_orilla_run(text,text,boolean,integer,integer,text,boolean)')
      AND NOT prosecdef
  ),
  'public Orilla RPC is SECURITY INVOKER'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_proc
    WHERE oid = to_regprocedure('private.record_orilla_run_authoritative(text,text,boolean,integer,integer,text,boolean)')
      AND prosecdef
  ),
  'private Orilla writer is SECURITY DEFINER'
);
SELECT ok(
  to_regprocedure('public.submit_quiz(text,text,integer[])') IS NULL
  OR NOT has_function_privilege('authenticated', 'public.submit_quiz(text,text,integer[])', 'EXECUTE'),
  'legacy quiz RPC is absent or no longer executable by authenticated users'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'progress'
      AND cmd = 'SELECT'
      AND qual ILIKE '%auth.uid()%'
      AND qual ILIKE '%user_id%'
  ),
  'progress has an owner-scoped SELECT policy'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orilla_runs'
      AND cmd = 'SELECT'
      AND qual ILIKE '%auth.uid()%'
      AND qual ILIKE '%user_id%'
  ),
  'Orilla runs has an owner-scoped SELECT policy'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'invitations'
      AND cmd = 'ALL'
      AND qual ILIKE '%current_user_is_admin%'
  ),
  'invitation management is restricted to administrators by RLS'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND cmd = 'SELECT'
      AND qual ILIKE '%auth.uid()%'
      AND qual ILIKE '%id%'
  ),
  'profiles has a self-scoped SELECT policy'
);

-- ---------------------------------------------------------------------------
-- Temporary Auth fixtures. The active 005 trigger permits signup without an
-- invitation; the test users are never persisted because the transaction rolls
-- back at the end of this file.
-- ---------------------------------------------------------------------------

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-00000000000a',
    'authenticated', 'authenticated', 'pgtap-student-a@example.invalid', 'test-only',
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"pgTAP Student A"}'::jsonb, now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-00000000000b',
    'authenticated', 'authenticated', 'pgtap-student-b@example.invalid', 'test-only',
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"pgTAP Student B"}'::jsonb, now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-00000000000c',
    'authenticated', 'authenticated', 'pgtap-admin@example.invalid', 'test-only',
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"pgTAP Admin"}'::jsonb, now(), now()
  );

UPDATE public.profiles
SET is_admin = TRUE
WHERE id = '00000000-0000-0000-0000-00000000000c';

INSERT INTO public.invitations (code, expires_at, created_by)
VALUES (
  'PGTAP-ADMIN-SEED',
  now() + interval '1 day',
  '00000000-0000-0000-0000-00000000000c'
);

-- ---------------------------------------------------------------------------
-- Student A: incorrect quiz does not complete the lesson; a correct attempt
-- persists a score. RLS keeps the row private, and direct writes are denied.
-- ---------------------------------------------------------------------------

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}',
  TRUE
);

SELECT is(
  public.submit_quiz_v2('module-1', 'b1-l1', ARRAY[0,0])->>'passed',
  'false',
  'an incorrect quiz attempt is not passed'
);
SELECT is(
  (
    SELECT count(*)::integer
    FROM public.progress
    WHERE user_id = '00000000-0000-0000-0000-00000000000a'
      AND module_id = 'module-1'
      AND lesson_id = 'b1-l1'
  ),
  0,
  'an incorrect quiz attempt does not create progress'
);
SELECT is(
  public.submit_quiz_v2('module-1', 'b1-l1', ARRAY[2,3])->>'score',
  '100',
  'correct quiz answers receive 100 percent'
);
SELECT ok(
  EXISTS (
    SELECT 1 FROM public.progress
    WHERE user_id = '00000000-0000-0000-0000-00000000000a'
      AND module_id = 'module-1'
      AND lesson_id = 'b1-l1'
      AND is_completed IS TRUE
      AND best_score = 100
  ),
  'a passed quiz persists completion and the best score'
);

SELECT throws_ok(
  $sql$INSERT INTO public.progress (user_id, module_id, lesson_id, is_completed, best_score)
       VALUES ('00000000-0000-0000-0000-00000000000a', 'module-1', 'b1-l2', TRUE, 100)$sql$,
  '42501',
  'student A cannot insert progress directly'
);
SELECT throws_ok(
  $sql$UPDATE public.progress SET best_score = 0
       WHERE user_id = '00000000-0000-0000-0000-00000000000a'
         AND module_id = 'module-1' AND lesson_id = 'b1-l1'$sql$,
  '42501',
  'student A cannot update progress directly'
);
SELECT throws_ok(
  $sql$SELECT * FROM private.quiz_answer_key LIMIT 1$sql$,
  '42501',
  'student A cannot read private answer keys'
);
SELECT is(
  (SELECT count(*)::integer FROM public.profiles),
  1,
  'student A sees only their own profile'
);
SELECT is(
  (SELECT count(*)::integer FROM public.invitations),
  0,
  'student A cannot read administrator invitations'
);
SELECT throws_ok(
  $sql$INSERT INTO public.invitations (code, expires_at, created_by)
       VALUES ('PGTAP-STUDENT-FORBIDDEN', now() + interval '1 day',
               '00000000-0000-0000-0000-00000000000a')$sql$,
  '42501',
  'student A cannot create administrator invitations'
);
SELECT throws_ok(
  $sql$UPDATE public.profiles SET is_admin = TRUE
       WHERE id = '00000000-0000-0000-0000-00000000000a'$sql$,
  '42501',
  'student A cannot grant themselves administrator privileges'
);

RESET ROLE;

-- ---------------------------------------------------------------------------
-- Student B: cannot read A's progress, cannot skip prerequisites, cannot write
-- quiz attempts directly, and can only advance Orilla via its authenticated RPC.
-- ---------------------------------------------------------------------------

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}',
  TRUE
);

SELECT is(
  (
    SELECT count(*)::integer
    FROM public.progress
    WHERE user_id = '00000000-0000-0000-0000-00000000000a'
      AND module_id = 'module-1'
      AND lesson_id = 'b1-l1'
  ),
  0,
  'student B cannot read student A progress'
);
SELECT throws_ok(
  $sql$SELECT public.submit_quiz_v2('module-2', 'b2-l1', ARRAY[0])$sql$,
  'P0001',
  'student B cannot submit a module 2 quiz before completing its prerequisite'
);
SELECT throws_ok(
  $sql$INSERT INTO private.quiz_attempts (user_id, module_id, lesson_id, score, passed)
       VALUES ('00000000-0000-0000-0000-00000000000b', 'module-1', 'b1-l1', 100, TRUE)$sql$,
  '42501',
  'student B cannot insert private quiz attempts directly'
);
SELECT ok(
  (
    SELECT saved.result->>'attempts' = '1' AND saved.result->>'passed' = 'false'
    FROM (
      SELECT public.record_orilla_run('c01', 'print("practice")', FALSE, 0, NULL, NULL, TRUE) AS result
    ) AS saved
  ),
  'student B can save a c01 practice attempt through the Orilla RPC'
);
SELECT throws_ok(
  $sql$SELECT public.record_orilla_run('c02', 'print("locked")', FALSE, 0, NULL, NULL, TRUE)$sql$,
  '42501',
  'student B cannot unlock c02 without passing c01'
);
SELECT is(
  (
    SELECT count(*)::integer
    FROM public.orilla_runs
    WHERE user_id = '00000000-0000-0000-0000-00000000000b'
      AND chapter_id = 'c01'
      AND attempts = 1
  ),
  1,
  'student B can read their own Orilla run'
);

RESET ROLE;

-- Student A cannot see student B's Orilla row either.
SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}',
  TRUE
);
SELECT is(
  (SELECT count(*)::integer FROM public.orilla_runs),
  0,
  'student A cannot read student B Orilla progress'
);
RESET ROLE;

-- ---------------------------------------------------------------------------
-- Administrator: can read profiles/invitations and create invitations.
-- ---------------------------------------------------------------------------

SET LOCAL ROLE authenticated;
SELECT set_config(
  'request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}',
  TRUE
);
SELECT is(
  (
    SELECT count(*)::integer
    FROM public.profiles
    WHERE id IN (
      '00000000-0000-0000-0000-00000000000a',
      '00000000-0000-0000-0000-00000000000b',
      '00000000-0000-0000-0000-00000000000c'
    )
  ),
  3,
  'administrator can read all three test profiles'
);
SELECT is(
  (SELECT count(*)::integer FROM public.invitations WHERE code = 'PGTAP-ADMIN-SEED'),
  1,
  'administrator can read invitations'
);
SELECT lives_ok(
  $sql$INSERT INTO public.invitations (code, expires_at, created_by)
       VALUES ('PGTAP-ADMIN-CREATED', now() + interval '1 day',
               '00000000-0000-0000-0000-00000000000c')$sql$,
  'administrator can create an invitation'
);
SELECT is(
  (SELECT count(*)::integer FROM public.invitations),
  2,
  'administrator can see both test invitations'
);
RESET ROLE;

SELECT * FROM finish();
ROLLBACK;
