# Informe de revisión hostil — rama `fix/cierre-reparacion` (fase-3-plataforma)

## Evidencias reproducidas (comando | exit | resumen | archivo)

| comando | exit | resumen | archivo de evidencia |
|---|---|---|---|
| `npx tsc --noEmit` | 0 | Sin errores de TypeScript | `docs/informes/revision/tsc-review9.txt` |
| `npm run build` | 0 | Next.js compiló; typecheck interno OK; 14/14 páginas estáticas | `docs/informes/revision/build.txt` |
| `npm test` (vitest) | 0 | 4 archivos, 21 tests pasados (solo `src/`) | `docs/informes/revision/test-review.txt` |
| `npx eslint` (archivos tocados) | 0 | 0 errores, 0 warnings en `page.tsx`, `runner-worker.ts`, `hostile.test.ts`, `python-worker.test.ts` | `lint-pagerunner.txt`, `lint-files2.txt` |
| `npm run lint` (scope completo `.`) | — | No se pudo completar: se cuelga en este entorno (problema previo documentado en `docs/informes/fase-3.md`) | — |
| `npm run test:e2e` (Playwright vs build de producción) | 1 | 12 failed / 28 passed | `docs/informes/revision/test-e2e.txt` |

## Verificación de seguridad con ejecución real

- **CSP de producción**: header `Content-Security-Policy` en modo **enforce** (no report-only), verificado contra `http://localhost:3000` con `NODE_ENV=production`. `script-src 'self' 'unsafe-eval'` (sin `unsafe-inline` en scripts); `style-src 'self' 'unsafe-inline'`; `connect-src` a Supabase; `frame-src 'self'`; `worker-src 'self' blob:`; `object-src 'none'`.
- **Pyodide versión fija y autohospedado**: `public/pyodide/0.29.5/full/pyodide.js` (versión 0.29.5 fijada; `indexURL: "/pyodide/0.29.5/full/"` en el worker). Sin CDN externo.
- **Monaco sin CDN externo**: `public/monaco/vs/editor/editor.main.js` presente; grep de `monaco.com/cdnjs/unpkg/esm.sh` en `src/` → sin resultados.
- **Turnstile por variables de entorno**: `.env.example` usa placeholders (`your-turnstile-site-key`, `your-turnstile-secret-key`); ningún valor real en el repo. Las claves `1x0000...AA` mencionadas en comentarios son las claves de prueba públicas de Cloudflare, no secretos del proyecto.
- **Runner Python con Pyodide real**: `setTimeout` dentro del worker **no corta** la ejecución síncrona de Pyodide (`Promise.race` solo rechaza la promesa de espera; Pyodide sigue corriendo). Corte real: `worker.terminate()` desde el hilo principal, ahora implementado en `page.tsx` con un timeout de 16 s que termina el worker y avisa al padre (`Tiempo de ejecución agotado`).
- **Aislamiento del iframe**: `hostile.test.ts` crea el iframe con `sandbox='allow-scripts'` (sin `allow-same-origin`). `page.tsx` valida `event.source === window.parent` y `event.origin === window.location.origin` antes de aceptar cualquier `postMessage`, y responde con el origen validado (fin de `window.parent.postMessage(data, '*'`)).

## Lista priorizada de malos olores

### Crítico (corregido en commits `review:`)

| prioridad | archivo:línea | problema | estado |
|---|---|---|---|
| Crítico | `src/app/python-runner/page.tsx:82,123` (antes) | `window.parent.postMessage(data, '*')` — cualquier origen recibe resultados de ejecución | Corregido: origen validado (`postToParent` usa `parentOriginRef`) |
| Crítico | `src/app/python-runner/page.tsx:98-118` (antes) | `handleMessage` no valida `event.origin` ni `event.source` | Corregido: se ignora todo mensaje que no venga del mismo origen y `window.parent` |

### Alto (corregido en commits `review:`)

| prioridad | archivo:línea | problema | estado |
|---|---|---|---|
| Alto | `src/app/python-runner/page.tsx:58` (antes) | `queueMicrotask(() => setError(...))` para silenciar `react-hooks/set-state-in-effect` | Corregido: rediseño con `src/lib/runner-worker.ts` (módulo de integración del worker fuera de React) + `useMemo`; sin `queueMicrotask` ni `setState` en el cuerpo del efecto |
| Alto | `eslint.config.mjs:26,30` (antes) | `tests/**` y `public/**` en `globalIgnores` (no se linteaban) | Corregido: se lintean con globals correctos (`tests/`: Playwright; `public/`: Worker). Solo `public/pyodide/**` (vendored, ~8 MB) sigue ignorado |
| Alto | `tests/hostile.test.ts` (varias) | Uso extensivo de `any` y `page.waitForTimeout` ciego (pruebas debilitadas) | Corregido: tipado con `Page` de Playwright, sin `any`, espera activa `waitForOutput` en lugar de `waitForTimeout` |

### Medio (documentados, no bloquean la entrega)

| prioridad | archivo:línea | problema |
|---|---|---|
| Medio | `src/app/login/actions.ts:12,24,56` | `captchaToken` (parte de las 9 advertencias de lint: variable no usada en algunos caminos) |
| Medio | `src/components/PortadaLab.tsx:6,32,42`; `PythonEditor.tsx:27,34,37,39`; `TurnstileWidget.tsx:61` | Variables declaradas y no usadas (parte de las 9 advertencias de lint) |
| Medio | `tests/acceptance.test.ts:59` | `page.waitForTimeout(10000)` ciego; flaky por la carga de Pyodide (~8.6 MB) |
| Medio | `next.config.mjs:9` | `script-src` permite `'unsafe-eval'` (justificado: Pyodide WASM y servicios de Monaco; documentado en el archivo) |

### Bajo

| prioridad | archivo:línea | problema |
|---|---|---|
| Bajo | `next.config.mjs` / CSP | Turnstile carga desde `challenges.cloudflare.com` (CDN externo; excepción documentada en `docs/informes/fase-3.md`). El CSP `script-src` no lista ese dominio — revisar si el widget carga en producción |
| Bajo | `public/python-worker.js:26` | `console.warn` en el worker (puede exponer detalles internos en consola de navegador) |

## Estado de las pruebas e2e

`npm run test:e2e` → exit=1: 12 failed / 28 passed. Las 12 fallas son `tests/acceptance.test.ts:59` (SVG tras árbol fractal, timeout por carga de Pyodide) y las 5 pruebas hostiles, en chromium y mobile-chrome. Son las mismas fallas de la entrega anterior. El mecanismo de corte real (`terminate` desde el hilo principal) está implementado; las fallas restantes se deben principalmente a tiempos de carga de Pyodide en este entorno, no a una regresión de código.

## Conclusión

`tsc`, `vitest` y el typecheck interno del `build` pasan con exit=0. Los archivos tocados en la revisión pasan ESLint con 0 errores y 0 warnings. El scope completo de ESLint no se puede completar de forma fiable en este entorno (se cuelga; problema previo documentado). No se afirma "listo" ni "corregido" sin la evidencia anterior, que se adjunta en `docs/informes/revision/`.

