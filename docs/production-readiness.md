# Preparación para producción — 30 de octubre de 2026

**Última publicación confirmada antes de PR #84:** `5013d517ed95ad0eb189a5e016dec9ce1faf69ef`  
**CI:** [41105688936](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41105688936) — success  
**Despliegue:** [41106258018](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41106258018) — success  
**Cloudflare Worker Version ID:** `37e9619d-770d-4d71-8df7-61bb1ac29c6d`  
**Cambio siguiente:** PR #84 está fusionado en `04604585d899173439f73c8a9d1975451e771200`; su CI de PR pasó, y el despliegue de ese SHA queda pendiente de verificación.  
**Alcance:** GitHub, dominio público, Cloudflare Workers y dos proyectos Supabase. Se aplicó la función de acceso histórico en PROD/DEV sin modificar filas de alumnos.

## Dictamen

**Publicado y comprobado técnicamente; todavía no aprobado como lanzamiento educativo completo.**

El release `5013d51` pasó CI completo y despliegue Cloudflare. El smoke test confirmó `/`, `/muestra`, `/login`, sitemap, marcador Turnstile, conexión del dominio al Worker y redirección `www` al dominio canónico. PR #84 incorpora después la corrección de acceso histórico; aunque su CI de PR pasó, no se debe considerar publicado hasta verificar el CI y despliegue del nuevo SHA de `master`. Esto no sustituye pruebas reales del recorrido autenticado, correo, Turnstile interactivo ni hardware móvil.

## Sitio y capacidades publicadas

