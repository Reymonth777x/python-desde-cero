-- 016_achievements_audit
-- Catalog, student achievements/streaks and audit records.
-- Client roles are read-only: authoritative awarding and audit writes must come
-- from a server-owned function or trusted backend, not client-supplied fields.

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL CHECK (length(code) BETWEEN 1 AND 100),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 160),
  description TEXT NOT NULL CHECK (length(description) <= 2000),
  icon TEXT NOT NULL CHECK (length(icon) <= 80),
  xp_reward INTEGER NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logros legibles por usuarios autenticados"
  ON public.achievements
  FOR SELECT TO authenticated
  USING (true);
REVOKE ALL ON TABLE public.achievements FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.achievements TO authenticated;
GRANT ALL ON TABLE public.achievements TO service_role;

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudiantes leen sus propios logros"
  ON public.user_achievements
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Admins leen todos los logros de usuarios"
  ON public.user_achievements
  FOR SELECT TO authenticated
  USING (private.current_user_is_admin());
REVOKE ALL ON TABLE public.user_achievements FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.user_achievements TO authenticated;
GRANT ALL ON TABLE public.user_achievements TO service_role;
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

CREATE TABLE public.user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_activity_date DATE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  CHECK (longest_streak >= current_streak)
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudiantes leen su propia racha"
  ON public.user_streaks
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Admins leen todas las rachas"
  ON public.user_streaks
  FOR SELECT TO authenticated
  USING (private.current_user_is_admin());
REVOKE ALL ON TABLE public.user_streaks FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.user_streaks TO authenticated;
GRANT ALL ON TABLE public.user_streaks TO service_role;

CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (length(action) BETWEEN 1 AND 120),
  target_table TEXT CHECK (target_table IS NULL OR length(target_table) <= 120),
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT CHECK (user_agent IS NULL OR length(user_agent) <= 2048),
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Solo admins leen auditoría"
  ON public.audit_log
  FOR SELECT TO authenticated
  USING (private.current_user_is_admin());

REVOKE ALL ON TABLE public.audit_log FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.audit_log TO authenticated;
GRANT ALL ON TABLE public.audit_log TO service_role;

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at);

COMMENT ON TABLE public.achievements IS 'Catálogo de logros del sistema.';
COMMENT ON TABLE public.user_achievements IS 'Logros desbloqueados por estudiantes; escritura reservada al backend.';
COMMENT ON TABLE public.user_streaks IS 'Rachas de actividad por estudiante; actualización reservada al backend.';
COMMENT ON TABLE public.audit_log IS 'Auditoría de acciones sensibles; escritura reservada al backend.';
