
# REGLAS OBLIGATORIAS — PYTHON PE1 ACADEMY

## 1. Protección absoluta del proyecto

- Está prohibido borrar archivos o carpetas existentes.
- Está prohibido renombrar o mover archivos existentes sin autorización explícita.
- Está prohibido reemplazar archivos completos cuando se pueda realizar un cambio localizado.
- Está prohibido eliminar funcionalidades que ya están implementadas.
- No sobrescribas configuraciones existentes sin revisar su contenido.
- Si consideras necesario eliminar, renombrar, mover o reemplazar por completo un archivo, detente y solicita autorización antes de hacerlo.
- No ejecutes comandos destructivos como Remove-Item, del, rmdir, rm, git clean, git reset --hard ni equivalentes.
- Nunca ejecutes DROP, TRUNCATE, DELETE general, reinicios de bases de datos ni migraciones destructivas.
- No ejecutes npm audit fix --force.
- No modifiques ni muestres el contenido de .env.local.

## 2. Reglas sobre Supabase

- No borres ni recrees tablas.
- No reinicies la base de datos.
- No ejecutes migraciones en Supabase sin autorización expresa.
- No cambies las credenciales, contraseñas ni permisos del propietario.
- No elimines políticas RLS existentes.
- No permitas que un estudiante se convierta a sí mismo en administrador.
- Antes de proponer cualquier operación de base de datos, explica qué cambiaría y pide autorización.

## 3. Método de trabajo

- Primero inspecciona el repositorio real y sus archivos.
- Conserva Next.js 14, TypeScript, Tailwind, Supabase, Monaco y Pyodide en Web Worker.
- Realiza cambios pequeños y localizados.
- Antes de modificar cada archivo, lee su contenido actual.
- No confíes en copias antiguas del código que aparezcan en conversaciones.
- No crees archivos duplicados para resolver errores de importación.
- No cambies tecnologías ni arquitectura sin autorización.
- No inventes funciones supuestamente terminadas.
- Protege la autenticación y el progreso que ya funcionan.
- Nunca expongas claves, contraseñas ni secretos en logs, informes o respuestas.

## 4. Pruebas obligatorias

- Comprueba las rutas y dependencias antes de editar.
- Ejecuta las comprobaciones disponibles después de implementar.
- Corrige los errores de TypeScript, ESLint y compilación que introduzcan tus cambios.
- No des por terminada una tarea si la compilación falla.
- No afirmes que probaste una función si no la ejecutaste.
- Si una reparación requiere una operación destructiva o externa, detente y solicita autorización.

## 5. Prioridad

La prioridad es reparar y completar la aplicación existente sin destruir nada.
Antes de cada acción potencialmente destructiva, pide permiso y espera la respuesta.
