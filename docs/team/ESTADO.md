# Estado del Proyecto — Ronda 2

## Resumen
Proyecto "Python desde cero" (https://python-desdecero.com) en reparación y auditoría completa.

## Rama actual
- `fix/local-login-searchparams-20261028` (publicada en origin)
- SHA: 94ff1a3

## Cambios aplicados en Ronda 2
1. Reemplazado `src/app/login/page.tsx` y creado `src/app/login/LoginForm.tsx` desde PR #5 de ChatGPT
   - Antes: Client Component con `use(searchParams ?? Promise.resolve({}))` — frágil, creaba nueva Promise cada render
   - Después: Server Component con `await searchParams` + `LoginForm` client component separado
   - `SearchParams` type: `error?: string | string[]`, `message?: string | string[]`
   - `useFormStatus()` para estados de carga en botones
   - `aria-live="polite"` en mensajes de error/mensaje
2. `.gitignore`: agregado `dev-server.*.log`

## Verificaciones completadas
- `npx tsc --noEmit`: 0 errores
- `npx vitest run`: 22/22 tests pasando
- Todas las rutas principales responden HTTP 200 en localhost

## Pendientes
- Fase 2: Verificación completa en localhost con Playwright (360px, 768px, 1280px)
- Fase 2: Corrección de `src/app/admin/invitaciones/page.tsx` (manejo de errores de form actions)
- Fase 2: Pruebas de laboratorio Pyodide
- Fase 3: Pruebas automatizadas exhaustivas
- Fase 4: Revisión crítica final
- Fase 5: Reporte final

## Bloqueos
- Ninguno por el momento