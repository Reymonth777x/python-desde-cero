# Estado de migraciones — repo y Supabase remoto

## Carpeta canónica

Los archivos que describen cambios de base de datos se guardan en `supabase/migrations/`. Las migraciones históricas deben conservarse; no se borran porque parezcan duplicadas sin verificar el historial remoto.

## Estado remoto comprobado (corte 30-10-2026)

- Producción registra **24 migraciones** y DEV **10**. `supabase/migrations/` contiene 30 archivos; el timestamp de la migración 028 se alineó con producción (`20261030183117`).
- Las dos últimas funciones aplicadas son `revoke_legacy_quiz_rpc_execution` (producción `20261030174256`, DEV `20261030174245`) y `grandfather_existing_module_progress` (producción `20261030183117`, DEV `20261030183123`). Son dos migraciones diferentes; la retirada del RPC heredado no es la migración 028.
- Supabase Preview sigue fallando porque hay versiones históricas remotas sin archivo local equivalente y archivos locales con timestamps diferentes. No ejecutar `db push`, `migration repair` ni reset para intentar arreglarlo automáticamente.

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
- `20261030073610` — `harden_quiz_rpc_invoker` (026; ya aplicado en producción)
- `20261030081610` — `add_required_pe1_assessments_and_project` (024; ya aplicada en producción)
- `20261030081612` — `add_module_2_hello_world_quiz` (025; ya aplicada en producción)
- `20261030084138` — `harden_quiz_result_and_enforce_prerequisites` (027; aplicada en DEV)
- `20261030084308` — `harden_quiz_result_and_enforce_prerequisites` (027; aplicada en producción)

La salida consultada del historial remoto empieza por la entrada timestamp 004; no asumir que las primeras migraciones locales 001-003 están registradas con el mismo historial de CLI. El esquema remoto existe. Antes de cualquier `db push`, comparar tablas, funciones, políticas y migraciones línea por línea.

## Migración 020 (aplicada y verificada)

Archivo canónico:
`supabase/migrations/20261029051953_020_balance_quiz_answer_positions_v2.sql`

La migración agregó `private.quiz_answer_key.correct_option_v2` y publicó `public.submit_quiz_v2(text,text,integer[])`. En el momento de aplicar la migración se configuraron 41 preguntas. La verificación remota de solo lectura del 30-10-2026 contra el catálogo vigente encontró (separando los IDs activos de las filas heredadas):
- 67 claves del catálogo actual repartidas en 37 lecciones; las 67 tienen `correct_option_v2` configurado.
- 29 de las 67 claves activas usan un índice v2 distinto del índice histórico; el texto de la opción correcta se conservó al reordenar el catálogo.
- Hay 43 claves históricas de IDs antiguos sin v2; no pertenecen al catálogo actual `bN-lN` y no deben confundirse con claves faltantes del curso vigente.
- `anon` no puede ejecutar el RPC v2; `authenticated` sí.
- La implementación autoritativa privada usa `SECURITY DEFINER`, valida `auth.uid()`, registra intentos y actualiza `progress` al aprobar. Desde la migración 026, el RPC público `submit_quiz_v2` es un envoltorio `SECURITY INVOKER`. La migración 027 retira el arreglo `answerCorrect` del JSON público y mueve las verificaciones de prerrequisitos al interior de la función privada `SECURITY DEFINER`, para que tampoco puedan evitarse llamando esa función directamente. Se mantiene el límite de 5 intentos por 5 minutos.

## Migraciones 021–023 (ya aplicadas y verificadas en remoto)

- **021 — 20261030050000:** reemplaza `private.submit_quiz_authoritative_v2` para que la limpieza de intentos con más de 30 días borre únicamente filas del usuario autenticado (`user_id = auth.uid()`). Mantiene el límite de 5 intentos por 5 minutos, la calificación, el umbral y el guardado de progreso.
- **022 — 20261030050915:** crea el trigger `invitations_prevent_used_deletion`; impide borrar invitaciones ya utilizadas y conserva la posibilidad de eliminar invitaciones no utilizadas. El trigger existe en remoto.
- **023 — 20261030051205:** registra las claves de evaluación de los laboratorios integradores `module-2/b2-l8`, `module-3/b3-l9` y `module-4/b4-l9`. Las tres claves están presentes en remoto.

