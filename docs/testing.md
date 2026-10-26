# Pruebas locales

## Comandos reproducibles

- `npm run lint`: ESLint con las reglas de Next Core Web Vitals y TypeScript.
- `npm run typecheck`: `tsc --noEmit`.
- `npm test`: Vitest.
- `npm run build`: build optimizado de Next.js.
- `npm audit`: reporte del registro npm; puede salir con código 1 cuando hay advisories o rangos todavía no actualizados.

## Cobertura presente

Las pruebas Vitest existentes cubren utilidades de callback Auth, estructura y evaluación del curso, worker Python simulado y normalización del código de invitación opcional. No se crean usuarios ni se consumen invitaciones durante estas pruebas.

No hay pruebas de integración PostgreSQL/Supabase locales disponibles en este entorno. Los tests unitarios del Worker simulan las respuestas; no sustituyen una prueba del Pyodide real en navegador.

## Pruebas externas pendientes

- Auth con envío de correo y confirmación en staging.
- Recovery de contraseña con enlace y sesión reales.
- RLS/ACL con roles anónimo, estudiante y administrador aislados.
- Invitaciones y concurrencia con una base aislada, nunca datos reales.
- Flujos autenticados de progreso y administración.
- Navegadores/dispositivos móviles físicos y red restringida.
