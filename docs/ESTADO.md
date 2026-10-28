# Estado del Proyecto — Python desde Cero

## Hito actual: H2 (Editor, ejecutor sandbox, Turtle)

## Hito H0 — COMPLETADO ✅
- Rama `producto-v1` creada desde `fase-3-5-correctivos`
- `npm install` exit 0, 440 paquetes, 0 vulnerabilidades
- `postinstall` repara Pyodide y Monaco
- `npx tsc --noEmit` exit 0
- `npx vitest run` exit 0, 22 tests pasando
- `npm run build` exit 0, 14 páginas estáticas
- `npm run dev` — localhost:3000 responde HTTP 200
- `npm run doctor` creado, exit 0
- Supabase local: NO EJECUTADO (Docker no disponible)

## Hito H1 — COMPLETADO ✅
- 6 temas: Original, Oscuro, Drácula, Cyberpunk, Hacker, Rosa + Sistema
- Tokens CSS semánticos completos en `src/app/themes.css`
- 381+25 colores hardcoded migrados a `var(--theme-*)`
- ThemeProvider con 7 temas, persistencia localStorage, data-theme en html
- ThemeSelector con preview de color, estados hover/focus/active
- Páginas 404, 500, offline con identidad propia
- Scripts `check:theme-coverage` y `check:contrast` pasando
- `docs/informes/h1-inventario-ui.md` — inventario de todos los elementos UI
- `docs/informes/h1-temas/index.html` — hoja de contactos
- `tests/theme-visual.test.ts` — pruebas visuales Playwright
- tsc, vitest, build en exit 0

## Hito H2 — EN PROGRESO ⏳
- Editor: evaluar CodeMirror 6 vs Monaco
- Ejecutor sandbox: iframe sin allow-same-origin, watchdog con worker.terminate()
- Turtle: módulo real en sys.modules, comandos JSON, renderizado SVG animado
- Traductor de errores Python → español
- Pruebas hostiles en Chromium real

## Próximos: H3-H10
- H3: Originalidad total (limpieza Cisco/PE1/PCEP)
- H4: Backend, cuentas, correos, antifraude
- H5: Seguridad 7+1 capas
- H6: Contenido 100+ ejercicios
- H7: Juego de cocina determinista
- H8: Portada, navegación, pulido UX
- H9: Despliegue reproducible
- H10: QA final y entrega

## Bloqueos
- Docker no disponible: Supabase local, pgTAP tests NO EJECUTADOS
- .env.local apunta a Supabase remoto (debe apuntar a local para desarrollo)
- npm run lint se cuelga en este entorno

## Comando para retomar
`cd c:\Users\USUARIO\python-pe1-academy && npm install && npm run build`
# Estado del proyecto — Hito H1 (en progreso)

**Rama:** `producto-v1` (desde `fase-3-5-correctivos`)
**Fecha:** 27/10/2026
**Hito actual:** H1 — Identidad, sistema de diseño, 6 temas y microinteracciones (EN PROGRESO)
**Hito anterior:** H0 — Línea base que arranca y compila (COMPLETADO)

## Qué está hecho (H0)
- Rama `producto-v1` creada desde `fase-3-5-correctivos`
- `npm install` completado (exit 0, 0 vulnerabilidades)
- `scripts/restore-browser-assets.js` reparado
- `postinstall` verificado: Pyodide + Monaco copiados a `public/`
- `npx tsc --noEmit`: exit 0
- `npx vitest run`: exit 0, 22 tests pasados
- `npm run build`: exit 0, 14/14 páginas estáticas
- `npm run doctor`: exit 0 (3 advertencias: puerto 3000 en uso, Docker/CLI no disponibles)

