# Tareas del humano — Python desde cero

Este documento lista las tareas que **solo puede ejecutar el humano** (según la carta de autonomía). El agente no puede realizar estas acciones.

## 1. Docker y Supabase local

- [ ] Instalar Docker Desktop (con WSL 2 en Windows)
- [ ] Ejecutar `npx supabase start` para iniciar Supabase local
- [ ] Aplicar migraciones 001-017 en orden
- [ ] Ejecutar `supabase test db` (pgTAP)

## 2. Variables de entorno y secretos

- [ ] Crear `.env.local` con variables de Supabase local
- [ ] Crear `.env.production` con variables de Supabase remoto (nunca subir al repositorio)
- [ ] **Nunca** subir `TURNSTILE_SECRET_KEY` al repositorio (la valida Supabase, no la app)

## 3. Cloudflare Turnstile

- [ ] Crear widget de Turnstile en dashboard de Cloudflare
- [ ] Obtener Site Key y configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` en variables de entorno
- [ ] Configurar `TURNSTILE_SECRET_KEY` **solo en el panel de Supabase** (Auth > CAPTCHA)
- [ ] Activar CAPTCHA en Supabase **solo después** de que la CSP pase las pruebas en producción

## 4. SMTP y DNS

- [ ] Configurar SMTP propio para envío de correos
- [ ] Configurar registros SPF/DKIM/DMARC del dominio en Cloudflare
- [ ] Pegar plantillas de `supabase/templates/` en el panel de Supabase (Entrega de correos > Plantillas)
- [ ] Configurar URL de redirección y dominio verificado en Supabase

## 5. Supabase staging y producción

- [ ] Crear proyecto de staging en Supabase
- [ ] Aplicar migraciones 001-017 en staging (con respaldo previo)
- [ ] Crear proyecto de producción en Supabase
- [ ] Aplicar migraciones en producción (con respaldo previo, solo por el humano)

## 6. Despliegue en Cloudflare

- [ ] Conectar repositorio GitHub a Cloudflare Workers & Pages
- [ ] Configurar preset de build: `vinext`
- [ ] Configurar variables de entorno en Cloudflare
- [ ] Desplegar en staging primero, validar, luego en producción

## 7. Revisión legal

- [ ] Revisar borrador de política de privacidad
- [ ] Revisar borrador de términos de servicio
- [ ] Revisar borrador de aviso de cookies
- [ ] Todas las políticas requieren revisión humana antes de publicarse

## 8. Renombrar carpeta del proyecto

- [ ] Renombrar carpeta local de `python-pe1-academy` a `python-desdecero` (opcional, según preferencia del humano)