-- 029: Orilla, práctica de Python conduciendo una lancha por un río.
-- La RPC guarda intentos y progreso de práctica de Orilla por cuenta.
-- IMPORTANTE: passed/stars/steps llegan desde el motor Pyodide del navegador.
-- Esta tabla es progreso de práctica y NO es una evaluación oficial del curso.
-- Las evaluaciones PE1 continúan usando su propio calificador privado.

CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE TABLE IF NOT EXISTS public.orilla_runs (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  chapter_id text NOT NULL,
  code text NOT NULL DEFAULT '',
  passed boolean NOT NULL DEFAULT false,
  stars smallint NOT NULL DEFAULT 0,
  best_steps integer,
  attempts integer NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chapter_id),
  CONSTRAINT orilla_runs_chapter_id_check
    CHECK (chapter_id ~ '^(c0[1-9]|c1[0-2]|abierta|reto-brazo|reto-luces)$'),
  CONSTRAINT orilla_runs_stars_check CHECK (stars BETWEEN 0 AND 3),
  CONSTRAINT orilla_runs_best_steps_check CHECK (best_steps IS NULL OR best_steps BETWEEN 0 AND 100000),
  CONSTRAINT orilla_runs_attempts_check CHECK (attempts >= 0),
  CONSTRAINT orilla_runs_code_length_check CHECK (char_length(code) <= 20000),
  CONSTRAINT orilla_runs_notes_length_check CHECK (char_length(notes) <= 20000)
);

ALTER TABLE public.orilla_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orilla_runs_select_own ON public.orilla_runs;
CREATE POLICY orilla_runs_select_own ON public.orilla_runs
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Sin INSERT, UPDATE ni DELETE directos desde la Data API.
REVOKE ALL ON TABLE public.orilla_runs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.orilla_runs TO authenticated;

-- Defensa en profundidad: filas y marcas solo avanzan y no cambian de dueño.
CREATE OR REPLACE FUNCTION private.orilla_runs_guard()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.user_id IS DISTINCT FROM OLD.user_id
       OR NEW.chapter_id IS DISTINCT FROM OLD.chapter_id THEN
      RAISE EXCEPTION 'orilla:fila_inmutable' USING ERRCODE = '42501';
    END IF;
    NEW.passed := OLD.passed OR NEW.passed;
    NEW.stars := GREATEST(OLD.stars, NEW.stars);
    NEW.attempts := GREATEST(OLD.attempts, NEW.attempts);
    NEW.best_steps := CASE
      WHEN OLD.best_steps IS NULL THEN NEW.best_steps
      WHEN NEW.best_steps IS NULL THEN OLD.best_steps
      ELSE LEAST(OLD.best_steps, NEW.best_steps)
    END;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orilla_runs_guard ON public.orilla_runs;
CREATE TRIGGER orilla_runs_guard
  BEFORE INSERT OR UPDATE ON public.orilla_runs
  FOR EACH ROW EXECUTE FUNCTION private.orilla_runs_guard();

