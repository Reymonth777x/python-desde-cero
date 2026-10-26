# Desarrollo local

## Requisitos

- Node.js 20.9 o posterior; esta auditoría usó Node 24.22.1.
- npm y las dependencias declaradas en `package-lock.json`.
- Un proyecto Supabase configurado para las rutas de Auth; no se requiere instalar Supabase CLI para lint, pruebas unitarias o build.

## Variables de entorno

Definir en `.env.local` (no incluir valores en Git ni en reportes):

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: clave publishable del proyecto.
- `NEXT_PUBLIC_SITE_URL`: origen público del sitio; debe ser HTTPS en producción y localhost solo en desarrollo.

`.gitignore` excluye `.env*.local`. No se leyó el contenido de `.env.local` durante esta tarea.

## Comandos

```powershell
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

El servidor local se abre normalmente en `http://localhost:3000`. El flujo de correo requiere configurar en Supabase Auth las URLs de confirmación y recuperación que apuntan a `/auth/callback`; no se puede comprobar sin el correo/proyecto de staging.

La aplicación tiene manifiesto PWA, pero no service worker ni caché sin conexión implementados. Se estudia desde el navegador sin instalar nada; no se promete uso offline.
