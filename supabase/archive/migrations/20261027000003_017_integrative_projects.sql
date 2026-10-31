-- 017_integrative_projects
-- Proyectos integradores por bloque con rúbrica de comprobaciones automáticas.

CREATE TABLE public.project_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    block_id INTEGER NOT NULL,
    project_title TEXT NOT NULL,
    code TEXT NOT NULL,
    auto_checks_passed INTEGER NOT NULL DEFAULT 0,
    auto_checks_total INTEGER NOT NULL DEFAULT 0,
    self_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,
    teacher_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    teacher_feedback TEXT,
    confidence_level TEXT NOT NULL DEFAULT 'unverified', -- unverified, auto_verified, teacher_reviewed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen sus propios proyectos"
  ON public.project_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Estudiantes insertan sus propios proyectos"
  ON public.project_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Estudiantes actualizan sus propios proyectos"
  ON public.project_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins y docentes leen todos los proyectos"
  ON public.project_submissions
  FOR SELECT
  TO authenticated
  USING (private.current_user_is_admin());

CREATE INDEX IF NOT EXISTS idx_project_submissions_user ON public.project_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_block ON public.project_submissions(block_id);

COMMENT ON TABLE public.project_submissions IS 'Proyectos integradores por bloque con auto-verificación';
COMMENT ON COLUMN public.project_submissions.confidence_level IS 'Nivel de confianza: unverified, auto_verified, teacher_reviewed';