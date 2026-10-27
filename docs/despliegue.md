# Despliegue a Cloudflare

## Hallazgos (documentación oficial de Cloudflare, verificada)

### Adaptador recomendado
Cloudflare recomienda **vinext on Workers** para aplicaciones Next.js full-stack
(SSR, React Server Components, Server Actions, route handlers y middleware).
Para exportación estática, usar Cloudflare Pages con `next export`.

Fuente: https://developers.cloudflare.com/pages/framework-guides/nextjs/

> "Cloudflare recommends vinext on Workers for full-stack Next.js applications,
> including server-side rendering, React Server Components, Server Actions,
> route handlers, and middleware."

### Estado de vinext
**vinext está en beta** (versiones con `beta` en el rango). Por la **Decisión 3.1**,
el repositorio mantiene un solo camino de build (`next dev/build/start`) y no
incluye dependencias beta en producción.

### Despliegue estático a Cloudflare Pages (funciona)
1. `npm run build` → genera `.next/`
2. `npm run preview` → `wrangler pages dev .next` (servidor local en http://127.0.0.1:8788)
3. `npm run deploy` → `wrangler pages deploy .next` (despliega a Pages)

**Limitación:** `.next` es output de `next build` con renderizado del servidor.
Pages espera archivos estáticos (`next export`). Con `next build` sin `export`,
algunas rutas pueden devolver 404 bajo Pages estático. Para uso real en Pages,
ejecutar `next export` (pierde Server Actions y renderizado dinámico).

### Despliegue full-stack a Cloudflare Workers (requiere vinext, beta)
Requeriría:
1. Reinstalar `@vinext/cloudflare`, `vinext`, `@cloudflare/vite-plugin`, `cf`
2. Crear `wrangler.toml` con configuración de Workers
3. Configurar `vite.config.ts` con plugin de vinext
4. Desplegar con `wrangler deploy`

**No implementado** por depender de paquetes beta (Decisión 3.1).

### Límites de Cloudflare Workers (verificados)

| Recurso | Plan Free | Plan Paid |
|---------|-----------|-----------|
| CPU time por request | 10 ms | 50 ms |
| Memoria | 128 MB | 256 MB |
| Requests diarias | 100,000 | Ilimitadas |
| Subrequests/request | 50 | 50 |
| Variables de entorno | 4 KB | 16 KB |
| Wall time (HTTP) | Ilimitada | Ilimitada |

Fuente: https://developers.cloudflare.com/workers/platform/limits/

### Incompatibilidades conocidas
- **Middleware/Proxy:** Next.js middleware requiere runtime de servidor (no compatible con Pages estático sin vinext).
- **Server Actions:** Requieren servidor Node.js (no compatible con Pages estático).
- **Pyodide WASM:** Requiere `wasm-unsafe-eval` o `unsafe-eval` en CSP; funciona en Workers pero consume CPU limitado.

### Archivos de configuración
- `wrangler.toml` — configuración de Pages (build_output = `.next`)
- `package.json` — scripts `preview` y `deploy`

### Comandos (ejecutar por el humano)
```bash
# Build
npm run build

# Preview local
npm run preview

# Desplegar a Cloudflare Pages
npm run deploy
```

### Recomendación
Para producción con funcionalidad completa (Server Actions, login, quiz),
evaluar migración a vinext cuando salga de beta, o usar una plataforma que
soporte Next.js nativamente (Vercel, etc.). Para despliegue estático simple
en Cloudflare Pages, usar `next export` + `npm run deploy`.