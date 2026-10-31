# Preparación para producción — archivo histórico con actualización 31-10-2026

> **Aviso de vigencia:** el cuerpo original de este documento conserva el corte del 30-10-2026. No utilizar sus SHA, recuentos de migración, estado de Preview ni inventario de funcionalidades como estado actual. La reconciliación de PROD, la publicación de Orilla y el estado actual de QA se resumen en `README.md`, `docs/team/ESTADO.md` y `docs/team/MIGRACIONES.md`.

## Actualización vigente — 31-10-2026

- `master` actual tras integrar PR #106 y #108: `e13bf1146c7956851149457c07c15199252b747c`. El CI de ese SHA debe revisarse en [GitHub Actions](https://github.com/Reymonth777x/python-desde-cero/actions); la publicación de runtime verificada previamente corresponde al commit `ed4ccf8b5a242b7c52b7c63f70380e4efe08f339`.
- Orilla está publicada en `/orilla`, requiere sesión y ofrece 12 tramos, río abierto y dos retos. La capa de base de datos pasó pruebas SQL reversibles en DEV, pero no se ha completado la aceptación de una partida real desde navegador autenticado ni la vista de progreso en Academia.
- PROD mantiene 29 migraciones activas que coinciden con los 29 archivos canónicos; DEV conserva 11 migraciones de su bootstrap/wrappers propios. No ejecutar `db push`, `migration repair` ni reset automáticamente.
- Preview `main`: estado actual `FUNCTIONS_DEPLOYED`, proyecto derivado `ACTIVE_HEALTHY`, `with_data=false`; falta comprobar su ledger y el resultado exacto del paso `migrate`.
- PR #108 está integrado: suite pgTAP actualizada a 69 aserciones, generador destructivo obsoleto eliminado y documentación corregida. La suite sigue pendiente de ejecución real con `npx supabase test db` en Supabase local limpio.
- El repositorio sigue público y `master` sin protección. No cambiar visibilidad ni reglas sin la decisión/configuración del propietario.
- La privacidad/terminología legal y la aceptación Auth/browser de DEV siguen abiertas. Ver issues #17, #18, #20, #21, #23 y #98.

---

**HEAD comprobado de `master`:** `38533eae71f60e899949f567c30f15c99c3cbe65`  
**CI:** [41150277769](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41150277769) — success sobre el HEAD actual  
**Despliegue Cloudflare:** [41150633694](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41150633694) — success sobre el mismo SHA  
**Worker principal:** `7b625566-1987-4f2c-9875-c369ed584e13`  
**Runner Python aislado:** `8cb973f4-fde5-4cce-ab25-7dba6a09ad25`  
**Estado:** publicación técnica verificada. El propietario confirma la aceptación manual de Auth/correo, runner Python en Chrome/Firefox/teléfonos físicos y revisión de las 33 unidades. El proyecto todavía no debe declararse listo para apertura general: quedan controles de gobierno, prueba de aislamiento/persistencia entre dos estudiantes, Preview/migraciones y revisión legal.

## Dictamen

**Publicado, con CI y despliegue satisfactorios. Aceptación manual del propietario registrada; lanzamiento educativo general condicionado a los controles restantes.**

El smoke test de producción verificó portada, `/muestra`, `/login`, sitemap, asociación de los hostnames personalizados y redirección `www` → dominio raíz HTTP 308. El flujo manual de Auth/correo, las pruebas Python/Turtle en Chrome/Firefox y teléfonos físicos, y la revisión humana de las 33 unidades quedan registrados como confirmados por el propietario; no como una certificación externa independiente.

## Sitio y capacidades publicadas