Verificación remota adicional del 30-10-2026:
- El historial `supabase_migrations.schema_migrations` contiene las tres versiones y nombres anteriores.
- El RPC `private.submit_quiz_authoritative_v2` contiene la limpieza acotada al usuario autenticado.
- El trigger de protección de invitaciones utilizadas está instalado.
- El catálogo vigente tiene 67 claves en 37 lecciones; 67/67 tienen `correct_option_v2`. Hay 43 claves históricas de IDs antiguos sin v2, fuera del catálogo vigente.

**Conflicto de PR #8:** su archivo `20261030050000_021_pe1_course_catalog_refresh.sql` reutiliza la versión `20261030050000` con contenido y propósito distintos. Esa versión ya está aplicada en remoto como `scope_quiz_attempt_cleanup_to_current_user`. No fusionar ni aplicar la migración de PR #8. Revisar sus cambios de código y rescatar únicamente los que no dupliquen ni contradigan la ruta canónica.
## Migraciones 024–027 — estado remoto verificado el 30-10-2026

Las cuatro migraciones 024–027 se probaron y aplicaron en DEV. El historial remoto de solo lectura confirma:

| Cambio | DEV (fcwbkkivelsipqqrbpya) | Producción (nuqydanbbgqcofcftshk) |
|---|---|---|
| 024 — evaluación M1, proyecto y examen | Aplicada: versión 20261030070355, add_required_pe1_assessments_and_project | Aplicada: versión 20261030081610, add_required_pe1_assessments_and_project |
| 025 — pregunta Hello, World! | Aplicada: versión 20261030071200, add_module_2_hello_world_quiz | Aplicada: versión 20261030081612, add_module_2_hello_world_quiz |
| 026 — RPC público SECURITY INVOKER | Aplicada: versión 20261030073304, harden_quiz_rpc_invoker | Aplicada: versión 20261030073610, harden_quiz_rpc_invoker |
| 027 — ocultar aciertos por pregunta y exigir prerrequisitos dentro del calificador privado | Aplicada: versión 20261030084138, harden_quiz_result_and_enforce_prerequisites | Aplicada: versión 20261030084308, harden_quiz_result_and_enforce_prerequisites |

Consultas SQL de solo lectura del 30-10-2026:
- DEV tiene 67 claves activas del catálogo (bN-lN), las 67 con correct_option_v2 y cero claves v2 faltantes.
- Producción tiene 67 claves activas del catálogo nuevo, las 67 con correct_option_v2 y cero claves v2 faltantes.
- En ambos entornos, public.submit_quiz_v2 tiene prosecdef = false (SECURITY INVOKER), search_path vacío, anon no tiene EXECUTE y authenticated sí.
- La implementación autoritativa privada sigue siendo SECURITY DEFINER y valida auth.uid().

**Divergencia de versiones que bloquea un db push a ciegas:** los timestamps registrados remotamente no coinciden con los prefijos de los tres archivos locales:
- Local 024: 20261030064000; remoto DEV: 20261030070355; remoto producción: 20261030081610.
- Local 025: 20261030072000; remoto DEV: 20261030071200; remoto producción: 20261030081612.
- Local 026: 20261030074000; remoto DEV: 20261030073304; remoto producción: 20261030073610.
- Local 027: 20261030090000; remoto DEV: 20261030084138; remoto producción: 20261030084308.

Los nombres de las migraciones coinciden, pero Supabase identifica las migraciones por versión/timestamp. No ejecutar `supabase db push`, `migration repair` ni renombrar/aplicar estos archivos hasta preparar una reconciliación explícita para ambos entornos. No repetir 024, 025, 026 ni 027 en producción. La divergencia se registra aquí para que ningún socio interprete que los archivos locales pendientes se deben aplicar sin más.
## Otras migraciones

