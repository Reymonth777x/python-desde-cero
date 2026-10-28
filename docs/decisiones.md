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

## Decisión 3.3 — Antibots en registro y login (Turnstile + Supabase captchaToken)

### Contexto
Los formularios de registro, login y recuperación de contraseña están expuestos a ataques de bots (credential stuffing, creación masiva de cuentas, fuerza bruta). Supabase Auth soporta CAPTCHA nativo mediante `captchaToken` en `signUp`, `signInWithPassword` y `resetPasswordForEmail`.

### Opciones
- **Opción A:** Cloudflare Turnstile (captchaToken nativo de Supabase Auth) + variables de entorno para claves
- **Opción B:** hCaptcha (también soportado por Supabase Auth)
- **Opción C:** Implementar rate limiting personalizado en el servidor sin CAPTCHA

### Decisión
**Opción A:** Cloudflare Turnstile integrado mediante `captchaToken` de Supabase Auth en registro, login y recuperación. Claves por variables de entorno (`.env.example`, sin valores reales). Claves de prueba de Turnstile en local/e2e.

### Motivo
- Turnstile es gratuito, no requiere resolver desafíos en la mayoría de casos (invisible), y está integrado nativamente en Supabase Auth.
- `captchaToken` se valida en el servidor de Supabase, no en el cliente.
- Supabase Auth ya tiene rate limits integrados (30 req/5 min para login, 60s por usuario para recuperación, etc.).
- Los mensajes de error ya son uniformes (no revelan si el correo existe).

### Archivos afectados
- Modificado: `.env.example` (añadir NEXT_PUBLIC_TURNSTILE_SITE_KEY y TURNSTILE_SECRET_KEY)
- Modificado: `src/app/login/actions.ts` (verificar captchaToken en login, signup, requestPasswordReset)
- Modificado: `src/app/login/page.tsx` (widget Turnstile en formularios)
- Modificado: `src/app/login/forgot-password/page.tsx` (widget Turnstile)
- Modificado: `playwright.config.ts` (configurar Turnstile en e2e)
- Nuevo: `docs/decisiones.md` (esta decisión)

## Decisión 3.4 — CSP basada en hosts exactos y wasm-unsafe-eval (no nonces)

### Contexto
La CSP actual permite `'unsafe-eval'` (Pyodide WASM + Monaco Editor) y `'unsafe-inline'` para estilos (Tailwind). Se necesita añadir `challenges.cloudflare.com` (Turnstile) y reemplazar comodines `*.supabase.co` por el host exacto del proyecto en `connect-src`.

### Opciones
- **Opción A:** CSP basada en nonces (middleware inyecta nonce por request, renderizado dinámico, impacto en caché).
- **Opción B:** CSP basada en hashes de scripts en línea (pre-computados en build, sin impacto en caché).
- **Opción C:** CSP con hosts explícitos y `'unsafe-eval'` mantenido (sin nonces ni hashes, más simple).

### Decisión
**Opción C:** CSP con hosts explícitos, `'unsafe-eval'` mantenido (justificado por Pyodide WASM y Monaco), y `wasm-unsafe-eval` añadido como alternativa más restrictiva.

### Motivo
- **Nonces (Opción A)** requerirían middleware en todas las rutas y harían el renderizado dinámico (por request), eliminando el caché estático de Next.js. El costo de rendimiento es alto para un beneficio marginal dado que `'unsafe-eval'` ya está presente.
- **Hashes (Opción B)** requieren computar SHA-256 de todos los scripts en línea en build time. Next.js 16 ya gestiona los scripts de forma segura; los scripts en línea del usuario son mínimos. El beneficio no justifica la complejidad.
- **Hosts explícitos (Opción C)** es el punto medio pragmático: elimina comodines en `connect-src`, añade Turnstile explícitamente, y mantiene `'unsafe-eval'` solo donde es técnicamente necesario (Pyodide/Monaco).
- `wasm-unsafe-eval` se añade como directiva más específica para WebAssembly, que algunos navegadores respetan en lugar de `'unsafe-eval'`.

### Archivos afectados
- Modificado: `next.config.mjs` (CSP con host exacto de Supabase, Turnstile en script-src/frame-src, wasm-unsafe-eval)
- Modificado: `playwright.config.ts` (quitar excepciones googleapis/gstatic)
- Modificado: `docs/decisiones.md` (esta decisión)


## Decisión 3.5 — Despliegue full-stack en Cloudflare Workers con Vinext (actualiza la 3.1)

### Contexto
La aplicación requiere middleware, Server Actions, route handlers, SSR y autenticación con Supabase. La configuración anterior de Cloudflare Pages apuntaba directamente a `.next`, que es salida de Next.js con servidor y no equivale a una exportación estática completa. Esa configuración no garantiza que login, progreso ni rutas dinámicas funcionen en Pages.

La documentación oficial de Cloudflare, consultada el 28 de octubre de 2026, recomienda Vinext en Workers para aplicaciones Next.js full-stack y advierte que Vinext sigue en beta.

### Opciones
- **Opción A:** Pages con exportación estática, que no soporta todas las funciones de servidor necesarias.
- **Opción B:** Seguir sin publicar en Cloudflare y conservar únicamente Next.js estándar.
- **Opción C:** Mantener Next.js estándar para CI y añadir Vinext como camino de despliegue Worker, con build propio y verificación independiente.

### Decisión
**Opción C**, a petición del responsable del proyecto. Se conserva `next build` para las comprobaciones estándar y se incorpora `build:vinext` más configuración de Cloudflare Workers para la publicación full-stack. Esta decisión sustituye a la opción A de la Decisión 3.1 exclusivamente en lo relativo al despliegue de producción.

### Riesgos y comprobación
Vinext y el adaptador de Cloudflare están en beta. No se considera desplegado ni validado por el mero hecho de compilar. El CI debe ejecutar ambos builds; después del acceso autorizado a Cloudflare se debe verificar en la URL pública el inicio de sesión, callback, acceso protegido y ejecución del editor. No se aplican migraciones remotas como parte del despliegue.

### Archivos afectados
- Restaurados: `vite.config.ts` y `cloudflare.config.ts`.
- Modificados: `package.json`, `package-lock.json`, workflow de CI, `.env.example` y documentación de despliegue.
- Eliminado: `wrangler.toml` de Pages, que apuntaba al directorio `.next`.
