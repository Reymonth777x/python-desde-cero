# Decisiones técnicas — FASE 3

## Decisión 3.1 — Un solo camino de build para despliegue

### Contexto
El repositorio convive con dos caminos de build:
1. `next dev/build/start` (Next.js 16.4.3, estable, estándar).
2. `vite dev/build` + `vinext` + `@cloudflare/vite-plugin` (beta) + `cf` (beta) para desplegar en Cloudflare Workers.

Ambos producen una salida funcional, pero el segundo depende de paquetes en beta (`@cloudflare/vite-plugin@^2.0.0-beta.v.4`, `vinext@^1.3.1`, `@vinext/cloudflare@^1.2.1`, `cf@^1.0.0-beta.21`) y no tiene configuración de wrangler (`wrangler.toml`/`wrangler.json` ausentes). No hay evidencia de que el camino vinext se haya desplegado realmente con estabilidad.

### Opciones
- **Opción A:** Mantener solo Next.js 16.4.3 (`next dev/build/start`). Eliminar vite/vinext/cloudflare.
- **Opción B:** Mantener ambos caminos en paralelo.
- **Opción C:** Migrar completamente a vinext/cloudflare.

### Decisión
**Opción A:** Un solo camino de build basado en Next.js 16.4.3. Se elimina `vite.config.ts`, los scripts `dev:vinext`/`build:vinext`/`start:vinext`/`deploy:vinext` y las dependencias `@vinext/cloudflare`, `vinext`, `@cloudflare/vite-plugin` y `cf`.

### Motivo
- Next.js 16.4.3 es estable, mantenida y ya verificada en build (exit code 0 en FASE 2).
- Los paquetes de Cloudflare vía vinext están en beta (versiones con `beta` en el rango) y no son aptos para producción sin validación adicional.
- Cero dependencias beta nuevas en producción.
- El despliegue en Cloudflare puede hacerse con el output estándar de Next.js (adapter o export) cuando el humano lo decida; el comando queda documentado en `docs/informes/fase-3.md`.

### Archivos afectados
- Eliminado: `vite.config.ts`
- Modificado: `package.json` (quitar scripts vinext y dependencias beta cloudflare/vinext/cf)
- Modificado: `playwright.config.ts` (e2e contra `npm run start`, build de producción)