- 018: revoca escritura directa de estudiantes en `progress` y concede DELETE de invitaciones sujeto a RLS; aparece en remoto.
- 019: alinea las claves de quiz con los IDs de catálogo `bN-lN`; aparece en remoto.
- Las migraciones locales 016 y 017 descritas en documentos anteriores no aparecen en el historial remoto consultado. No aplicarlas hasta revisar si se necesitan, el estado real del esquema y si tienen dependencias.
- Se eliminó de la rama la migración redundante `20261028220816_grant_delete_invitations.sql`; no debe duplicarse el permiso ya incluido en 018.
- Algunos archivos tienen prefijos ordinales repetidos (por ejemplo, más de un archivo que empieza por 014 o 015). El orden real de Supabase lo determina el timestamp de versión, no solo el número que aparece en el nombre.

## Diferencias detectadas entre el repositorio y Supabase remoto

Comparación de versiones realizada el 30-10-2026 entre los 30 archivos locales de supabase/migrations/ en master y los historiales de producción (24) y DEV (10).

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
- 20261030073610 — `harden_quiz_rpc_invoker` (archivo local 026 usa 20261030074000).
- 20261030081610 — `add_required_pe1_assessments_and_project` (archivo local 024 usa 20261030064000).
- 20261030081612 — `add_module_2_hello_world_quiz` (archivo local 025 usa 20261030072000).
- 20261030084308 — `harden_quiz_result_and_enforce_prerequisites` (archivo local 027 usa 20261030090000).

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


## Release de aplicación 30-10-2026: curso e invitaciones

- Release `e758f9cf9da1aa647429669b112b7128ca9b126d`: CI [41076396982](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41076396982) y deploy [41076898388](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41076898388), ambos success.
- PR #65 corrigió los saltos de línea en ejemplo, salida, starter y solución de `b3-l6`; no cambió el ID ni las claves del quiz.
- PR #66 corrigió la expiración de invitaciones. La hora local se convierte en navegador a ISO UTC; el servidor valida que sea un instante UTC válido y futuro, y la lista muestra la hora local del administrador. No requirió migración ni cambió columnas.
- PR #63 añadió práctica y pruebas de desplazamientos bit a bit en `b3-l2` y excepciones/`else`/`finally` en `b4-l7`. No cambió claves de quiz ni esquema.

## Verificación consolidada del catálogo y rama preview — 30-10-2026

Consulta de solo lectura posterior al despliegue del 30-10-2026:

- Producción y DEV tienen las mismas 67 claves v2 del catálogo vigente: módulo 1 = 10, módulo 2 = 13, módulo 3 = 11, módulo 4 = 28 y módulo 5 opcional = 5.
- En los cuatro módulos obligatorios hay 62 claves; las otras 5 pertenecen a la extensión opcional. No se detectaron filas con `correct_option_v2 IS NULL` en ese conjunto.
- Comparación directa con el catálogo (`questions.answer`): producción y DEV tienen 67/67 coincidencias, cero filas ausentes, cero `correct_option_v2` nulos y cero índices desalineados. En producción, 29/67 valores v2 difieren del campo histórico `correct_option`; no sobrescribir v2 desde el índice legacy.
- Producción conserva 43 filas históricas con IDs `lesson-*` y sin v2, fuera de las 67 tuplas actuales. DEV contiene solo las 67 claves actuales; no borrar las filas históricas sin reconciliar primero.
- Producción confirma `public.submit_quiz_v2` como SECURITY INVOKER, sin permiso EXECUTE para `anon` y con permiso para `authenticated`. La función privada autoritativa es SECURITY DEFINER, valida `auth.uid()` y conserva el cálculo del lado servidor.
- El trigger `invitations_prevent_used_deletion` está habilitado sobre `public.invitations`.

### Rama preview fallida del proyecto de producción

La consulta de `list_branches` al proyecto `nuqydanbbgqcofcftshk` devuelve una rama preview llamada `main`, ID `82612040-2379-41e3-8f76-100fadca6a2c`, con `status = MIGRATIONS_FAILED` y `preview_project_status = ACTIVE_HEALTHY`. El proyecto separado `python-desde-cero-dev` (`fcwbkkivelsipqqrbpya`) está `ACTIVE_HEALTHY`; no confundir ambos recursos.

