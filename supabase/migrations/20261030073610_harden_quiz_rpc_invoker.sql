-- 026: Expose only an invoker wrapper for quiz submission.
-- The private implementation remains SECURITY DEFINER with an empty search_path.
-- Authenticated users can execute the private implementation, but cannot read
-- answer keys or write attempts/progress directly.

ALTER FUNCTION public.submit_quiz_v2(text, text, integer[]) SECURITY INVOKER;

GRANT USAGE ON SCHEMA private TO authenticated;

REVOKE EXECUTE ON FUNCTION private.submit_quiz_authoritative_v2(text, text, integer[])
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.submit_quiz_authoritative_v2(text, text, integer[])
  TO authenticated;

REVOKE EXECUTE ON FUNCTION public.submit_quiz_v2(text, text, integer[])
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_v2(text, text, integer[])
  TO authenticated;
