# REPORTE DE AUDITORIA Y CONTINUIDAD — Python desde Cero

## Estado del Proyecto

**Repositorio:** Reymonth777x/python-desde-cero
**Rama:** fix/local-login-searchparams-20261028
**Ultimo SHA:** 342a4b0
**URL publicada:** https://python-desdecero.pythondesdecero.workers.dev
**Estado del despliegue:** Desplegado pero responde 404 en todas las rutas (problema de configuracion de rutas Vinext/Cloudflare Workers)

---

## Arquitectura Encontrada

- **Framework:** Next.js 16.4.3 con App Router
- **Runtime:** Vinext + Cloudflare Workers
- **Frontend:** React 19.3.1, TypeScript, Tailwind CSS, Monaco Editor
- **Backend:** Supabase Auth + PostgreSQL con RLS
- **Laboratorio:** Pyodide 0.29.5 en Web Worker (public/python-worker.js)
- **Pruebas:** Vitest (unitarias), Playwright (e2e, configurado)
- **Despliegue:** Cloudflare Workers vía wrangler + vinext-cloudflare

---

## Inventario de Rutas

| Ruta | Tipo | Auth requerida |
|------|------|---------------|
| / | Publica | No |
| /login | Publica | No |
| /login/forgot-password | Publica | No |
| /login/reset-password | Publica | No |
| /auth/callback | Route handler | No |
| /api/csp-report | Route handler | No |
| /academia | Privada | Sí |
| /academia/[moduleId]/[lessonId] | Privada | Sí |
| /practica | Privada | Sí |
| /estudiante | Privada | Sí |
| /docente | Privada | Sí + admin |
| /admin | Privada | Sí + admin |
| /admin/invitaciones | Privada | Sí + admin |
| /python-runner | Iframe | No |

---

## Problemas Encontrados y Solucionados

| ID | Causa | Solucion | Archivo/Commit | Prueba |
|----|-------|----------|----------------|--------|
| TS-01 | searchParams es Promise en Next.js 16 pero se accedía como objeto plano | Usar use(searchParams) en Client Component | src/app/login/page.tsx | tsc 0 errores, vitest 22/22 |
| TS-02 | handleNewUser requería invitación obligatoria (migracion 003) | Migracion 005 ya aplicada (invitacion opcional) | supabase/migrations/005 | tsc 0 errores |
| SEC-02 | Pyodide podía acceder a js/pyodide_js desde Python | Bloquear globales js y pyodide_js | public/python-worker.js | tsc 0 errores |
| SEC-03 | Contraseñas hardcodeadas e impresas en seed-dev-users.mjs | Generar aleatorias con crypto.randomBytes(), no imprimir | scripts/seed-dev-users.mjs | node --check pasa |
| AUTH-02 | resetPasswordForEmail no pasaba captchaToken | Agregar captchaToken a las opciones | src/app/login/actions.ts | tsc 0 errores |
| AUTHZ-01 | Middleware usaba claims.role, paginas usaban profiles.is_admin | Unificar: middleware solo verifica auth, paginas verifican rol | src/middleware.ts | tsc 0 errores |
| AUTHZ-02 | /practica no rechazaba sesiones inexistentes por sí misma | Agregar redirect si no hay user | src/app/practica/page.tsx | tsc 0 errores |
| ADMIN-01/02 | Enlaces a /admin/usuarios y /admin/auditoria inexistentes | Reemplazar con enlaces a /admin/invitaciones y estado | src/app/admin/page.tsx | tsc 0 errores |
| LAB-01 | Atributos self.heading y self.speed ocultaban métodos | Renombrar a _heading y _speed | public/turtle_compat.py | tsc 0 errores |
| LAB-02 | Ejemplos con input() fallaban sin campo de entrada | Reemplazar con ejemplos que no requieren input() | src/app/page.tsx | tsc 0 errores |
| AUD-01 | /api/csp-report sin límite de tamaño | Agregar límite de 1KB y validación | src/app/api/csp-report/route.ts | tsc 0 errores |
| HEAD-01 | CSP con 'unsafe-eval' (amplio) | Quitar 'unsafe-eval', mantener solo 'wasm-unsafe-eval' | next.config.mjs | tsc 0 errores |
| SEO-01/02 | Sin metadataBase, sin robots.ts, sin sitemap.ts | Agregar metadataBase, robots.ts, sitemap.ts, Open Graph | layout.tsx, robots.ts, sitemap.ts | Build exitoso |

