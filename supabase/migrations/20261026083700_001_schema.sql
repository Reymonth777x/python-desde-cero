CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND is_admin = TRUE
    );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated;

CREATE POLICY "Usuarios ven su propio perfil"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins ven todo"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.current_user_is_admin());

CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES auth.users(id) NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gestionan invitaciones"
ON public.invitations
FOR ALL
TO authenticated
USING (public.current_user_is_admin())
WITH CHECK (public.current_user_is_admin());

CREATE TABLE public.progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    best_score NUMERIC DEFAULT 0,
    last_attempt TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id, lesson_id)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estudiantes leen su progreso"
ON public.progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Estudiantes insertan su progreso"
ON public.progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Estudiantes actualizan su progreso"
ON public.progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
