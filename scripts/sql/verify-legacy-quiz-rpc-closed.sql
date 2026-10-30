-- Read-only verification for the legacy quiz RPC retirement.
-- Run with a role allowed to inspect function privileges (e.g. postgres).

DO $verify$
DECLARE
  legacy_grader regprocedure := to_regprocedure('private.submit_quiz_authoritative(text,text,integer[])');
  legacy_rpc regprocedure := to_regprocedure('public.submit_quiz(text,text,integer[])');
  v2_rpc regprocedure := to_regprocedure('public.submit_quiz_v2(text,text,integer[])');
  v2_grader regprocedure := to_regprocedure('private.submit_quiz_authoritative_v2(text,text,integer[])');
BEGIN
  IF legacy_grader IS NOT NULL THEN
    IF has_function_privilege('anon', legacy_grader, 'EXECUTE')
       OR has_function_privilege('authenticated', legacy_grader, 'EXECUTE')
       OR has_function_privilege('service_role', legacy_grader, 'EXECUTE')
       OR has_function_privilege('public', legacy_grader, 'EXECUTE') THEN
      RAISE EXCEPTION 'Legacy private quiz grader still has an execution grant';
    END IF;
  END IF;

  IF legacy_rpc IS NOT NULL AND legacy_grader IS NOT NULL THEN
    IF has_function_privilege('anon', legacy_rpc, 'EXECUTE')
       OR has_function_privilege('authenticated', legacy_rpc, 'EXECUTE')
       OR has_function_privilege('service_role', legacy_rpc, 'EXECUTE')
       OR has_function_privilege('public', legacy_rpc, 'EXECUTE') THEN
      RAISE EXCEPTION 'Legacy public quiz RPC still has an execution grant';
    END IF;
  END IF;

  IF v2_rpc IS NULL OR NOT has_function_privilege('authenticated', v2_rpc, 'EXECUTE') THEN
    RAISE EXCEPTION 'Current v2 quiz RPC is missing or unavailable to authenticated users';
  END IF;

  IF v2_grader IS NULL OR NOT has_function_privilege('authenticated', v2_grader, 'EXECUTE') THEN
    RAISE EXCEPTION 'Current private v2 grader is missing or unavailable to authenticated users';
  END IF;
END;
$verify$;
