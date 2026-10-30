-- Preserve invitation history once a single-use code has been redeemed.
-- Administrators can still delete expired or active invitations that remain unused.

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

REVOKE ALL ON FUNCTION private.prevent_used_invitation_deletion() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS invitations_prevent_used_deletion ON public.invitations;

CREATE TRIGGER invitations_prevent_used_deletion
BEFORE DELETE ON public.invitations
FOR EACH ROW
EXECUTE FUNCTION private.prevent_used_invitation_deletion();
