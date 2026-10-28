# Usuarios de prueba - solo desarrollo local

Este documento describe cómo generar cuentas descartables para pruebas. No contiene contraseñas fijas.

## Requisitos

- Docker y Supabase CLI funcionando localmente.
- Supabase local iniciado mediante npx supabase start.
- La URL y la clave de servicio local obtenidas desde npx supabase status -o env.

## Generar usuarios

En PowerShell, establece la URL de la API local y la clave de servicio que devuelve el comando anterior. Mantén el valor en tu terminal local; no lo compartas ni lo guardes en Git.

~~~powershell
$env:SUPABASE_URL = "http://127.0.0.1:54321"
$env:SUPABASE_SERVICE_ROLE_KEY = "<SERVICE_ROLE_KEY LOCAL, NO PRODUCCIÓN>"
node scripts/seed-dev-users.mjs
~~~

El script rechaza hostnames distintos de localhost y 127.0.0.1. Necesita la clave de servicio local porque crear usuarios requiere privilegios administrativos; una clave publishable/anon no sirve para esa operación.

El script genera una contraseña aleatoria distinta para cada cuenta y guarda los datos en .local-dev-users.json en la raíz del proyecto. Ese archivo está excluido de Git. No lo subas, no lo compartas y elimínalo cuando termines las pruebas.

## Cuentas generadas

- estudiante@python-desdecero.local — estudiante
- docente@python-desdecero.local — docente
- admin@python-desdecero.local — administrador

Las contraseñas se vuelven a generar cuando se ejecuta el script y se actualizan las cuentas locales existentes. Nunca ejecutes este script contra producción.
