# Estado de migraciones — repo y Supabase remoto

## Carpeta canónica

Los archivos que describen cambios de base de datos se guardan en `supabase/migrations/`. Las migraciones históricas deben conservarse; no se borran porque parezcan duplicadas sin verificar el historial remoto.

## Estado remoto comprobado

El historial de Supabase para el proyecto `nuqydanbbgqcofcftshk` incluye, entre otras, las entradas timestamp:
- `20261026221230` — `011_secure_quiz_submission`
- `20261026221332` — `012_deny_direct_quiz_table_access`
- `20261026222246` — `013_randomize_quiz_option_order`
- `20261026230434` — `014_require_invitation_expiry`
- `20261026230815` — `015_private_quiz_rpc_wrapper`
- `20261028213732` — `018_lock_progress_writes_allow_invitation_delete`
- `20261029042216` — `019_quiz_key_current_catalog_ids`
- `20261029051953` — `020_balance_quiz_answer_positions_v2`
- `20261030050000` — `scope_quiz_attempt_cleanup_to_current_user` (021)
- `20261030050915` — `protect_redeemed_invitation_history` (022)
- `20261030051205` — `add_three_core_integration_labs` (023)

La salida consultada del historial remoto empieza por la entrada timestamp 004; no asumir que las primeras migraciones locales 001-003 están registradas con el mismo historial de CLI. El esquema remoto existe. Antes de cualquier `db push`, comparar tablas, funciones, políticas y migraciones línea por línea.

## Migración 020 (aplicada y verificada)

Archivo canónico:
`supabase/migrations/20261029051953_020_balance_quiz_answer_positions_v2.sql`

La migración agregó `private.quiz_answer_key.correct_option_v2` y publicó `public.submit_quiz_v2(text,text,integer[])`. En el momento de aplicar la migración se configuraron 41 preguntas. La verificación remota de solo lectura del 30-10-2026 contra el catálogo vigente encontró:
- 44 claves del catálogo actual repartidas en 34 lecciones; las 44 tienen `correct_option_v2` configurado.
- 31 de las 44 usan un índice v2 distinto del índice histórico; el texto de la opción correcta se conservó al reordenar el catálogo.
- Hay 43 claves históricas de IDs antiguos sin v2; no pertenecen al catálogo actual `bN-lN` y no deben confundirse con claves faltantes del curso vigente.
- `anon` no puede ejecutar el RPC v2; `authenticated` sí.
- El RPC usa `SECURITY DEFINER`, valida `auth.uid()`, registra intentos y actualiza `progress` al aprobar. Aplica un límite de 5 intentos por 5 minutos.

## Migraciones 021–023 (ya aplicadas y verificadas en remoto)

- **021 — 20261030050000:** reemplaza `private.submit_quiz_authoritative_v2` para que la limpieza de intentos con más de 30 días borre únicamente filas del usuario autenticado (`user_id = auth.uid()`). Mantiene el límite de 5 intentos por 5 minutos, la calificación, el umbral y el guardado de progreso.
- **022 — 20261030050915:** crea el trigger `invitations_prevent_used_deletion`; impide borrar invitaciones ya utilizadas y conserva la posibilidad de eliminar invitaciones no utilizadas. El trigger existe en remoto.
- **023 — 20261030051205:** registra las claves de evaluación de los laboratorios integradores `module-2/b2-l8`, `module-3/b3-l9` y `module-4/b4-l9`. Las tres claves están presentes en remoto.

Verificación remota adicional del 30-10-2026:
- El historial `supabase_migrations.schema_migrations` contiene las tres versiones y nombres anteriores.
- El RPC `private.submit_quiz_authoritative_v2` contiene la limpieza acotada al usuario autenticado.
- El trigger de protección de invitaciones utilizadas está instalado.
- El catálogo vigente tiene 44 claves en 34 lecciones; 44/44 tienen `correct_option_v2`. Hay 43 claves históricas de IDs antiguos sin v2, fuera del catálogo vigente.

