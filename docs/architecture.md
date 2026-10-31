# Arquitectura local

## Stack

- Next.js 16 App Router, React 19 y TypeScript.
- Tailwind CSS 3 para la identidad crema y verde bosque.
- Supabase Auth y PostgreSQL mediante `@supabase/ssr`.
- Monaco para editar Python y Pyodide en `public/python-worker.js` para ejecutar en el navegador.
- Vitest para pruebas unitarias locales.

## Rutas

- `/`: información pública de la academia y módulos disponibles.
- `/login`: registro e inicio de sesión.
- `/login/forgot-password` y `/login/reset-password`: solicitud y cambio de contraseña.
- `/academia` y `/academia/[moduleId]/[lessonId]`: recorrido educativo autenticado.
- `/practica`: editor, ejecución y progreso.
- `/orilla` y `/orilla/[chapterId]`: práctica gamificada de Python, con campaña de 12 tramos y retos extra; requiere sesión.
- `/admin/invitaciones`: gestión administrativa protegida en página y Server Action.
- `/auth/callback`: intercambio de códigos de Auth y redirección fija a práctica o restablecimiento.

## Límites de confianza

- Los clientes de navegador usan únicamente la URL y la clave publishable pública de Supabase.
- El cliente de servidor está aislado con `server-only`; obtiene cookies mediante la API asíncrona de Next.
- Middleware refresca/verifica claims para restringir aprendizaje. Las páginas y acciones administrativas vuelven a comprobar identidad y `profiles.is_admin`.
- RLS debe ser la protección final de filas. Las migraciones locales son la única evidencia disponible; el ACL y RLS remotos no se han consultado.
- Python se ejecuta en un Worker del navegador, con límites de duración y salida en el código existente. El Worker reduce el bloqueo de interfaz, pero no es aislamiento de seguridad absoluto.

## Orilla

Orilla comparte el Worker Pyodide del laboratorio mediante el `MessagePort` transferido y añade el motor didáctico `public/orilla-engine.py`. Su motor limita el subconjunto de Python permitido por AST, evalúa mapas y objetivos y devuelve eventos para reproducir el recorrido. La interfaz guarda código y resultados de práctica en `public.orilla_runs` por RPC autenticada; las estrellas son feedback de práctica, no notas oficiales de las evaluaciones del curso.

## Datos

El esquema local define `profiles`, `invitations` y `progress`. `progress` vincula usuario, módulo y lección con una restricción única. El trigger crea el perfil al crear la cuenta; la migración local 005 permite omitir invitación y consume atómicamente cualquier código proporcionado. La migración no se ha aplicado a ningún proyecto remoto.

La carpeta canónica de migraciones es `supabase/migrations/`. Hay copias históricas en `src/app/supabase/migrations/`; no se borraron para evitar eliminar trabajo existente. Mantenerlas sincronizadas o designarlas explícitamente como archivo pendiente.
