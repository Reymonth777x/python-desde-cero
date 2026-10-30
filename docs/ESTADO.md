# Estado del proyecto — Python desde Cero

**Actualizado:** 30 de octubre de 2026, 11:45 UTC  
**HEAD publicado:** 71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15  
**CI:** [41049538535 — success](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049538535)  
**Despliegue:** [41049961984 — success](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41049961984)

Este archivo es un índice breve. La referencia operativa detallada está en:

- [Estado operativo](team/ESTADO.md)
- [Preparación para producción](production-readiness.md)
- [Matriz de migraciones Supabase](team/MIGRACIONES.md)
- [Tareas pendientes](TAREAS_PENDIENTES.md)
- [Turnstile y autenticación](team/TURNSTILE.md)

El sitio está publicado y la muestra pública está verificada. El lanzamiento educativo completo sigue condicionado a pruebas reales de Auth/correo/Turnstile, dos cuentas de estudiante, revisión física móvil, protección del repositorio y de master, reconciliación de migraciones y revisión legal.

No ejecutar supabase db push, migration repair ni db reset contra producción hasta reconciliar los historiales locales/remotos y preparar respaldo y reversión.
