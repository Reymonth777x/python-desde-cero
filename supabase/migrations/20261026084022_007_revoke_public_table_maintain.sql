-- 007_revoke_public_table_maintain
-- Revoca privilegios de mantenimiento sobre tablas públicas para evitar
-- modificaciones no autorizadas desde roles no autenticados.

REVOKE ALL ON TABLE public.profiles FROM PUBLIC;
REVOKE ALL ON TABLE public.invitations FROM PUBLIC;
REVOKE ALL ON TABLE public.progress FROM PUBLIC;

-- Los privilegios específicos se otorgan solo a authenticated en 004
-- y se rigen por políticas RLS.