## Qué está hecho (H1 — parcial)
- `src/app/themes.css`: 6 temas + Sistema con tokens CSS semánticos completos (--theme-bg, --theme-ink, --theme-accent, --theme-border, --theme-success, --theme-error, --theme-warning, --theme-focus-ring, --theme-shadow, --theme-glow, --theme-ink-inverse, etc.)
- `src/app/globals.css`: limpiado, sin variables hardcoded, delega a themes.css
- `src/app/theme-provider.tsx`: 7 temas (original, dark, dracula, cyberpunk, hacker, rosa, sistema), persistencia localStorage, data-theme en HTML, data-color-scheme, prefers-reduced-motion, forced-colors
- `src/components/ThemeSelector.tsx`: 7 opciones con preview de color, estados hover, focus-visible, usando var(--theme-*) para todos los colores
- `src/components/AcademyDashboard.tsx`: migrado a tokens CSS
- `src/components/LessonStudy.tsx`: migrado a tokens CSS
- `src/components/LessonProgress.tsx`: migrado a tokens CSS
- `src/components/PythonEditor.tsx`: migrado a tokens CSS
- `src/components/PortadaLab.tsx`: migrado a tokens CSS
- `src/app/login/page.tsx`: migrado a tokens CSS
- `src/app/login/forgot-password/page.tsx`: migrado a tokens CSS
- `src/app/login/reset-password/page.tsx`: migrado a tokens CSS
- `src/app/admin/invitaciones/page.tsx`: migrado a tokens CSS
- `src/app/practica/page.tsx`: migrado a tokens CSS
- `src/app/page.tsx`: migrado a tokens CSS
- `src/app/python-runner/page.tsx`: migrado a tokens CSS (text-red-600 → text-[var(--theme-error)])
- `scripts/migrate-colors.mjs`: script de migración (381 replacements)
- `scripts/migrate-colors2.mjs`: segunda pasada (25 replacements)
- `scripts/check-theme-coverage.mjs`: verifica que no haya colores fijos en src/ fuera de themes.css → ✅ PASA
- `scripts/check-contrast.mjs`: verifica contraste WCAG en 6 temas → ✅ PASA (0 pares debajo del umbral)
- `package.json`: agregados scripts `check:theme-coverage` y `check:contrast`
- `npm run build`: exit 0
- `npx tsc --noEmit`: exit 0
- `npx vitest run`: exit 0, 22 tests pasados

## Qué falta (H1)
- Pruebas visuales Playwright: cada ruta × cada tema, verifica colores calculados difieren
- `docs/informes/h1-inventario-ui.md`: inventario de cada botón/enlace con su función
- `docs/informes/h1-temas/index.html`: hoja de contactos (páginas × 6 temas × móvil/desktop)

## Qué está hecho (H1 — páginas de error)
- `src/app/not-found.tsx`: 404 con diseño propio, enlaces funcional, tema-aware
- `src/app/error.tsx`: 500 con botón recargar, tema-aware
- `src/app/offline/page.tsx`: sin conexión, tema-aware, sin 'use client' (metadata es server-only)

## Qué falta (H0 — pendientes)
- Verificar `npm run dev` en `http://localhost:3000` sin errores de consola
- `npm run lint` (se cuelga en este entorno, problema conocido documentado)
- Supabase local NO DISPONIBLE (Docker y Supabase CLI no están instalados localmente) → NO EJECUTADO
- `.env.local` actualmente apunta a Supabase remoto; para desarrollo local debe apuntar a `http://localhost:54322`
- `supabase test db` (pgTAP) → NO EJECUTADO sin Docker

## Decisiones tomadas
- Un solo camino de build: Next.js 16.4.3 estándar
- CSP completa con Report-Only en dev / enforce en prod
- Turnstile + Supabase captchaToken
- Tokens CSS semánticos en `src/app/themes.css` con `[data-theme="..."]` selectores
- Tema por defecto: "sistema" (sigue prefers-color-scheme del dispositivo)
- Todos los colores de componentes usan `var(--theme-*)` vía clases Tailwind arbitrarias `[color:var(--theme-*)]`, `bg-[var(--theme-*)]`, etc.

## Bloqueos
- ESLint scope completo se cuelga en este entorno
- Docker/Supabase CLI pueden no estar disponibles para Supabase local

## Comando para retomar
`git checkout producto-v1 && npm install && npx tsc --noEmit && npm test && npm run build`
