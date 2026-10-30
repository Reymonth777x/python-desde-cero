# Estado operativo — 30 de octubre de 2026

> Este documento describe el estado comprobado de `master`, producción y Supabase. Los informes en `docs/informes/` son históricos y no sustituyen esta referencia.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`; rama de producción: `master`.
- HEAD actual de master: **71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15**. Incluye PR #41, #45, #48, #52, #54, #55 y #57. El CI completo terminó correctamente en [41049538535](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049538535).
- Última publicación comprobada: SHA **71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15**, workflow [41049961984](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049961984), finalizado con CI y job deploy en success.
- El CI completo del HEAD publicado 71fa854 terminó correctamente en [41049538535](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049538535). El despliegue [41049961984](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049961984) completó la compilación Vinext, confirmó que master no avanzó durante el build, publicó el Worker y verificó el dominio y la versión nueva.
- La inspección externa posterior al despliegue confirmó la portada, `/muestra`, el sitemap de cinco URLs y que `www.python-desdecero.com` termina en el dominio canónico. El workflow verificó el marcador Turnstile y HTTP 308.
- PR #43 está integrado: la navegación activa refleja las rutas implementadas y no presenta un panel docente inexistente.

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
- Las PR #52, #55 y #57 están integradas y publicadas en 71fa854. La página `/muestra` pública presenta la explicación guiada de `b1-l1`, que remite la enseñanza formal de `print()` a la lección 2.1.
- La revisión integral de las 33 unidades y la ampliación de cobertura para ejercicios con entradas límite siguen pendientes.

## Supabase y seguridad de evaluaciones

- Producción `nuqydanbbgqcofcftshk` y el proyecto separado DEV `fcwbkkivelsipqqrbpya` aparecen `ACTIVE_HEALTHY`.
- Producción tiene 22 migraciones registradas; DEV tiene su propio historial. Las versiones 024–027 existen en ambos, pero con timestamps diferentes. La matriz exacta está en `docs/team/MIGRACIONES.md`.
- Consultas SQL de solo lectura compararon las 67 tuplas del catálogo actual (62 obligatorias y 5 opcionales): producción y DEV tienen 67/67 claves v2 presentes y cero filas vigentes faltantes.
- En producción existen otras 43 filas históricas con IDs antiguos lesson-* y correct_option_v2 NULL; no corresponden a las 67 tuplas del catálogo actual y se conservan mientras se reconcilia el historial. DEV contiene solo las 67 claves actuales. No borrar ni migrar esas filas automáticamente.
- En producción, 29 de las 67 claves v2 tienen un índice distinto al campo histórico correct_option y 38 coinciden; en DEV, las 67 coinciden. Sin embargo, correct_option_v2 coincide exactamente con los índices answer del catálogo vigente: 67/67 en ambos proyectos. No copiar ni reconstruir valores v2 desde el campo legacy.
- Se compararon las 67 posiciones actuales de questions.answer en el catálogo (SHA `b14b334a9700d5191ae106266925ed8cf208d2b0`) con correct_option_v2: producción y DEV tienen 67/67 presentes, cero filas faltantes, cero valores nulos y cero índices distintos.
- Ambos proyectos usan PostgreSQL 17.11.0.003 y pgcrypto 1.3. El Advisor de producción advierte que la protección de contraseñas filtradas está desactivada; DEV no muestra ese aviso.
- `public.submit_quiz_v2` es `SECURITY INVOKER`: `anon` no tiene permiso de ejecución y `authenticated` sí. El calificador autoritativo vive en el esquema privado como `SECURITY DEFINER`, valida `auth.uid()` y devuelve calificación agregada.
- El trigger `invitations_prevent_used_deletion` está activo. Las invitaciones usadas se conservan como historial; las no usadas pueden eliminarse.
- Existe una rama preview `main` asociada al proyecto de producción con ID `82612040-2379-41e3-8f76-100fadca6a2c` y estado `MIGRATIONS_FAILED`. No es el proyecto DEV separado. No hacer reset, rebase, merge ni borrado de esa rama sin investigar su drift y preparar un plan explícito.
- La divergencia entre los archivos locales y el historial remoto sigue bloqueando un `db push`, `migration repair` o `db reset` a ciegas. No repetir migraciones 024–027.

## Turnstile y autenticación

- La Sitekey pública está disponible en GitHub Actions y el HTML publicado de `/login` incluye el widget Turnstile.
- La comprobación HTTP confirma que el widget se renderiza; no demuestra que una persona completó el desafío ni que Supabase Auth validó la Secret key privada.
- La configuración CAPTCHA dentro de Supabase Auth no se puede leer mediante las herramientas disponibles. La validación real debe completarse con un correo controlado en el dominio publicado.
- El historial de CI no sustituye una prueba integral de registro, confirmación por correo, login, logout y recuperación de contraseña con cuentas reales.

## Riesgos de repositorio y gobierno

- El repositorio sigue siendo público. El código fuente versionado contiene claves de respuestas, explicaciones y soluciones de ejercicios; no es una filtración de credenciales, pero sí expone material evaluativo. La decisión de privatizarlo o mantener una copia pública saneada sigue abierta en el issue #21. No cambiar la visibilidad ni reescribir el historial sin decisión del propietario.
- master no tiene branch protection (protected: false). La integración GitHub devuelve 403 al endpoint de administración de reglas; el propietario debe activarla desde Settings → Branches. El issue #23 registra los checks y requisitos.

## Bloqueos y próximos pasos

1. Mantener un smoke test tras cada despliegue: confirmar `/muestra`, sitemap, Turnstile renderizado y redirección www 308.
2. PR #54 está integrado: el workflow compara el SHA del evento con master antes de desplegar y vuelve a comprobarlo después de compilar, evitando que un run antiguo revierta producción.
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
