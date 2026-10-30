# Cloudflare Turnstile para acceso, registro y recuperación

## Diagnóstico
La web pública se revisó el 30-10-2026 y la ruta `/login` no mostraba el widget. El componente solo se renderiza cuando está definida `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. El workflow anterior construía el Worker de producción sin inyectar esa variable, aunque el entorno local podía tenerla en `.env.local`.

El workflow de producción:
- exige una sitekey real antes de publicar;
- acepta una variable de GitHub Actions llamada `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (preferida) o un secreto heredado con ese nombre;
- inyecta la llave durante la compilación de Vinext y en el comando de despliegue;
- rechaza las llaves de prueba oficiales;
- si no hay una Sitekey configurada, consulta la API de Turnstile en modo solo lectura y usa el Sitekey público únicamente cuando encuentra un solo widget que permite el hostname exacto `python-desdecero.com`;
- si la consulta no está autorizada, no hay widget o aparecen varios candidatos, omite el despliegue y pide configuración manual; nunca selecciona entre varios ni accede a la Secret key.

El PR `#27`, en la rama `chore/verify-turnstile-on-live-login`, añade una comprobación HTTP posterior al despliegue para validar que la portada está actualizada y que el HTML de `/login` contiene el widget. La validación anterior solo comprobaba la portada. No se debe considerar completo un despliegue si el widget no aparece en la ruta de autenticación.

Si no hay una Sitekey manual, el workflow intenta encontrar un único widget existente para el hostname exacto mediante la API de solo lectura. Si no puede verificar una única coincidencia, omite el despliegue y deja la versión de producción intacta.

## Estado verificado — 30 de octubre de 2026

- El commit `99e39027409682ed3bf21d64754769b21199854f` está integrado en `master`; contiene la mejora de flujo móvil del laboratorio (PR #28).
- CI #501 terminó correctamente para ese commit, incluyendo Vitest, TypeScript, ESLint, build Next, Playwright y build Vinext.
- El workflow de publicación #54 (run `41038244192`) no desplegó ese commit: `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` estaban disponibles, pero `RAW_TURNSTILE_SITE_KEY` llegó vacío y el job `deploy` quedó omitido.
- El PR #29 intenta resolverlo buscando un único widget de producción mediante la API de solo lectura. Requiere `Turnstile Sites Read` o `Account Settings Read`; si el token no dispone de permiso, habrá que configurar la Sitekey manualmente.
- No usar claves de prueba en producción ni habilitar CAPTCHA de Supabase antes de que el widget esté visible en la web publicada.

## Reintentar el despliegue después de guardar la Sitekey

El workflow también permite un inicio manual, limitado a la rama `master`. Esto evita tener que crear un commit vacío o modificar código solo para volver a probar el despliegue después de guardar la variable pública:

1. Abre GitHub → Actions → **Deploy Cloudflare Worker**.
2. Selecciona **Run workflow** y la rama `master`.
3. Ejecuta el workflow. Volverá a validar la Sitekey y las credenciales antes de compilar o publicar.
4. Si no hay una Sitekey real válida, la publicación seguirá omitida y producción permanecerá intacta.

El inicio manual no omite CI, no permite desplegar ramas distintas de `master`, ni lee la Secret key privada de Turnstile.

## Configuración de Cloudflare
1. En Cloudflare Dashboard → Turnstile, abre o crea el widget correspondiente al sitio `python-desdecero.com`.
2. En Hostname Management incluye `python-desdecero.com` y cualquier hostname público que realmente uses (por ejemplo `www.python-desdecero.com`, solo si está activo). No uses hostnames de localhost en el widget de producción.
3. Copia la **Sitekey** y guárdala en GitHub → Settings → Secrets and variables → Actions → Variables con el nombre `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. La Sitekey es pública y se entrega al navegador; nunca pegues aquí la Secret key.
4. Confirma que la variable quedó guardada en el repositorio correcto (`Reymonth777x/python-desde-cero`) y no como variable personal o de otro repositorio.

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
