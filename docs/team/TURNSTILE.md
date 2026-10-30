# Turnstile y autenticación — producción

## Estado comprobado el 30 de octubre de 2026

- La variable pública `NEXT_PUBLIC_TURNSTILE_SITE_KEY` está disponible en GitHub Actions y el workflow la inyecta durante el build de Vinext.
- La publicación actual de `master` es el SHA `37db89ecb542a7a00abc0f55691872505146cd61`. CI de master [41129443835](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41129443835) y despliegue Cloudflare [41129901037](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41129901037) terminaron correctamente. El Worker principal tiene versión `dd3dc42c-b29b-4e86-8604-25f3a94ebab5`.
- PR #89 conserva el correo de login al fallar Turnstile y permite reintentar el widget sin guardar la contraseña ni debilitar la verificación. PR #91 está integrado y publicó el runner Python separado: `https://python-desdecero-runner.pythondesdecero.workers.dev`, versión `d831ac62-d7d8-4afb-95fb-8b17ae363a88`.
- El workflow validó las credenciales de Cloudflare sin imprimirlas, preparó y publicó los assets del runner, comprobó CSP y origen, compiló Vinext, comparó el SHA actual de `master` antes de publicar y verificó el dominio `python-desdecero.com` conectado al Worker.
- El smoke test de producción verificó portada, `/muestra`, `/login` con widget Turnstile, sitemap y redirección `www` HTTP 308. Esto demuestra presencia del widget en el HTML, no que el desafío haya sido completado ni que Supabase Auth haya validado un token en un inicio de sesión real.
- La Secret key privada de Turnstile y el estado de CAPTCHA protection no se pueden leer mediante la inspección del repositorio ni el estado básico del proyecto Supabase. Su configuración en Supabase Auth sigue pendiente de confirmación.
- Tampoco se completó una prueba real de correo, registro o restablecimiento; estos puntos siguen abiertos.

## Aislamiento del laboratorio Python en Cloudflare

- El código alumno se ejecuta en el origen independiente `python-desdecero-runner.pythondesdecero.workers.dev`, separado de las cookies y del origen de la academia.
- El iframe se comunica con su padre solo después de que el runner valida `event.source` y el origen permitido; después transfiere un `MessagePort` privado. El worker no acepta las respuestas por el canal global de mensajes.
- El runner se publica como Worker de assets estáticos con una CSP propia; la CI y el workflow de publicación comprueban sus assets y encabezados. No procesa código Python en el servidor ni recibe claves de Supabase.
- CI #91 incluyó E2E y build de Vinext. La publicación de producción comprobó archivos y CSP del runner; la ejecución manual interactiva en un navegador de producción sigue pendiente, aunque el smoke test de rutas públicas pasó.
- No modificar CAPTCHA ni eliminar el desafío de producción para facilitar pruebas automatizadas.

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

La publicación requiere CI exitoso en `master`, credenciales válidas de Cloudflare y una Sitekey real. El workflow verifica el HTML de `/login`, la muestra pública, el sitemap y el redirect `www` 308. Las credenciales ausentes o una Sitekey inválida provocan fallo visible; una ejecución de CI antigua o cancelada se omite de forma segura. PR #54 está integrado: compara el SHA del CI con el HEAD real de `master` antes de compilar y vuelve a comprobarlo justo antes de ejecutar el deploy. Ambas barreras pasaron en los releases funcionales `71fa854`, `2445f68` y `e758f9c`, y en el deploy documental posterior `10cc1b7`.

## Desarrollo y pruebas automatizadas

- CI utiliza una Sitekey de prueba oficial únicamente en el entorno automatizado.
- Nunca publicar llaves de prueba en producción.
- Referencias: [Cloudflare Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) · [Supabase Auth CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha).
