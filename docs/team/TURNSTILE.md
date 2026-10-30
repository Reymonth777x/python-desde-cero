# Turnstile y autenticación — producción

## Estado comprobado el 30 de octubre de 2026

- La variable pública `NEXT_PUBLIC_TURNSTILE_SITE_KEY` está disponible en GitHub Actions y el workflow la inyecta durante el build de Vinext.
- El workflow de publicación **41049961984** finalizó correctamente para el HEAD `71fa854381f0507f6b0b16b8a6fbf2a0c2efaa15`.
- El log confirma que el Worker se compiló y publicó desde el mismo SHA que `master`, que la segunda comparación SHA pasó justo antes de publicar, y que el HTML de `/login` contiene `data-testid="turnstile-widget"`; `/muestra`, sitemap y `www` HTTP 308 también pasaron.
- La lectura pública de `/muestra` confirmó la explicación guiada revisada en `b1-l1`–`b1-l3`. Esto confirma que el componente y la Sitekey pública llegaron al build/HTML. No demuestra que el script cliente haya cargado, que un usuario haya completado el desafío ni que Supabase Auth haya validado un token.
- La Secret key privada de Turnstile y el estado de CAPTCHA protection no se pueden leer mediante la inspección del repositorio ni el estado básico del proyecto Supabase. Su configuración en Supabase Auth sigue pendiente de confirmación.
- Tampoco se completó una prueba real de correo, registro o restablecimiento; estos puntos siguen abiertos.

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

La publicación requiere CI exitoso en `master`, credenciales válidas de Cloudflare y una Sitekey real. El workflow verifica el HTML de `/login`, la muestra pública, el sitemap y el redirect `www` 308. Las credenciales ausentes o una Sitekey inválida provocan fallo visible; una ejecución de CI antigua o cancelada se omite de forma segura. PR #54 está integrado: compara el SHA del CI con el HEAD real de `master` antes de compilar y vuelve a comprobarlo justo antes de ejecutar el deploy. Ambas barreras pasaron en el release `71fa854`.

## Desarrollo y pruebas automatizadas

- CI utiliza una Sitekey de prueba oficial únicamente en el entorno automatizado.
- Nunca publicar llaves de prueba en producción.
- Referencias: [Cloudflare Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) · [Supabase Auth CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha).
