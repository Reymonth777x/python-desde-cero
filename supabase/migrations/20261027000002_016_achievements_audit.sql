-- 016_achievements_audit
-- Tabla de logros del estudiante, rachas y registro de auditoría de acciones sensibles.

-- Logros disponibles en el sistema
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logros legibles por todos autenticados"
  ON public.achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- Logros desbloqueados por cada estudiante
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen sus propios logros"
  ON public.user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema inserta logros desbloqueados"
  ON public.user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- Rachas de actividad diaria
CREATE TABLE public.user_streaks (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen su propia racha"
  ON public.user_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema gestiona rachas"
  ON public.user_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Registro de auditoría de acciones sensibles
CREATE TABLE public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins leen auditoría"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

CREATE POLICY "Sistema inserta auditoría"
  ON public.audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.audit_log(created_at);

COMMENT ON TABLE public.achievements IS 'Catálogo de logros del sistema';
COMMENT ON TABLE public.user_achievements IS 'Logros desbloqueados por cada estudiante';
COMMENT ON TABLE public.user_streaks IS 'Rachas de actividad diaria por estudiante';
COMMENT ON TABLE public.audit_log IS 'Registro de auditoría de acciones sensibles';