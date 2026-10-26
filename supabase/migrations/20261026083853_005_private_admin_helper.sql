-- 005_private_admin_helper
-- Mueve la función de verificación de administrador al esquema privado
-- para evitar que sea invocada directamente desde el esquema público.

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND is_admin = TRUE
    );
$$;

REVOKE ALL ON FUNCTION private.current_user_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.current_user_is_admin() TO authenticated;

-- Actualizar políticas de perfiles para usar la función privada
DROP POLICY IF EXISTS "Admins ven todo" ON public.profiles;

CREATE POLICY "Admins ven todo"
ON public.profiles
FOR SELECT
TO authenticated
USING (private.current_user_is_admin());

-- Actualizar políticas de invitaciones para usar la función privada
DROP POLICY IF EXISTS "Admins gestionan invitaciones" ON public.invitations;

CREATE POLICY "Admins gestionan invitaciones"
ON public.invitations
FOR ALL
TO authenticated
USING (private.current_user_is_admin())
WITH CHECK (private.current_user_is_admin());