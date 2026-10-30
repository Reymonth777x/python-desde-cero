# Tareas pendientes de configuración, calidad y operación

Actualizado el 30 de octubre de 2026 tras comprobar `master`, CI, despliegue y los dos proyectos Supabase. Los elementos completados se separan de las verificaciones que aún requieren una sesión real, hardware o intervención de plataforma.

## 1. Completado y verificado en código/producción

- [x] Publicar la portada actual en `python-desdecero.com`; verificar el Worker y el dominio personalizado.
- [x] Publicar `/muestra`, añadirla al sitemap y comprobar su HTML público sin claves, soluciones ni progreso privado.
- [x] Comprobar que `/login` renderiza el marcador Turnstile y que `www` redirige al dominio apex con HTTP 308.
- [x] Simplificar la navegación: solo estudiante y administrador; retirar la ruta docente ficticia y el prototipo de cocina del árbol activo.
- [x] Estructurar el PE1 obligatorio en cuatro módulos y 33 unidades, dejando el módulo 5 como extensión opcional.
- [x] Añadir la evaluación formal del módulo 1, Hello, World! en 2.1, el proyecto final obligatorio y el examen global.
- [x] Corregir la progresión de variables/conversiones, operadores bit a bit y Bubble Sort con pruebas de regresión.
- [x] Hacer que el calificador del servidor compruebe prerrequisitos, conserve las claves en esquema privado y no exponga aciertos por pregunta.
- [x] Verificar en producción y DEV 67 claves v2 configuradas, sin claves faltantes en el catálogo vigente.
- [x] Confirmar que las invitaciones utilizadas se conservan y que las no utilizadas pueden eliminarse.
- [x] CI completo y despliegue del HEAD `2940723e3a37a6556770169d0ae692e6bab2d943` completados correctamente.

## 2. Trabajo de currículo en curso

- [ ] Integrar PR #52 tras CI verde: guiar `b3-l9` desde consultar una fila hasta recorrer matrices con dos bucles.
- [ ] Integrar PR #55 tras CI verde: obtener el número de pruebas del proyecto desde `lesson.exercise.tests.length`, no desde un texto fijo.
- [ ] Revisar PR #53 (sintaxis guiada de la primera lección): su CI actual falla; corregirlo o cerrarlo sin integrar cambios no probados.
- [ ] Revisar de forma integral las 33 unidades obligatorias y los prerequisitos entre temas; retirar redundancias sin recortar el contenido necesario.
- [ ] Ampliar prácticas con más entradas válidas, inválidas, límites y explicaciones de errores. Priorizar las unidades que aún tienen un solo caso de prueba.
- [ ] Revisar la exactitud de las soluciones, la salida esperada, las pistas y la dificultad declarada en cada ejercicio.
- [ ] Validar todo el contenido en español antes de iniciar una traducción al inglés.

## 3. Evaluaciones y progreso real

- [ ] Probar con dos cuentas de estudiante distintas que el servidor calcula la nota y el cliente no puede cambiar la clave.
- [ ] Confirmar que una evaluación no aprobada no marca la unidad como completada.
- [ ] Aprobar una evaluación y confirmar que la mejor nota y el estado se conservan después de cerrar sesión y volver a entrar.
- [ ] Confirmar que el progreso de la portada coincide con el panel Academia.
- [ ] Verificar la secuencia completa del módulo 4: completar `b4-l8`, ejecutar y aprobar las seis pruebas del proyecto `b4-l10`, superar su revisión conceptual y luego aprobar el examen `b4-l11`.
- [ ] Añadir una rúbrica explícita para revisar el código del proyecto final y los criterios de aprobación docente/administrador; el sitio emite una evaluación formativa, no una certificación externa.

## 4. Autenticación, CAPTCHA y correo

- [ ] Completar registro, confirmación de correo, login, logout y recuperación/cambio de contraseña en el dominio final con un buzón de prueba controlado.
- [ ] Completar interactivamente el desafío Turnstile y comprobar que Supabase Auth acepta el token. La presencia del widget en el HTML no demuestra la validación del secreto.
- [ ] Confirmar permisos de estudiante y administrador y las rutas protegidas con ambas cuentas.
- [ ] Activar la protección de contraseñas filtradas en Supabase Auth (el Advisor la reportó desactivada).
- [ ] Verificar SMTP, SPF, DKIM, DMARC, plantillas y URLs de redirección.

## 5. Laboratorio y experiencia de dispositivo

- [ ] Probar la carga de Pyodide en Chrome y Firefox.
- [ ] Probar `print()`, `input()`, conversiones, errores de sintaxis, programas largos y timeout/reinicio del Worker.
- [ ] Probar Turtle: fondo, color, grosor, posición, orientación, formas, `clear()`, `reset()` y ocultar/mostrar tortuga.
- [ ] Hacer una pasada en móviles físicos con paleta de temas, editor, teclado táctil, salida y navegación. Playwright emulado no reemplaza hardware real.

## 6. Invitaciones y administración

- [ ] Con cuenta administradora, crear y guardar un código automático.
- [ ] Crear y guardar un código personalizado; confirmar normalización a mayúsculas y persistencia exacta.
- [ ] Eliminar una invitación no utilizada.
- [ ] Confirmar que una invitación usada no se puede eliminar y que la interfaz explica la conservación del historial.
- [ ] Con una cuenta de estudiante, confirmar que listar, crear o eliminar invitaciones está prohibido.

## 7. Supabase, staging y migraciones

- [ ] Reconciliar los archivos locales con los historiales remotos de producción y DEV; ver `docs/team/MIGRACIONES.md`.
- [ ] Recuperar/versionar las migraciones exactas que faltan en Git y retirar variantes obsoletas sin reescribir versiones ya aplicadas.
- [ ] Resolver el estado `MIGRATIONS_FAILED` de la rama preview `main` dentro del proyecto de producción. Investigar primero; no resetear, rebasar, fusionar ni borrar esa rama como atajo.
- [ ] Probar futuras migraciones en una base local limpia y otra con datos preservados; preparar backup y rollback.
- [ ] No ejecutar `supabase db push`, `migration repair` ni `db reset` contra producción mientras persista la divergencia de timestamps. Las migraciones 024–027 ya están aplicadas en ambos entornos con versiones distintas; no repetirlas.
- [ ] Revisar periódicamente los Security y Performance Advisors. No eliminar índices solo por avisos informativos sin medir la carga.

## 8. Legal, privacidad y producto futuro

- [ ] Completar revisión legal de privacidad, términos y cookies.
- [ ] Definir criterios medibles del plan gratuito y posibles beneficios Pro antes de ofrecerlos.
- [ ] Separar contenido y traducciones del código de interfaz cuando se inicie el inglés.
- [ ] Mantener fuera del alcance de esta versión los juegos no publicados y Orilla, que es un proyecto futuro independiente.
