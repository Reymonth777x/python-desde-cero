# Decisiones Técnicas — Ronda 2

## D001: Usar solución de PR #5 para login/page.tsx
**Decisión:** Adoptar la solución de PR #5 de ChatGPT en lugar de la corrección previa (`use(searchParams!)`).
**Motivo:** PR #5 usa Server Component con `await searchParams` (correcto para Next.js 16) y separa `LoginForm` como client component con `useFormStatus()` para estados de carga. La solución previa usaba `use(searchParams!)` con aserción `!` frágil.
**Archivos afectados:** `src/app/login/page.tsx`, `src/app/login/LoginForm.tsx`

## D002: Excluir dev-server.*.log del control de versiones
**Decisión:** Agregar `dev-server.*.log` a `.gitignore`.
**Motivo:** Evitar subir logs del servidor de desarrollo al repositorio.

## Pendientes de decisión
- ¿Rol docente distinto de admin? (pendiente con el líder)
- ¿Laboratorio público con demo y sesión solo para guardar? (pendiente con el líder)