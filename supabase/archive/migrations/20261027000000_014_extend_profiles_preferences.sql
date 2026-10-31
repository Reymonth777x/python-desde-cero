-- 014_extend_profiles_preferences
-- Extiende public.profiles con preferencias de usuario (tema, sonido, movimiento reducido)
-- y agrega avatar elegido por el estudiante.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'sistema',
  ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'chef-1',
  ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS reduce_motion BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Índice para búsquedas rápidas por tema (útil para admin)
CREATE INDEX IF NOT EXISTS idx_profiles_theme ON public.profiles(theme);

-- Política: usuario actualiza su propio perfil
CREATE POLICY "Usuario actualiza su propio perfil"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: admins actualizan cualquier perfil
CREATE POLICY "Admins actualizan cualquier perfil"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (private.current_user_is_admin())
  WITH CHECK (private.current_user_is_admin());

-- Comentario
COMMENT ON COLUMN public.profiles.theme IS 'Tema visual preferido del usuario (sistema, original, dark, dracula, cyberpunk, hacker, rosa)';
COMMENT ON COLUMN public.profiles.avatar IS 'Avatar elegido del set propio';
COMMENT ON COLUMN public.profiles.sound_enabled IS 'Si el usuario tiene sonidos de interfaz activados';
COMMENT ON COLUMN public.profiles.reduce_motion IS 'Si el usuario prefiere movimiento reducido';
COMMENT ON COLUMN public.profiles.updated_at IS 'Fecha de última actualización del perfil';