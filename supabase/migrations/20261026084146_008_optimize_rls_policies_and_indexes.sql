-- 008_optimize_rls_policies_and_indexes
-- Añade índices para mejorar el rendimiento de las consultas filtradas por
-- usuario y módulo, y reafirma las políticas RLS existentes.

CREATE INDEX IF NOT EXISTS idx_progress_user_module_lesson
ON public.progress (user_id, module_id, lesson_id);

CREATE INDEX IF NOT EXISTS idx_progress_user_id
ON public.progress (user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_id
ON public.profiles (id);

CREATE INDEX IF NOT EXISTS idx_invitations_code
ON public.invitations (code);

CREATE INDEX IF NOT EXISTS idx_invitations_is_used
ON public.invitations (is_used);

-- Reafirmar que RLS está habilitado en todas las tablas sensibles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;