# Base de datos y migraciones pendientes

## Evidencia y límites

Las migraciones `001` a `005` en `supabase/migrations/` se revisan como código local. En esta auditoría no se ejecutó SQL, no se usó Supabase remoto y no se alteraron datos, usuarios, invitaciones, triggers o políticas remotas. No hay evidencia local de ACL reales, objetos aplicados manualmente, copias de seguridad ni prueba de restauración.

No se encontró Supabase CLI, PostgreSQL CLI o Docker disponible para levantar un entorno de base de datos aislado. Por tanto, las conclusiones sobre RLS y triggers son estáticas, no pruebas de ejecución.

## Secuencia local

- `001_schema.sql`: perfiles, invitaciones, progreso, RLS y políticas iniciales.
- `002_auth_profile_trigger.sql`: perfil al crear usuario.
- `003_require_invitation.sql`: trigger que exigía código válido de un solo uso.
- `004_explicit_client_table_grants.sql`: grants acotados para las operaciones del cliente; permanece sin aplicar.
- `005_public_signup_optional_invitation.sql`: propuesta local para permitir alta pública sin código y validar/consumir atómicamente el código si se proporciona.

La 005 modifica `public.handle_new_user()` de manera no destructiva; no cambia tablas, datos, políticas, grants ni permisos administrativos. Las cuentas con código inválido, caducado o usado siguen rechazándose. Un código sin fecha de caducidad conserva la semántica previa y no vence automáticamente.

## Acción antes de habilitar altas públicas

La interfaz y el código local admiten registro sin invitación, pero el trigger remoto 003 sigue exigiendo código hasta que se revise y autorice la aplicación de 005. No afirmar que el registro público completo funciona contra Supabase hasta aplicar y probar la migración en un entorno aislado/de staging y luego autorizar el cambio de producción. Antes de cualquier aplicación, inspeccionar ACL y estado de migraciones, confirmar respaldo restaurable, probar altas anónimas y con códigos válidos/inválidos/caducados/usados y revisar que RLS y el administrador permanecen intactos.

La migración 004 también requiere autorización y verificación del ACL previo antes de aplicarse. No ejecutar migraciones remotas automáticamente.

## Informe de intervención remota propuesta — migración 005

1. **Problema:** el producto solicita registro público sin código, pero `003_require_invitation.sql` rechaza cualquier `auth.users` nuevo cuyo metadato de invitación esté vacío. El código de página por sí solo no puede evitar ese bloqueo porque el trigger se ejecuta dentro de la inserción de Auth.
2. **Alcance exacto:** reemplazar solamente `public.handle_new_user()` según `supabase/migrations/005_public_signup_optional_invitation.sql`. La función vinculada al trigger existente `on_auth_user_created` seguirá creando el perfil. La migración no crea, borra ni altera tablas, columnas, filas, políticas RLS, grants, cuentas o roles.
3. **Comportamiento:** metadato ausente/vacío permite crear el perfil sin consumir invitación; metadato presente intenta una actualización condicional de una invitación que no se haya usado y cuya expiración sea futura o nula; si no existe coincidencia, el alta falla y la transacción no consume código. La actualización condicional conserva el uso único bajo concurrencia. El nombre se lee de `raw_user_meta_data.full_name` y no se modifica `is_admin`.
4. **Permisos:** se conserva `SECURITY DEFINER` y `SET search_path = ''` de la función actual. No se conceden ni revocan permisos. El trigger continúa invocando la función como mecanismo interno.
5. **Riesgos/efectos:** cambia deliberadamente la política de acceso y permite a cualquier visitante intentar registrar una cuenta con correo. Supabase Auth debe mantener confirmación, rate limits y controles de correo acordes. El código opcional inválido/usado/caducado sigue rechazándose; un código con `expires_at IS NULL` conserva la aceptación indefinida de la migración anterior. La invitación se consume al crear la cuenta, antes de confirmar el correo, igual que en el flujo actual.
6. **Respaldo/rollback:** antes de la aplicación, guardar la definición actual de la función y confirmar un respaldo de base recuperable; su existencia no se comprobó. La reversión funcional consiste en restaurar la definición de `003` como una migración posterior. No debe borrarse la fila de historial ni revertirse/eliminar usuarios creados durante el periodo público. Aun restaurando la función, los registros ya creados permanecen.
7. **Pruebas previas:** revisar orden/historial de migraciones y función/trigger reales; aplicar primero en Supabase local o staging aislado; probar altas sin código, con código válido, formato inválido, inexistente, vencido y usado; hacer intentos simultáneos para confirmar una única aceptación; verificar perfil creado, `used_by` y `is_admin = false` sin usar usuarios/invitaciones productivos.
8. **Verificación posterior:** comparar `pg_get_functiondef` con el archivo aprobado, verificar que `on_auth_user_created` sigue asociado a `public.handle_new_user`, repetir los casos de prueba en staging y probar RLS de lectura/escritura por rol. En producción confirmar migración registrada y ejecutar una prueba con una cuenta de prueba autorizada; no incluir correo ni token en logs.
9. **Prerequisitos externos:** identificar explícitamente el proyecto Supabase de staging y producción, confirmar respaldo restaurable, ventana de cambio, URLs/confirmación de correo y controles antiabuso. No se inspeccionaron credenciales ni archivos de entorno y no se confirma que un proyecto staging o respaldo exista.
10. **Separación:** la migración 004 de grants es otra intervención y no queda incluida en la propuesta 005; requiere su propia revisión/permiso. La 005 está preparada localmente, pero no se ejecutó en ningún destino.
