# Estado operativo — 30 de octubre de 2026

> Este documento describe el estado comprobado de `master`, producción y Supabase. Los informes en `docs/informes/` son históricos y no sustituyen esta referencia.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`; rama de producción: `master`.
- Última publicación comprobada: HEAD de `master` `f95231db81c6222263a698523f205e8fa7e3d23d` (30-10-2026). La CI [41140127258](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41140127258) y el despliegue Cloudflare [41140504102](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41140504102) terminaron en `success`. El último cambio de runtime de la aplicación sigue siendo `d072f962d96a9e3deb1d5d2a7a4a8a83ebec4e21`; la publicación `f95231d` actualizó exclusivamente workflows y documentación operativa.
- Cloudflare Worker principal Version ID actual: `f67a7cca-49b3-4f11-ab4c-586ec970286e`.
- PR #91 integró el ejecutor Python de origen separado. Su Worker actual es `https://python-desdecero-runner.pythondesdecero.workers.dev`, versión `e2235f5c-dfe5-4dd1-a529-e34aa607db70`.
- La release actual se validó con 24 archivos Vitest, 168 pruebas Playwright, TypeScript, ESLint, build Next, build Vinext y `npm audit` (0 vulnerabilidades).
- El workflow de publicación comprobó el mismo SHA de `master` antes de desplegar, verificó el origen y CSP del runner, y confirmó que `python-desdecero.com` continúa conectado al Worker principal. El smoke test de producción confirmó portada, `/muestra`, `/login` con widget Turnstile, sitemap y redirección `www` HTTP 308.
- La CI verificó **62 casos de 36 actividades de código**, **24 archivos de pruebas Vitest** y **168 pruebas Playwright E2E**. TypeScript, ESLint, build Next, build Vinext y `npm audit` finalizaron correctamente; la auditoría de dependencias encontró **0 vulnerabilidades**. Las pruebas E2E cubren el runner de origen distinto en CI; el despliegue comprobó los assets y CSP del runner real. Sigue pendiente una ejecución interactiva manual del runner desde un navegador real y una pasada en teléfonos físicos.
- PR #84 conserva el acceso de estudiantes con progreso histórico, sin inventar calificaciones ni completar evaluaciones.
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
- Sigue pendiente la revisión pedagógica integral de las 33 unidades (progresión, claridad, repeticiones y adecuación al nivel). La suite automatizada ejecuta 36 actividades de código contra 62 casos, pero la revisión humana del contenido sigue siendo necesaria.

## Supabase y seguridad de evaluaciones

- Producción `nuqydanbbgqcofcftshk` y el proyecto separado DEV `fcwbkkivelsipqqrbpya` aparecen `ACTIVE_HEALTHY`.
- Producción registra 24 migraciones y DEV 10. La migración `revoke_legacy_quiz_rpc_execution` se registró en producción `20261030174256` y DEV `20261030174245`; la migración 028 `grandfather_existing_module_progress` se registró en producción `20261030183117` y DEV `20261030183123`. La matriz exacta está en `docs/team/MIGRACIONES.md`.
- Consultas SQL de solo lectura y comparación con `src/lib/course.ts` confirmaron 67 claves activas repartidas en 37 lecciones: módulo 1 = 10, módulo 2 = 13, módulo 3 = 11, módulo 4 = 28 y módulo opcional 5 = 5. Todas las claves activas tienen `correct_option_v2` y coinciden con el catálogo en ambos proyectos. Producción conserva además 43 filas heredadas (`lesson-1`…`lesson-8`) sin v2, fuera del catálogo actual; no borrarlas a ciegas. En 29 de las 67 claves activas, el índice v2 difiere del índice histórico.
- `public.submit_quiz_v2` es `SECURITY INVOKER`: `anon` no tiene permiso de ejecución y `authenticated` sí. El calificador autoritativo vive en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve calificación agregada.
- El 30-10-2026 se revocó en producción la ruta heredada `public.submit_quiz` → `private.submit_quiz_authoritative`, que usaba índices legacy y devolvía `answerCorrect`. `authenticated`, `anon`, `service_role` y `PUBLIC` ya no pueden ejecutarla. La migración quedó registrada como producción `20261030174256` y DEV `20261030174245`; verificador: `scripts/sql/verify-legacy-quiz-rpc-closed.sql`.
- La migración 028 `grandfather_existing_module_progress` está aplicada en PROD (`20261030183117`) y DEV (`20261030183123`). Permite reanudar módulos con progreso ya persistido sin inventar notas ni marcar unidades como completadas. Se verificaron en ambas funciones las excepciones `existing_module_progress`, `existing_project_progress` y `existing_exam_progress`.
- La consulta agregada de producción había detectado dos cuentas con progreso previo en módulo 2 sin `b1-l4` completada. No se exponen IDs y la migración no ejecuta DML sobre `progress` ni `quiz_attempts`; la interfaz equivalente quedó publicada mediante PR #84.
- El trigger `invitations_prevent_used_deletion` está activo. Las invitaciones usadas se conservan como historial; las no usadas pueden eliminarse. PR #66 corrige además la conversión de la fecha elegida localmente a un instante UTC explícito.
- Existe una rama preview `main` asociada al proyecto de producción con ID `82612040-2379-41e3-8f76-100fadca6a2c`, cuyo estado de rama es `MIGRATIONS_FAILED`; el campo `preview_project_status` devuelve `ACTIVE_HEALTHY`. No es el proyecto DEV separado. No hacer reset, rebase, merge ni borrado de esa rama sin investigar su drift y preparar un plan explícito.
- La divergencia entre los archivos locales y el historial remoto sigue bloqueando un `db push`, `migration repair` o `db reset` a ciegas. No repetir migraciones 024–027.

