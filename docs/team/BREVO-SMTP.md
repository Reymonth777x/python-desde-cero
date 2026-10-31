# Correo transaccional — Brevo + Supabase Auth

## Estado comprobado y aceptación manual — 30 de octubre de 2026

**Dominio autenticado y con marca en Brevo. El propietario confirma que los flujos de registro, confirmación, login, logout, recuperación y cambio de contraseña funcionaron manualmente el 30-10-2026. La inspección independiente del host/login SMTP guardado y de recibos individuales sigue limitada por el acceso disponible.**

- El propietario generó una clave SMTP Standard en Brevo el 30-10-2026, con la expiración anual que mostraba el panel. La clave es privada: no se registra aquí ni se almacena en GitHub, en el frontend o en `.env`.
- Los DNS públicos del dominio raíz `python-desdecero.com` muestran el TXT de verificación de Brevo.
- Los dos DKIM publicados son:
  - `brevo1._domainkey.python-desdecero.com` CNAME → `b1.python-desdecero-com.dkim.brevo.com`
  - `brevo2._domainkey.python-desdecero.com` CNAME → `b2.python-desdecero-com.dkim.brevo.com`
- El DNS público muestra un único registro DMARC: `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`. La política actual es de monitorización, no de cuarentena ni rechazo.
- Los nameservers autoritativos publicados para el dominio son `piers.ns.cloudflare.com` y `chan.ns.cloudflare.com`. Las respuestas DNS conservan los CNAME DKIM, por lo que no se observa aplanamiento que los convierta en TXT.
- La consulta TXT del apex no devolvió un registro SPF. Brevo indica que SPF/MX no son obligatorios para autenticar dominios con IP compartida; si la cuenta utiliza IP dedicada, los registros requeridos pueden ser diferentes. Supabase recomienda mantener SPF, DKIM y DMARC alineados para mejorar la entregabilidad. No añadir un segundo SPF ni cambiar los existentes sin ver primero todos los registros del dominio de envío.
- El propietario mostró el panel de Brevo donde `python-desdecero.com` aparece **Autentificado**, **Con marca**, con subdominio de marca `em`. La captura confirma el dominio y el branded subdomain; no muestra por sí sola el estado individual de cada remitente.
- La vista general de Brevo aportada por el propietario muestra 4 emails transaccionales enviados durante los últimos 7 días, 100 % entregados, 0 % hard bounce y 0 % bloqueados. Es una estadística agregada; no permite asignar esos mensajes concretos a registro/confirmación/recuperación de Supabase.
- El propietario confirmó que generó una clave SMTP Standard. El valor nunca se comparte ni se registra en archivos.
- Las herramientas de conexión no permiten leer Authentication → SMTP Settings ni inspeccionar los recibos individuales de Brevo. El propietario sí confirma la aceptación funcional manual de los flujos Auth; no se inventa el host/login actualmente guardado.

## Evidencia de envío observada en Supabase Auth (30-10-2026)

Consulta de solo lectura de los logs Auth de producción para las últimas 24 horas de la revisión:

- A las `2026-10-30T21:12:07Z`, GoTrue registró que `GOTRUE_RATE_LIMIT_EMAIL_SENT` cambió de `2/1h` a `30`. Esto es consistente con el cambio/ajuste del límite al configurar SMTP personalizado, pero no expone el servidor SMTP ni identifica al proveedor.
- Se agruparon 4 solicitudes de recuperación con HTTP 200, 3 eventos de registro con HTTP 303, 4 solicitudes de recuperación con HTTP 429 y 2 solicitudes de confirmación con HTTP 429.
- El último rechazo de recuperación detalla una espera mínima de 17 segundos. No todos los `429` deben atribuirse al límite horario ni a una falla de Brevo: algunos son controles antiabuso/cooldown.
- HTTP 200/303 acredita que Auth aceptó/procesó la solicitud, no que el servidor receptor haya recibido el mensaje. No se encontraron recibos SMTP ni encabezados del correo en los logs accesibles.
- DEV no mostró eventos de email coincidentes durante la misma ventana.

**Conclusión:** el propietario confirma que el recorrido funcional de Auth y correo se completó manualmente. Brevo muestra el dominio autenticado/con marca y cuatro envíos transaccionales agregados entregados, pero esa estadística no identifica cada mensaje de Auth. La conexión de solo lectura tampoco revela el host/login SMTP guardado ni los recibos individuales. La aceptación manual se considera completada; la verificación administrativa de configuración y encabezados queda como control adicional, no como prueba de que el flujo manual haya fallado. No regenerar ni cambiar credenciales a ciegas.

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

## Cierre de la integración

1. La autenticación del dominio `python-desdecero.com` y la configuración de marca `em` ya están confirmadas en el panel de Brevo. Los 9 registros de Cloudflare compartidos por el propietario incluyen dos CNAME DKIM, tres CNAME de marca, el TXT de verificación de Brevo y DMARC. No hay que repetir esa configuración.
2. La clave SMTP Standard ya fue generada por el propietario. No crear una segunda ni revocar la actual salvo que aparezca un error de autenticación SMTP verificable.
3. La conexión de solo lectura no revela qué host/login/remitente están guardados en Supabase Auth DEV y PROD. Si se hace una auditoría administrativa posterior, comparar con `smtp-relay.brevo.com`, puerto `587`, el login SMTP exacto de Brevo, la clave Standard y un remitente individual verificado. No cambiar ningún campo si ya coincide.
4. El propietario confirma que ya ejecutó el flujo completo con correo controlado y comprobó registro, confirmación, login, recuperación y cambio de contraseña. No repetirlo innecesariamente. Para evidencia técnica independiente adicional, correlacionar un envío concreto con Brevo Transactional Email Logs y revisar sus encabezados, sin reutilizar una cuenta real de estudiante.
5. Revisar encabezados del mensaje para `dkim=pass`, SPF y DMARC. DMARC actual es `p=none` (monitorización); no endurecerlo durante esta integración.
6. Los logs previos de Auth incluyen HTTP 429 tanto por límites horarios como por enfriamiento antiabuso (uno informó 17 segundos). No repetir solicitudes en ráfaga ni interpretar todos los 429 como un rechazo de Brevo.

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
