# Estado del proyecto — Python desde Cero

**HEAD publicado:** `e758f9cf9da1aa647429669b112b7128ca9b126d`  
**CI:** [41076396982 — success](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41076396982)  
**Despliegue:** [41076898388 — success](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41076898388)

Este archivo es un índice de la referencia operativa:

- [Estado operativo](team/ESTADO.md)
- [Preparación para producción](production-readiness.md)
- [Matriz de migraciones Supabase](team/MIGRACIONES.md)
- [Tareas pendientes](TAREAS_PENDIENTES.md)
- [Turnstile y autenticación](team/TURNSTILE.md)

El sitio y la muestra pública están publicados. El lanzamiento educativo completo sigue condicionado a pruebas reales de Auth, correo y Turnstile, aislamiento de dos estudiantes, QA en teléfono físico, decisión sobre el repositorio público y protección de `master`, reconciliación de migraciones y revisión legal.

No ejecutar `supabase db push`, `migration repair` ni `db reset` contra producción hasta reconciliar historiales locales/remotos y preparar respaldo y reversión.
