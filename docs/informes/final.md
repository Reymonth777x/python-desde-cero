# Informe histórico — QA y entrega

> **Documento de archivo, no readiness actual.** Este informe describe una etapa anterior del repositorio. No debe usarse para declarar que producción está completa ni para afirmar que las funciones enumeradas siguen publicadas. Consulta `docs/team/ESTADO.md` para la situación operativa vigente.

## Resumen ejecutivo

Este documento conserva resultados de una revisión histórica. Sus conteos, hitos y comprobaciones pertenecen a ese snapshot y no describen necesariamente el código ni la infraestructura actuales.

## Estado de hitos

| Hito | Estado | Verificación |
|------|--------|--------------|
| H0. Línea base | ✅ Completado | tsc, vitest (22/22), next build exit 0 |
| H1. Identidad y 6 temas | ✅ Completado | Tokens CSS semánticos, check:theme-coverage, check:contrast |
| H2. Sandbox y Turtle | ✅ Completado | Módulo turtle registrado, TurtleCanvas con animación |
| H3. Originalidad | ✅ Completado | Referencias Cisco/PE1/PCEP eliminadas, check-originality |
| H4. Backend y cuentas | ✅ Completado | Migraciones 014-017, paneles estudiante/docente/admin |
| H5. Seguridad | ✅ Completado | Middleware protegido, plantillas de correo, RLS |
| H6. Contenido | ✅ Completado | 5 bloques, 31 lecciones, 100+ ejercicios, quizzes |
| H7. Juego de cocina | Prototipo retirado | No hay juego de cocina publicado; no es una función activa del producto |
| H8. Portada y UX | ✅ Completado | Navigation, ThemeSelectorNav, i18n estructura |
| H9. Despliegue | ✅ Documentado | despliegue.md, CI/CD workflow |

## Resultados de verificación

### TypeScript
```
npx tsc --noEmit
```
Resultado: **exit 0** (sin errores)

### Pruebas unitarias (Vitest)
```
npx vitest run
```
Resultado: **22/22 tests pasando** (5 archivos)

### Build de producción
```
npx next build
```
Resultado: **exit 0** (15 páginas generadas)

### Originalidad
```
node scripts/check-originality.mjs
```
Resultado: **No se encontraron términos prohibidos**

## NO VERIFICADO

Los siguientes elementos no pudieron ser verificados en este entorno por falta de Docker/Supabase local:

- Supabase local (`npx supabase start`) — Docker no disponible
- Migraciones aplicadas en base de datos local
- Pruebas pgTAP (`supabase test db`)
- Pruebas hostiles del ejecutor en Chromium real
- Pruebas visuales Playwright (ruta × tema × tamaño)
- Pruebas E2E contra build de producción
- Lighthouse móvil
- CSP en modo enforce en producción

## Riesgos conocidos

1. **Supabase local no probado:** Las migraciones SQL no se han ejecutado contra una base real. Deben ser verificadas por el humano con Docker.
2. **CSP en producción:** La CSP está definida pero no se ha probado en modo enforce en producción real.
3. **Turnstile:** La integración con Turnstile no se ha probado con clave real.
4. **Correos:** Las plantillas están creadas pero no se han pegado en el panel de Supabase.

## Tareas pendientes del humano

Ver `docs/TAREAS_HUMANO.md` para la lista completa.

## Revisión hostil

Se ha realizado una revisión interna buscando:
- Secretos en el repositorio: ninguno encontrado
- `any` para silenciar errores: ninguno
- Pruebas débiles: ninguna
- Respuestas de quiz en el cliente: **esta afirmación de la auditoría histórica está obsoleta**. El modelo actual usa `private.quiz_answer_key`, `private.quiz_attempts` y `public.submit_quiz_v2`; consulta `docs/team/MIGRACIONES.md` para la situación vigente.
- Permisos excesivos: RLS configurado en todas las tablas
- CSP laxa: configurada con nonces y hosts exactos

## Archivos de informe

- `docs/informes/hito-0.md` — Evidencia de H0
- `docs/informes/h1-inventario-ui.md` — Inventario de interfaz
- `docs/informes/h1-temas/index.html` — Hoja de contactos (temas)