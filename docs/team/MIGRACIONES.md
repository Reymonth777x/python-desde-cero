# Matriz de Migraciones — Local vs Remoto

## Migraciones locales (en repo)
001_schema.sql
002_auth_profile_trigger.sql
003_require_invitation.sql
004_explicit_client_table_grants.sql
005_public_signup_optional_invitation.sql
005_private_admin_helper.sql
009_public_signup_optional_invitation_reasserted.sql
010_harden_state_columns_and_remove_legacy_admin_rpc.sql
011_*.sql
012_corrective_grants_and_invitation_expiry.sql
013_quiz_keys_and_submit_quiz.sql
014_extend_profiles_preferences.sql
015_exercise_submissions.sql
016_achievements_audit.sql
017_integrative_projects.sql

## Migraciones remotas (historial conocido)
Hasta 015_private_quiz_rpc_wrapper

## Discrepancias
- El remoto llega hasta 015_private_quiz_rpc_wrapper
- El local tiene migraciones 014-017 que el remoto no registra
- **NO sincronizar a ciegas** — documentar y decidir con el líder

## Migración pendiente (PASO 4)
- Conceder DELETE a authenticated sobre public.invitations (bajo RLS admin existente)
- Crear en rama como migración reversible con rollback
- Probar solo en local