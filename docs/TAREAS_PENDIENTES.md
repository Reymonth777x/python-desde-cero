# Tareas pendientes de configuración, calidad y operación

Actualización: 31 de octubre de 2026. Este resumen superior es el estado operativo vigente. Las listas de las secciones históricas que siguen conservan el corte del 30-10-2026; sus casillas no deben interpretarse como pendientes actuales sin contrastar con los issues enlazados.

## Estado vigente — 31-10-2026

### Completado
- [x] Orilla integrada y publicada: `/orilla`, 12 tramos, río abierto y dos retos. Las rutas requieren sesión y el runner de Python aislado está publicado.
- [x] Corregido el bloqueo del runner: allowlist de orígenes apex/`www` y smoke test real de ejecución en CI.
- [x] Reconciliado el historial PROD: 29 versiones remotas coinciden con 29 archivos activos canónicos en `supabase/migrations/`. La reparación de 001/002/003/005 en PROD fue solo de metadatos; no reejecutó SQL.
- [x] Corregidos los datos y guía de migraciones: DEV conserva su bootstrap y wrappers propios (11 versiones). No copiarle el historial de PROD ni ejecutar `db push` a ciegas.
- [x] Pruebas SQL reversibles en DEV: quiz fallido no crea progreso, quiz aprobado guarda 100 puntos, el segundo estudiante no puede leer progreso del primero; RPC/RLS de Orilla y bloqueo de `c02` comprobados. Todas las transacciones terminaron en `ROLLBACK` y las consultas posteriores confirmaron cero filas de prueba.
- [x] PR #108 fusionado: suite pgTAP reescrita para esquema actual (69 aserciones), generador obsoleto que emitía `TRUNCATE ... CASCADE` retirado y documentos históricos corregidos. CI de PR pasó 172 pruebas E2E y builds.
- [x] Portada, login, `www` y rutas protegidas de Orilla revalidadas después de la publicación anterior. Turnstile aparece en el HTML del login.

