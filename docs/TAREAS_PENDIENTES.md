# Tareas pendientes de configuración, calidad y operación

Actualizado el 30 de octubre de 2026 tras comprobar el repositorio, CI, publicación y los dos proyectos Supabase. Los elementos ya integrados se distinguen de las verificaciones que aún requieren cuentas reales, hardware o reconciliación de base de datos.

## 1. Completado y verificado en código/producción

- [x] Publicar la portada actual en `python-desdecero.com`; verificar el Worker y el dominio personalizado.
- [x] Publicar `/muestra`, añadirla al sitemap y comprobar la muestra pública sin claves, soluciones ni progreso privado.
- [x] Verificar el marcador Turnstile en el HTML de `/login` y la redirección HTTP 308 de `www` al dominio apex.
- [x] Simplificar navegación: estudiante y administrador; retirar la ruta docente ficticia y el prototipo de cocina del árbol activo.
- [x] Estructurar PE1 en cuatro módulos obligatorios y 33 unidades, con módulo 5 separado como extensión opcional.
- [x] Incorporar evaluación formal del módulo 1, Hello, World! en 2.1, proyecto final obligatorio y examen global PE1.
- [x] Corregir progresión de variables/conversiones, operadores bit a bit y Bubble Sort.
- [x] Integrar la mejora de matrices y bucles anidados paso a paso en `b3-l9` (PR #52).
- [x] Integrar la aclaración pedagógica de las primeras lecciones `b1-l1`–`b1-l3` (PR #57).
- [x] Hacer que el contador de pruebas del proyecto final derive de `lesson.exercise.tests.length` (PR #55; seis casos en el catálogo).
- [x] Proteger prerrequisitos del curso en el servidor y en el calificador privado de Supabase.
- [x] Verificar 67 claves v2 (62 obligatorias y 5 opcionales), sin claves faltantes en el catálogo vigente.
- [x] Confirmar que las invitaciones usadas se conservan y las no usadas pueden eliminarse.
- [x] Integrar protección contra despliegues obsoletos de Cloudflare (PR #54): verificación del SHA antes del build y otra comprobación justo antes de publicar.
- [x] CI completo y despliegue del HEAD `2940723e3a37a6556770169d0ae692e6bab2d943` completados correctamente.

## 2. Publicación pendiente del HEAD actual

- [ ] Completar el CI del HEAD actual `71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15` (workflow 41049538535).
- [ ] Confirmar que el job `deploy` se ejecuta y termina correctamente para ese mismo SHA.
- [ ] Tras publicar, verificar en producción las mejoras de las primeras lecciones, `b3-l9` y el texto dinámico de seis pruebas del proyecto final.
- [ ] Si un `workflow_run` se omite porque el CI upstream fue cancelado, esperar el CI del HEAD más reciente. No confundir el estado general `success` de un workflow con un job `deploy` realmente ejecutado.

## 3. Evaluaciones y progreso real

- [ ] Probar con dos estudiantes distintos que el servidor calcula la nota y el cliente no puede modificar la clave.
- [ ] Confirmar que una evaluación no aprobada no marca la unidad como completada.
- [ ] Aprobar una evaluación y confirmar que la mejor nota y el estado se conservan tras cerrar sesión y volver a entrar.
- [ ] Confirmar que el progreso de la portada coincide con el panel Academia.
- [ ] Verificar la secuencia del módulo 4: completar `b4-l8`, ejecutar y aprobar las seis pruebas del proyecto `b4-l10`, superar su revisión conceptual y luego aprobar `b4-l11`.
- [ ] Diseñar una rúbrica explícita para revisar el código del proyecto final. El sitio emite una evaluación formativa, no una certificación externa.

## 4. Autenticación, CAPTCHA y correo

- [ ] Completar registro, confirmación, login, logout y recuperación/cambio de contraseña en el dominio final con un buzón de prueba controlado.
- [ ] Completar interactivamente el desafío Turnstile y comprobar que Supabase Auth acepta el token. La presencia del widget en el HTML no demuestra la validación del secreto.
- [ ] Confirmar permisos de estudiante y administrador y las rutas protegidas con ambas cuentas.
- [ ] Activar la protección contra contraseñas filtradas en Supabase Auth (Advisor la reportó desactivada).
- [ ] Verificar SMTP, SPF, DKIM, DMARC, plantillas y URLs de redirección.

## 5. Laboratorio y experiencia de dispositivo

- [ ] Probar la carga de Pyodide en Chrome y Firefox.
- [ ] Probar `print()`, `input()`, conversiones, errores de sintaxis, programas largos y timeout/reinicio del Worker.
- [ ] Probar Turtle: fondo, color, grosor, posición, orientación, formas, `clear()`, `reset()` y ocultar/mostrar tortuga.
- [ ] Hacer una pasada en móviles físicos con paleta de temas, editor, teclado táctil, salida y navegación. Playwright emulado no reemplaza hardware real.

## 6. Invitaciones y administración

- [ ] Con cuenta administradora, crear y guardar un código automático.
- [ ] Crear y guardar un código personalizado; confirmar normalización a mayúsculas y persistencia.
- [ ] Eliminar una invitación no utilizada.
- [ ] Confirmar que una invitación usada no se puede eliminar y que la interfaz explica la conservación del historial.
- [ ] Con cuenta de estudiante, confirmar que listar, crear o eliminar invitaciones está prohibido.

## 7. Supabase, staging y migraciones

- [ ] Reconciliar archivos locales e historiales remotos de producción y DEV; ver `docs/team/MIGRACIONES.md`.
- [ ] Recuperar/versionar las migraciones exactas que faltan en Git y retirar variantes obsoletas sin reescribir versiones ya aplicadas.
- [ ] Investigar la rama preview `main` del proyecto de producción con estado `MIGRATIONS_FAILED` (ID `82612040-2379-41e3-8f76-100fadca6a2c`). No resetearla, rebasarla, fusionarla ni borrarla como atajo.
- [ ] Probar futuras migraciones en una base local limpia y otra con datos preservados; preparar respaldo y rollback.
- [ ] No ejecutar `supabase db push`, `migration repair` ni `db reset` en producción mientras persista la divergencia de timestamps. Las migraciones 024–027 ya están aplicadas en ambos entornos con versiones distintas; no repetirlas.
- [ ] Revisar Security y Performance Advisors. No eliminar índices por avisos informativos sin medir carga real.

## 8. Legal, privacidad y producto futuro

- [ ] Completar revisión legal de privacidad, términos y cookies.
- [ ] Definir criterios medibles del plan gratuito y posibles beneficios Pro antes de ofrecerlos.
- [ ] Separar contenido y traducciones del código de interfaz cuando se inicie el inglés.
- [ ] Mantener fuera del alcance de esta versión los juegos no publicados y Orilla, que es un proyecto futuro independiente.