- Portada: [python-desdecero.com](https://python-desdecero.com/); muestra pública: [python-desdecero.com/muestra](https://python-desdecero.com/muestra).
- La portada presenta cuatro módulos y 33 unidades obligatorias; la extensión del módulo 5 contiene cuatro actividades opcionales.
- `/muestra` permite leer y ejecutar la primera lección sin cuenta. El serializador excluye preguntas, respuestas, soluciones, pruebas ocultas y progreso.
- `/academia` y `/practica` requieren sesión. El modelo de autorización distingue estudiante y administrador; no hay panel docente.
- El panel administrativo ofrece gestión de invitaciones; administración de usuarios y auditoría no están disponibles en esta versión.
- PR #54 protege los despliegues frente a workflows obsoletos verificando el SHA antes y después de compilar. El despliegue del 30-10-2026 omitió ejecuciones obsoletas y publicó finalmente el HEAD actual.
- PR #82 ejecuta las soluciones de referencia de todas las actividades de código con 62 casos en procesos Python aislados; el examen conceptual final se excluye porque no requiere código adicional.
- PR #81 recupera el foco al activar el cierre del selector móvil. La suite Playwright comprueba el diálogo a 320, 360 y 390 px, su encaje en pantalla, el scroll interno y el foco de teclado. El propietario confirma pruebas físicas del runner Python; la aceptación visual integral de paleta, editor Monaco, teclado virtual y progreso autenticado sigue separada en issue #18.
- El smoke test externo leyó `/`, `/muestra`, `/login`, `/sitemap.xml` y `www`. El workflow también comprobó el marcador Turnstile y el redirect HTTP 308.

## Curso y correcciones recientes

- Curso obligatorio: 4 módulos y 33 unidades (4 + 9 + 9 + 11). Extensión opcional: 4 actividades.
- Evaluación M1: `b1-l4`, seis preguntas. Hello World M2: `b2-l9` (sección 2.1). Proyecto obligatorio: `b4-l10`, seis pruebas automáticas y evaluación conceptual. Examen final: `b4-l11`, doce preguntas y umbral 75%.
- Mejoras publicadas: variables/conversiones `b2-l4`; operadores y desplazamientos `b3-l2`; Bubble Sort `b3-l7`; matrices y bucles anidados `b3-l9`; listas `b3-l6` con saltos de línea reales; excepciones `b4-l7` con `KeyError`, `ValueError`, `else` y `finally`; y explicación introductoria `b1-l1`–`b1-l3`.
- Las fechas opcionales de invitación se interpretan según el reloj local del administrador, se convierten a un instante UTC en el navegador y se validan en el servidor; la tabla las muestra en hora local. La corrección no alteró el esquema.
- El propietario confirma la revisión humana de las 33 unidades obligatorias: progresión, claridad, repeticiones, nivel, ejercicios y retroalimentación (30-10-2026). La suite automatizada ejecuta 36 actividades de código contra 62 casos. Sigue pendiente la validación de evaluaciones/progreso entre dos cuentas de estudiantes y un administrador.

## Supabase — solo lectura

| Comprobación | Producción | DEV |
|---|---|---|
| Proyecto | `nuqydanbbgqcofcftshk` | `fcwbkkivelsipqqrbpya` |
| Estado | ACTIVE_HEALTHY | ACTIVE_HEALTHY |
| Región | us-west-2 | us-west-1 |
| PostgreSQL | 17.11.0.003 | 17.11.0.003 |
| Claves v2 del catálogo | 67/67 | 67/67 |
| Índices distintos al catálogo actual | 0 | 0 |
| Filas heredadas fuera del catálogo | 43 | 0 |

Se compararon las 67 tuplas actuales de `questions.answer` con `private.quiz_answer_key.correct_option_v2`: producción y DEV tienen 67/67 coincidencias, cero filas ausentes, nulas o desalineadas. En producción, 29 de esas 67 posiciones v2 difieren del campo histórico `correct_option`; el calificador usa v2, por lo que no debe reconstruirse desde el campo legacy. Producción conserva además 43 filas `lesson-*` históricas sin v2, fuera del catálogo actual; no borrarlas sin reconciliación.

`public.submit_quiz_v2` es `SECURITY INVOKER`; `anon` no tiene EXECUTE y `authenticated` sí. El calificador autoritativo vive en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve calificación agregada. La ruta antigua `public.submit_quiz` y `private.submit_quiz_authoritative` usaba `correct_option` legacy y devolvía `answerCorrect`; el 30-10-2026 se revocó `EXECUTE` sobre ambas para `PUBLIC`, `anon`, `authenticated` y `service_role`. El flujo v2 sigue habilitado. Migración: `20261030174256_revoke_legacy_quiz_rpc_execution.sql`; verificador: `scripts/sql/verify-legacy-quiz-rpc-closed.sql`. El trigger `invitations_prevent_used_deletion` conserva las invitaciones usadas.

El historial remoto registra 24 migraciones en producción y 10 en DEV. La migración `revoke_legacy_quiz_rpc_execution` corresponde a producción `20261030174256` y DEV `20261030174245`. La migración 028 `grandfather_existing_module_progress` corresponde a producción `20261030183117` y DEV `20261030183123`. Las versiones locales 001–003 y 016–017, además de varios timestamps 024–027, siguen presentando divergencias frente a los historiales remotos; la matriz detallada está en `docs/team/MIGRACIONES.md`. No ejecutar `db push`, `migration repair` ni `db reset` para resolver estas diferencias. La rama preview `main` del proyecto de producción tiene `MIGRATIONS_FAILED` (la base preview indica `ACTIVE_HEALTHY`), y no es el proyecto DEV separado. No ejecutar `db push`, `migration repair`, `db reset`, ni resetear/rebasar/borrar esa rama sin investigar el drift y preparar backup/rollback.

Producción y DEV usan PostgreSQL 17.11.0.003 y `pgcrypto` 1.3. El Advisor de seguridad de producción reporta Leaked Password Protection desactivado. La organización está en plan Free y la documentación oficial de Supabase indica que la función requiere Pro o superior; no está disponible para activar en el plan actual. Mantener los requisitos básicos de contraseña y reevaluar si se decide actualizar. Dos índices de invitaciones muestran uso no observado (INFO); no cambiarlos sin medir.

## Controles pendientes antes del lanzamiento educativo

### P0 — Gobierno y exposición del material evaluativo

- El repositorio es público y el historial de `src/lib/course.ts` contiene respuestas, explicaciones y soluciones; `server-only` evita el bundle cliente, pero no impide leer el código desde GitHub.
- Issue [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21): preparar la privacidad del código evaluativo. Mantener la visibilidad sin cambios hasta comprobar que los tres socios tienen acceso individual; no arriesgar que pierdan el repositorio al privatizarlo.
- Issue [#23](https://github.com/Reymonth777x/python-desde-cero/issues/23): `master` continúa sin branch protection (`protected: false`). La conexión GitHub disponible es de solo lectura para administración de reglas; la protección debe activarse con una sesión propietaria con permisos de Settings.

### P1 — Aislamiento de progreso y controles Auth

- El propietario confirma que registro, confirmación, login, logout, recuperación y cambio de contraseña funcionan. También confirma la prueba manual del runner y el acceso a la academia.
- El conector de solo lectura no puede inspeccionar la Secret key, el estado exacto del CAPTCHA de Auth ni el host/login SMTP guardado. No rotar ni modificar secretos basándose en una inferencia.
- Probar con dos estudiantes DEV y un administrador el aislamiento entre cuentas, una evaluación reprobada/aprobada, la persistencia de la mejor nota y la recuperación del progreso tras cerrar sesión. Issue #20 permanece abierto.
- Leaked Password Protection aparece desactivado en el Advisor; el plan Free no permite activarlo. Requiere Pro o superior y una decisión de presupuesto.

### P1 — Aceptación móvil visual

- El propietario confirma pruebas del runner Python, Turtle, límites y errores en Chrome, Firefox y teléfonos físicos.
- La aceptación visual integral de la paleta de temas, Monaco, teclado virtual, scroll y pantallas de progreso autenticadas sigue abierta en issue #18. La automatización móvil no sustituye la inspección visual de cada pantalla en hardware.

### P1 — Migraciones y recuperación

- Reconciliar archivos de migración con los historiales PROD/DEV y diagnosticar la rama preview `main` fallida.
- Preparar y ensayar backup/restauración antes de cualquier cambio futuro de esquema.

### P2 — Legal y producto

- Completar revisión legal de privacidad, términos y cookies.
- Mantener las descripciones de funciones administrativas alineadas con las capacidades publicadas; no anunciar roles o herramientas inexistentes.

## Regla operativa

No exponer contraseñas, Secret keys, service-role keys ni tokens en Git, navegador, logs o issues. No modificar producción con SQL de escritura sin plan, respaldo, aprobación y rollback. Un CI cancelado o un deploy omitido no se considera publicación.