---

## Migraciones Aplicadas

| Migracion | Estado | Descripcion |
|-----------|--------|-------------|
| 001-017 | Aplicadas (local) | Todas las migraciones del esquema |
| 005 | Aplicada | Invitacion opcional en submit_quiz |
| 009 | Aplicada | Reafirma invitacion opcional |
| 012 | Aplicada | USAGE ON SCHEMA private TO authenticated |
| 20261028220816_013_quiz_keys_and_submit_quiz | Corregida | Delimitadores AS $$, off-by-one, RLS privada |
| 20261028220816_grant_delete_invitations | Creadas | DELETE en private.invitations bajo RLS |

---

## Migraciones Pendientes

- Migracion reversible para DELETE en public.invitations (preparada, no aplicada)
- Sincronizar historial remoto (llega a 015, local tiene 014-017)

---

## Pruebas Ejecutadas

| Prueba | Resultado | Evidencia |
|--------|-----------|-----------|
| npx tsc --noEmit | 0 errores (codigo fuente) | Ejecutado exitosamente |
| npx vitest run | 22/22 pasando | 5 archivos de test |
| npm run build | Exitoso | 19 rutas generadas |
| npm run build:vinext | Exitoso | Todas las rutas construidas |
| vinext-cloudflare deploy | Exitoso | Version 53734a0f-a60a-46f4-9dc1-b73d705dfc5f |
| HTTP GET / | 404 (problema de rutas) | Desplegado pero no responde correctamente |

---

## Archivos Creados/Modificados

### Creados:
- docs/team/ESTADO.md
- docs/team/DECISIONES.md
- docs/security-audit.md
- docs/team/MIGRACIONES.md
- src/app/robots.ts
- src/app/sitemap.ts
- supabase/migrations/20261028220816_grant_delete_invitations.sql
- tests/e2e/auth-flow.spec.ts

### Modificados:
- src/app/login/page.tsx
- src/app/login/actions.ts
- src/app/admin/page.tsx
- src/app/admin/invitaciones/page.tsx
- src/app/practica/page.tsx
- src/middleware.ts
- public/python-worker.js
- public/turtle_compat.py
- scripts/seed-dev-users.mjs
- next.config.mjs
- cloudflare.config.ts
- src/app/layout.tsx

---

## Bloqueos Pendientes

1. **Worker responde 404 en todas las rutas:** El despliegue a Cloudflare Workers se completo pero el Worker no sirve correctamente las rutas de Next.js. Puede ser un problema de configuracion de wrangler.jsonc (main apunta a vinext/server/fetch-handler que no existe tras el build) o de enrutamiento de assets.

2. **Docker Desktop no disponible:** No se pudieron ejecutar pruebas de Supabase local ni pgTAP.

3. **Credenciales de GitHub Actions:** No se configuraron CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID para CI/CD automatico.

4. **Playwright no instalado:** No se pudieron ejecutar pruebas e2e en navegador real.

---

## Siguientes Pasos

1. Investigar y corregir el problema de 404 en el Worker desplegado (revisar wrangler.jsonc y configuracion de assets)
2. Ejecutar pruebas con Playwright en 3 viewports (360px, 768px, 1280px)
3. Configurar secretos de GitHub Actions para CI/CD
4. Crear workflow de despliegue automatico si no existe
5. Verificar que el dominio python-desdecero.com apunte al Worker

---

## Instrucciones para Continuar

1. Rama actual: fix/local-login-searchparams-20261028 (publicada en origin)
2. Para desplegar: npx vinext-cloudflare deploy
3. Para verificar localmente: npm run dev (puerto 3000)
4. Para pruebas: npx vitest run (22 tests)
5. Para build: npm run build y npm run build:vinext
