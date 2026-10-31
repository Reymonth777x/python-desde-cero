-- 012_corrective_grants_and_invitation_expiry
-- Migración correctiva (no renombra ni edita migraciones previas).
--
-- 1. H2: concede USAGE en el schema private a authenticated para que las
--    políticas que llaman a private.current_user_is_admin() puedan ejecutarse.
--    Sin este GRANT, authenticated no puede invocar la función aunque tenga EXECUTE.
--
-- 2. SEC-04: invitations.expires_at deja de aceptar nulos.
--    Primero se backfillan las filas existentes con expires_at NULL
--    (creadas bajo la política anterior de "sin vencimiento") y luego se añade
--    la restricción NOT NULL. Se usa created_at + 7 días como valor de transición,
--    coherente con el vencimiento de 7 días que usa la acción de administración.

-- --- H2: GRANT USAGE en schema private ---
GRANT USAGE ON SCHEMA private TO authenticated;

-- --- SEC-04: backfill de expires_at NULL antes de añadir NOT NULL ---
UPDATE public.invitations
SET expires_at = created_at + INTERVAL '7 days'
WHERE expires_at IS NULL;

ALTER TABLE public.invitations
ALTER COLUMN expires_at SET NOT NULL;
