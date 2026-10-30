# Estado operativo — 30 de octubre de 2026

> Fuente de verdad para el equipo. Los informes en `docs/informes/` son históricos; no prueban por sí solos el estado actual de producción.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`; rama de producción: `master`.
- HEAD actual de `master`: `71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15`. Su CI está en curso en [41049538535](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049538535); no declarar este HEAD como publicado hasta que el job `deploy` termine.
- Última versión confirmada en producción: SHA `2940723e3a37a6556770169d0ae692e6bab2d943`, workflow [41048172586](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41048172586). Cloudflare publicó el Worker y verificó el dominio personalizado.
- El CI de ese HEAD publicado terminó correctamente en [41048172812](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41048172812).
- Los intentos de publicación de los HEAD `021f4cc...` (run 41049100683) y `4f5cface...` (run 41049444718) tuvieron un resultado general de workflow `success`, pero el job `deploy` fue `skipped`: su CI upstream había terminado `cancelled`. No cambiaron el Worker en producción.
- PR #54 ya está integrada. El workflow comprueba que el SHA del CI coincide con el HEAD de `master` antes de preparar el build y vuelve a verificarlo justo antes de publicar. Si la rama avanza durante la compilación, la ejecución falla sin publicar un bundle obsoleto.
- La última publicación comprobada sirve la portada actual, `/muestra`, `/sitemap.xml`, el marcador Turnstile en el HTML de `/login` y HTTP 308 desde `www.python-desdecero.com` hacia el dominio principal.
- El producto activo no incluye juegos. El prototipo de cocina fue retirado del árbol activo sin borrar el historial Git; Orilla es una iniciativa futura separada y no forma parte de esta versión.

## Producto y experiencia del alumno

- La portada ofrece `/muestra`, una lección real con conceptos, ejemplo, ejercicio y editor Python, accesible antes del registro.
- El serializador de la muestra es una lista permitida y no entrega preguntas de quiz, claves de respuestas, soluciones, pruebas ocultas ni progreso privado al navegador.
- `/academia` y `/practica` requieren sesión. `/estudiante` solo redirige a `/academia`.
- El modelo actual tiene dos perfiles: estudiante y administrador mediante `profiles.is_admin`. No existe un rol ni un panel docente; `/docente` fue retirado.
- La navegación pública y las rutas canónicas están cubiertas por pruebas de CI y verificaciones HTTP posteriores al despliegue.

## Estado académico de PE1

- El recorrido obligatorio tiene cuatro módulos y 33 unidades: módulo 1 (4), módulo 2 (9), módulo 3 (9) y módulo 4 (11). El módulo 5 tiene 4 unidades de extensión opcional; no se contabiliza como un módulo PE1 obligatorio.
- La evaluación formal del módulo 1 existe en `b1-l4` (seis preguntas). Hello, World! aparece como primera unidad del módulo 2 en `b2-l9`.
- El proyecto final obligatorio es `b4-l10` (gestor de inventario). El catálogo define seis casos automáticos y la actividad incluye revisión conceptual con un mínimo de 75%.
- El examen final PE1 es `b4-l11`, con doce preguntas y mínimo de 75%.
- Los prerrequisitos están controlados en la página de lección y en el calificador privado de Supabase: aprobar la evaluación del módulo anterior antes de avanzar; completar `b4-l8` antes del proyecto; aprobar el proyecto antes del examen final.
- Mejoras pedagógicas ya fusionadas en `master`: demostración inicial guiada en `b1-l1`–`b1-l3` (PR #57), conversiones y variables en `b2-l4`, operadores bit a bit en `b3-l2`, Bubble Sort en `b3-l7`, matrices/bucles anidados paso a paso en `b3-l9` (PR #52) y contador dinámico de pruebas del proyecto final (PR #55).
- Las mejoras #52, #55 y #57 están en el HEAD actual `71fa854...`, pero todavía no en producción: esperan la finalización del CI y el siguiente despliegue satisfactorio.
- La revisión integral de las 33 unidades, la eliminación de repeticiones y la ampliación de prácticas con entradas límite siguen pendientes.

## Supabase y seguridad de evaluaciones

- Producción `nuqydanbbgqcofcftshk` y el proyecto DEV separado `fcwbkkivelsipqqrbpya` aparecen `ACTIVE_HEALTHY`.
- Producción registra 22 migraciones. DEV tiene un historial separado. Las versiones 024–027 están aplicadas en ambos entornos, pero con timestamps distintos; la matriz está en `docs/team/MIGRACIONES.md`.
- Las consultas SQL de solo lectura encontraron 67 claves v2 configuradas: 62 en los cuatro módulos PE1 y 5 en la extensión opcional. No se detectaron claves con `correct_option_v2 IS NULL` en ese catálogo.
- `public.submit_quiz_v2` es `SECURITY INVOKER`; `anon` no puede ejecutarla y `authenticated` sí. El calificador autoritativo permanece en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve una calificación agregada.
- El trigger `invitations_prevent_used_deletion` está activo. Las invitaciones usadas se conservan como historial; las no utilizadas pueden eliminarse.
- Una rama preview `main` del proyecto de producción tiene ID `82612040-2379-41e3-8f76-100fadca6a2c` y estado `MIGRATIONS_FAILED`. No es el proyecto DEV separado. No resetear, rebasar, fusionar ni eliminar esa rama sin investigar su historial y preparar un plan explícito.
- La divergencia entre los archivos locales y el historial remoto sigue bloqueando `db push`, `migration repair` y `db reset` a ciegas. No repetir migraciones 024–027.

## Turnstile y autenticación

- La Sitekey pública está disponible en GitHub Actions y el HTML publicado de `/login` contiene el marcador del widget Turnstile.
- Esto demuestra que el widget se renderiza en el HTML, no que una persona haya completado el desafío interactivo ni que Supabase Auth haya validado la Secret key privada.
- La configuración CAPTCHA de Supabase Auth no se puede leer mediante el conector; la validación real requiere una prueba con un correo controlado en el dominio publicado.
- El estado de despliegue tampoco sustituye pruebas manuales integrales de registro, confirmación, login, logout y recuperación de contraseña.
- El Advisor de Auth reportó desactivada la protección de contraseñas filtradas; queda pendiente activarla.

## Próximas verificaciones

1. Completar el CI de `71fa854...` y confirmar que el job `deploy` se ejecuta y termina correctamente.
2. Verificar en producción que las mejoras de `b1-l1`–`b1-l3`, `b3-l9` y el contador de seis pruebas del proyecto final llegaron al Worker.
3. Completar pruebas de Auth/Turnstile con un buzón controlado, sin compartir contraseñas ni Secret keys.
4. Probar evaluaciones y progreso con dos estudiantes y un administrador; comprobar persistencia al cerrar sesión y que una evaluación no aprobada no complete la unidad.
5. Activar la protección contra contraseñas filtradas en Supabase Auth y verificar SPF, DKIM, DMARC, plantillas y redirecciones de correo.
6. Probar Pyodide, Worker, Turtle y timeouts en Chrome y Firefox y hacer una pasada en móviles físicos. E2E emulados no sustituyen esas pruebas.
7. Revisar en español las 33 unidades obligatorias y ampliar prácticas con casos límite.
8. Reconciliar migraciones y tratar la rama preview fallida sin operaciones destructivas.
9. Completar revisión legal de privacidad, términos y cookies.

## Regla operativa

Nunca incluir Secret keys, contraseñas, service-role keys ni tokens privados en el repositorio, navegador, capturas o conversaciones. No alterar el esquema de producción para resolver discrepancias locales sin evidencia, respaldo y plan de reversión.
