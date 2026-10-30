# Estado del proyecto — revisión de entrega para el equipo

## Estado de integración y publicación

- Repositorio: `Reymonth777x/python-desde-cero`.
- Rama de trabajo: `fix/lider-20261028`.
- Revisión: [PR #6](https://github.com/Reymonth777x/python-desde-cero/pull/6), dirigida a `master`.
- El PR sigue en **draft**, abierto y sin fusionar. La versión de esta rama no se ha publicado en producción.
- Producción prevista: `https://python-desdecero.com`; respaldo: `https://python-desdecero.pythondesdecero.workers.dev`. No afirmar que esos dominios sirven esta versión hasta que se fusione, despliegue y compruebe el workflow de producción.

## Última verificación de CI

La ejecución de GitHub Actions **#251** para el commit `26f46a225f897f2440eedb7012ce3fbad438f526` terminó correctamente:
- Vitest: 26/26 pruebas.
- TypeScript: aprobado.
- ESLint: 0 errores y 56 advertencias.
- Build de producción Next.js: aprobado.
- Playwright: 146/146 pruebas, incluyendo el dibujo Turtle en Chromium y móvil.
- Build de Cloudflare Workers con Vinext: aprobado.
- Auditoría informativa de dependencias: completada.

Esta CI verifica código y builds en GitHub. No demuestra que Docker/Supabase local ya haya arrancado en cada computadora ni reemplaza pruebas manuales contra el entorno local o producción.

## Interfaz y laboratorio de portada

- La portada se rediseñó como una página editorial de aprendizaje: hero, ejemplo visual, ruta con los cinco módulos reales y selector de seis ejemplos ejecutables.
- La ruta de módulos y el total de lecciones se leen desde `src/lib/course.ts`; no se duplicó un catálogo fijo de dos módulos.
- El laboratorio de portada se amplió con editor, lienzo SVG a tamaño útil y consola; los errores de Python se muestran en lugar de quedar ocultos por el mensaje de estado.
- Pyodide continúa ejecutándose en `public/python-worker.js` y Turtle entrega objetos JavaScript nativos mediante `PyProxy.toJs()`; la prueba unitaria cubre conversión y liberación del proxy.

## Desarrollo local con Docker y usuarios de prueba

- `scripts/start-local.ps1` inicia Supabase local mediante Docker, consulta `supabase status --output env`, configura `.env.development.local` para Next.js y arranca el servidor en localhost.
- No ejecuta `supabase link`, `db push` ni `db reset`; no debe conectarse a producción para sembrar cuentas.
- `scripts/seed-dev-users.mjs` solo acepta una URL HTTP local y crea dos estudiantes más un administrador (`profiles.is_admin = true`). El perfil actual no tiene una columna `role` o `is_teacher`, por lo que no se crea un rol docente ficticio.
- Las contraseñas generadas se guardan en `.local/dev-users.credentials.json`, ignorado por Git; nunca se imprimen ni se suben al repositorio.
- Comando de arranque: `.\scripts\start-local.ps1`. Opción `-SkipSeed` para mantener las contraseñas ya creadas.
- La primera ejecución de Docker/Supabase local en la computadora del responsable sigue pendiente de confirmación manual. Después se deben comprobar login/logout, aislamiento entre los dos estudiantes, admin/invitaciones, progreso, quiz y recuperación de contraseña.

## Qué se encontró sobre el supuesto juego

- La rama contiene seis ejemplos interactivos de Python y gráficos Turtle; son ejercicios de programación, no un minijuego de usuario independiente.
- El antiguo `/python-runner` era un puente de comunicación con un iframe/Worker para ejecutar Python, no un juego.
- No se encontró un componente o ruta de minijuego independiente en los archivos revisados de la rama. El minijuego de restaurante ya aparece como pendiente en la auditoría anterior.
- Puede existir un artefacto local no versionado de una sesión previa de Cline; debe buscarse en los archivos locales no rastreados antes de concluir que nunca se creó. No se debe borrar esa evidencia.

## Cambios de producto y seguridad previamente incorporados

- `src/proxy.ts` verifica sesión y autorización admin para las rutas protegidas.
- El login valida el destino `next`, conserva el contexto de redirección y muestra mensajes accesibles.
- El quiz usa `submit_quiz_v2`; las respuestas correctas y soluciones no se serializan al navegador.
- La migración 020 agrega `correct_option_v2` y `submit_quiz_v2` sin alterar la columna antigua.
- El Worker Pyodide limita código, salida, entrada, duración y comandos Turtle.
- Se mantiene la guía de incorporación para cuatro socios: cuentas individuales, ramas y PR, nunca compartir secretos.

## Estado remoto de Supabase y migraciones

- Proyecto remoto inspeccionado: `nuqydanbbgqcofcftshk`.
- Las migraciones 018, 019 y 020 aparecen en el historial remoto.
- 41 claves de quiz v2 configuradas; `anon` no puede ejecutar el RPC v2 y `authenticated` sí.
- No se han aplicado nuevas migraciones en este trabajo de portada/local-dev. No ejecutar `db push` para “probar” Docker.
- Mantener la matriz y procedimientos de `docs/team/MIGRACIONES.md` como referencia canónica.

## Pendientes antes de un release público

1. Arrancar por primera vez `scripts/start-local.ps1` en la computadora del propietario y confirmar que Supabase local inicia, crea las cuentas y Next sirve `http://localhost:3000`.
2. Ejecutar pruebas manuales con las cuentas de prueba: login, logout, reset, RLS/IDOR entre estudiantes, admin, invitaciones, progreso y quiz.
3. Inspeccionar la portada en móvil y escritorio desde localhost; corregir los detalles visuales que aparezcan en capturas/dispositivos reales.
4. Localizar el artefacto de juego que el usuario recuerda de Cline o definirlo como una tarea separada; no presentarlo como ya entregado mientras no haya componente y prueba.
5. Mantener CI verde en el SHA final, revisar el PR y solo después aprobar/fusionar siguiendo el proceso del equipo.
6. Tras fusionar, comprobar Cloudflare y las páginas reales en ambos dominios, login, recuperación, temas, quiz, progreso e invitaciones.

## Regla de release

No se afirma que producción está actualizada hasta que el workflow de Cloudflare termine y la comprobación del dominio sea exitosa. No aplicar migraciones remotas de manera improvisada ni compartir secretos del propietario.
