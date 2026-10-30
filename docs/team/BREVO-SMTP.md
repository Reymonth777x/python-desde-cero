# Correo transaccional — Brevo + Supabase Auth

## Estado comprobado el 30 de octubre de 2026

La integración está en preparación, no certificada en producción.

- El propietario generó una clave SMTP Standard en Brevo el 30-10-2026, con la expiración anual que mostraba el panel. La clave es privada: no se registra aquí ni se almacena en GitHub, en el frontend o en `.env`.
- Los DNS públicos del dominio raíz `python-desdecero.com` muestran el TXT de verificación de Brevo.
- Los dos DKIM publicados son:
  - `brevo1._domainkey.python-desdecero.com` CNAME → `b1.python-desdecero-com.dkim.brevo.com`
  - `brevo2._domainkey.python-desdecero.com` CNAME → `b2.python-desdecero-com.dkim.brevo.com`
- El DNS público muestra un único registro DMARC: `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`. La política actual es de monitorización, no de cuarentena ni rechazo.
- Los nameservers autoritativos publicados para el dominio son `piers.ns.cloudflare.com` y `chan.ns.cloudflare.com`. Las respuestas DNS conservan los CNAME DKIM, por lo que no se observa aplanamiento que los convierta en TXT.
- La consulta TXT del apex no devolvió un registro SPF. Brevo indica que SPF/MX no son obligatorios para autenticar dominios con IP compartida; si la cuenta utiliza IP dedicada, los registros requeridos pueden ser diferentes. Supabase recomienda mantener SPF, DKIM y DMARC alineados para mejorar la entregabilidad. No añadir un segundo SPF ni cambiar los existentes sin ver primero todos los registros del dominio de envío.
- No se ha podido inspeccionar el estado privado del dominio/remitente en el panel de Brevo. Tampoco se ha podido leer la configuración SMTP de Authentication de Supabase desde la conexión de proyecto disponible. No se afirma que el dominio esté marcado como “Authenticated”, que el remitente esté validado, que la clave SMTP esté guardada en Supabase ni que un correo haya sido entregado.

## Datos SMTP que se deben utilizar

Para el servidor de correo de Brevo, la documentación oficial indica:

| Campo | Valor o fuente |
|---|---|
| Servidor SMTP | `smtp-relay.brevo.com` |
| Puerto recomendado para STARTTLS | `587` |
| Usuario SMTP | Copiar exactamente el SMTP login mostrado en Brevo → SMTP; puede ser el correo de login o un ID generado. No asumir que coincide con el correo de la cuenta. |
| Contraseña SMTP | La clave SMTP Standard recién creada; nunca una API key. |
| Remitente | Una dirección cuyo dominio esté autenticado en Brevo y que aparezca como remitente verificado. |
| Nombre del remitente | `Python desde cero` (nombre visible sugerido). |

Brevo admite otros puertos, pero la configuración de cifrado debe coincidir con el puerto seleccionado. Para el puerto 465 se usa SSL/TLS; para 587 no activar SSL implícito.

## Orden correcto para terminar

1. En Brevo → Settings → Senders, Domains, IPs, comprobar que `python-desdecero.com` aparece como **Authenticated** y que la dirección remitente está verificada. Si Brevo muestra registros adicionales para esta cuenta, comprobarlos antes de asumir que el DNS está completo.
2. En Supabase DEV `python-desde-cero-dev` → Authentication → Emails → SMTP Settings, activar `Enable custom SMTP` e introducir host, puerto, SMTP login exacto, clave SMTP y remitente verificado. Guardar el secreto directamente en el panel; no pegarlo en el chat ni en este repositorio.
3. Enviar una confirmación de registro y un restablecimiento de contraseña a un buzón controlado. Revisar recepción, enlaces, carpeta de spam y el encabezado del mensaje (`dkim=pass`, SPF y DMARC).
4. Solo después de que DEV funcione, aplicar el mismo patrón al proyecto de producción `nuqydanbbgqcofcftshk` y probar una dirección controlada.
5. Revisar los límites de envío de Supabase Auth y Brevo. La documentación vigente de Supabase indica un máximo de 2 mensajes/hora para el SMTP compartido por defecto y un límite inicial de 30 mensajes/hora después de configurar SMTP personalizado (ajustable en Rate Limits). Los logs previos registraron dos `over_email_send_rate_limit` (429), pero no identificaban el proveedor SMTP activo en ese momento.

## Separación de entornos y seguridad

- DEV: `fcwbkkivelsipqqrbpya`. PROD: `nuqydanbbgqcofcftshk`. Ambos proyectos aparecen `ACTIVE_HEALTHY`; el estado del proyecto no revela la configuración Auth SMTP.
- No usar una contraseña de SMTP como clave de frontend. No guardarla bajo nombres `NEXT_PUBLIC_*`, en GitHub Actions Variables, en el código fuente ni en archivos compartidos.
- La clave SMTP no sustituye la verificación del dominio ni la comprobación del remitente.
- No usar credenciales de producción en Playwright ni claves de prueba en producción.

## Referencias oficiales

- [Brevo: Enviar emails transaccionales con SMTP](https://help.brevo.com/hc/es/articles/7924908994450-Enviar-emails-transaccionales-con-Brevo-SMTP)
- [Brevo: Autenticar el dominio (código, DKIM, DMARC)](https://help.brevo.com/hc/es/articles/12163873383186-Autenticar-el-dominio-con-Brevo-c%C3%B3digo-Brevo-DKIM-DMARC)
- [Brevo: Crear y administrar claves SMTP](https://help.brevo.com/hc/es/articles/7959631848850-Crear-y-administrar-claves-SMTP)
- [Brevo: Conectar SMTP de Brevo con Supabase](https://developers.brevo.com/docs/supabase-smtp-integration)
- [Supabase: Send emails with custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
