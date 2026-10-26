-- Limita el acceso de PostgREST a las operaciones usadas por la aplicación.
-- Esta migración solo define privilegios de tabla; las políticas RLS siguen
-- siendo obligatorias para limitar filas y operaciones por usuario.
REVOKE ALL ON TABLE
    public.profiles,
    public.invitations,
    public.progress
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT SELECT, INSERT ON TABLE public.invitations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.progress TO authenticated;