- Portada: [python-desdecero.com](https://python-desdecero.com/); muestra pública: [python-desdecero.com/muestra](https://python-desdecero.com/muestra).
- La portada presenta cuatro módulos y 33 unidades obligatorias; la extensión del módulo 5 contiene cuatro actividades opcionales.
- `/muestra` permite leer y ejecutar la primera lección sin cuenta. El serializador excluye preguntas, respuestas, soluciones, pruebas ocultas y progreso.
- `/academia` y `/practica` requieren sesión. El modelo de autorización distingue estudiante y administrador; no hay panel docente.
- El panel administrativo ofrece gestión de invitaciones; administración de usuarios y auditoría no están disponibles en esta versión.
- PR #54 protege los despliegues frente a workflows obsoletos verificando el SHA antes y después de compilar. El despliegue del 30-10-2026 omitió ejecuciones obsoletas y publicó finalmente el HEAD actual.
- PR #82 ejecuta las soluciones de referencia de todas las actividades de código con 62 casos declarados en procesos Python aislados; el examen conceptual final se excluye porque no requiere código adicional.
- PR #81 recupera el foco al activar el cierre del selector móvil. La suite Playwright comprueba el diálogo a 320, 360 y 390 px, su encaje en pantalla, el scroll interno y el foco de teclado. Aún falta validar en un teléfono físico.
- El smoke test externo leyó `/`, `/muestra`, `/login`, `/sitemap.xml` y `www`. El workflow también comprobó el marcador Turnstile y el redirect HTTP 308.

## Curso y correcciones recientes

- Curso obligatorio: 4 módulos y 33 unidades (4 + 9 + 9 + 11). Extensión opcional: 4 actividades.
- Evaluación M1: `b1-l4`, seis preguntas. Hello World M2: `b2-l9` (sección 2.1). Proyecto obligatorio: `b4-l10`, seis pruebas automáticas y evaluación conceptual. Examen final: `b4-l11`, doce preguntas y umbral 75%.
- Mejoras publicadas: variables/conversiones `b2-l4`; operadores y desplazamientos `b3-l2`; Bubble Sort `b3-l7`; matrices y bucles anidados `b3-l9`; listas `b3-l6` con saltos de línea reales; excepciones `b4-l7` con `KeyError`, `ValueError`, `else` y `finally`; y explicación introductoria `b1-l1`–`b1-l3`.
- Las fechas opcionales de invitación se interpretan según el reloj local del administrador, se convierten a un instante UTC en el navegador y se validan en el servidor; la tabla las muestra en hora local. La corrección no alteró el esquema.
- Pendiente: revisión integral de las 33 unidades, ejemplos/salidas/casos límite y verificación autenticada de todas las pantallas educativas.

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

El historial remoto de producción registra 23 migraciones y DEV registra 9. La migración 028 (`revoke_legacy_quiz_rpc_execution`) está aplicada en ambos entornos con timestamps distintos. Las versiones locales 001–003 y 016–017, además de varios timestamps 024–027, siguen difiriendo del historial remoto. La rama preview `main` del proyecto de producción tiene `MIGRATIONS_FAILED` (la base preview indica `ACTIVE_HEALTHY`), y no es el proyecto DEV separado. No ejecutar `db push`, `migration repair`, `db reset`, ni resetear/rebasar/borrar esa rama sin investigar el drift y preparar backup/rollback.

Producción y DEV usan PostgreSQL 17.11.0.003 y `pgcrypto` 1.3. El Advisor de seguridad de producción reporta Leaked Password Protection desactivado. La organización está en plan Free y la documentación oficial de Supabase indica que la función requiere Pro o superior; no está disponible para activar en el plan actual. Mantener los requisitos básicos de contraseña y reevaluar si se decide actualizar. Dos índices de invitaciones muestran uso no observado (INFO); no cambiarlos sin medir.

## Bloqueos antes del lanzamiento educativo

### P0 — Gobierno y exposición del material evaluativo

- El repositorio es público y el historial de `src/lib/course.ts` contiene respuestas, explicaciones y soluciones; `server-only` evita el bundle cliente, pero no impide leer el código desde GitHub.
- Issue [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21): decidir entre privatizar el repositorio o mantener una copia pública saneada. No cambiar visibilidad ni reescribir historial sin aprobación del propietario.
- Issue [#23](https://github.com/Reymonth777x/python-desde-cero/issues/23): `master` continúa sin branch protection (`protected: false`). La integración de GitHub devuelve 403 para administrar esa configuración; el propietario debe activar PR obligatorio, una aprobación, conversaciones resueltas y checks requeridos.

### P1 — Auth, Turnstile y correo

- `/login` incluye el widget Turnstile en HTML; eso no demuestra que el desafío interactivo se complete ni que Supabase Auth valide el token/Secret key.
- Probar con buzón controlado registro, confirmación, login, logout y recuperación/cambio de contraseña en el dominio final.
- Probar con dos cuentas de estudiante aislamiento de datos, guardado/restauración de progreso, notas y prerrequisitos del calificador.
- Leaked Password Protection no se puede habilitar en el plan Free; requiere Pro o superior. No considerarla una acción inmediata sin decisión de actualización.
- Los logs de producción registraron dos respuestas `over_email_send_rate_limit` (429). La configuración del proveedor SMTP no pudo verificarse por herramientas de solo lectura. Confirmar el proveedor en Auth → SMTP; si se usa el SMTP integrado por defecto, configurar SMTP propio y después verificar SPF, DKIM, DMARC, plantillas y URLs de redirección.

### P1 — Dispositivo y laboratorio

- Playwright cubre Chromium y emulación móvil; la paleta tiene pruebas de viewport. Falta una pasada en teléfono físico: tema, Monaco, teclado táctil, scroll, salida y navegación.
- Probar Pyodide/Worker, Turtle, `input()`, programas largos, errores y timeout/reinicio en Chrome y Firefox.

### P1 — Migraciones y recuperación

- Reconciliar archivos de migración con los historiales PROD/DEV y diagnosticar la rama preview `main` fallida.
- Preparar y ensayar backup/restauración antes de cualquier cambio futuro de esquema.

### P2 — Legal y producto

- Completar revisión legal de privacidad, términos y cookies.
- Mantener las descripciones de funciones administrativas alineadas con las capacidades publicadas; no anunciar roles o herramientas inexistentes.

## Regla operativa

No exponer contraseñas, Secret keys, service-role keys ni tokens en Git, navegador, logs o issues. No modificar producción con SQL de escritura sin plan, respaldo, aprobación y rollback. Un CI cancelado o un deploy omitido no se considera publicación.
