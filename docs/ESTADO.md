# Estado del proyecto — Python desde Cero

**Corte:** 30 de octubre de 2026, 10:37 UTC  
**Rama principal:** `master`  
**Commit publicado observado:** `ef6b1b7807dd9816ce6064ba5ae5ea6f11bf389f`

## Resumen ejecutivo

La aplicación está desplegada en Cloudflare Workers y compila correctamente. La ruta educativa principal, las evaluaciones, el progreso, Auth y el laboratorio existen en el código. Aún no debe declararse lanzamiento completo: falta comprobar el recorrido real de una persona desde el registro hasta la primera evaluación aprobada y el progreso recuperado, además de resolver la exposición de respuestas en el repositorio público.

## Publicación y CI

- CI de `master` para el commit publicado: [ejecución 41040829424](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41040829424), finalizada correctamente.
- Despliegue manual del Worker: [ejecución 41041886743](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41041886743), finalizada correctamente.
- El despliegue comprobó el dominio raíz, la nueva portada y la presencia del marcador del widget Turnstile en `/login`.
- La portada publicada anuncia cuatro módulos y 33 unidades obligatorias, más una extensión opcional con cuatro actividades.
- La PR #28 de flujo móvil del laboratorio se fusionó y sus pruebas CI pasaron. Falta validación en teléfonos físicos.
- La PR #31 configura el dominio `www` y redirección 308 al dominio raíz. Verificar DNS, certificado y redirección en clientes externos.

Un build o deploy exitoso no demuestra que registro, correo, CAPTCHA, login, evaluación y progreso funcionen de extremo a extremo.

## Producto y contenidos

- Cuatro módulos principales de PE1; 33 unidades obligatorias según `src/lib/course-catalog.ts`.
- Evaluación formal del módulo 1, primer programa Hello World del módulo 2, evaluaciones de módulos y proyecto final/examen global definidos en el catálogo actual.
- Extensión de archivos y persistencia separada como contenido opcional.
- Editor Monaco, Pyodide en Web Worker y visualización Turtle implementados.
- El laboratorio móvil usa un recorrido vertical de guía, editor, ejecución y resultado.
- La portada aún utiliza un ejemplo Turtle con `for` como pieza visual principal. Debe cambiarse por una demostración que represente la primera unidad para principiantes.
- El laboratorio de portada y la primera lección de Academia todavía no forman una experiencia única de prueba y conversión.

## Supabase

Hay un proyecto de producción y otro de desarrollo, ambos observados como activos.

La producción tiene aplicadas las migraciones remotas desde 004–015, 018–027, con versiones timestamp que no siempre coinciden con los prefijos de los archivos locales. La migración local 028 no aparece aplicada en producción al momento de esta comprobación. Las variantes locales 001–003 y 016–017 tampoco deben ejecutarse sin reconciliación.

En una inspección de solo lectura:
- RLS está habilitada en las tablas públicas y privadas revisadas.
- Las respuestas correctas se almacenan en `private.quiz_answer_key`.
- `public.submit_quiz_v2` es `SECURITY INVOKER`; el calificador autoritativo privado valida la identidad autenticada.
- Los estudiantes no tienen escritura directa sobre `profiles.is_admin`; la lectura del perfil está limitada por RLS.
- El progreso de las evaluaciones se escribe desde el calificador privado.

No ejecutar `db push`, `migration repair` o `db reset` en producción hasta reconciliar historial y archivos, probar en desarrollo y confirmar respaldo/rollback. Ver [docs/team/MIGRACIONES.md](team/MIGRACIONES.md).

## Pendientes que bloquean el lanzamiento

### P0 — Validar el recorrido del alumno
- Probar registro, confirmación de correo, Turnstile, login, cierre y recuperación con cuentas desechables.
- Completar una lección real, ejecutar Python, enviar una evaluación, reprobar, aprobar y verificar que la nota/progreso sobreviven al cierre de sesión.
- Repetir las pruebas con dos estudiantes distintos para comprobar aislamiento de datos.
- Publicar una primera lección de muestra con ejecución real sin guardar progreso ni revelar respuestas. Solicitar registro cuando el alumno quiera conservar avances o enviar una evaluación.

### P0 — Resolver respuestas expuestas en el repositorio público
El repositorio es público. Aunque `src/lib/course.ts` esté marcado `server-only`, el propio archivo versionado contiene campos `answer` y `exercise.solution`. Eso evita una exposición en el bundle cliente, pero no impide que cualquier visitante los lea en GitHub. Resolver la visibilidad del repositorio o mover claves/soluciones fuera del código público. Seguimiento: issue [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21).

### P1 — Seguridad y operación
- Proteger `master` con PR obligatorio, aprobación y checks obligatorios. Seguimiento: issue [#23](https://github.com/Reymonth777x/python-desde-cero/issues/23).
- Verificar correo real, URLs allowlist, SMTP y DNS SPF/DKIM/DMARC.
- Revisar límites de Auth, controles/MFA de administración, backups y restauración.
- Resolver la advertencia de Supabase sobre protección de contraseñas filtradas.
- Mantener la auditoría de dependencias como control explícito: el paso `npm audit` de CI no bloquea actualmente la publicación.

### P1 — QA y gobierno del contenido
- Probar Monaco/Pyodide/Turtle, `input()`, errores y tiempos de espera en dispositivos físicos y redes lentas.
- Auditar las 33 unidades para eliminar repeticiones, confirmar progresión de dificultad y comprobar alineación con el temario PE1.
- Revisar invitaciones automáticas/personalizadas, edición, borrado de no usadas y rechazo de las ya utilizadas.
- Completar privacidad, términos, retención y revisión legal para Costa Rica.
- Actualizar sitemap/robots solo después de decidir qué lecciones introductorias serán públicas.

## Validaciones CI actuales

El workflow de CI ejecuta:
1. Pruebas unitarias Vitest.
2. TypeScript.
3. ESLint.
4. Build Next.js.
5. Playwright sobre build de producción (incluye proyecto Chromium y emulación móvil).
6. Build de Cloudflare Workers con Vinext.

Estas pruebas comprueban el código y la interfaz en un entorno automatizado; no sustituyen pruebas con cuentas reales, correo real ni dispositivos físicos.

## Cómo retomar el desarrollo local

Desde la raíz del repositorio clonado:

```powershell
npm ci
npm run check:release
```

Para Supabase local, seguir el lanzador y las restricciones descritas en el README y en `docs/TAREAS_PENDIENTES.md`. No conectar pruebas locales a producción ni ejecutar migraciones remotas sin el procedimiento de reconciliación.
