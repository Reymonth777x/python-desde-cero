# Estado operativo — 30 de octubre de 2026

> Este documento describe el estado comprobado de `master`, producción y Supabase. Los informes en `docs/informes/` son históricos y no sustituyen esta referencia.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`; rama de producción: `master`.
- Último release funcional comprobado: `5013d517ed95ad0eb189a5e016dec9ce1faf69ef` (30-10-2026). Incluye las mejoras integradas en PR #77 (pruebas de límites para decisiones y ciclos), #78 (retirada del RPC heredado de evaluación), #80 (`break`/`continue`), #81 (accesibilidad del diálogo móvil de temas) y #82 (comprobación automática de prácticas), además del PR #83 documental.
- CI del release: [41105688936](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41105688936), ambos jobs `success`. Publicación Cloudflare: [41106258018](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41106258018), job `deploy` `success`. Versión del Worker: `37e9619d-770d-4d71-8df7-61bb1ac29c6d`.
- El bundle publicado conserva las mejoras previas de contenido, proyecto, excepciones y fechas de invitación, e incorpora además pruebas de límites de decisión/ciclos, práctica guiada de `break`/`continue`, accesibilidad del diálogo móvil y el verificador de las actividades de código. El verificador ejecuta las soluciones de referencia con sus 52 casos declarados, en procesos y directorios aislados; excluye el examen conceptual final, que no es una práctica de código. Las pantallas autenticadas aún necesitan una comprobación manual con cuentas reales.
- El smoke test del release `5013d51` confirmó `/`, `/muestra`, `/login`, `/sitemap.xml`, el marcador Turnstile, el dominio del Worker y la redirección HTTP 308 de `www.python-desdecero.com` al dominio principal.
- PR #43 está integrado: la navegación presenta Academia y Laboratorio; no anuncia un panel docente no implementado.

## Producto y navegación

- La portada dirige a `/muestra`, una lección real que permite modificar y ejecutar Python sin registrarse. El serializador público excluye preguntas, claves, soluciones, pruebas ocultas y progreso.
- `/academia` y `/practica` requieren sesión. `/estudiante` solo redirige a `/academia`.
- El modelo de autorización actual tiene dos perfiles: estudiante y administrador (`profiles.is_admin`). No existe un rol ni un panel docente; `/docente` fue retirado.
- No hay juegos publicados en el producto activo.

## Estado académico del curso PE1

- El recorrido obligatorio tiene cuatro módulos y 33 unidades: módulo 1 (4), módulo 2 (9), módulo 3 (9) y módulo 4 (11). La extensión opcional del módulo 5 tiene 4 unidades y no se cuenta como un módulo PE1 obligatorio.
- La evaluación formal del módulo 1 existe en `b1-l4` (seis preguntas). La primera unidad del módulo 2 es Hello, World! (`b2-l9`).
- El proyecto final obligatorio es `b4-l10` (gestor de inventario). Incluye seis casos automáticos de ejecución y una revisión conceptual que requiere al menos 75%.
- El examen final PE1 es `b4-l11`, con doce preguntas y mínimo de 75%.
- Los prerrequisitos se comprueban tanto en la navegación del servidor como dentro del calificador privado de Supabase: examen anterior de módulo, evaluación del módulo 3 antes del proyecto, y proyecto aprobado antes del examen final.
- Mejoras pedagógicas ya integradas y publicadas: demostración inicial en `b1-l1`–`b1-l3` (PR #57), variables/conversiones en `b2-l4` (PR #41), operadores y desplazamientos bit a bit en `b3-l2` (PR #48 y #63), Bubble Sort en `b3-l7` (PR #45), matrices y bucles anidados en `b3-l9` (PR #52), contador de pruebas del proyecto (PR #55), saltos de línea en `b3-l6` (PR #65), cobertura de límites para decisiones y ciclos (PR #77) y práctica de `break`/`continue` (PR #80). El PR #82 ejecuta automáticamente las soluciones de código contra los casos declarados.
- Las PR #52, #55, #57, #63, #65 y #66 siguen incluidas en producción. También se publicaron las PR #77, #78, #80, #81 y #82. El PR #81 devuelve el foco al activador al cerrar el diálogo de temas; las pruebas de navegador verifican el diálogo a 320, 360 y 390 px, su contención dentro del viewport, el desplazamiento vertical y el ciclo de foco. Esto no sustituye la pasada manual en un teléfono físico.
- Sigue pendiente la revisión pedagógica integral de las 33 unidades (progresión, claridad, repeticiones y adecuación al nivel). La suite automatizada ya ejecuta las 36 actividades de código contra 52 casos declarados, pero la revisión humana del contenido y la ampliación de casos límite específicos todavía deben completarse.

## Supabase y seguridad de evaluaciones

- Producción `nuqydanbbgqcofcftshk` y el proyecto separado DEV `fcwbkkivelsipqqrbpya` aparecen `ACTIVE_HEALTHY`.
- Producción registra 23 migraciones y DEV 9. Ambos entornos incluyen la migración 028 (`revoke_legacy_quiz_rpc_execution`), con timestamps distintos; las versiones 024–027 también tienen timestamps diferentes entre entornos. La matriz exacta está en `docs/team/MIGRACIONES.md`.
- Consultas SQL de solo lectura y comparación con `src/lib/course.ts` confirmaron 67 claves activas repartidas en 37 lecciones: módulo 1 = 10, módulo 2 = 13, módulo 3 = 11, módulo 4 = 28 y módulo opcional 5 = 5. Todas las claves activas tienen `correct_option_v2` y coinciden con el catálogo en ambos proyectos. Producción conserva además 43 filas heredadas (`lesson-1`…`lesson-8`) sin v2, fuera del catálogo actual; no borrarlas a ciegas. En 29 de las 67 claves activas, el índice v2 difiere del índice histórico.
- `public.submit_quiz_v2` es `SECURITY INVOKER`: `anon` no tiene permiso de ejecución y `authenticated` sí. El calificador autoritativo vive en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve calificación agregada.
- El 30-10-2026 se revocó en producción la ruta heredada `public.submit_quiz` → `private.submit_quiz_authoritative`, que usaba índices legacy y devolvía `answerCorrect`. `authenticated`, `anon`, `service_role` y `PUBLIC` ya no pueden ejecutarla. Se conserva el código/las claves históricos sin borrar filas; el único flujo autorizado de evaluación es v2. La migración 028 está registrada como producción `20261030174256` y DEV `20261030174245`; el verificador está en `scripts/sql/verify-legacy-quiz-rpc-closed.sql`.
- El trigger `invitations_prevent_used_deletion` está activo. Las invitaciones usadas se conservan como historial; las no usadas pueden eliminarse. PR #66 corrige además la conversión de la fecha elegida localmente a un instante UTC explícito.
- Existe una rama preview `main` asociada al proyecto de producción con ID `82612040-2379-41e3-8f76-100fadca6a2c`, cuyo estado de rama es `MIGRATIONS_FAILED`; el campo `preview_project_status` devuelve `ACTIVE_HEALTHY`. No es el proyecto DEV separado. No hacer reset, rebase, merge ni borrado de esa rama sin investigar su drift y preparar un plan explícito.
- La divergencia entre los archivos locales y el historial remoto sigue bloqueando un `db push`, `migration repair` o `db reset` a ciegas. No repetir migraciones 024–027.

## Turnstile y autenticación

- La Sitekey pública está disponible en GitHub Actions y el HTML publicado de `/login` incluye el widget Turnstile.
- La comprobación HTTP confirma que el widget se renderiza; no demuestra que una persona completó el desafío ni que Supabase Auth validó la Secret key privada.
- La configuración CAPTCHA dentro de Supabase Auth no se puede leer mediante las herramientas disponibles. La validación real debe completarse con un correo controlado en el dominio publicado.
- Los logs recientes de producción mostraron dos respuestas `over_email_send_rate_limit` (429). Esto confirma que el servicio de envío alcanzó su límite, pero no identifica por sí solo qué proveedor SMTP está configurado. Verificar el proveedor; si aún se usa el SMTP integrado por defecto, configurar SMTP propio antes de abrir el registro al público.
- El historial de CI no sustituye una prueba integral de registro, confirmación por correo, login, logout y recuperación de contraseña con cuentas reales.
- La organización Supabase está en plan Free. El Advisor de producción reporta `auth_leaked_password_protection` desactivado; Supabase documenta que esta función requiere Pro o superior. No se puede habilitar mediante SQL y no debe figurar como una corrección disponible en el plan actual. DEV no presenta avisos de seguridad.

## Riesgos de repositorio y gobierno

- El repositorio sigue siendo público y el código versionado contiene respuestas, explicaciones y soluciones de ejercicios. No es una filtración de credenciales, pero expone material evaluativo. La decisión de privatizarlo o mantener una copia pública saneada sigue abierta en el issue #21; no cambiar visibilidad ni reescribir historial sin decisión del propietario.
- `master` sigue sin branch protection (`protected: false`). La integración de GitHub devuelve 403 al administrar esa configuración; el propietario debe activarla desde Settings → Branches. Seguimiento: issue #23.

## Bloqueos y próximos pasos

1. Con una sesión autenticada, verificar que las lecciones `b3-l6`, `b3-l9` y `b4-l10` cargan la versión publicada, que los ejemplos y las seis pruebas del proyecto se ejecutan y que los prerrequisitos se respetan.
2. Completar pruebas manuales de Auth/Turnstile con un buzón controlado, incluyendo registro, confirmación, login, logout y recuperación de contraseña, sin compartir contraseñas ni Secret keys.
3. Probar evaluaciones y progreso con dos estudiantes y un administrador; comprobar que un intento no aprobado no completa la unidad y que la mejor nota persiste después del cierre de sesión.
4. Protección de contraseñas filtradas: el Advisor la reporta desactivada, pero la organización está en plan Free y Supabase exige Pro o superior. No es una tarea ejecutable con el plan actual; mantener longitud mínima de ocho caracteres y reevaluar solo si se decide actualizar.
5. Verificar SPF, DKIM, DMARC, plantillas y redirecciones de correo.
6. Probar Pyodide, Worker, Turtle y timeouts en Chrome y Firefox y hacer una pasada en móviles físicos. Los E2E emulados no sustituyen estas pruebas.
7. Revisar en español las 33 unidades obligatorias, retirar repeticiones y ampliar prácticas con casos límite.
8. Reconciliar migraciones locales/DEV/producción y resolver de forma controlada la rama preview fallida antes de cualquier operación de esquema.
9. Completar revisión legal de privacidad, términos y cookies.

## Regla operativa

Nunca incluir Secret keys, contraseñas, service-role keys ni tokens privados en el repositorio, navegador, capturas o conversaciones. No alterar la base de producción para resolver discrepancias locales sin evidencia, respaldo y plan de reversión.
