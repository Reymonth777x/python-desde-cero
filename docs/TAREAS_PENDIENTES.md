# Tareas pendientes de configuración y operación

Este documento reúne las tareas que requieren acceso a cuentas, paneles externos o equipos locales. Ejecuta cada paso en el entorno correspondiente y valida los resultados antes de habilitar servicios en producción.

## 1. Docker y Supabase local

- [ ] Instalar Docker Desktop (con WSL 2 en Windows).
- [ ] Ejecutar `npx supabase start` para iniciar Supabase local.
- [ ] Aplicar las migraciones 001-017 en orden.
- [ ] Ejecutar `supabase test db` (pgTAP).

## 2. Variables de entorno y secretos

- [ ] Crear `.env.local` con variables de Supabase local.
- [ ] Configurar las variables de producción en el panel del servicio de despliegue; no subir archivos de secretos al repositorio.
- [ ] Nunca subir `TURNSTILE_SECRET_KEY` al repositorio. Configurarla únicamente en el panel correspondiente.

## 3. Cloudflare Turnstile

- [ ] Crear el widget de Turnstile en el dashboard de Cloudflare.
- [ ] Obtener la Site Key y configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` en las variables de entorno.
- [ ] Configurar `TURNSTILE_SECRET_KEY` solo en el panel de Supabase (Auth > CAPTCHA).
- [ ] Activar CAPTCHA en Supabase después de que la CSP pase las pruebas en producción.

## 4. SMTP y DNS

- [ ] Configurar SMTP propio para el envío de correos.
- [ ] Configurar los registros SPF, DKIM y DMARC del dominio en Cloudflare.
- [ ] Pegar las plantillas de `supabase/templates/` en el panel de Supabase (Entrega de correos > Plantillas).
- [ ] Configurar la URL de redirección y el dominio verificado en Supabase.

## 5. Supabase: staging y producción

- [ ] Crear un proyecto de staging en Supabase.
- [ ] Aplicar las migraciones 001-017 en staging, con respaldo previo.
- [ ] Crear un proyecto de producción en Supabase.
- [ ] Aplicar las migraciones en producción únicamente después de verificar el respaldo y el plan de reversión.

## 6. Despliegue en Cloudflare

- [ ] Conectar el repositorio de GitHub a Cloudflare Workers & Pages.
- [ ] Configurar el preset de build: `vinext`.
- [ ] Configurar las variables de entorno en Cloudflare.
- [ ] Desplegar primero en staging, validar y después publicar en producción.

## 7. Revisión legal

- [ ] Revisar el borrador de la política de privacidad.
- [ ] Revisar el borrador de los términos de servicio.
- [ ] Revisar el borrador del aviso de cookies.
- [ ] Obtener revisión legal antes de publicar las políticas.