### Pendiente real
- [ ] **Orilla en navegador:** usar una cuenta desechable DEV, iniciar sesión, abrir `c01`, ejecutar el código, superar el objetivo, recargar y comprobar que el mapa y Academia reflejan el avance. PROD solo tiene un borrador `c01` con cero intentos; no utilizar alumnos de PROD. Seguimiento: issue [#20](https://github.com/Reymonth777x/python-desde-cero/issues/20).
- [ ] **Auth y evaluaciones en navegador DEV:** confirmar registro, correo, CAPTCHA, login, logout, recuperación, quiz aprobado/reprobado y persistencia al reingresar. Los logs de PROD muestran uso real y errores de CAPTCHA/límites, pero no sustituyen una aceptación controlada de DEV. Issues [#17](https://github.com/Reymonth777x/python-desde-cero/issues/17) y [#20](https://github.com/Reymonth777x/python-desde-cero/issues/20).
- [ ] **pgTAP real:** ejecutar `npx supabase test db` contra una instancia Supabase local limpia. La suite nueva está escrita y tiene guardas Vitest, pero no se ha ejecutado con Docker/Supabase CLI local. No ejecutarla contra DEV ni PROD.
- [x] **Supabase Preview:** `main` está `FUNCTIONS_DEPLOYED` y `ACTIVE_HEALTHY`; el workflow `09bb28322abe438299e8e8eaa313f821` (2026-10-31 02:50:48 UTC) registra `All migrations are up to date`. No se hizo reset ni borrado. Issue [#3](https://github.com/Reymonth777x/python-desde-cero/issues/3) listo para cerrar.
- [ ] **Móvil/rediseño:** completar inventario y revisión visual de portada, lección, paleta, Monaco, teclado virtual y progreso en teléfonos físicos. Las pruebas a 320/360/390 px no sustituyen aceptación física. Issue [#18](https://github.com/Reymonth777x/python-desde-cero/issues/18).
- [ ] **Gobierno de GitHub:** `master` sigue sin protección. Activar PR obligatorio, aprobación, conversaciones resueltas y checks `test-and-build`/`powershell-launcher`. Issue [#23](https://github.com/Reymonth777x/python-desde-cero/issues/23).
- [ ] **Decisión de visibilidad:** el repositorio sigue público y las respuestas de evaluación permanecen en el historial. No cambiar visibilidad ni reescribir commits sin decisión explícita. Issue [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21).
- [ ] **Dependencias:** PR #107 propone una mitigación parcial de `minimatch`; su rama conserva cinco avisos moderados en una copia heredada de ESLint. No considerar el audit limpio ni forzar un salto mayor incompatible.
- [ ] **Privacidad y términos:** revisión profesional de privacidad, términos, cookies, retención y derechos para Costa Rica antes de abrir registro externo. Issue [#98](https://github.com/Reymonth777x/python-desde-cero/issues/98).

La referencia de publicación, commits y Workers está en `README.md`; el estado exacto de migraciones está en `docs/team/MIGRACIONES.md`. Las secciones siguientes son el checklist conservado del 30-10-2026 y sirven como historial, no como fuente de estado actual.

---

## Checklist histórico — corte 30-10-2026

## 1. Completado y verificado en código/producción

- [x] Publicar la portada actual en `python-desdecero.com`; verificar el Worker y el dominio personalizado.
- [x] Publicar `/muestra`, añadirla al sitemap y comprobar su HTML público sin claves, soluciones ni progreso privado.
- [x] Comprobar que `/login` renderiza el marcador Turnstile y que `www` redirige al dominio apex con HTTP 308.
- [x] Simplificar la navegación: solo estudiante y administrador; retirar la ruta docente ficticia y el prototipo de cocina del árbol activo.
- [x] Estructurar el PE1 obligatorio en cuatro módulos y 33 unidades, dejando el módulo 5 como extensión opcional.
- [x] Añadir la evaluación formal del módulo 1, Hello, World! en 2.1, el proyecto final obligatorio y el examen global.
- [x] Corregir la progresión de variables/conversiones, operadores bit a bit, desplazamientos, Bubble Sort, listas de listas, manejo de excepciones y saltos de línea del ejemplo de listas con pruebas de regresión.
- [x] Hacer que el calificador del servidor compruebe prerrequisitos, conserve las claves en esquema privado y no exponga aciertos por pregunta.
- [x] Verificar en producción y DEV 67 claves v2 configuradas, sin claves faltantes en el catálogo vigente.
- [x] Comparar las 67 posiciones `questions.answer` del catálogo con `correct_option_v2`: 67/67 coinciden en producción y DEV, sin filas faltantes, nulas ni índices desalineados.
- [x] Revocar el RPC heredado `public.submit_quiz` y el calificador legacy `private.submit_quiz_authoritative` en producción; conservar el flujo `submit_quiz_v2` y los datos existentes. Verificación posterior: ambas rutas antiguas no son ejecutables por clientes; v2 sigue habilitada.
- [x] Corregir el vencimiento de invitaciones para interpretar `datetime-local` en el navegador, guardar un timestamp UTC explícito y mostrar la hora local del administrador (PR #66). CI y despliegue aprobados.
- [x] Confirmar que las invitaciones utilizadas se conservan y que las no utilizadas pueden eliminarse.
- [x] CI y despliegue del release funcional `e758f9cf9da1aa647429669b112b7128ca9b126d` (workflows `41076396982` y `41076898388`) completados correctamente. La actualización documental PR #67 (`10cc1b7`) también pasó CI `41092034385` y deploy `41092591412`; no modificó código de la aplicación.
- [x] Integrar PR #54: el workflow comparó el SHA del CI con el HEAD de `master` antes de compilar y volvió a comprobarlo inmediatamente antes del deploy; ambas validaciones pasaron en el release `71fa854`.
- [x] Verificar en producción el hero `cambio.py`, la muestra pública `/muestra`, las cinco URLs del sitemap, el marcador Turnstile de `/login` y el redirect HTTP 308 de `www` al apex.

## 2. Trabajo de currículo en curso

- [x] Integrar PR #52: `b3-l9` guía el acceso a una fila, el bucle exterior y el bucle interior. CI aprobado; fusionada en `master`.
- [x] Integrar PR #55: el número de pruebas del proyecto se obtiene de `lesson.exercise.tests.length`, coincidiendo con los seis casos del catálogo. CI aprobado; fusionada en `master`.
- [x] Integrar PR #57: aclara la demostración de variables y `print()` en las lecciones iniciales sin convertirlas en teoría adelantada. CI aprobado; fusionada en `master`.
- [x] Integrar PR #63: añade práctica de desplazamientos `<<`/`>>` a `b3-l2` y casos de `KeyError`, `ValueError`, `else` y `finally` a `b4-l7`.
- [x] Integrar PR #65: corrige secuencias `\\n` literales en `b3-l6` (ejemplo, salida, código inicial y solución) y protege el formato con regresión.
- [x] Integrar PR #66: interpreta vencimientos de invitaciones en zona horaria local, los almacena en UTC y muestra el instante en hora local.
- [x] Publicar en el release `e758f9c...` las mejoras de curso y de invitaciones; el smoke test externo posterior confirmó `/`, `/muestra`, `/login`, sitemap de cinco URLs y `www` al dominio apex.
- [ ] Verificar con sesión autenticada que las lecciones `b3-l9` y `b4-l10`, los seis casos del proyecto y los prerrequisitos se presentan y se completan correctamente.
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
- [ ] Añadir una rúbrica explícita para la revisión administrativa del código del proyecto final; no hay un rol docente en el modelo actual. El sitio emite una evaluación formativa, no una certificación externa.

## 4. Autenticación, CAPTCHA y correo

- [ ] Completar registro, confirmación de correo, login, logout y recuperación/cambio de contraseña en el dominio final con un buzón de prueba controlado.
- [ ] Completar interactivamente el desafío Turnstile y comprobar que Supabase Auth acepta el token. La presencia del widget en el HTML no demuestra la validación del secreto.
- [ ] Confirmar permisos de estudiante y administrador y las rutas protegidas con ambas cuentas.
- [ ] Protección de contraseñas filtradas en Supabase Auth: el Advisor la reporta desactivada. La organización está en plan Free y la función requiere Pro o superior; reevaluar solo si se decide actualizar el plan.
- [ ] Verificar SMTP, SPF, DKIM, DMARC, plantillas y URLs de redirección.

## 5. Laboratorio y experiencia de dispositivo

- [ ] Probar la carga de Pyodide en Chrome y Firefox.
- [ ] Probar `print()`, `input()`, conversiones, errores de sintaxis, programas largos y timeout/reinicio del Worker.
- [ ] Probar Turtle: fondo, color, grosor, posición, orientación, formas, `clear()`, `reset()` y ocultar/mostrar tortuga.
- [ ] Hacer una pasada en móviles físicos con paleta de temas, editor, teclado táctil, salida y navegación. Playwright emulado no reemplaza hardware real.

## 6. Invitaciones y administración

- [ ] Con cuenta administradora, crear y guardar un código automático.
- [ ] Crear y guardar un código personalizado; confirmar normalización a mayúsculas y persistencia exacta.
- [ ] Con cuenta administradora, confirmar en DEV que se puede eliminar una invitación no utilizada y que la usada se bloquea con un mensaje claro. La lógica y trigger tienen pruebas automatizadas; falta esta comprobación manual.
- [ ] Con una cuenta de estudiante, confirmar que listar, crear o eliminar invitaciones está prohibido.

## 7. Supabase, staging y migraciones

- [ ] Reconciliar los archivos locales con los historiales remotos de producción y DEV; ver `docs/team/MIGRACIONES.md`.
- [ ] Recuperar/versionar las migraciones exactas que faltan en Git y retirar variantes obsoletas sin reescribir versiones ya aplicadas.
- [ ] Resolver el estado `MIGRATIONS_FAILED` de la rama preview `main` dentro del proyecto de producción. Investigar primero; no resetear, rebasar, fusionar ni borrar esa rama como atajo.
- [ ] Probar futuras migraciones en una base local limpia y otra con datos preservados; preparar backup y rollback.
- [ ] No ejecutar `supabase db push`, `migration repair` ni `db reset` contra producción mientras persista la divergencia de timestamps. Las migraciones 024–027 ya están aplicadas en ambos entornos con versiones distintas; no repetirlas.
- [ ] Revisar periódicamente los Security y Performance Advisors. No eliminar índices solo por avisos informativos sin medir la carga.

## 8. Seguridad del repositorio y gobierno de GitHub

- [ ] Decidir entre privatizar el repositorio o publicar una copia saneada que no contenga `questions.answer`, `questions.explanation`, `exercise.solution` ni `tests[].expected`. Issue #21; no reescribir historial ni cambiar visibilidad sin aprobación.
- [ ] Proteger `master` desde GitHub Settings → Branches con PR obligatorio, una aprobación, conversaciones resueltas y checks `test-and-build` y `powershell-launcher`. La integración actual no tiene permiso para administrar la regla (HTTP 403); issue #23.

## 9. Legal, privacidad y producto futuro

- [ ] Completar revisión legal de privacidad, términos y cookies.
- [ ] Definir criterios medibles del plan gratuito y posibles beneficios Pro antes de ofrecerlos.
- [ ] Separar contenido y traducciones del código de interfaz cuando se inicie el inglés.
- [ ] Mantener el producto y el copy comercial limitados a las funciones realmente publicadas.
