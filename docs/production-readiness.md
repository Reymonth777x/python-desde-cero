# Preparación para producción — 30 de octubre de 2026

**Última comprobación:** 30 de octubre de 2026, 11:45 UTC  
**HEAD de master:** 71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15  
**CI:** [41049538535](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049538535) — success  
**Despliegue:** [41049961984](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049961984) — success, job deploy ejecutado
**Alcance:** GitHub, dominio público, Cloudflare Workers y dos proyectos Supabase. Las consultas de base de datos fueron de solo lectura; no se ejecutaron migraciones ni escrituras de datos.

## Dictamen

**Publicado y verificado técnicamente, pero todavía no aprobado como lanzamiento educativo completo.**

La versión 71fa854 está publicada. El flujo de CI pasó pruebas, TypeScript, ESLint, build, Playwright y compilación Vinext. El despliegue revalidó que master no avanzó durante el build, publicó el Worker y comprobó el dominio personalizado y la versión nueva.

Todavía faltan pruebas integrales con cuentas reales de Auth, desafío Turnstile interactivo, dos estudiantes con aislamiento de progreso, prueba física en móviles, decisión de seguridad sobre el repositorio público y revisión legal.

## Evidencia de producción

- Sitio: [python-desdecero.com](https://python-desdecero.com/).
- PR #43 integró portada, navegación y rutas; las rutas activas corresponden a Academia y Laboratorio, con /muestra pública.
- La portada informa cuatro módulos y 33 unidades obligatorias, más cuatro actividades opcionales de extensión.
- /muestra sirve la lección real 1.1, incluye la explicación guiada de nombres de datos y print(), y no expone preguntas, respuestas, soluciones, pruebas ocultas ni progreso.
- La inspección externa leyó /, /muestra y /sitemap.xml; el sitemap contiene cinco URLs. La petición a www.python-desdecero.com termina en el dominio canónico apex.
- El workflow de despliegue comprueba el marcador Turnstile en /login y la redirección HTTP 308 de www; eso prueba el renderizado/encaminamiento, no que el desafío interactivo haya sido completado.
- PR #54 integró una guarda anti-despliegue obsoleto: compara el SHA del evento con master antes de compilar y vuelve a comprobar el HEAD antes de publicar.

## Curso y calidad pedagógica

- Cuatro módulos obligatorios, 33 unidades: 4 + 9 + 9 + 11.
- Módulo 5: cuatro actividades opcionales, fuera del núcleo PE1.
- Evaluación M1: b1-l4 (seis preguntas); primera unidad M2: Hello, World! (b2-l9).
- Proyecto final obligatorio: b4-l10, seis pruebas automáticas y revisión conceptual.
- Examen final: b4-l11, doce preguntas, mínimo 75%.
- Mejoras ya publicadas: variables y conversiones (b2-l4), operadores bit a bit (b3-l2), Bubble Sort guiado (b3-l7), matrices/bucles anidados (b3-l9), contador real de pruebas del proyecto y aclaración de la demostración introductoria (b1-l1–b1-l3).
- Sigue pendiente una revisión integral del contenido, variación de contextos de evaluación y ampliación de pruebas límite.

## Supabase: producción y DEV

| Comprobación | Producción | DEV |
|---|---|---|
| Proyecto | nuqydanbbgqcofcftshk | fcwbkkivelsipqqrbpya |
| Estado | ACTIVE_HEALTHY | ACTIVE_HEALTHY |
| Región | us-west-2 | us-west-1 |
| PostgreSQL | 17.11.0.003 | 17.11.0.003 |
| Claves v2 del catálogo actual | 67/67 | 67/67 |
| Filas vigentes sin clave v2 | 0 | 0 |
| Filas heredadas fuera del catálogo | 43 | 0 |

La tabla de producción conserva 43 filas antiguas con IDs del esquema previo lesson-* y correct_option_v2 NULL. No coinciden con ninguna de las 67 tuplas actuales del catálogo. Se mantienen sin cambios hasta una reconciliación explícita; no deben confundirse con claves faltantes.

El historial remoto de producción registra 22 migraciones. Las versiones locales 001–003, 016–017 y algunas variantes posteriores no coinciden con el historial remoto. Las migraciones 024–027 están aplicadas tanto en producción como en DEV, pero con timestamps diferentes. No ejecutar db push, migration repair ni db reset hasta reconciliar los archivos e historiales y preparar respaldo/rollback.

La rama preview main del proyecto de producción tiene status = MIGRATIONS_FAILED y with_data = false; su preview_project_status aparece ACTIVE_HEALTHY. No es el proyecto DEV separado. Investigar el drift antes de resetear, rebasar, fusionar o eliminar esa rama.

La función pública submit_quiz_v2 es SECURITY INVOKER; anon no tiene permiso EXECUTE y authenticated sí. El calificador autoritativo vive en el esquema privado como SECURITY DEFINER, valida auth.uid() y devuelve calificación agregada.

## Riesgos y bloqueos antes del lanzamiento educativo

### P0 — Integridad del contenido y gobierno del repositorio

- El repositorio es público y su historial de código contiene material evaluativo: respuestas, explicaciones y soluciones. No es una filtración de credenciales, pero expone las claves a quien consulte GitHub.
- El issue #21 requiere decidir entre privatizar el repositorio o mantener una copia pública saneada. No cambiar visibilidad ni reescribir historial sin aprobación expresa.
- master sigue sin branch protection. El issue #23 requiere PR obligatorio, al menos una revisión y checks test-and-build y powershell-launcher. La integración de GitHub devuelve 403 al intentar administrar esa configuración.

### P1 — Auth, correo y abuso

- El HTML de /login incluye el widget Turnstile; no se ha demostrado aún una resolución humana del desafío ni validación real del token/Secret key en Supabase Auth.
- Completar registro, confirmación de correo, login, logout y recuperación/cambio de contraseña con un buzón controlado.
- Probar aislamiento de dos estudiantes, guardado/restauración de progreso y prerrequisitos de evaluaciones con cuentas reales de DEV.
- Supabase Security Advisor reporta Leaked Password Protection Disabled en producción; debe habilitarse desde Auth.
- Verificar SMTP, SPF, DKIM, DMARC, plantillas y URLs de redirección.

### P1 — Dispositivo y funcionamiento

- Playwright cubre Chromium y emulación móvil; la paleta de temas se prueba a 320, 360 y 390 px.
- Falta probar en teléfono físico: selector de temas, Monaco/editor, teclado táctil, scroll hasta la salida y navegación.
- Probar Pyodide/Worker, Turtle, input(), programas largos, errores y timeout/reinicio en Chrome y Firefox.

### P1 — Base de datos y recuperación

- Reconciliar migraciones locales y remotas y diagnosticar la rama preview fallida.
- Preparar y ensayar backups/restauración antes de futuras migraciones.
- Los dos índices no utilizados sobre invitaciones son alertas INFO; no eliminarlos sin medir la carga.
- pgcrypto 1.3 está instalada en ambos proyectos con PostgreSQL 17.11. Revisar la nota de release de Supabase para esta versión antes de cualquier operación relacionada con datos cifrados.

### P2 — Cumplimiento y producto

- Completar revisión legal de privacidad, términos y cookies.
- Mantener copy comercial y de administración alineado con las funciones realmente implementadas.
- No presentar la evaluación formativa del proyecto como certificación externa ni anunciar un panel docente inexistente.

## Reglas operativas

- No exponer secretos, service-role keys, contraseñas ni tokens en Git, navegador, logs o issues.
- No modificar producción con SQL de escritura sin plan, respaldo, aprobación y rollback.
- Cualquier CI cancelado o job de deploy omitido no cuenta como una publicación.
- La última versión publicada debe determinarse por un workflow con job deploy = success y comprobaciones posteriores, no solo por el HEAD de GitHub.
