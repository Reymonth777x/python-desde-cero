# Turnstile y autenticación — producción

## Estado comprobado el 30 de octubre de 2026

- La variable pública `NEXT_PUBLIC_TURNSTILE_SITE_KEY` está disponible en GitHub Actions y el workflow la inyecta durante el build de Vinext.
- El workflow de publicación **41045380505** finalizó correctamente para el commit `5818eb529283123b4d4adb7a60aec3b121f7d7da`.
- El log de ese deploy confirma que Cloudflare publicó el Worker, que el dominio está conectado al servicio `python-desdecero` y que el HTML servido por `/login` contiene `data-testid="turnstile-widget"`.
- La inspección del HTML comprueba que el componente está incluido en el documento. No demuestra por sí sola que el script cliente haya cargado, que un usuario haya resuelto un desafío ni que Supabase haya validado el token.
- No se ha verificado desde las herramientas disponibles si la Secret key de Turnstile está guardada en Supabase Auth. Tampoco se completó una prueba real de correo, registro o restablecimiento. Estos puntos permanecen abiertos.

## Separación de llaves

1. **Sitekey pública:** se guarda como GitHub Actions Variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Es visible para el navegador y puede incluirse en el build.
2. **Secret key privada:** se configura únicamente en Supabase Dashboard → Authentication → Bot and Abuse Protection, con Cloudflare Turnstile seleccionado. Nunca se guarda en Git, en el navegador o en una variable `NEXT_PUBLIC_*`.
3. Producción y desarrollo deben utilizar los widgets y secretos correspondientes a sus hostnames y proyectos separados.

## Prueba pendiente en Supabase Auth

En el proyecto de producción `nuqydanbbgqcofcftshk`:

1. Abrir Authentication → Bot and Abuse Protection.
2. Verificar que CAPTCHA protection esté habilitada y que el proveedor sea Cloudflare Turnstile.
3. Confirmar que se guardó la Secret key del widget que permite `python-desdecero.com` y `www.python-desdecero.com` si ese hostname sigue siendo aceptado.
4. No copiar la Secret key en un chat, issue, commit, log o variable pública.
5. Completar pruebas con una dirección de correo controlada: registro y confirmación, inicio de sesión y recuperación/cambio de contraseña.

El código de servidor envía `captchaToken` en sign-in, sign-up y password reset. Si el build tiene Sitekey pero no llega token, las acciones rechazan la solicitud.

## Despliegue y señal de fallo

La publicación requiere CI exitoso en `master`, credenciales válidas de Cloudflare y una Sitekey real. El workflow también realiza una comprobación HTTP posterior del HTML de `/login`. Un deploy omitido no debe confundirse con uno publicado; el workflow debe terminar en estado no exitoso cuando los prerrequisitos fallen.

## Desarrollo y pruebas automatizadas

- CI utiliza una Sitekey de prueba oficial únicamente en el entorno automatizado.
- Nunca publicar llaves de prueba en producción.
- Referencias: [Cloudflare Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) · [Supabase Auth CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha).