No resetear, rebasar, fusionar ni eliminar la rama preview como solución rápida. Primero identificar qué migración falla, comparar su historial con producción y valorar si la rama puede repararse sin perder datos de preview. Esta incidencia no justifica ejecutar operaciones de migración en la base principal.


## Retirar el RPC de evaluación heredado — migración de seguridad (30-10-2026)

La auditoría encontró que producción conservaba `public.submit_quiz` y `private.submit_quiz_authoritative` con `EXECUTE` para `authenticated`. Esa ruta antigua usaba `correct_option` (índice histórico), devolvía el arreglo `answerCorrect` y no aplicaba los prerrequisitos añadidos al calificador v2. Como 29 de las 67 claves actuales tienen un índice distinto entre legacy y v2, un estudiante podía intentar el RPC heredado directamente en lugar de usar el flujo actual.

- Archivo canónico: `supabase/migrations/20261030174256_revoke_legacy_quiz_rpc_execution.sql`.
- Producción registra `20261030174256`; DEV registra `20261030174245`. El nombre y el SQL son iguales; Supabase asignó timestamps distintos por entorno.
- La migración revoca `EXECUTE` de `PUBLIC`, `anon`, `authenticated` y `service_role` sobre el calificador heredado y su wrapper público, si existen.
- No elimina las definiciones, claves antiguas, intentos, invitaciones ni progreso. En DEV, donde la función privada heredada no existe y `public.submit_quiz` ya reenvía a v2, no se revoca el wrapper vigente.
- Verificación posterior: las dos funciones heredadas en producción ya no son ejecutables por `anon`, `authenticated`, `service_role` ni `PUBLIC`; `public.submit_quiz_v2` y `private.submit_quiz_authoritative_v2` siguen disponibles para `authenticated`. La migración solo revoca permisos de ejecución; no contiene operaciones DML.
- Verificador repetible: `scripts/sql/verify-legacy-quiz-rpc-closed.sql`.

No volver a conceder `EXECUTE` a la ruta heredada. La aplicación usa `submit_quiz_v2` exclusivamente.

## 028 — Conservar el acceso de estudiantes con progreso histórico (30-10-2026)

- Archivo canónico: `supabase/migrations/20261030183117_028_grandfather_existing_module_progress.sql`.
- Producción registra la versión `20261030183117`; DEV registra `20261030183123`. Supabase asignó timestamps distintos al aplicar el mismo SQL en cada proyecto.
- Reemplaza únicamente `private.submit_quiz_authoritative_v2` para que un estudiante que ya tiene una fila de progreso en el módulo destino pueda continuar aunque aún no tenga completada la evaluación previa que se incorporó después.
- Conserva los controles específicos de progreso previo del proyecto `b4-l10` y el examen `b4-l11`. No fabrica puntuaciones, no marca lecciones como completadas y no modifica filas de `progress` ni `quiz_attempts`.
- La función permanece `SECURITY DEFINER`, conserva `auth.uid()`, `search_path` vacío, validación de opciones, el límite de intentos y la respuesta agregada sin `answerCorrect`.
- Verificación de solo lectura en producción y DEV: los indicadores `existing_module_progress`, `existing_project_progress` y `existing_exam_progress` están presentes en la definición remota del calificador.

La excepción de progreso histórico también se aplica en la interfaz: el PR #84 se fusionó en `04604585d899173439f73c8a9d1975451e771200`. Su CI de PR [41107541504](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41107541504) y CI de master [41108215559](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41108215559) pasaron; Cloudflare publicó ese mismo SHA en [41108747917](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41108747917), con smoke tests de producción satisfactorios.

## 029 — Orilla (verificación remota 31-10-2026)

