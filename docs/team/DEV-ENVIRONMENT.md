# Entorno de desarrollo compartido

## Proyecto Supabase

Proyecto independiente: `python-desde-cero-dev`
- Project ref: `fcwbkkivelsipqqrbpya`
- Región: `us-west-1`
- Uso: desarrollo y pruebas únicamente.
- No contiene datos de estudiantes de producción.

El esquema base se reproduce mediante `supabase/bootstrap/dev-environment-baseline.sql`. Este archivo es un snapshot inicial solo para el proyecto de desarrollo; **no se debe ejecutar en producción**.

El repositorio todavía tiene una divergencia documentada entre migraciones locales e historial remoto. Hasta reconciliar el historial canónico:
- No ejecutar `supabase db push`, `supabase migration repair` ni `supabase db reset` contra producción.
- No editar migraciones históricas.
- Todo cambio nuevo de esquema debe tener SQL versionado, revisión y aprobación del responsable de datos.
- No añadir claves de respuestas, secretos ni credenciales al repositorio público.

## Variables locales

Cada socio crea `.env.local` a partir de `.env.example` y recibe del propietario la URL y la clave publicable del proyecto de desarrollo.

Valores locales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://fcwbkkivelsipqqrbpya.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SE_ENTREGA_POR_CANAL_SEGURO
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

La clave publicable no sustituye RLS. Nunca utilizar `service_role`, una clave secret o credenciales de producción en el navegador.

## Auth pendiente de ajuste manual en Dashboard

En Supabase → Authentication → URL Configuration, el propietario debe configurar:
- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`
- Redirect URL adicional: `http://localhost:3001/auth/callback`

El flujo de correo/SMTP y el CAPTCHA no están certificados en este entorno. Hasta verificar el envío de confirmación y recuperación, cada socio debe limitarse a pruebas de interfaz no destructivas y reportar cualquier error de Auth.

## Inicio local

```powershell
npm ci
npm run dev
```

Abrir `http://localhost:3000`.

## Validación mínima antes de un PR

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

Las pruebas de navegador:
```powershell
npx playwright install chromium
npm run test:e2e
```

El build de Cloudflare solo se ejecuta cuando el responsable solicita validar el entorno de despliegue:
```powershell
npm run build:vinext
```

## Restricciones

- No usar producción para pruebas.
- No compartir archivos `.env.local`.
- No publicar claves, tokens, contraseñas o archivos de credenciales.
- No escribir directamente en `master`.
- Una rama por tarea y Pull Request para cada cambio.
- El código debe superar pruebas y revisión humana antes de integrarse.
