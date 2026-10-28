# Estado del Proyecto — Ronda 2

## Resumen
Proyecto "Python desde cero" (https://python-desdecero.com) en reparación y auditoría completa.

## Rama actual
- `fix/local-login-searchparams-20261028` (publicada en origin)
- SHA: 94ff1a3

## Cambios aplicados en Ronda 2 (FASE 1 COMPLETADA)
1. Reemplazado `src/app/login/page.tsx` y creado `src/app/login/LoginForm.tsx` desde PR #5 de ChatGPT
   - Antes: Client Component con `use(searchParams ?? Promise.resolve({}))` — frágil
   - Después: Server Component con `await searchParams` + `LoginForm` client component separado
   - `SearchParams` type: `error?: string | string[]`, `message?: string | string[]`
   - `useFormStatus()` para estados de carga en botones
   - `aria-live="polite"` en mensajes de error/mensaje
2. Corregido `src/app/admin/invitaciones/page.tsx`:
   - `handleCreateInvitation` ahora captura errores de `createInvitation` y redirige con mensaje
   - `handleDeleteInvitation` ahora captura errores de `deleteInvitation` y redirige con mensaje
   - Agregado `searchParams` prop para mostrar errores/mensajes desde URL
   - `listError` renombrado para no colisionar con `params.error`
3. `.gitignore`: agregado `dev-server.*.log`
4. `docs/team/` creado con ESTADO.md, DECISIONES.md, AUDITORIA-CHATGPT.md, MIGRACIONES.md

## Verificaciones completadas
- `npx tsc --noEmit`: 0 errores
- `npx vitest run`: 22/22 tests pasando
- Todas las rutas principales responden HTTP 200 en localhost

## Fase 2 EN CURSO
- Verificación completa en localhost con Playwright (360px, 768px, 1280px)
- Flujo de auth completo: registro, confirmación por correo, login, logout, recuperar contraseña, restablecer contraseña, sesión persistente, rutas protegidas
- Laboratorio de Python: Pyodide, ejecutar código, turtle, input()
- Guardado de progreso en Supabase
- Panel admin e invitaciones

## Fase 3 pendiente
- Pruebas automatizadas exhaustivas con Playwright

## Fase 4 pendiente
- Revisión crítica final

## Fase 5 pendiente
- Reporte final

## Bloqueos
- Ninguno por el momento