-- Pruebas de permisos RLS/ACL para Python desde cero.
-- Formato pgTAP para Supabase: ejecutar con \supabase test db\ (requiere Docker + Supabase CLI).
-- ENTORNO ACTUAL: sin Docker ni Supabase CLI disponibles → PENDIENTE DE EJECUCIÓN.
-- Roles probados: anon, estudiante A, estudiante B, admin.
--
-- Uso: supabase start && supabase test db

\set student_a '00000000-0000-0000-0000-00000000000a'
\set student_b '00000000-0000-0000-0000-00000000000b'
\set admin     '00000000-0000-0000-0000-000000000001'

BEGIN;
SELECT plan(16);

-- 1. anon no lee nada de progress
SET LOCAL ROLE anon;
SELECT is(
    (SELECT count(*) FROM public.progress),
    0,
    'anon no lee filas de public.progress'
);
RESET ROLE;

-- 2. A no ve el progreso de B (RLS)
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":student_a","role":"authenticated"}', true);
SELECT is(
    (SELECT count(*) FROM public.progress WHERE user_id = :'student_b'),
    0,
    'estudiante A no ve el progreso de estudiante B'
);
RESET ROLE;

-- 3. A no puede escribir progress directamente (INSERT revocado en migración 011)
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":student_a","role":"authenticated"}', true);
SELECT throws_ok(
    3
    INSERT INTO public.progress (user_id, module_id, lesson_id, is_completed, best_score, last_attempt)
    VALUES (:'student_a', 'module-1', 'lesson-1', TRUE, 100, NOW())
    3,
    '42501',
    'estudiante A no puede INSERT en public.progress (privilegio revocado)'
);
RESET ROLE;

-- 4. A no puede escribir quiz_attempts directamente (INSERT revocado)
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":student_a","role":"authenticated"}', true);
SELECT throws_ok(
    3
    INSERT INTO public.quiz_attempts (user_id, module_id, lesson_id, score, answers)
    VALUES (:'student_a', 'module-1', 'lesson-1', 0, '[]'::jsonb)
    3,
    '42501',
    'estudiante A no puede INSERT en public.quiz_attempts (privilegio revocado)'
);
RESET ROLE;

-- 5. A no puede ponerse is_admin = true en public.profiles
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":student_a","role":"authenticated"}', true);
SELECT throws_ok(
    3
    UPDATE public.profiles SET is_admin = TRUE WHERE id = :'student_a'
    3,
    '42501',
    'estudiante A no puede actualizar is_admin en public.profiles'
);
RESET ROLE;

-- 6. Solo admin lee public.invitations
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":admin","role":"authenticated"}', true);
SELECT is(
    (SELECT count(*) FROM public.invitations) IS NOT NULL,
    true,
    'admin puede leer public.invitations'
);
RESET ROLE;

-- 7. Estudiante no puede leer public.invitations
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":student_a","role":"authenticated"}', true);
SELECT throws_ok(
    Parte 2 escrita
    SELECT count(*) FROM public.invitations
    Parte 2 escrita,
    '42501',
    'estudiante A no puede leer public.invitations'
);
RESET ROLE;

-- 8. submit_quiz con respuestas incorrectas no completa la lección
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":student_a","role":"authenticated"}', true);
SELECT is(
    (SELECT (submit_quiz('module-1', 'lesson-1', ARRAY[99, 99, 99]))->>'passed'),
    'false',
    'submit_quiz con respuestas incorrectas reporta passed = false'
);
SELECT is(
    (SELECT is_completed FROM public.progress WHERE user_id = :'student_a' AND module_id = 'module-1' AND lesson_id = 'lesson-1'),
    NULL,
    'estudiante A no se marca completado tras submit_quiz fallido'
);
RESET ROLE;

-- 9. submit_quiz con ids inventados falla
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":" || :'student_a' || '","role":"authenticated"}', true);
SELECT throws_ok(
    Parte 3 escrita
    SELECT submit_quiz('modulo-inexistente', 'leccion-inexistente', ARRAY[0])
    Parte 3 escrita,
    'P0001',
    'submit_quiz con ids inventados lanza excepción'
);
RESET ROLE;

-- 10. submit_quiz con número incorrecto de respuestas falla
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":" || :'student_a' || '","role":"authenticated"}', true);
SELECT throws_ok(
    Parte 3 escrita
    SELECT submit_quiz('module-1', 'lesson-1', ARRAY[0])
    Parte 3 escrita,
    'P0001',
    'submit_quiz con cantidad incorrecta de respuestas lanza excepción'
);
RESET ROLE;

-- 11. submit_quiz con respuesta fuera de rango falla
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":" || :'student_a' || '","role":"authenticated"}', true);
SELECT throws_ok(
    Parte 3 escrita
    SELECT submit_quiz('module-1', 'lesson-1', ARRAY[-1])
    Parte 3 escrita,
    'P0001',
    'submit_quiz con respuesta fuera de rango lanza excepción'
);
RESET ROLE;

-- 12. Límite de intentos por lección (5 por minuto)
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":" || :'student_a' || '","role":"authenticated"}', true);
SELECT count(*) FROM (
    SELECT submit_quiz('module-1', 'lesson-2', ARRAY[0]) FROM generate_series(1, 5)
) AS attempts;
SELECT throws_ok(
    Parte 4 escrita
    SELECT submit_quiz('module-1', 'lesson-2', ARRAY[0])
    Parte 4 escrita,
    'P0001',
    'rate limit por lección rechaza el 6to intento en un minuto'
);
RESET ROLE;

-- 13. submit_quiz sin autenticación falla
SET LOCAL ROLE anon;
SELECT throws_ok(
    Parte 4 escrita
    SELECT submit_quiz('module-1', 'lesson-1', ARRAY[0])
    Parte 4 escrita,
    'P0001',
    'submit_quiz sin auth.uid() lanza excepción'
);
RESET ROLE;

-- 14. Upsert de progress nunca baja best_score ni desmarca is_completed
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":" || :'student_a' || '","role":"authenticated"}', true);
SELECT (submit_quiz('module-1', 'lesson-2', ARRAY[0]))->>'passed' AS primero_pasa;
SELECT (submit_quiz('module-1', 'lesson-2', ARRAY[1]))->>'passed' AS segundo_no_pasa;
SELECT is(
    (SELECT best_score FROM public.progress WHERE user_id = :'student_a' AND module_id = 'module-1' AND lesson_id = 'lesson-2'),
    '100',
    'best_score no baja tras intento con score 0'
);
SELECT is(
    (SELECT is_completed FROM public.progress WHERE user_id = :'student_a' AND module_id = 'module-1' AND lesson_id = 'lesson-2'),
    'true',
    'is_completed permanece true tras intento fallido'
);
RESET ROLE;

-- 15. anon no puede ejecutar submit_quiz (sin EXECUTE para anon)
SET LOCAL ROLE anon;
SELECT throws_ok(
    Parte 4 escrita
    SELECT submit_quiz('module-1', 'lesson-1', ARRAY[0])
    Parte 4 escrita,
    '42501',
    'anon no puede ejecutar submit_quiz (EXECUTE revocado)'
);
RESET ROLE;

-- 16. authenticated no puede leer private.quiz_keys directamente
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":":" || :'student_a' || '","role":"authenticated"}', true);
SELECT throws_ok(
    Parte 4 escrita
    SELECT count(*) FROM private.quiz_keys
    Parte 4 escrita,
    '42501',
    'authenticated no puede leer private.quiz_keys directamente'
);
RESET ROLE;

SELECT * FROM finish();
ROLLBACK;
