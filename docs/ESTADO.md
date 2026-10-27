# Estado del proyecto — Hito H0

**Rama:** `producto-v1` (desde `fase-3-5-correctivos`)
**Fecha:** 27/10/2026
**Hito actual:** H0 — Línea base que arranca y compila (COMPLETADO)

## Qué está hecho
- Rama `producto-v1` creada desde `fase-3-5-correctivos`
- Proceso node colgado (PID 8360) detenido
- Directorio `.next` obsoleto limpiado
- `npm install` completado (exit 0, 0 vulnerabilidades)
- `scripts/restore-browser-assets.js` reparado: `pyodideSrc` apunta a `node_modules/pyodide` (no a `node_modules/pyodide/full`, que no existe)
- `postinstall` verificado: Pyodide copiado a `public/pyodide/0.29.5/full/`, Monaco copiado a `public/monaco/vs/`
- `npx tsc --noEmit`: exit 0 (sin errores de TypeScript)
- `npx vitest run`: exit 0, 5 archivos, 22 tests pasados
- `npm run build`: exit 0, Next.js compiló, 14/14 páginas estáticas, typecheck interno OK

## Qué falta
- Verificar `npm run dev` en `http://localhost:3000` sin errores de consola
- `npm run lint` (se cuelga en este entorno, problema conocido documentado)
- Supabase local NO DISPONIBLE (Docker y Supabase CLI no están instalados localmente) → marcar como NO EJECUTADO con instrucciones para el humano
- `.env.local` actualmente apunta a Supabase remoto; para desarrollo local debe apuntar a `http://localhost:54322`
- `supabase test db` (pgTAP) → NO EJECUTADO sin Docker

## Decisiones tomadas
- Un solo camino de build: Next.js 16.4.3 estándar (Decisión 3.1)
- CSP completa con Report-Only en dev / enforce en prod (Decisión 3.2, 3.4)
- Turnstile + Supabase captchaToken (Decisión 3.3)
- `scripts/restore-browser-assets.js` corrigido para copiar Pyodide desde `node_modules/pyodide/` (raíz del paquete)

## Bloqueos
- ESLint scope completo se cuelga en este entorno (problema previo documentado; archivos tocados pasan individualmente)
- Docker/Supabase CLI pueden no estar disponibles para Supabase local

## Comando para retomar
`git checkout producto-v1 && npm install && npx tsc --noEmit && npm test && npm run build`
