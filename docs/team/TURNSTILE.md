# Cloudflare Turnstile para acceso, registro y recuperación

## Diagnóstico
La web pública se revisó el 30-10-2026 y la ruta `/login` no mostraba el widget. El componente solo se renderiza cuando está definida `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. El workflow anterior construía el Worker de producción sin inyectar esa variable, aunque el entorno local podía tenerla en `.env.local`.

El workflow de producción ahora:
- exige una sitekey real antes de publicar;
- acepta una variable de GitHub Actions llamada `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (preferida) o un secreto heredado con ese nombre;
- inyecta la llave durante la compilación de Vinext y en el comando de despliegue;
- rechaza las llaves de prueba oficiales;
- comprueba después de publicar que `/login` contiene el widget.

Si la sitekey no está configurada, el paso de comprobación omite el despliegue y deja la versión de producción intacta.

## Configuración de Cloudflare
1. En Cloudflare Dashboard → Turnstile, abre o crea el widget correspondiente al sitio `python-desdecero.com`.
2. En Hostname Management incluye `python-desdecero.com` y cualquier hostname público que realmente uses (por ejemplo `www.python-desdecero.com`, solo si está activo). No uses hostnames de localhost en el widget de producción.
3. Copia la **Sitekey** y guárdala en GitHub → Settings → Secrets and variables → Actions → Variables con el nombre `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. La Sitekey es pública y se entrega al navegador; nunca pegues aquí la Secret key.

## Configuración de Supabase Auth
Para que el desafío no sea solo visual:
1. En el proyecto Supabase de producción `nuqydanbbgqcofcftshk`, abre Authentication → Bot and Abuse Protection.
2. Activa CAPTCHA protection, selecciona Cloudflare Turnstile y pega la **Secret key** correspondiente al widget de producción.
3. Guarda y prueba inicio de sesión, registro y recuperación de contraseña. La Secret key se queda en Supabase Auth; no debe añadirse al repositorio, al navegador, ni a `NEXT_PUBLIC_*`.
4. Configura el proyecto DEV por separado con su propio widget/secret de desarrollo. No reutilices el secreto de producción en DEV.

El frontend envía `captchaToken` a Supabase Auth en sign-in, sign-up y password reset. Las acciones de servidor rechazan la solicitud si el build incluye una sitekey pero no llega un token.

## Pruebas
- CI usa la sitekey de prueba oficial `1x00000000000000000000AA` exclusivamente en builds y pruebas automatizadas; nunca la usa el workflow de producción.
- La prueba E2E confirma que los formularios de acceso, registro y recuperación incluyen el widget cuando la llave está configurada.
- Cloudflare recomienda sitekeys de prueba para suites automatizadas y exige usar sitekey/secret reales en producción: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
- Supabase Auth documenta la configuración del proveedor y el envío del token: https://supabase.com/docs/guides/auth/auth-captcha

## Desarrollo local
En `.env.local`, define `NEXT_PUBLIC_TURNSTILE_SITE_KEY` con una sitekey compatible con el proyecto Supabase que apunta tu configuración local. Para pruebas automatizadas puedes usar la sitekey oficial de prueba; no la publiques en producción.