- Archivo canónico del repositorio: `supabase/migrations/20261031012927_029_orilla_runs.sql`.
- Producción registra `20261031012927`, nombre `orilla_runs`. El SQL guardado en el historial remoto coincide exactamente con el archivo canónico (7.843 caracteres).
- DEV registra la misma migración como `20261031012712`, nombre `orilla_runs`. Su SQL es equivalente al archivo canónico tras normalizar comentarios y formato. No hay que volver a ejecutar la migración.
- Auditoría de solo lectura en ambos entornos: `public.orilla_runs` existe con RLS activo; `authenticated` tiene lectura propia por política; `anon` no puede leer y ninguno de esos roles puede escribir directamente. Las RPC públicas son `SECURITY INVOKER`, las funciones autoritativas están en `private` con `SECURITY DEFINER` y `search_path` vacío; solo `authenticated` puede ejecutarlas. El trigger `orilla_runs_guard` está habilitado.
- No se hicieron cambios SQL en DEV ni producción durante esta revisión. La migración ya estaba aplicada en ambos entornos; solo se alineó el timestamp canónico del archivo con producción.
- Se mantiene la restricción general de este documento: no ejecutar `db push`, `migration repair` ni `db reset` mientras persista la divergencia histórica de otras migraciones. No repetir la migración 029 en ningún entorno.


---

## Reconciliación de historial — 31-10-2026

Esta sección es la referencia vigente y sustituye los conteos/versiones de los apartados históricos anteriores.

### Hechos verificados en PROD y DEV

- PROD registra 25 migraciones; DEV registra 11. Ambos esquemas tienen `profiles`, `invitations`, `progress`, el calificador privado de quizzes y `orilla_runs`.
- PROD y DEV **no** tienen `public.quiz_attempts` ni `private.quiz_keys`; su modelo activo usa `private.quiz_attempts` y `private.quiz_answer_key`.
- PROD y DEV tampoco tienen `exercise_submissions`, `achievements`, `user_achievements`, `user_streaks`, `audit_log` ni `project_submissions`; el código actual no consulta esas tablas.
- Las preferencias `theme`, `avatar`, `sound_enabled` y `reduce_motion` tampoco existen como columnas de `profiles`; el selector de tema actual no debe depender de esas columnas.
- El trigger `on_auth_user_created` existe y está habilitado en ambos proyectos. La definición actual de `public.handle_new_user()` es el flujo de invitación opcional de la migración 005.
- `invitations.expires_at` es `NOT NULL`, tiene default de siete días y no hay filas con vencimiento nulo.
- La rama Supabase Preview `main` del proyecto de producción tiene `MIGRATIONS_FAILED`, pero el proyecto de preview continúa `ACTIVE_HEALTHY` y está marcado `with_data=false`. No resetearla sin una razón y comprobación posterior.

### Cambios de repositorio preparados en esta rama

1. Restaurar las cinco migraciones históricas 011–015 con el SQL exacto recuperado de `supabase_migrations.schema_migrations` de PROD:
   - `20261026221230_011_secure_quiz_submission.sql`
   - `20261026221332_012_deny_direct_quiz_table_access.sql`
   - `20261026222246_013_randomize_quiz_option_order.sql`
   - `20261026230434_014_require_invitation_expiry.sql`
   - `20261026230815_015_private_quiz_rpc_wrapper.sql`

   Las sentencias guardadas en el historial remoto se conservaron literalmente; no se regeneraron a partir de nombres ni se reescribió su lógica.

2. Alinear los archivos 024–027 a las versiones de PROD, sin cambiar su SQL. Se comparó cada archivo con `statements[1]` del historial remoto y los cuatro contenidos dieron coincidencia exacta:
   - 024 → `20261030081610`
   - 025 → `20261030081612`
   - 026 → `20261030073610`
   - 027 → `20261030084308`

3. Archivar fuera de `supabase/migrations/` las tres variantes de quizzes que no representan el esquema desplegado y las cuatro migraciones de características sin consumidor actual. Se preservan sus contenidos en `supabase/archive/migrations/`; no se aplican automáticamente.

4. Mantener las migraciones base 001–003 y la función de registro opcional 005 dentro de la carpeta activa. Los objetos base y el trigger ya existen en PROD y DEV, y el cuerpo actual de `handle_new_user()` coincide con el comportamiento de 005. Antes de publicar la rama se requiere reconciliar **solo el historial** de esas versiones (marcarlas como ya aplicadas), sin volver a ejecutar sus SQL.

### Diferencia específica de DEV

