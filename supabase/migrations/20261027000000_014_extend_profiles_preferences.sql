-- 014_extend_profiles_preferences
-- Adds preferences and an avatar to profiles. The client cannot change role,
-- is_admin, email, or any other protected profile field directly.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'sistema',
  ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'chef-1',
  ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS reduce_motion BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT pg_catalog.now();

CREATE INDEX IF NOT EXISTS idx_profiles_theme ON public.profiles(theme);

-- The helper lives in the non-exposed private schema.
GRANT USAGE ON SCHEMA private TO authenticated;

-- Preferences currently live in client state/localStorage. Keep all profile
-- writes server-owned until a validated Server Action is implemented.
DROP POLICY IF EXISTS "Usuario actualiza su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins actualizan cualquier perfil" ON public.profiles;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;

COMMENT ON COLUMN public.profiles.theme IS 'Tema visual preferido del usuario (sistema, original, dark, dracula, cyberpunk, hacker, rosa)';
COMMENT ON COLUMN public.profiles.avatar IS 'Avatar elegido del set propio';
COMMENT ON COLUMN public.profiles.sound_enabled IS 'Si el usuario tiene sonidos de interfaz activados';
COMMENT ON COLUMN public.profiles.reduce_motion IS 'Si el usuario prefiere movimiento reducido';
COMMENT ON COLUMN public.profiles.updated_at IS 'Fecha de última actualización del perfil';
