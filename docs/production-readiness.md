# Preparación para producción

## Estado actual

- **APROBADA localmente:** framework actualizado a Next.js 16.4.3 y React 19.3.1; el build registra rutas App Router.
- **APROBADA localmente:** lint, TypeScript y pruebas unitarias; revisar los resultados de esta sesión en `docs/security-audit.md`.
- **PENDIENTE:** ejecutar en Supabase staging las migraciones que correspondan. La 005 es necesaria para que el registro sin código funcione con un trigger basado en la migración 003. Las migraciones 011 (quiz_attempts, restricciones de progress y función RPC SECURITY DEFINER) y 012 (GRANT USAGE en schema private e invitations.expires_at NOT NULL) están preparadas localmente y requieren revisión/aprobación antes de aplicarse.
- **PENDIENTE:** callback, confirmación de correo y recuperación dependen de los URL allowlist, plantillas y entrega de correo configurados en Supabase Auth.
- **PENDIENTE:** verificar ACL/RLS/triggers efectivos, límites de Auth, MFA/controles de administrador y backups/restauración en el proyecto real.
- **PENDIENTE:** comprobar dominio, HTTPS/HSTS y CSP final en el alojamiento real. El alojamiento y dominio no están demostrados en este repositorio.
- **PENDIENTE:** revisar privacidad, retención, ejercicio de derechos y tratamiento de menores con asesoría adecuada para Costa Rica. La presencia de documentos técnicos no demuestra cumplimiento legal.
- **PENDIENTE:** comprobar la ejecución de Monaco/Pyodide en teléfonos reales y redes lentas. La emulación de navegador no sustituye una prueba física.

## Barreras antes de lanzamiento

1. Ejecutar 005 primero en Supabase local/staging y probar el trigger con cuentas desechables; solicitar aprobación explícita antes de producción.
2. Verificar que la configuración de correo permite los callbacks de alta y reset en el dominio HTTPS final.
3. Obtener una inspección de solo lectura del ACL/RLS remoto y verificar respaldos/restauración; no cambiar tablas o permisos durante esa inspección.
4. Resolver o documentar con proveedor/registro las alertas pendientes de `npm audit`. La auditoría local actual reporta una advertencia moderada para Tailwind 3, mientras GitHub publicó un arreglo compatible 6.1.5 para el parser fijado; debe repetirse el audit cuando npm sincronice su rango.
5. Preparar monitoreo, retención de logs, contacto de incidentes, privacidad y revisión legal costarricense.
6. Hacer pruebas navegadores móviles reales y flujo completo de Auth en staging; no usar datos de estudiantes.

## Costos y acciones externas

No se desplegó, cambió DNS ni creó un servicio externo. El costo del hosting, correo transaccional, monitoreo y Supabase depende del proveedor y del plan que se seleccione; no se ha contratado ni verificado ninguno.
