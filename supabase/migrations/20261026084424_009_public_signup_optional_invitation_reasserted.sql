-- 009_public_signup_optional_invitation_reasserted
-- Reafirma el comportamiento de registro público con invitación opcional,
-- garantizando que handle_new_user() permita registros sin código de invitación
-- y valide estrictamente los códigos cuando se proporcionan.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_code TEXT;
    v_invitation_id UUID;
BEGIN
    v_code := NULLIF(
        upper(
            btrim(
                COALESCE(
                    NEW.raw_user_meta_data ->> 'invitation_code',
                    ''
                )
            )
        ),
        ''
    );

    IF v_code IS NOT NULL THEN
        UPDATE public.invitations
        SET
            is_used = TRUE,
            used_by = NEW.id
        WHERE code = v_code
          AND is_used = FALSE
          AND (
              expires_at IS NULL
              OR expires_at > NOW()
          )
        RETURNING id INTO v_invitation_id;

        IF v_invitation_id IS NULL THEN
            RAISE EXCEPTION
                'Invitation is invalid, expired, or already used';
        END IF;
    END IF;

    INSERT INTO public.profiles (
        id,
        email,
        full_name
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'full_name'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

    RETURN NEW;
END;
$$;