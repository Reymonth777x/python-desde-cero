-- 006_restrict_default_api_privileges
-- Restringe los privilegios por defecto de la API de PostgREST para el rol anon.
-- Las tablas sensibles no deben ser accesibles directamente sin autenticación.

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.invitations FROM anon;
REVOKE ALL ON TABLE public.progress FROM anon;

REVOKE ALL ON SCHEMA public FROM anon;

-- Asegurar que el rol authenticated solo tenga los privilegios explícitos
-- definidos en la migración 004; no se otorgan privilegios adicionales implícitos.