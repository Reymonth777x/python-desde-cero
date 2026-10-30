-- Retire the legacy grader that used pre-v2 answer positions and returned
-- per-question correctness. The application now uses submit_quiz_v2 only.
--
-- Keep the old function definitions for historical compatibility, but remove
-- every client-facing execution grant. This migration is safe to re-run and
-- intentionally does not delete attempts, progress, answer keys, or functions.

DO $migration$
DECLARE
  legacy_grader regprocedure := to_regprocedure('private.submit_quiz_authoritative(text,text,integer[])');
  legacy_rpc regprocedure := to_regprocedure('public.submit_quiz(text,text,integer[])');
BEGIN
  IF legacy_grader IS NOT NULL THEN
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated, service_role',
      legacy_grader
    );
  END IF;

  IF legacy_grader IS NOT NULL AND legacy_rpc IS NOT NULL THEN
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated, service_role',
      legacy_rpc
    );
  END IF;
END;
$migration$;
