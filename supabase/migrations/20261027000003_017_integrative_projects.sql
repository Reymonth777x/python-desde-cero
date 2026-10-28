-- 017_integrative_projects
-- Integrative project submissions. Client writes are disabled until a trusted
-- server-side checker can validate code and award any completion/XP metadata.

CREATE TABLE public.project_submissions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  block_id INTEGER NOT NULL CHECK (block_id > 0),
  project_title TEXT NOT NULL CHECK (length(project_title) BETWEEN 1 AND 200),
  code TEXT NOT NULL CHECK (length(code) <= 50000),
  auto_checks_passed INTEGER NOT NULL DEFAULT 0 CHECK (auto_checks_passed >= 0),
  auto_checks_total INTEGER NOT NULL DEFAULT 0 CHECK (auto_checks_total >= 0),
  self_assessment JSONB NOT NULL DEFAULT '{}'::jsonb,
  teacher_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  teacher_feedback TEXT CHECK (teacher_feedback IS NULL OR length(teacher_feedback) <= 10000),
  confidence_level TEXT NOT NULL DEFAULT 'unverified'
    CHECK (confidence_level IN ('unverified', 'auto_verified', 'teacher_reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  CHECK (auto_checks_passed <= auto_checks_total)
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen sus propios proyectos"
  ON public.project_submissions
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins leen todos los proyectos"
  ON public.project_submissions
  FOR SELECT TO authenticated
  USING (private.current_user_is_admin());

REVOKE ALL ON TABLE public.project_submissions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.project_submissions TO authenticated;
GRANT ALL ON TABLE public.project_submissions TO service_role;

CREATE INDEX IF NOT EXISTS idx_project_submissions_user ON public.project_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_block ON public.project_submissions(block_id);

COMMENT ON TABLE public.project_submissions IS 'Proyectos integradores; escritura y evaluación reservadas al backend.';
COMMENT ON COLUMN public.project_submissions.confidence_level IS 'unverified: no validado; auto_verified: validado por backend; teacher_reviewed: revisado por docente.';