CREATE OR REPLACE FUNCTION private.record_orilla_run_authoritative(
  p_chapter_id text,
  p_code text,
  p_passed boolean,
  p_stars integer,
  p_steps integer,
  p_notes text,
  p_es_intento boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_num integer;
  v_passed boolean := COALESCE(p_passed, false);
  v_stars integer;
  v_best integer;
  v_notes text;
  v_out jsonb;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'orilla:no_autenticado' USING ERRCODE = '28000';
  END IF;
  IF p_chapter_id IS NULL
     OR p_chapter_id !~ '^(c0[1-9]|c1[0-2]|abierta|reto-brazo|reto-luces)$' THEN
    RAISE EXCEPTION 'orilla:tramo_invalido' USING ERRCODE = '22023';
  END IF;
  IF p_code IS NULL OR char_length(p_code) > 20000 THEN
    RAISE EXCEPTION 'orilla:codigo_invalido' USING ERRCODE = '22023';
  END IF;
  IF p_notes IS NOT NULL AND char_length(p_notes) > 20000 THEN
    RAISE EXCEPTION 'orilla:notas_largas' USING ERRCODE = '22023';
  END IF;
  IF p_stars IS NULL OR p_stars < 0 OR p_stars > 3
     OR (p_steps IS NOT NULL AND (p_steps < 0 OR p_steps > 100000)) THEN
    RAISE EXCEPTION 'orilla:valores_invalidos' USING ERRCODE = '22023';
  END IF;

  -- La campaña se desbloquea tramo a tramo; los retos y el río libre piden c12.
  IF p_chapter_id ~ '^c(0[2-9]|1[0-2])$' THEN
    v_num := substring(p_chapter_id FROM 2)::integer;
    IF NOT EXISTS (
      SELECT 1 FROM public.orilla_runs
      WHERE user_id = v_user
        AND chapter_id = 'c' || lpad((v_num - 1)::text, 2, '0')
        AND passed
    ) THEN
      RAISE EXCEPTION 'orilla:bloqueado' USING ERRCODE = '42501';
    END IF;
  ELSIF p_chapter_id <> 'c01' THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.orilla_runs
      WHERE user_id = v_user AND chapter_id = 'c12' AND passed
    ) THEN
      RAISE EXCEPTION 'orilla:bloqueado' USING ERRCODE = '42501';
    END IF;
  END IF;

  v_stars := CASE WHEN v_passed AND p_chapter_id <> 'abierta' THEN p_stars ELSE 0 END;
  v_best := CASE WHEN v_passed THEN p_steps ELSE NULL END;
  v_notes := CASE WHEN p_chapter_id = 'abierta' THEN p_notes ELSE NULL END;

  INSERT INTO public.orilla_runs AS r
    (user_id, chapter_id, code, passed, stars, best_steps, attempts, notes)
  VALUES
    (v_user, p_chapter_id, p_code, v_passed, v_stars, v_best,
     CASE WHEN p_es_intento THEN 1 ELSE 0 END, COALESCE(v_notes, ''))
  ON CONFLICT (user_id, chapter_id) DO UPDATE SET
    code = EXCLUDED.code,
    passed = r.passed OR EXCLUDED.passed,
    stars = GREATEST(r.stars, EXCLUDED.stars),
    best_steps = CASE
      WHEN EXCLUDED.best_steps IS NULL THEN r.best_steps
      WHEN r.best_steps IS NULL THEN EXCLUDED.best_steps
      ELSE LEAST(r.best_steps, EXCLUDED.best_steps)
    END,
    attempts = r.attempts + CASE WHEN p_es_intento THEN 1 ELSE 0 END,
    notes = CASE WHEN v_notes IS NULL THEN r.notes ELSE v_notes END
  RETURNING jsonb_build_object(
    'passed', r.passed,
    'stars', r.stars,
    'best_steps', r.best_steps,
    'attempts', r.attempts
  ) INTO v_out;

  RETURN v_out;
END;
$$;

CREATE OR REPLACE FUNCTION private.clear_orilla_notes_authoritative()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'orilla:no_autenticado' USING ERRCODE = '28000';
  END IF;
  UPDATE public.orilla_runs
  SET notes = ''
  WHERE user_id = v_user AND chapter_id = 'abierta';
END;
$$;

CREATE OR REPLACE FUNCTION public.record_orilla_run(
  p_chapter_id text,
  p_code text,
  p_passed boolean,
  p_stars integer,
  p_steps integer,
  p_notes text DEFAULT NULL,
  p_es_intento boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.record_orilla_run_authoritative(
    p_chapter_id, p_code, p_passed, p_stars, p_steps, p_notes, p_es_intento
  );
$$;

CREATE OR REPLACE FUNCTION public.clear_orilla_notes()
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.clear_orilla_notes_authoritative();
$$;

REVOKE EXECUTE ON FUNCTION private.record_orilla_run_authoritative(text, text, boolean, integer, integer, text, boolean)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.record_orilla_run_authoritative(text, text, boolean, integer, integer, text, boolean)
  TO authenticated;
REVOKE EXECUTE ON FUNCTION private.clear_orilla_notes_authoritative() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.clear_orilla_notes_authoritative() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.record_orilla_run(text, text, boolean, integer, integer, text, boolean)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_orilla_run(text, text, boolean, integer, integer, text, boolean)
  TO authenticated;
REVOKE EXECUTE ON FUNCTION public.clear_orilla_notes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.clear_orilla_notes() TO authenticated;
