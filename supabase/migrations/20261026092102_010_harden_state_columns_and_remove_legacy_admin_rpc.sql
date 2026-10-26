-- 010_harden_state_columns_and_remove_legacy_admin_rpc
-- Aplica restricciones NOT NULL en columnas de estado y elimina la función pública
-- current_user_is_admin() ya reemplazada por private.current_user_is_admin().

ALTER TABLE public.profiles
  ALTER COLUMN is_admin SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.invitations
  ALTER COLUMN is_used SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE public.progress
  ALTER COLUMN is_completed SET NOT NULL,
  ALTER COLUMN best_score SET NOT NULL,
  ALTER COLUMN last_attempt SET NOT NULL;

DROP FUNCTION IF EXISTS public.current_user_is_admin();