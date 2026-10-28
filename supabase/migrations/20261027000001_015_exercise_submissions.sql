-- 015_exercise_submissions
-- Student submissions are not directly writable: the client cannot attest its
-- own pass status, XP, test counts, or confidence level. A validated server-side
-- submission RPC can be added with the exercise-verification feature.

CREATE TABLE public.exercise_submissions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  exercise_id TEXT NOT NULL CHECK (length(exercise_id) BETWEEN 1 AND 120),
  module_id TEXT NOT NULL CHECK (module_id ~ '^module-[0-9]+$'),
  lesson_id TEXT NOT NULL CHECK (lesson_id ~ '^(b[0-9]+-l[0-9]+|lesson-[0-9]+)$'),
  code TEXT NOT NULL CHECK (length(code) <= 50000),
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  xp_awarded INTEGER NOT NULL DEFAULT 0 CHECK (xp_awarded >= 0),
  confidence_level TEXT NOT NULL DEFAULT 'unverified'
    CHECK (confidence_level IN ('unverified', 'server_verified', 'manual_review')),
  test_cases_passed INTEGER NOT NULL DEFAULT 0 CHECK (test_cases_passed >= 0),
  test_cases_total INTEGER NOT NULL DEFAULT 0 CHECK (test_cases_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT pg_catalog.now(),
  CHECK (test_cases_passed <= test_cases_total)
);

ALTER TABLE public.exercise_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen sus propios envíos"
  ON public.exercise_submissions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins leen todos los envíos"
  ON public.exercise_submissions
  FOR SELECT
  TO authenticated
  USING (private.current_user_is_admin());

REVOKE ALL ON TABLE public.exercise_submissions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.exercise_submissions TO authenticated;
GRANT ALL ON TABLE public.exercise_submissions TO service_role;

CREATE INDEX IF NOT EXISTS idx_exercise_submissions_user ON public.exercise_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_exercise ON public.exercise_submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_created ON public.exercise_submissions(created_at);

COMMENT ON TABLE public.exercise_submissions IS 'Ejercicios enviados; el servidor debe verificar el resultado antes de otorgar XP.';
COMMENT ON COLUMN public.exercise_submissions.confidence_level IS 'unverified: cliente no confiable; server_verified: backend verificado; manual_review: revisión docente.';
