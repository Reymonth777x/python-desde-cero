# Tareas pendientes de configuración, calidad y operación

Actualización: 31 de octubre de 2026. Este resumen superior es el estado operativo vigente. Las listas históricas que siguen conservan sus cortes anteriores y no deben interpretarse como pendientes actuales sin contrastarlas con los issues enlazados.

## Estado vigente — 31-10-2026

### Completado y publicado

- [x] Orilla integrada en producción: `/orilla`, 12 tramos guiados, río abierto y dos retos. Las rutas requieren sesión y el runner Python de origen aislado está publicado.
- [x] Corregido el bloqueo del runner: allowlist de orígenes apex/`www`, política de producción y smoke test real de ejecución.
- [x] Reconciliado el historial PROD: 29 versiones remotas coinciden con 29 archivos activos canónicos en `supabase/migrations/`. La reparación de 001/002/003/005 en PROD fue solo de metadatos; no reejecutó SQL.
- [x] DEV conserva su bootstrap y wrappers propios (11 versiones). No copiar el historial PROD ni ejecutar `db push` a ciegas.
- [x] Pruebas SQL reversibles en DEV: quiz fallido no crea progreso, quiz aprobado guarda 100 puntos, un segundo estudiante no puede leer el progreso del primero; RPC/RLS de Orilla y bloqueo de `c02` comprobados. Las transacciones terminaron en `ROLLBACK` y las consultas posteriores confirmaron cero filas de prueba.
- [x] PR #108 integró la suite pgTAP de 69 aserciones para el esquema actual y retiró el generador obsoleto que emitía `TRUNCATE ... CASCADE`.
- [x] PR #118 añadió pruebas Playwright de controles del laboratorio en 320, 360 y 390 px; PR #119 humanizó el encabezado de `/practica`.
- [x] PR #120 conectó `OrillaPlay` al helper probado de recuperación de borradores.
- [x] PR #121/#124 corrigieron la tarjeta de la extensión opcional y reforzaron E2E + smoke de producción para exigir los nodos exactos `05` y `OPCIONAL`.
- [x] PR #122 añadió regresiones de login exitoso, redirección interna y registro con callback de confirmación mediante Supabase simulado.
- [x] PR #125 mejoró la guía, los ejemplos y la edición móvil de Orilla. PR #126 corrigió la recuperación: fecha remota presente pero inválida bloquea la recuperación y una edición manual prevalece frente al timeout.
- [x] CI #793 [run](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41177442432) y deploy #140 [run](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41177624316) completaron en `success` sobre el mismo SHA `a4d7f6a225813ab2bbb27948f6d2fed9bcae17e4`. CI incluye unit tests, verificación de ejercicios, Pyodide/Orilla, TypeScript, ESLint, build, Playwright E2E, Vinext, pgTAP en Supabase efímero y PowerShell. El deploy verificó el dominio personalizado y la versión servida.
- [x] PR #127 actualizó solo documentación. El HEAD de `master` ahora es `13ce9e2ce7915e5dcd3c1df330ef7029c19755a6`; CI #797 [run](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41178125638) y deploy #141 [run](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41178300094) terminaron en `success` sobre ese SHA. La versión funcional no cambió respecto de `a4d7f6a`.
- [x] La portada pública se inspeccionó tras deploy #139 y #140: módulos `01`–`05`, extensión con etiqueta `OPCIONAL`; `/muestra` y `/login` responden y `/practica`/`/orilla` exigen sesión para visitantes.
- [x] Supabase Preview `main` está `FUNCTIONS_DEPLOYED` y `ACTIVE_HEALTHY`; el workflow registrado en issue #3 informó `All migrations are up to date`. No se hizo reset ni borrado.
- [x] PR #107 de mitigación de dependencias quedó fusionado. La auditoría de dependencias de CI sigue siendo informativa y requiere revisar su salida antes de afirmar que no quedan avisos.

### Pendiente real

- [ ] **Orilla en navegador DEV:** usar una cuenta desechable, iniciar sesión, abrir `c01`, ejecutar el código, superar el objetivo, recargar y comprobar que el mapa y Academia reflejan el avance. PROD solo tiene el borrador anterior `c01` con cero intentos; no usar cuentas de alumnos de PROD. Seguimiento: issue [#20](https://github.com/Reymonth777x/python-desde-cero/issues/20).
- [ ] **Auth y evaluaciones en navegador DEV:** confirmar registro, correo real, Turnstile, login, logout, recuperación, quiz aprobado/reprobado y persistencia al reingresar. Las pruebas de Server Actions con mocks no sustituyen esta aceptación. Issues [#17](https://github.com/Reymonth777x/python-desde-cero/issues/17) y [#20](https://github.com/Reymonth777x/python-desde-cero/issues/20).
- [ ] **Móvil físico/rediseño:** revisar selector de temas, Monaco/textarea, teclado virtual, desplazamiento, foco y progreso autenticado en teléfonos físicos. Las pruebas a 320/360/390 px no sustituyen la aceptación física. Issue [#18](https://github.com/Reymonth777x/python-desde-cero/issues/18).
- [ ] **Gobierno de GitHub:** `master` sigue sin protección. Activar PR obligatorio, una aprobación, conversaciones resueltas, checks `test-and-build` y `powershell-launcher`, no permitir force-push/eliminación ni bypass. Issue [#23](https://github.com/Reymonth777x/python-desde-cero/issues/23). La integración disponible permitió inspeccionar, pero no modificar, esta configuración.
- [ ] **Decisión de visibilidad:** el repositorio sigue público y las respuestas históricas de evaluación permanecen en Git. No cambiar la visibilidad ni reescribir el historial sin decisión explícita. Issue [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21).
- [ ] **Dependencias:** PR #107 quedó fusionado, pero su último `npm audit` registró **5 vulnerabilidades moderadas** y una copia restante de `minimatch@3.1.5`, compartida por `eslint-plugin-import`, `eslint-plugin-jsx-a11y` y `eslint-plugin-react` mediante `eslint-config-next` (rango solicitado `^3.1.2`). El audit de CI es informativo; no forzar `minimatch@11` fuera del rango. Actualizar/reemplazar esa cadena de plugins y repetir la suite completa.
- [ ] **Privacidad y términos:** revisión profesional de privacidad, términos, cookies, retención, derechos de titulares y tratamiento de menores para Costa Rica antes de abrir el registro externo. Issue [#98](https://github.com/Reymonth777x/python-desde-cero/issues/98).

### Notas de validación

- pgTAP ya se ejecuta en CI sobre una instancia Supabase local efímera y limpia; los jobs #791/#793 completaron en verde. Esto no aplica migraciones ni escribe datos en DEV o PROD.
- El runtime protege las respuestas del curso mediante serializadores server-only, pero el código/historial Git del repositorio público sigue conteniendo material de evaluación histórico. La decisión de visibilidad y el plan de material histórico siguen siendo del propietario.
- PR #123 se cerró como reemplazado por #125; no se fusionó ni se eliminó su rama.
- La referencia operativa exacta está en `README.md` y el estado de migraciones en `docs/team/MIGRACIONES.md`. Las secciones siguientes conservan el checklist histórico del 30-10-2026 y no deben reabrirse automáticamente.

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
