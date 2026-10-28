-- 015_exercise_submissions
-- Tabla para registrar envíos de ejercicios de código con verificación de servidor.
-- Cada envío guarda el código, resultado (pasó/no pasó), XP ganado y nivel de confianza.

CREATE TABLE public.exercise_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    exercise_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    code TEXT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    xp_awarded INTEGER NOT NULL DEFAULT 0,
    confidence_level TEXT NOT NULL DEFAULT 'unverified', -- unverified, server_verified, manual_review
    test_cases_passed INTEGER NOT NULL DEFAULT 0,
    test_cases_total INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exercise_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen sus propios envíos"
  ON public.exercise_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Estudiantes insertan sus propios envíos"
  ON public.exercise_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Solo admins pueden leer todos los envíos
CREATE POLICY "Admins leen todos los envíos"
  ON public.exercise_submissions
  FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

CREATE INDEX IF NOT EXISTS idx_exercise_submissions_user ON public.exercise_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_exercise ON public.exercise_submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_created ON public.exercise_submissions(created_at);

COMMENT ON TABLE public.exercise_submissions IS 'Registro de envíos de ejercicios de código con resultado verificado';
COMMENT ON COLUMN public.exercise_submissions.confidence_level IS 'Nivel de confianza: unverified (cliente), server_verified (servidor), manual_review (docente)';