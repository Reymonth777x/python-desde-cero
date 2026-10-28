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
