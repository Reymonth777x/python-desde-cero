# Usuarios de Prueba — Entorno Local

Este documento lista las credenciales de usuario para pruebas en el entorno de desarrollo local.
**Nunca usar estas credenciales en producción.**

## Credenciales

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Estudiante | `estudiante@python-desdecero.local` | `Estudiante123!` |
| Docente | `docente@python-desdecero.local` | `Docente123!` |
| Administrador | `admin@python-desdecero.local` | `Admin123!` |

## Cómo crear estos usuarios

Ejecutar el script de semilla contra Supabase local:

```bash
# Configurar variables de entorno para Supabase local
export SUPABASE_URL=http://localhost:54322
export SUPABASE_ANON_KEY=<tu-anon-key-local>

# Ejecutar seed
node scripts/seed-dev-users.mjs
```

## Permisos por rol

- **Estudiante**: Acceso a `/estudiante`, `/academia`, `/practica`. Puede ver lecciones, ejecutar código en el laboratorio y jugar el juego de cocina.
- **Docente**: Acceso a `/docente`. Puede ver progreso de estudiantes, gestionar invitaciones.
- **Administrador**: Acceso a `/admin`. Gestión completa de usuarios, invitaciones y configuración.

## Notas

- Los usuarios se crean con `email_confirm: true` (auto-confirmados) en entorno local.
- El script `seed-dev-users.mjs` rechaza cualquier URL que no sea `localhost` o `127.0.0.1` para evitar accidentes en producción.
- Para producción, crear usuarios a través del flujo normal de registro con confirmación por correo.