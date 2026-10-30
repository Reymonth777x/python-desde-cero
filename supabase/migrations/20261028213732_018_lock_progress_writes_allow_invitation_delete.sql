-- Recorded migration 018.

REVOKE INSERT, UPDATE ON public.progress FROM authenticated;
REVOKE INSERT, UPDATE ON public.progress FROM anon;

GRANT DELETE ON public.invitations TO authenticated;

-- Rollback reference:
-- GRANT INSERT, UPDATE ON public.progress TO authenticated;
-- REVOKE DELETE ON public.invitations FROM authenticated;
