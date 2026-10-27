# Informe Hito H0 — Línea base que arranca y compila

**Rama:** `producto-v1`
**Commit:** `69b49a4`
**Fecha:** 27/10/2026

## Resumen

Se estableció la línea base del proyecto en la rama `producto-v1`. La aplicación compila, pasa los tests unitarios, el build de producción genera 14 páginas estáticas, y el servidor de desarrollo responde en `http://localhost:3000` con HTTP 200.

## Evidencia de comandos

| Comando | Exit | Resumen |
|---------|------|---------|
| `git checkout -b producto-v1` | 0 | Rama creada desde `fase-3-5-correctivos` |
| `npm install` | 0 | 440 paquetes, 0 vulnerabilidades; postinstall restaura Pyodide y Monaco |
| `npx tsc --noEmit` | 0 | Sin errores de TypeScript |
| `npx vitest run` | 0 | 5 archivos, 22 tests pasados |
| `npm run build` | 0 | Next.js compiló, 14/14 páginas estáticas, typecheck interno OK |
| `npm run dev` | 0 | `http://localhost:3000` responde HTTP 200 |
| `npm run doctor` | 0 | 0 errores, 2 advertencias (Docker y Supabase CLI no disponibles localmente) |

## Cambios realizados

### `scripts/restore-browser-assets.js` (reparado)
- `pyodideSrc` apuntaba a `node_modules/pyodide/full/`, que no existe. El paquete npm `pyodide@0.29.5` publica los archivos en la raíz del paquete (`node_modules/pyodide/`). Se corrigió la ruta.

### `scripts/doctor.mjs` (nuevo)
- Script de verificación de entorno de primera instalación.
- Verifica: versión de Node.js (>= 20.9), existencia de `node_modules`, `.env.local`, puertos 3000/3001 libres, Docker, Supabase CLI, assets de Pyodide en `public/pyodide/0.29.5/full/`, assets de Monaco en `public/monaco/vs/`, Next.js binario.
- Sale con código 0 si no hay errores (las advertencias no bloquean).

### `package.json` (modificado)
- Agregado script `"doctor": "node scripts/doctor.mjs"`.

### `.gitignore` (modificado)
- Agregado `/.wrangler/` y `/supabase/.temp/`.

### `docs/ESTADO.md` (nuevo)
- Estado del hito H0, qué está hecho, qué falta, bloqueos, comando para retomar.

### `docs/informes/hito-0.md` (nuevo)
- Este informe.

## Estado NO EJECUTADO / NO VERIFICADO

1. **Supabase local**: Docker y Supabase CLI no están instalados en este entorno. No se pudo ejecutar `npx supabase start`, aplicar migraciones 001-013, ni ejecutar `supabase test db` (pgTAP).
   - **Instrucciones para el humano:** Instalar Docker Desktop con WSL 2, instalar Supabase CLI, crear `.env.local` apuntando a `http://localhost:54322`, ejecutar `npx supabase start`, aplicar migraciones en orden, ejecutar `supabase test db`.

2. **`.env.local` apunta a Supabase remoto**: Actualmente apunta a `https://nuqydanbbgqcofcftshk.supabase.co`. Para desarrollo local debe apuntar al Supabase local.

3. **`npm run lint`**: Se cuelga en este entorno (problema previo documentado en `docs/informes/fase-3.md`). Los archivos tocados pasan ESLint individualmente con 0 errores y 0 warnings.

## Próximo paso

Continuar con **H1: Identidad, sistema de diseño, 6 temas y microinteracciones**.