## Turnstile y autenticación

- La Sitekey pública de producción está configurada en GitHub Actions y el HTML publicado de `/login` incluye el widget Turnstile. El smoke test confirma que se renderiza; no demuestra que el desafío humano se haya completado o que Supabase Auth haya validado un token real.
- El estado de CAPTCHA protection y la Secret key privada de Supabase Auth no se pueden consultar mediante la conexión disponible. No se debe compartir ni añadir esa clave a Git, al navegador o a este documento.
- El propietario mostró el panel de Brevo el 30-10-2026: `python-desdecero.com` aparece **Autentificado**, **Con marca**, con subdominio de marca `em`. En Cloudflare hay dos CNAME DKIM, tres CNAME de marca, el TXT de verificación de Brevo y DMARC `p=none`. No modificar estos registros. No se detectó SPF TXT en el apex durante la consulta pública; no añadir otro SPF ni tocar otros proveedores sin revisar el hostname exacto.
- El propietario confirmó que generó una clave SMTP Standard. La vista general de Brevo aportada muestra 4 correos transaccionales enviados en los últimos 7 días, 100 % entregados, 0 % hard bounce y 0 % bloqueados. Es una estadística agregada que no identifica el flujo Auth correspondiente ni verifica un remitente individual.
- La conexión de Supabase disponible no revela el host/login guardado en Authentication → SMTP Settings. No se regenera ni sustituye la clave SMTP a ciegas.
- En PROD, GoTrue registró a las 21:12:07 UTC el cambio de `GOTRUE_RATE_LIMIT_EMAIL_SENT` de `2/1h` a `30`. En la ventana revisada se agruparon 4 solicitudes de recuperación HTTP 200, 3 eventos de registro HTTP 303, 4 solicitudes de recuperación HTTP 429 y 2 confirmaciones HTTP 429. Un rechazo especificó un cooldown de 17 segundos. HTTP 200/303 confirma que Auth aceptó/procesó solicitudes, no que el servidor receptor haya entregado el correo. DEV no mostró eventos coincidentes en esa ventana.
- Para cerrar esta parte falta correlacionar con un buzón externo controlado: registro + confirmación + inicio de sesión, y recuperación + cambio de contraseña. Revisar después los registros individuales de Brevo y los encabezados SPF/DKIM/DMARC. El estado detallado está en `docs/team/BREVO-SMTP.md` y `docs/team/TURNSTILE.md`.
- La organización Supabase está en plan Free. El Advisor de producción reporta `auth_leaked_password_protection` desactivado; Supabase requiere Pro o superior para habilitarlo. No puede corregirse mediante SQL en el plan actual; conservar la longitud mínima de contraseña configurada y reevaluar solo si se aprueba un cambio de plan.

## Riesgos de repositorio y gobierno

- El repositorio sigue siendo público y el código versionado contiene respuestas, explicaciones y soluciones de ejercicios. No es una filtración de credenciales, pero expone material evaluativo. La decisión de privatizarlo o mantener una copia pública saneada sigue abierta en el issue #21; no cambiar visibilidad ni reescribir historial sin decisión del propietario.
- `master` sigue sin branch protection (`protected: false`). La integración de GitHub devuelve 403 al administrar esa configuración; el propietario debe activarla desde Settings → Branches. Seguimiento: issue #23.

## Bloqueos y próximos pasos

1. Con una sesión autenticada, verificar que las lecciones `b3-l6`, `b3-l9` y `b4-l10` cargan la versión publicada, que los ejemplos y las seis pruebas del proyecto se ejecutan y que los prerrequisitos se respetan.
2. Completar pruebas manuales de Auth/Turnstile con un buzón controlado, incluyendo registro, confirmación, login, logout y recuperación de contraseña, sin compartir contraseñas ni Secret keys.
3. Probar evaluaciones y progreso con dos estudiantes y un administrador; comprobar que un intento no aprobado no completa la unidad y que la mejor nota persiste después del cierre de sesión.
4. Protección de contraseñas filtradas: el Advisor la reporta desactivada, pero la organización está en plan Free y Supabase exige Pro o superior. No es una tarea ejecutable con el plan actual; mantener longitud mínima de ocho caracteres y reevaluar solo si se decide actualizar.
5. Confirmar en Supabase Auth que SMTP personalizado está guardado en DEV y PROD con el remitente verificado y luego ejecutar los flujos de registro/confirmación y recuperación/cambio de contraseña con un buzón controlado. Correlacionar los resultados con los registros transaccionales de Brevo; no volver a modificar DNS salvo que el panel identifique un registro faltante concreto.
6. Probar Pyodide, Worker, Turtle y timeouts en Chrome y Firefox y hacer una pasada en móviles físicos. Los E2E emulados no sustituyen estas pruebas.
7. Revisar en español las 33 unidades obligatorias, retirar repeticiones y ampliar prácticas con casos límite.
8. Reconciliar migraciones locales/DEV/producción y resolver de forma controlada la rama preview fallida antes de cualquier operación de esquema.
9. Completar revisión legal de privacidad, términos y cookies.

## Regla operativa

Nunca incluir Secret keys, contraseñas, service-role keys ni tokens privados en el repositorio, navegador, capturas o conversaciones. No alterar la base de producción para resolver discrepancias locales sin evidencia, respaldo y plan de reversión.
