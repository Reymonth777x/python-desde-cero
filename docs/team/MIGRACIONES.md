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

La salida consultada del historial remoto empieza por la entrada timestamp 004; no asumir que las primeras migraciones locales 001-003 están registradas con el mismo historial de CLI. El esquema remoto existe. Antes de cualquier `db push`, comparar tablas, funciones, políticas y migraciones línea por línea.

## Migración 020 (aplicada y verificada)

Archivo canónico:
`supabase/migrations/20261029051953_020_balance_quiz_answer_positions_v2.sql`

La migración agrega `private.quiz_answer_key.correct_option_v2`, configura las 41 filas del catálogo actual y publica `public.submit_quiz_v2(text,text,integer[])`. Conserva intacta la columna `correct_option` y el RPC anterior para que el código anterior no quede roto durante el despliegue. Comprobaciones remotas:
- 41 filas del catálogo y 41 claves v2 configuradas.
- 31 filas usan un índice v2 distinto del anterior; el texto de la opción correcta se conservó al reordenar el catálogo.
- `anon` no puede ejecutar el RPC v2; `authenticated` sí.

## Otras migraciones

- 018: revoca escritura directa de estudiantes en `progress` y concede DELETE de invitaciones sujeto a RLS; aparece en remoto.
- 019: alinea las claves de quiz con los IDs de catálogo `bN-lN`; aparece en remoto.
- Las migraciones locales 016 y 017 descritas en documentos anteriores no aparecen en el historial remoto consultado. No aplicarlas hasta revisar si se necesitan, el estado real del esquema y si tienen dependencias.
- Se eliminó de la rama la migración redundante `20261028220816_grant_delete_invitations.sql`; no debe duplicarse el permiso ya incluido en 018.
- Algunos archivos tienen prefijos ordinales repetidos (por ejemplo, más de un archivo que empieza por 014 o 015). El orden real de Supabase lo determina el timestamp de versión, no solo el número que aparece en el nombre.

## Procedimiento seguro para cambios futuros

1. Crear un archivo SQL nuevo con timestamp único en `supabase/migrations/`.
2. Añadir comprobaciones de permisos/RLS y un plan de reversión.
3. Probarlo contra una instancia de desarrollo; registrar el resultado.
4. Para producción, aplicar el SQL en una ventana coordinada con el código compatible y verificar la fila en el historial remoto.
5. Actualizar esta matriz. No copiar SQL de un chat a producción sin dejar el archivo versionado.
