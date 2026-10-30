# Usuarios de prueba — desarrollo local

Este documento describe las cuentas que prepara `scripts/seed-dev-users.mjs` en una instancia local de Supabase. No hay contraseñas compartidas ni cuentas de prueba de producción.

## Cuentas creadas por el seed

| Cuenta | Permiso real |
|---|---|
| `estudiante1@python-desdecero.local` | Estudiante |
| `estudiante2@python-desdecero.local` | Estudiante |
| `admin@python-desdecero.local` | Administrador |

El esquema actual utiliza `profiles.is_admin`: distingue administradores de cuentas normales. **No existe un rol docente** ni una pantalla docente en el producto publicado.

## Preparar el entorno

Desde la raíz del repositorio, inicia el entorno local:

```powershell
.\\scripts\\start-local.ps1
```

El lanzador inicia Supabase local y prepara las cuentas. Las contraseñas aleatorias se guardan en:

```powershell
Get-Content .local\\dev-users.credentials.json
```

Ese archivo está excluido de Git. No copies sus credenciales a producción ni lo compartas.

## Rutas reales

- Estudiante: `/academia` y `/practica`, después de iniciar sesión.
- Administrador: `/admin`, si `profiles.is_admin = true`.
- `/estudiante` se conserva solamente como redirección de compatibilidad hacia `/academia`.
- No existe `/docente` ni un juego disponible para estudiantes.

El seed rechaza cualquier URL que no sea loopback (`localhost`, `127.0.0.1` o `::1`). Para producción, las cuentas se crean mediante el registro normal y la confirmación por correo.
