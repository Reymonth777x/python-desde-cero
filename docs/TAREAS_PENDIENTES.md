# Tareas pendientes de configuración, calidad y operación

Este documento reemplaza la lista anterior. No ejecutar pasos de producción hasta completar las verificaciones indicadas.

## 1. Entorno local

- [ ] Instalar Node.js 24, npm y Docker Desktop.
- [ ] Desde la raíz del repositorio, ejecutar en PowerShell: .\scripts\start-local.ps1.
- [ ] El lanzador usa Supabase CLI 2.121.0 mediante npx; no requiere instalación global.
- [ ] Consultar las cuentas de prueba en .local/dev-users.credentials.json.
- [ ] Usar únicamente URLs loopback para el seed de desarrollo.
- [ ] Si faltan tablas o el seed falla por esquema, detenerse y reportar el error. No ejecutar db reset para ocultar el problema.

## 2. Migraciones y Supabase

- [ ] Resolver la divergencia entre supabase/migrations y el historial remoto descrita en docs/team/MIGRACIONES.md.
- [ ] Recuperar en Git las migraciones exactas que ya están aplicadas en remoto.
- [ ] Revisar las variantes locales no aplicadas y decidir cuáles se archivan o se convierten en migraciones nuevas.
- [ ] Reconciliar 001–003 con el historial remoto solo con evidencia del esquema existente.
- [ ] Crear cada migración nueva con Supabase CLI: npx --yes supabase@2.121.0 migration new nombre_descriptivo.
- [ ] Probar migraciones en una base local limpia y otra con datos preservados.
- [ ] Preparar backup y rollback antes de cualquier cambio en staging o producción.
- [ ] No ejecutar supabase db push, migration repair ni db reset contra producción hasta aprobación y reconciliación.

## 3. Academia y calidad del curso PE1

- [ ] Completar la evaluación formal del módulo 1.
- [ ] Mantener print() en b1-l4 solo como demostración de ejecución y verificar que la explicación formal de salida, cadenas y comentarios permanezca en el módulo 2.
- [ ] Crear evaluación final global de PE1.
- [ ] Convertir el proyecto final en requisito de graduación del PE1.
- [ ] Revisar las 30 unidades principales para eliminar explicaciones repetidas y asegurar prerequisitos.
- [ ] Ampliar prácticas con casos límite, entradas inválidas y retroalimentación explicativa.
- [ ] Mantener la extensión de archivos claramente fuera del PE1 principal.
- [ ] Revisar todo el contenido en español antes de traducirlo al inglés.

## 4. Evaluaciones y progreso

- [ ] Probar envío de evaluación con dos estudiantes distintos.
- [ ] Confirmar que el servidor calcula la nota y que el estudiante no puede modificar la clave.
- [ ] Confirmar que una respuesta incorrecta no marca la lección como completada.
- [ ] Confirmar que la mejor nota y el estado completado se conservan tras cerrar sesión y volver a entrar.
- [ ] Confirmar que el progreso de la portada coincide con el panel de Academia.

## 5. Laboratorio de Python

- [ ] Probar carga inicial de Pyodide en Chrome y Firefox.
- [ ] Probar print(), input(), conversiones, errores de sintaxis y timeout.
- [ ] Probar Turtle: fondo, color, grosor, posición, orientación, formas, clear(), reset() y ocultar/mostrar tortuga.
- [ ] Probar programas largos y confirmar que el Worker se reinicia si se agota el tiempo.
- [ ] Verificar que el laboratorio completo y la demostración de portada no prometen capacidades distintas.

## 6. Invitaciones y administración

- [ ] Crear un código automático y comprobar que queda guardado.
- [ ] Crear un código personalizado y comprobar que se guarda exactamente como se escribió tras normalizarlo.
- [ ] Eliminar una invitación no utilizada.
- [ ] Confirmar que una invitación utilizada no se puede eliminar y que la interfaz explica por qué.
- [ ] Probar permisos con administrador y estudiante; el estudiante no puede listar, crear ni eliminar invitaciones.

## 7. Autenticación y navegación

- [ ] Probar registro, confirmación de correo, inicio, cierre y recuperación de contraseña.
- [ ] Verificar que los campos de registro e inicio no se mezclan ni por estado ni por autocompletado.
- [ ] Confirmar que una sesión de administrador no aparece como desconectada en la portada.
- [ ] Confirmar que Academia, Mi progreso y Acceso del estudiante tienen destinos y estados claros.
- [ ] Probar rutas protegidas con usuario anónimo, estudiante y administrador.

## 8. Seguridad, correo y despliegue

- [ ] Configurar Turnstile y validar CSP en producción antes de activarlo.
- [ ] Configurar SMTP, SPF, DKIM y DMARC.
- [ ] Revisar plantillas de correo, URL de redirección y dominio verificado.
- [ ] Ejecutar CI completo: Vitest, TypeScript, ESLint, build Next, E2E y build Vinext.
- [ ] Desplegar primero en staging, validar y después publicar en producción.
- [ ] Verificar dominio, robots, sitemap, cabeceras, cookies y rutas después del despliegue.
- [ ] Obtener revisión legal de privacidad, términos y cookies.

## 9. Preparación para inglés y servicios Pro

- [ ] Separar contenido y traducciones del código de interfaz.
- [ ] No traducir automáticamente ejemplos de código ni nombres de funciones Python.
- [ ] Definir criterios de finalización y evidencias de aprendizaje para el plan gratuito.
- [ ] Diseñar beneficios Pro medibles: proyectos revisados, rutas extendidas, seguimiento docente o certificados internos con rúbricas verificables.
- [ ] No prometer certificaciones externas que la plataforma no emite.
