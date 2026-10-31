# Migraciones archivadas

Este directorio conserva SQL histórico que **no forma parte de la secuencia activa** de `supabase/migrations/`.

No ejecutar estos archivos con `supabase db push`, `supabase migration up` ni copiarlos de vuelta a la carpeta activa sin una revisión nueva.

## Variantes locales de quizzes

- `20261026093000_011_quiz_attempts_and_progress_restrictions.sql`
- `20261026093001_012_corrective_grants_and_invitation_expiry.sql`
- `20261026100000_013_quiz_keys_and_submit_quiz.sql`

Estas variantes locales no están registradas en PROD ni DEV. Sus objetos característicos (`public.quiz_attempts` y `private.quiz_keys`) no existen en ninguno de los dos proyectos. El historial remoto conserva la implementación canónica con `private.quiz_attempts`, `private.quiz_answer_key` y el RPC privado de evaluación; sus cinco migraciones originales se restauraron en `supabase/migrations/` con los timestamps que Supabase registra.

## Funciones de esquema que no usa el código activo

- `20261027000000_014_extend_profiles_preferences.sql`
- `20261027000001_015_exercise_submissions.sql`
- `20261027000002_016_achievements_audit.sql`
- `20261027000003_017_integrative_projects.sql`

Las tablas y columnas que estas migraciones crearían no existen en PROD ni DEV y una búsqueda del código activo no encontró consumidores. Se conservan aquí para una futura implementación deliberada, pero no se deben crear en las bases conectadas como parte de la publicación actual.

El archivo `20261026083730_005_public_signup_optional_invitation.sql` se mantiene en la secuencia activa porque el alta opcional de invitación forma parte del flujo vigente y su función remota se verificó en ambos proyectos.

## Generador antiguo de claves retirado

El archivo `scripts/gen-quiz-keys.ts` fue eliminado porque generaba un `TRUNCATE ... CASCADE` contra `private.quiz_keys`, objeto de una variante histórica no aplicada en PROD/DEV. El modelo activo es `private.quiz_answer_key` / `private.quiz_attempts`; las claves del curso se deben cambiar mediante migraciones versionadas, comparadas con `correct_option_v2` y revisadas antes de aplicar. No restaurar el generador ni ejecutar las migraciones archivadas.