DEV se creó con un snapshot de desarrollo `20261030061534_dev_environment_bootstrap_20261030` y tres migraciones auxiliares para wrappers/privilegios. No se deben copiar esas sentencias a la secuencia común de producción: el bootstrap es específico de DEV y las auxiliares preservan un wrapper de compatibilidad que PROD retiró. La reconciliación de DEV requiere conservar su comportamiento, y alinear solo los timestamps compartidos 024–029 cuando sus sentencias/efectos sean equivalentes. La migración `revoke_legacy_quiz_rpc_execution` de DEV incluye comentarios adicionales y protege su wrapper v2; no se sustituye sin volver a comparar el ACL resultante.

### Límites operativos

- La restauración y renombrado de archivos no ejecutan SQL ni cambian datos.
- No ejecutar `db push`, `db reset`, `merge_branch` ni borrar la rama Preview como atajo.
- La reparación de historial debe ser metadata-only, version por version, con comparación previa de objetos y permisos. No marcar como applied una migración cuyo efecto no esté presente.
- Después de la reparación, comprobar `list_migrations` en ambos entornos y confirmar que PROD y DEV no tienen versiones remotas ausentes en la carpeta correspondiente. Si el preview sigue fallando, leer el error nuevo antes de tocar esa rama.


### Cierre de reconciliación del proyecto de producción — 31-10-2026

- La carpeta activa `supabase/migrations/` de esta rama contiene 29 archivos y el historial de PROD contiene exactamente las mismas 29 versiones: cero archivos locales ausentes del historial y cero versiones remotas sin archivo local.
- Se recuperaron las sentencias SQL originales de 011–015 desde `schema_migrations.statements[1]` de producción; los archivos nuevos conservan las sentencias originales sin reconstrucción.
- Las cuatro migraciones 024–027 se renombraron a sus timestamps reales de PROD. Se comparó el contenido de cada archivo con la sentencia registrada y los cuatro dieron igualdad exacta.
- Los SQL locales alternativos de 011–013 y las cuatro migraciones de funcionalidades que no tienen tablas/columnas/consumidores en el producto actual se preservaron en `supabase/archive/migrations/`; no forman parte del orden de ejecución.
- En PROD se completó una reparación solo de historial para `20261026083700`, `20261026083705`, `20261026083715` y `20261026083730`. Antes de insertarlas se verificó que las tablas base y el trigger de Auth existían, que `handle_new_user()` ya ejecutaba el registro con invitación opcional y que el vencimiento de invitaciones estaba normalizado. Las cuatro filas fueron insertadas en `supabase_migrations.schema_migrations` con las sentencias de su archivo local y `ON CONFLICT DO NOTHING`. No se ejecutaron esas sentencias SQL ni se alteró esquema, datos, usuarios, invitaciones, progreso, permisos o triggers.
- No se modificó el historial remoto de DEV. DEV sigue utilizando un bootstrap de entorno propio y tres wrappers/ajustes de privilegios locales a ese proyecto. No se deben insertar en DEV versiones comunes por mera semejanza de nombre: antes se requiere una matriz de efectos por timestamp y comprobar sus RPC/ACL para conservar el wrapper v2 de DEV.
- Esta reconciliación se preparó en la rama `fix/reconcile-supabase-migration-history-20261031`. La rama aún requiere CI y revisión de Supabase Preview antes de integrarse en `master`.

### Distinción importante sobre Supabase Preview

La reparación anterior corrige el historial del proyecto de producción principal. No equivale a reparar la rama Preview `main` que reporta `MIGRATIONS_FAILED`. Esa rama es un proyecto derivado separado, marcado `with_data=false` y `ACTIVE_HEALTHY`; su estado debe comprobarse después de que Supabase evalúe esta rama Git. No resetearla ni eliminarla por anticipado.


### Aceptación funcional de Orilla — lectura real de filas (31-10-2026)

Consulta de solo lectura de `public.orilla_runs`:

- PROD contiene exactamente una fila: `chapter_id = c01`, `passed = false`, `stars = 0`, `best_steps = NULL`, `attempts = 0`. Es un borrador guardado; no acredita que el estudiante ejecutara el programa ni que superara el objetivo.
- DEV no contiene filas de Orilla.
- El código guarda borradores con `p_es_intento = false`; el contador `attempts` solo aumenta cuando se registra una ejecución. No interpretar la fila de PROD como una partida.
- Aceptación pendiente: con una cuenta desechable de DEV, abrir `/orilla`, ejecutar la solución de `c01`, verificar que la ejecución queda aprobada y que la campaña/Academia reflejan el progreso. No utilizar cuentas ni datos de estudiantes de producción.


