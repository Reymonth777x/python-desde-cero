# Estado operativo — 30 de octubre de 2026

> Este documento describe el estado comprobado de `master`, producción y Supabase. Los informes en `docs/informes/` son históricos y no sustituyen esta referencia.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`; rama de producción: `master`.
- HEAD actual de `master`: `71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15` (incluye PR #43, #52, #54, #55 y #57). El CI de ese SHA terminó correctamente en el workflow [41049538535](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049538535).
- Última publicación comprobada: SHA `71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15`, workflow [41049961984](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049961984). El deploy hizo checkout del mismo SHA que `master`, confirmó que el HEAD no avanzó durante el build y pasó las comprobaciones HTTP posteriores.
- El bundle publicado incluye PR #52 (`b3-l9`, matrices y bucles anidados), PR #55 (contador de seis casos del proyecto) y PR #57 (marco didáctico inicial de `b1-l1`–`b1-l3`). La lectura pública confirma el texto introductorio actualizado en `/muestra`; las pantallas de lecciones autenticadas todavía necesitan verificación con cuentas reales.
- El smoke test público confirmó portada nueva, `/muestra`, `/sitemap.xml`, marcador Turnstile en `/login` y respuesta HTTP 308 desde `www.python-desdecero.com` al dominio principal.
- PR #43 está integrado. Se retiró el prototipo de cocina del código activo sin borrar su historial Git; Orilla sigue fuera del alcance de esta versión.

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
- Mejoras pedagógicas ya integradas en `master`: demostración inicial más clara en `b1-l1`–`b1-l3` (PR #57), conversiones y variables en `b2-l4`, operadores bit a bit en `b3-l2`, Bubble Sort guiado en `b3-l7`, matrices y bucles anidados paso a paso en `b3-l9` (PR #52) y contador del proyecto final derivado de los seis casos reales (PR #55).
- Las PR #52, #55 y #57 están fusionadas y publicadas en producción dentro del HEAD `71fa854...`. La verificación de la experiencia autenticada de las lecciones y el progreso con cuentas reales sigue pendiente.
- La revisión integral de las 33 unidades y la ampliación de cobertura para ejercicios con entradas límite siguen pendientes.

## Supabase y seguridad de evaluaciones

- Producción `nuqydanbbgqcofcftshk` y el proyecto separado DEV `fcwbkkivelsipqqrbpya` aparecen `ACTIVE_HEALTHY`.
- Producción tiene 22 migraciones registradas; DEV tiene su propio historial. Las versiones 024–027 existen en ambos, pero con timestamps diferentes. La matriz exacta está en `docs/team/MIGRACIONES.md`.
- Consultas SQL de solo lectura y comparación con `src/lib/course.ts` confirmaron 67 claves activas repartidas en 37 lecciones: módulo 1 = 10, módulo 2 = 13, módulo 3 = 11, módulo 4 = 28 y módulo opcional 5 = 5. Todas las claves activas tienen `correct_option_v2` y coinciden con el catálogo en ambos proyectos. Producción conserva además 43 filas heredadas (`lesson-1`…`lesson-8`) sin v2, fuera del catálogo actual; no borrarlas a ciegas. En 29 de las 67 claves activas, el índice v2 difiere del índice histórico.
- `public.submit_quiz_v2` es `SECURITY INVOKER`: `anon` no tiene permiso de ejecución y `authenticated` sí. El calificador autoritativo vive en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve calificación agregada.
- El trigger `invitations_prevent_used_deletion` está activo. Las invitaciones usadas se conservan como historial; las no usadas pueden eliminarse.
- Existe una rama preview `main` asociada al proyecto de producción con ID `82612040-2379-41e3-8f76-100fadca6a2c`, cuyo estado de rama es `MIGRATIONS_FAILED`; el campo `preview_project_status` devuelve `ACTIVE_HEALTHY`. No es el proyecto DEV separado. No hacer reset, rebase, merge ni borrado de esa rama sin investigar su drift y preparar un plan explícito.
- La divergencia entre los archivos locales y el historial remoto sigue bloqueando un `db push`, `migration repair` o `db reset` a ciegas. No repetir migraciones 024–027.

## Turnstile y autenticación

- La Sitekey pública está disponible en GitHub Actions y el HTML publicado de `/login` incluye el widget Turnstile.
- La comprobación HTTP confirma que el widget se renderiza; no demuestra que una persona completó el desafío ni que Supabase Auth validó la Secret key privada.
- La configuración CAPTCHA dentro de Supabase Auth no se puede leer mediante las herramientas disponibles. La validación real debe completarse con un correo controlado en el dominio publicado.
- El historial de CI no sustituye una prueba integral de registro, confirmación por correo, login, logout y recuperación de contraseña con cuentas reales.

## Bloqueos y próximos pasos

1. Esperar CI verde y publicación del HEAD `4f5cface...`; confirmar en producción que `b3-l9`, los ejemplos introductorios y el texto del proyecto final corresponden a esa versión.
2. Verificar el primer deploy exitoso del HEAD `71fa854` y confirmar en el log que ambas comparaciones SHA del workflow anti-stale pasan; comprobar después el hero `cambio.py`, la muestra, sitemap, Turnstile y `www` 308.
3. Completar pruebas manuales de Auth/Turnstile con un buzón controlado, sin compartir contraseñas ni Secret keys.
4. Probar evaluación, progreso y prerrequisitos con dos estudiantes y un administrador; verificar que una evaluación no aprobada no complete la unidad y que los resultados sobrevivan al cierre de sesión.
5. Activar la protección de contraseñas filtradas en Supabase Auth; el Advisor de Auth la reportó desactivada.
6. Verificar SPF, DKIM, DMARC, plantillas y redirecciones de correo.
7. Probar Pyodide, Worker, Turtle y timeouts en Chrome y Firefox y hacer una pasada en dispositivos móviles físicos. Los E2E emulados no sustituyen esas pruebas.
8. Revisar en español las 33 unidades obligatorias, retirar repeticiones y ampliar prácticas con casos límite.
9. Reconciliar migraciones locales/DEV/producción y resolver de forma controlada la rama preview fallida antes de cualquier operación de esquema.
10. Completar revisión legal de privacidad, términos y cookies.

## Regla operativa

Nunca incluir Secret keys, contraseñas, service-role keys ni tokens privados en el repositorio, navegador, capturas o conversaciones. No alterar la base de producción para resolver discrepancias locales sin evidencia, respaldo y plan de reversión.
