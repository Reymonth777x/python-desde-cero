# Turnstile y autenticación — producción

## Estado comprobado y aceptación manual — 30 de octubre de 2026

- La variable pública `NEXT_PUBLIC_TURNSTILE_SITE_KEY` está disponible en GitHub Actions y el workflow la inyecta durante el build de Vinext.
- La publicación actual comprobada de `master` es el SHA `38533eae71f60e899949f567c30f15c99c3cbe65`. CI [41150277769](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41150277769) y despliegue Cloudflare [41150633694](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41150633694) terminaron correctamente sobre el mismo SHA. El Worker principal tiene versión `7b625566-1987-4f2c-9875-c369ed584e13`.
- PR #89 conserva el correo de login al fallar Turnstile y permite reintentar el widget sin guardar la contraseña ni debilitar la verificación. PR #91 está integrado y publicó el runner Python separado: `https://python-desdecero-runner.pythondesdecero.workers.dev`, versión actual `8cb973f4-fde5-4cce-ab25-7dba6a09ad25`. El último cambio del runtime de la aplicación es `d072f962`; los commits posteriores actualizan workflows y documentación.
- El workflow validó las credenciales de Cloudflare sin imprimirlas, preparó y publicó los assets del runner, comprobó CSP y origen, compiló Vinext, comparó el SHA actual de `master` antes de publicar y verificó el dominio `python-desdecero.com` conectado al Worker.
- El smoke test de producción del SHA actual verificó portada, `/muestra`, `/login` con widget Turnstile, sitemap, asociación del dominio con el Worker y redirección `www` HTTP 308. Esto demuestra presencia del widget en el HTML, no que el desafío haya sido completado ni que Supabase Auth haya validado un token en un inicio de sesión real.
- El propietario confirma que completó satisfactoriamente las pruebas manuales de autenticación/correo. Esto es aceptación funcional informada por el propietario. La conexión de inspección no puede leer la Secret key privada ni consultar el estado de CAPTCHA protection en Supabase Auth; por eso no se afirma que esos valores privados hayan sido auditados independientemente.
- Brevo muestra el dominio `python-desdecero.com` como **Autentificado** y **Con marca**, con subdominio `em`. Su vista general aportada por el propietario mostró cuatro emails transaccionales en 7 días, 100 % entregados y 0 % hard bounce/bloqueados. El propietario confirma que comprobó manualmente registro, confirmación, login y recuperación/cambio de contraseña; la asociación de cada mensaje con los recibos individuales de Brevo queda como evidencia adicional.

## Aislamiento del laboratorio Python en Cloudflare

- El código alumno se ejecuta en el origen independiente `python-desdecero-runner.pythondesdecero.workers.dev`, separado de las cookies y del origen de la academia.
- El iframe se comunica con su padre solo después de que el runner valida `event.source` y el origen permitido; después transfiere un `MessagePort` privado. El worker no acepta las respuestas por el canal global de mensajes.
- El runner se publica como Worker de assets estáticos con una CSP propia; la CI y el workflow de publicación comprueban sus assets y encabezados. No procesa código Python en el servidor ni recibe claves de Supabase.
- CI #91 incluyó E2E y build de Vinext. La publicación de producción comprobó archivos y CSP del runner. El propietario confirma ejecución interactiva del runner y Turtle en Chrome, Firefox y teléfonos físicos, con pruebas de límites y errores.
- No modificar CAPTCHA ni eliminar el desafío de producción para facilitar pruebas automatizadas.

## Separación de llaves

1. **Sitekey pública:** se guarda como GitHub Actions Variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Es visible para el navegador y puede incluirse en el build.
2. **Secret key privada:** se configura únicamente en Supabase Dashboard → Authentication → Bot and Abuse Protection, con Cloudflare Turnstile seleccionado. Nunca se guarda en Git, en el navegador o en una variable `NEXT_PUBLIC_*`.
3. Producción y desarrollo deben utilizar los widgets y secretos correspondientes a sus hostnames y proyectos separados.

## Comprobación administrativa adicional en Supabase Auth

En el proyecto de producción `nuqydanbbgqcofcftshk`, un administrador del panel puede hacer una comprobación adicional:

1. Abrir Authentication → Bot and Abuse Protection.
2. Confirmar que CAPTCHA protection está habilitada y que el proveedor es Cloudflare Turnstile.
3. Confirmar que la Secret key privada corresponde al widget autorizado para `python-desdecero.com` y `www.python-desdecero.com` si ese hostname sigue aceptado.
4. No copiar la Secret key en chat, issues, commits, logs o variables públicas.
5. El recorrido manual de Auth ya fue confirmado por el propietario el 30-10-2026; repetirlo solo si la inspección del panel descubre una discrepancia concreta.

El código de servidor envía `captchaToken` en sign-in, sign-up y password reset. Si el build tiene Sitekey pero no llega token, las acciones rechazan la solicitud.

## Despliegue y señal de fallo

La publicación requiere CI exitoso en `master`, credenciales válidas de Cloudflare y una Sitekey real. El workflow verifica el HTML de `/login`, la muestra pública, el sitemap y el redirect `www` 308. Las credenciales ausentes o una Sitekey inválida provocan fallo visible; una ejecución de CI antigua o cancelada se omite de forma segura. El workflow compara el SHA del CI con el HEAD real de `master` antes de compilar y vuelve a comprobarlo justo antes de ejecutar el deploy. Ambas barreras se volvieron a comprobar en el despliegue `41150633694` sobre el HEAD `38533eae`.

## Desarrollo y pruebas automatizadas

- CI utiliza una Sitekey de prueba oficial únicamente en el entorno automatizado.
- Nunca publicar llaves de prueba en producción.
- Referencias: [Cloudflare Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) · [Supabase Auth CAPTCHA](https://supabase.com/docs/guides/auth/auth-captcha).