### Prueba reversible de guardado y aislamiento de Orilla en DEV — 31-10-2026

Se ejecutó una prueba SQL de integración usando dos perfiles de estudiante existentes en el proyecto DEV, dentro de una sola transacción que terminó en `ROLLBACK`:

- La RPC `record_orilla_run` guardó un intento temporal de `c01` y devolvió `attempts = 1`, `passed = false`, `stars = 0`.
- El primer estudiante pudo leer su propia fila.
- El segundo estudiante no pudo ver la fila ajena.
- Intentar registrar `c02` sin haber superado `c01` fue rechazado con el error de tramo bloqueado.
- `authenticated` no tiene privilegios directos INSERT/UPDATE/DELETE sobre `public.orilla_runs`.
- Después del `ROLLBACK`, una consulta independiente verificó que DEV seguía con cero filas en `orilla_runs`.

La prueba acredita el comportamiento de RPC, RLS, prerrequisitos y permisos a nivel de base de datos. **No acredita todavía la experiencia visual real con Monaco/Pyodide desde un navegador autenticado**, ni la actualización visual del mapa y del panel de Academia. Esa aceptación sigue pendiente con un estudiante desechable de DEV.


## Pruebas de permisos y evaluación actuales — 31-10-2026

La suite `supabase/tests/permissions.sql` fue reemplazada para coincidir con el esquema canónico vigente:

- Usa `public.progress`, `public.invitations`, `public.orilla_runs`, `private.quiz_answer_key` y `private.quiz_attempts`.
- Comprueba ACL, RLS, los wrappers públicos `SECURITY INVOKER`, las funciones privadas autoritativas `SECURITY DEFINER), el bloqueo del RPC heredado, aislamiento entre dos estudiantes y permisos del administrador.
- Comprueba quiz incorrecto sin progreso, quiz aprobado con score persistido, prerrequisitos de módulo y el guardado/avance de Orilla.
- Crea tres usuarios Auth ficticios en el test local, dentro de una transacción que termina en `ROLLBACK`; no requiere cuentas remotas ni modifica datos persistentes.
- El plan pgTAP contiene **69 aserciones**. Se añadió una regresión Vitest para impedir que vuelvan a aparecer placeholders, referencias a tablas antiguas o comandos psql incompletos.

La ejecución real de pgTAP (`npx supabase test db`) todavía no se ha realizado contra una instancia local limpia; la prueba está escrita, pero no debe marcarse como ejecutada hasta disponer de Docker/Supabase CLI local y observar el resultado.

### Integración reversible ejecutada en DEV — quiz/progreso — 31-10-2026

Dentro de una transacción con `ROLLBACK` en el proyecto DEV:

- El quiz incorrecto `module-1/b1-l1` devolvió `passed = false` y no creó progreso.
- Las respuestas correctas devolvieron `passed = true`, score 100 y fila de progreso completada.
- La segunda cuenta no pudo leer la fila de progreso de la primera por RLS.
- El rol `authenticated` no tiene INSERT/UPDATE en `public.progress`, INSERT en `private.quiz_attempts`, ni SELECT en `private.quiz_answer_key`.
- Consulta independiente posterior al `ROLLBACK`: cero filas en `progress`, `private.quiz_attempts` y `orilla_runs`.

Esta verificación acredita la lógica RPC/ACL/RLS en la base de datos DEV, no el flujo UI/browser de Auth, recarga o nueva sesión.

### Herramienta obsoleta retirada

Se eliminó `scripts/gen-quiz-keys.ts`: no era un script npm activo y generaba `TRUNCATE TABLE private.quiz_keys RESTART IDENTITY CASCADE`, además de INSERTs hacia una tabla que no existe en PROD ni DEV. No se sustituye por un generador SQL manual. El catálogo vigente se versiona mediante migraciones revisadas de `private.quiz_answer_key`; no se debe regenerar ni truncar la clave desde `src/lib/course.ts`.
