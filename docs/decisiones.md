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

## Decisión 3.2 — CSP completa y aislamiento del código del estudiante

### Contexto
La CSP original era mínima (solo `base-uri`, `object-src`, `frame-ancestors`). Había que añadir una CSP completa para prevenir inyección de código, exfiltración de datos y carga de recursos externos no autorizados.

### Opciones
- **Opción A:** CSP en modo Report-Only en desarrollo, enforce en producción.
- **Opción B:** CSP enforce en todos los entornos.
- **Opción C:** CSP muy permisiva (solo cabeceras básicas).

### Decisión
**Opción A:** CSP completa con `Content-Security-Policy-Report-Only` en desarrollo y `Content-Security-Policy` (enforce) en producción.

### Motivo
- Report-Only permite recoger violaciones sin romper la funcionalidad durante el desarrollo.
- En producción, enforce bloquea activamente cargas no autorizadas.
- `'unsafe-eval'` se mantiene justificado: Pyodide compila WebAssembly en tiempo de ejecución y Monaco Editor usa eval para servicios de lenguaje. No hay alternativa sin perder estas funcionalidades.
- `'unsafe-inline'` para estilos es necesario por Tailwind CSS y estilos en línea de componentes.

### Archivos afectados
- Modificado: `next.config.mjs` (CSP completa)
- Nuevo: `src/app/api/csp-report/route.ts` (endpoint de informes CSP)
- Nuevo: `src/app/python-runner/page.tsx` (runner aislado en iframe)
- Nuevo: `tests/hostile.test.ts` (pruebas de aislamiento y CSP)
