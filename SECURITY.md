# Política de Seguridad

## Versiones soportadas

| Versión | Soportada |
|---------|-----------|
| 0.1.0   | ✅        |

## Reportar una vulnerabilidad

Si descubres un problema de seguridad en Python desde cero, por favor no abra un issue público. Escríbe al propietario del repositorio para que pueda evaluar y corregir el problema antes de cualquier divulgación pública.

## Áreas de seguridad revisadas

- **Autenticación**: gestionada por Supabase Auth. El middleware del lado del servidor verifica la sesión con `getClaims()` y rechaza el acceso a rutas protegidas cuando no hay una sesión válida.
- **Row Level Security (RLS)**: todas las tablas de datos (`profiles`, `progress`, `invitations`) tienen RLS habilitado. Los usuarios solo pueden leer, insertar y actualizar sus propias filas.
- **Funciones `SECURITY DEFINER`**: `current_user_is_admin()` y `handle_new_user()` usan `SECURITY DEFINER` con `SET search_path = ''` para evitar inyección de rutas.
- **Grants explícitos**: la migración `004` revoca privilegios de tabla de `PUBLIC`, `anon` y `authenticated`, y concede solo lo necesario a `authenticated`.
- **Clientes de Supabase**: separación entre cliente de servidor (`server.ts`, con `server-only` y cookies asíncronas) y cliente de navegador (`client.ts`).
- **Variables de entorno**: `.env.local` está excluido de Git. Nunca subir claves, tokens ni credenciales al repositorio.

## Migraciones pendientes

Las migraciones `004_explicit_client_table_grants.sql` y `005_public_signup_optional_invitation.sql` están preparadas localmente pero no se han aplicado a ninguna base de datos remota. Requieren revisión y autorización explícita antes de ejecutarse en Supabase.

## Limitaciones conocidas

- La ejecución de Python se realiza en un Web Worker del navegador con Pyodide. No es un aislamiento de seguridad absoluto y no debe usarse para ejecutar código no confiable en un entorno de servidor.
- No se ha realizado una inspección remota de RLS/ACL en Supabase. El estado remoto debe verificarse antes de invitar a estudiantes reales.
