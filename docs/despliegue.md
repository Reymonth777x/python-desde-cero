# Despliegue de Python desde cero en Cloudflare Workers

## Modo de publicación

La aplicación usa Next.js App Router con middleware, Server Actions, rutas dinámicas y Supabase Auth. Para mantener esas funciones en Cloudflare se usa Vinext sobre Workers, no una publicación estática de `.next` en Pages.

- Worker objetivo: `python-desde-cero`
- Configuración: `cloudflare.config.ts`
- Vite: `vite.config.ts`
- Build de Cloudflare: `npm run build:vinext`
- Comando de despliegue: `npm run deploy:vinext`

Cloudflare recomienda Vinext para Next.js full-stack en Workers, pero está en beta. El CI verifica por separado el build estándar de Next y el de Vinext; el despliegue solo se considera comprobado cuando pasa también la prueba de autenticación en el Worker real.

## Variables públicas de Supabase

Configurar como variables de entorno disponibles durante el build y en el Worker:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publicable del mismo proyecto.
- `NEXT_PUBLIC_SITE_URL`: origen HTTPS público del Worker, por ejemplo `https://python-desde-cero.pythondesdecero.workers.dev`.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: site key pública de Cloudflare Turnstile.

Las variables `NEXT_PUBLIC_SUPABASE_*` son para el cliente web; no configures la service-role key de Supabase en el navegador ni la pongas en Git.

El secreto de Turnstile se configura en Supabase Auth → Bot and Abuse Protection/CAPTCHA. No se necesita en el Worker. No activar CAPTCHA en producción hasta verificar site key, secreto y formularios.

## Pasos

1. Conectar la rama de publicación del repositorio en Cloudflare Workers Builds.
2. Definir las variables anteriores para build y runtime.
3. Ejecutar `npm ci`, comprobar el workflow CI y desplegar el Worker con el camino Vinext.
4. Abrir la URL pública y validar portada, login, registro, recuperación de contraseña, callback, rutas protegidas y editor Python en escritorio y móvil.
5. Verificar las URL permitidas de Supabase Auth y la entrega real de correo. No se ejecutan migraciones remotas durante el despliegue.

## Importante

No usar `wrangler pages deploy .next`: la salida de Next no es una exportación estática completa y eso no preservaría todas las rutas de servidor. Tampoco se debe afirmar que la web quedó desplegada hasta que Cloudflare confirme el deploy y las verificaciones públicas resulten satisfactorias.


## Publicación automatizada desde GitHub Actions

El workflow `.github/workflows/deploy-cloudflare.yml` intenta publicar el Worker solo cuando detecta los dos secretos de repositorio siguientes:

- `CLOUDFLARE_API_TOKEN`: token API con permisos de despliegue de Workers.
- `CLOUDFLARE_ACCOUNT_ID`: identificador de la cuenta Cloudflare dueña del Worker.

Configúralos en GitHub → Settings → Secrets and variables → Actions. El workflow solo comprueba si existen; no imprime sus valores. Si faltan, la publicación se omite y se registra una notificación. Si existen, compila Vinext, despliega `python-desde-cero` y comprueba que la URL pública responde con HTTP exitoso.

No se guarda ningún token en el repositorio. El secreto de Turnstile no se necesita en el Worker: debe configurarse únicamente en Supabase Auth cuando se decida habilitar CAPTCHA.
