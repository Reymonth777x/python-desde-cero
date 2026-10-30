# Estado operativo — 30 de octubre de 2026

> Este documento describe el estado comprobado de `master`, producción y Supabase. Los informes en `docs/informes/` son históricos y no sustituyen esta referencia.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`; rama de producción: `master`.
- HEAD actual de `master`: `021f4cc006c417a3ad648134796529e9f34fa31b` (incluye PR #52 y #55). Su CI está en curso en el workflow [41049003539](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049003539); todavía no declarar esta revisión como publicada.
- Última publicación comprobada: SHA `2940723e3a37a6556770169d0ae692e6bab2d943`, workflow [41048172586](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41048172586). Cloudflare confirmó Worker y dominio personalizado `python-desdecero.com`.
- El CI completo de ese último HEAD publicado terminó correctamente en el workflow [41048172812](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41048172812).
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
- Mejoras pedagógicas ya integradas: conversión y variables en `b2-l4`, operadores bit a bit en `b3-l2`, recorrido guiado de Bubble Sort en `b3-l7` y demostración completa del ordenamiento.
- PR #52 (recorrido guiado de matrices y bucles anidados de `b3-l9`) y PR #55 (contador dinámico de pruebas del proyecto final) ya están integrados en `master`. Ambos cambios están incluidos en el HEAD `021f4cc...`, pero siguen pendientes el CI y el despliegue de ese nuevo HEAD.
- La revisión integral de las 33 unidades y la ampliación de cobertura para ejercicios con entradas límite siguen pendientes.

## Supabase y seguridad de evaluaciones

- Producción `nuqydanbbgqcofcftshk` y el proyecto separado DEV `fcwbkkivelsipqqrbpya` aparecen `ACTIVE_HEALTHY`.
- Producción tiene 22 migraciones registradas; DEV tiene su propio historial. Las versiones 024–027 existen en ambos, pero con timestamps diferentes. La matriz exacta está en `docs/team/MIGRACIONES.md`.
- Consultas SQL de solo lectura confirmaron 67 claves con `correct_option_v2` configurado: 62 distribuidas en los cuatro módulos PE1 y 5 en la extensión opcional; no hay claves v2 faltantes en ese conjunto.
- `public.submit_quiz_v2` es `SECURITY INVOKER`: `anon` no tiene permiso de ejecución y `authenticated` sí. El calificador autoritativo vive en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve calificación agregada.
- El trigger `invitations_prevent_used_deletion` está activo. Las invitaciones usadas se conservan como historial; las no usadas pueden eliminarse.
- Existe una rama preview `main` asociada al proyecto de producción con ID `82612040-2379-41e3-8f76-100fadca6a2c` y estado `MIGRATIONS_FAILED`. No es el proyecto DEV separado. No hacer reset, rebase, merge ni borrado de esa rama sin investigar su drift y preparar un plan explícito.
- La divergencia entre los archivos locales y el historial remoto sigue bloqueando un `db push`, `migration repair` o `db reset` a ciegas. No repetir migraciones 024–027.

## Turnstile y autenticación

- La Sitekey pública está disponible en GitHub Actions y el HTML publicado de `/login` incluye el widget Turnstile.
- La comprobación HTTP confirma que el widget se renderiza; no demuestra que una persona completó el desafío ni que Supabase Auth validó la Secret key privada.
- La configuración CAPTCHA dentro de Supabase Auth no se puede leer mediante las herramientas disponibles. La validación real debe completarse con un correo controlado en el dominio publicado.
- El historial de CI no sustituye una prueba integral de registro, confirmación por correo, login, logout y recuperación de contraseña con cuentas reales.

## Bloqueos y próximos pasos

1. Esperar CI verde y la publicación del HEAD `021f4cc...`; comprobar en producción que el texto del proyecto final informa seis pruebas y que `b3-l9` presenta el nuevo ejemplo paso a paso.
2. Revisar PR #54: añade una comparación del SHA del CI aprobado con el HEAD actual de `master`, para evitar que un workflow atrasado revierta la publicación. No integrarlo hasta CI verde.
3. Revisar PR #57 (sintaxis guiada de la primera lección) y corregir cualquier fallo de pruebas antes de integrarla.
4. Completar pruebas manuales de Auth/Turnstile con un buzón controlado, sin compartir contraseñas ni Secret keys.
5. Probar evaluación, progreso y prerrequisitos con dos estudiantes y un administrador; verificar que una evaluación no aprobada no complete la unidad y que los resultados sobrevivan al cierre de sesión.
6. Activar la protección de contraseñas filtradas en Supabase Auth; el Advisor de Auth la reportó desactivada.
7. Verificar SPF, DKIM, DMARC, plantillas y redirecciones de correo.
8. Probar Pyodide, Worker, Turtle y timeouts en Chrome y Firefox y hacer una pasada en dispositivos móviles físicos. Los E2E emulados no sustituyen esas pruebas.
9. Revisar en español las 33 unidades obligatorias, retirar repeticiones y ampliar prácticas con casos límite.
10. Reconciliar migraciones locales/DEV/producción y resolver de forma controlada la rama preview fallida antes de cualquier operación de esquema.
11. Completar revisión legal de privacidad, términos y cookies.

## Regla operativa

Nunca incluir Secret keys, contraseñas, service-role keys ni tokens privados en el repositorio, navegador, capturas o conversaciones. No alterar la base de producción para resolver discrepancias locales sin evidencia, respaldo y plan de reversión.
