ALTER TABLE public.invitations
    ALTER COLUMN expires_at SET DEFAULT (now() + interval '7 days'),
    ALTER COLUMN expires_at SET NOT NULL;
COMMENT ON COLUMN public.invitations.expires_at IS
  'Mandatory expiration timestamp; new invitations default to seven days after creation.';
