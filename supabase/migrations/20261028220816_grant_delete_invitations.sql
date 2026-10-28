-- 20261028220816_grant_delete_invitations
-- Concede DELETE en public.invitations a authenticated bajo RLS existente.
-- Los estudiantes solo pueden eliminar sus propias invitaciones (verificadas por RLS).
-- Los administradores pueden eliminar cualquier invitación.

-- Aplicar: concede DELETE a authenticated
GRANT DELETE ON TABLE public.invitations TO authenticated;

-- Revertir: revoca DELETE de authenticated
-- REVOKE DELETE ON TABLE public.invitations FROM authenticated;
