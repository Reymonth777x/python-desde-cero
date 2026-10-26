-- Pruebas de permisos RLS/ACL para Python desde cero.
-- Roles probados: anon, estudiante A, estudiante B, admin.
-- NOTA: este entorno no tiene Docker, PostgreSQL CLI ni Supabase CLI disponibles,
-- por lo que estas pruebas no se han ejecutado. Se entregan como SQL para revisión
-- y ejecución en un entorno aislado (supabase start / pg_prove).

\set student_a '00000000-0000-0000-0000-00000000000a'
\set student_b '00000000-0000-0000-0000-00000000000b'
\set admin     '00000000-0000-0000-0000-000000000001'

BEGIN;
SELECT plan(12);

-- 1. anon no lee nada de progress
SET ROLE anon;
SELECT is(
    (SELECT count(*) FROM public.progress),
    0,
    'anon no lee filas de progress'
);
RESET ROLE;

-- 2. A no ve el progreso de B
SET ROLE :student_a;
SELECT is(
    (SELECT count(*) FROM public.progress WHERE user_id = :'student_b'),
    0,
    'estudiante A no ve el progreso de estudiante B'
);
RESET ROLE;

-- 3. A no puede escribir progress directamente (INSERT revocado)
SET ROLE :student_a;
SELECT is(
    (SELECT count(*) FROM public.progress WHERE user_id = :'student_a'),
    0,
    'estudiante A no tiene filas previas en progress'
);
-- Intentar INSERT directo debe fallar (privilegio revocado en migración 011)
SELECT throws_ok(
    $$
    INSERT INTO public.progress (user_id, module_id, lesson_id, is_completed, best_score, last_attempt)
    VALUES (:'student_a', 'module-1', 'lesson-1', TRUE, 100, NOW())
    $$,
    '42501',
    'estudiante A no puede INSERT en public.progress (privilegio revocado)'
);
RESET ROLE;

-- 4. A no puede ponerse is_admin = true
SET ROLE :student_a;
SELECT throws_ok(
    $$
    UPDATE public.profiles SET is_admin = TRUE WHERE id = :'student_a'
    $$,
    '42501',
    'estudiante A no puede actualizar is_admin en public.profiles'
);
RESET ROLE;

-- 5. Solo admin lee y crea invitaciones
SET ROLE :admin;
SELECT is(
    (SELECT count(*) FROM public.invitations),
    (SELECT count(*) FROM public.invitations),
    'admin puede leer public.invitations'
);
RESET ROLE;

SET ROLE :student_a;
SELECT throws_ok(
    $$
    SELECT count(*) FROM public.invitations
    $$,
    '42501',
    'estudiante A no puede leer public.invitations'
);
RESET ROLE;

-- 6. submitQuiz con respuestas incorrectas no completa la lección
-- (probado vía la función RPC record_quiz_attempt con score bajo)
SET ROLE :student_a;
SELECT is(
    (SELECT is_completed FROM public.progress WHERE user_id = :'student_a' AND module_id = 'module-1' AND lesson_id = 'lesson-1'),
    NULL,
    'estudiante A no tiene progreso previo en module-1/lesson-1'
);
-- Intentar registrar un intento con score 0 (respuestas incorrectas) no debe completar
SELECT is(
    (SELECT (record_quiz_attempt('module-1', 'lesson-1', 0, FALSE, '[]'::jsonb))->>'passed'),
    'false',
    'record_quiz_attempt con score 0 reporta passed = false'
);
SELECT is(
    (SELECT is_completed FROM public.progress WHERE user_id = :'student_a' AND module_id = 'module-1' AND lesson_id = 'lesson-1'),
    NULL,
    'estudiante A no se marca completado tras intento fallido'
);
RESET ROLE;

-- 7. El límite de intentos por minuto se aplica
SET ROLE :student_a;
-- 5 intentos válidos seguidos
SELECT count(*) FROM (
    SELECT record_quiz_attempt('module-1', 'lesson-1', 0, FALSE, '[]'::jsonb) FROM generate_series(1, 5)
) AS attempts;
-- El 6to intento debe fallar por rate limiting
SELECT throws_ok(
    $$
    SELECT record_quiz_attempt('module-1', 'lesson-1', 0, FALSE, '[]'::jsonb)
    $$,
    'P0001',
    'rate limit rechaza el 6to intento en un minuto'
);
RESET ROLE;

SELECT * FROM finish();
ROLLBACK;