**Conflicto de PR #8:** su archivo `20261030050000_021_pe1_course_catalog_refresh.sql` reutiliza la versión `20261030050000` con contenido y propósito distintos. Esa versión ya está aplicada en remoto como `scope_quiz_attempt_cleanup_to_current_user`. No fusionar ni aplicar la migración de PR #8. Revisar sus cambios de código y rescatar únicamente los que no dupliquen ni contradigan la ruta canónica.
## Otras migraciones

- 018: revoca escritura directa de estudiantes en `progress` y concede DELETE de invitaciones sujeto a RLS; aparece en remoto.
- 019: alinea las claves de quiz con los IDs de catálogo `bN-lN`; aparece en remoto.
- Las migraciones locales 016 y 017 descritas en documentos anteriores no aparecen en el historial remoto consultado. No aplicarlas hasta revisar si se necesitan, el estado real del esquema y si tienen dependencias.
- Se eliminó de la rama la migración redundante `20261028220816_grant_delete_invitations.sql`; no debe duplicarse el permiso ya incluido en 018.
- Algunos archivos tienen prefijos ordinales repetidos (por ejemplo, más de un archivo que empieza por 014 o 015). El orden real de Supabase lo determina el timestamp de versión, no solo el número que aparece en el nombre.

## Diferencias detectadas entre el repositorio y Supabase remoto

Comparación de solo lectura realizada el 30-10-2026 entre los archivos de supabase/migrations/ de fix/lider-20261028 y supabase_migrations.schema_migrations del proyecto remoto.

### Versiones locales que no aparecen en el historial remoto

- 001, 002 y 003: migraciones base del repositorio; el historial remoto consultado comienza en 004. No asumir que se pueden ejecutar sobre una base que ya contiene esas tablas.
- 20261026083730: 005_public_signup_optional_invitation.
- 20261026093000, 20261026093001 y 20261026100000: variantes locales de 011, 012 y 013.
- 20261027000000, 20261027000001, 20261027000002 y 20261027000003: preferencias de perfil, exercise_submissions, achievements/audit y project_submissions. No aparecen como aplicadas en el proyecto remoto.

### Versiones remotas que no están en la carpeta local

- 20261026221230 — 011_secure_quiz_submission.
- 20261026221332 — 012_deny_direct_quiz_table_access.
- 20261026222246 — 013_randomize_quiz_option_order.
- 20261026230434 — 014_require_invitation_expiry.
- 20261026230815 — 015_private_quiz_rpc_wrapper.

Las variantes locales 011–015 no son equivalentes a las versiones remotas. Por ejemplo, el 011 local crea public.quiz_attempts y el 013 local usa private.quiz_keys; las versiones remotas usan private.quiz_attempts y private.quiz_answer_key. No se deben combinar ni aplicar a ciegas.

### Acciones obligatorias antes de cualquier despliegue de migraciones

1. Recuperar y versionar en Git las migraciones exactas que ya están aplicadas en remoto.
2. Comparar las variantes locales no aplicadas con el esquema y el código actual.
3. Archivar o convertir las migraciones locales obsoletas mediante migraciones nuevas, sin reescribir versiones ya aplicadas.
4. Reconciliar 001–003 con el historial remoto mediante un plan explícito de migration repair, solo después de verificar objetos existentes.
5. Ejecutar una prueba completa en una base local limpia y otra con datos locales preservados.
6. Obtener aprobación humana antes de cualquier migration repair, db push o cambio de esquema en producción.

Mientras exista esta divergencia, no ejecutar supabase db push, migration repair ni db reset contra producción. El lanzador local tampoco aplica migraciones automáticamente.

## Procedimiento seguro para cambios futuros

1. Crear un archivo SQL nuevo con timestamp único en `supabase/migrations/`.
2. Añadir comprobaciones de permisos/RLS y un plan de reversión.
3. Probarlo contra una instancia de desarrollo; registrar el resultado.
4. Para producción, aplicar el SQL en una ventana coordinada con el código compatible y verificar la fila en el historial remoto.
5. Actualizar esta matriz. No copiar SQL de un chat a producción sin dejar el archivo versionado.
