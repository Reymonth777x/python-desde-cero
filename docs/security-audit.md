# Auditoría de seguridad y preparación para producción

- **Fecha:** 25 de octubre de 2026
- **Repositorio auditado:** `C:\Users\USUARIO\python-pe1-academy`
- **Alcance:** inspección del código y migraciones locales, comprobaciones locales y referencias oficiales. No se accedió a Supabase remoto ni se leyó el contenido de `.env.local`.

## Resumen ejecutivo

**Estado: no listo para publicar en producción.** La autorización de las rutas administrativas está comprobada estáticamente, y el trigger de invitaciones consume cada código mediante una actualización atómica. Se añadieron cabeceras de seguridad, validación de la URL de confirmación en producción, pruebas unitarias de esa validación y una migración local para restringir privilegios de tabla.

El proyecto usa Next.js 16.4.3, que incluye la corrección del aviso de DoS de Server Actions. Next 14 está fuera de soporte, pero no es la versión instalada. La aplicación usa Server Actions. La migración de privilegios tampoco se aplicó, por lo que los ACL y políticas reales de Supabase siguen pendientes de verificación.

Los estados **APROBADA**, **FALLIDA** y **PENDIENTE** describen evidencia de este repositorio y estas comprobaciones; no son una certificación ni una afirmación de cumplimiento legal.

## Hallazgos prioritarios

### SEC-01 — Dependencia Next.js sin soporte y con avisos aplicables

**Estado: FALLIDA — riesgo crítico/alto de disponibilidad y, en una condición de despliegue, ejecución remota.**

- `package.json` fija Next.js y `eslint-config-next` en `16.4.3`; el proyecto usa App Router y exporta Server Actions en `src/app/login/actions.ts` y `src/app/admin/invitaciones/actions.ts`.
- La revisión de dependencias `npm audit` terminó con código 1 y reportó 10 vulnerabilidades: 2 críticas, 4 altas, 3 moderadas y 1 baja. Entre los avisos aparecen Next.js, DOMPurify transitivo de Monaco, `glob`, PostCSS y `postcss-selector-parser`.
- El aviso de DoS de Server Actions afecta las versiones hasta Next 15.5.27 y 16.4.0 y declara que no existe workaround; el proyecto cumple la condición App Router + Server Actions. Next publicó versiones corregidas 15.5.28 y 16.4.1 para ese conjunto de avisos. El proyecto usa Next.js 16.4.3, que incluye la corrección. Next 14 figura como versión sin soporte, pero no es la versión instalada.
- El aviso de RCE del optimizador de imágenes depende de la ruta de optimización de imágenes, SVG y Linux basado en glibc; el entorno de despliegue no se conoce. No se afirma que esa condición esté presente. El hallazgo de DoS no depende de esa configuración.
- **Acción requerida:** aprobar y planificar una actualización deliberada a una línea soportada y parcheada, con adaptación de APIs del App Router/React y pruebas de regresión. No se ejecutó `npm audit fix`, no se usó `--force` y no se modificaron `package.json` ni `package-lock.json`, que ya tenían cambios locales.

### SEC-02 — Privilegios de tabla y USAGE en schema private

**Estado: PENDIENTE — migración correctiva 012 preparada localmente, no aplicada en remoto.**

- `supabase/migrations/005_private_admin_helper.sql` crea `private.current_user_is_admin()` y las políticas RLS la invocan, pero ninguna migración previa concede `USAGE ON SCHEMA private TO authenticated`. Sin ese privilegio, `authenticated` no puede ejecutar la función aunque tenga `EXECUTE`.
- Migración correctiva `supabase/migrations/20261026093001_012_corrective_grants_and_invitation_expiry.sql` añade `GRANT USAGE ON SCHEMA private TO authenticated`.
- La migración 004 (`004_explicit_client_table_grants.sql`) revoca privilegios de tabla de `PUBLIC`, `anon` y `authenticated`; concede a `authenticated` solo `SELECT` en perfiles, `SELECT/INSERT` en invitaciones y (antes de 011) `SELECT/INSERT/UPDATE` en progreso.
- Migración 011 (`20261026093000_011_quiz_attempts_and_progress_restrictions.sql`) revoca `INSERT, UPDATE` en `progress` de `authenticated`, dejando solo `SELECT`. La escritura en `progress` ocurre únicamente vía `record_quiz_attempt` (SECURITY DEFINER).
- Ninguna de estas migraciones se ha ejecutado en Supabase remoto. `supabase`, `psql` y `docker` no están disponibles en este entorno.

### SEC-03 — URL de confirmación podía apuntar a localhost en producción

**Estado: APROBADA localmente tras corrección; configuración real de producción PENDIENTE.**

- `src/app/login/actions.ts` construía `emailRedirectTo` con `http://localhost:3000` si faltaba `NEXT_PUBLIC_SITE_URL`, lo que podía enviar a un usuario de producción a un destino incorrecto.
- Se añadió `src/lib/auth-callback-url.ts`: en producción exige origen HTTPS público; en desarrollo permite fallback a localhost y rechaza HTTP remoto, credenciales, rutas y parámetros inesperados. El registro detiene el flujo con un mensaje de configuración si la URL no es válida.
- `options.data` conserva exactamente `full_name` e `invitation_code`; no se modificó la forma de los metadatos. `src/app/auth/callback/route.ts` intercambia el código y solo redirige a destinos internos fijos.
- Se agregaron pruebas unitarias para producción, desarrollo y URLs rechazadas. Falta comprobar las URLs permitidas/configuradas en Supabase Auth y la entrega real de correo.

### SEC-04 — Expiración nula y consumo anterior a confirmar correo

**Estado: PENDIENTE — migración correctiva 012 preparada localmente, no aplicada en remoto.**

- `001_schema.sql` permite `invitations.expires_at` nulo. `003_require_invitation.sql` acepta explícitamente `expires_at IS NULL`, por lo que esas filas no caducan.
- Migración correctiva `supabase/migrations/20261026093001_012_corrective_grants_and_invitation_expiry.sql`: hace backfill de filas existentes con `expires_at IS NULL` (a `created_at + INTERVAL '7 days'`) y luego añade `ALTER COLUMN expires_at SET NOT NULL`.
- La acción de administración genera invitaciones con vencimiento a siete días, pero no es posible determinar si existen invitaciones remotas antiguas con vencimiento nulo. No se cambió el trigger porque rechazar esos códigos podría invalidar invitaciones existentes.
- El trigger consume el código al insertar el usuario, antes de que la persona confirme el correo. Un correo mal escrito o no confirmado puede dejar el código usado; la recuperación depende de que administración emita otro.
- **Acción requerida:** revisar el inventario remoto y decidir una política de transición antes de aplicar 012. No se alteró el esquema remoto.

### SEC-04b — Calificación del quiz en cliente y escritura directa en progreso (H1)

**Estado: APROBADA localmente — corregido en código, pendiente de migraciones 011/012 en remoto.**

- `src/components/LessonStudy.tsx` calificaba el quiz en el navegador (`gradeQuiz`) y escribía directamente en `public.progress` desde el cliente de Supabase. Las respuestas correctas (`answer`) y explicaciones (`explanation`) viajaban al navegador dentro del `lesson` prop.
- Corrección aplicada:
  - `src/lib/server-quiz/quiz-answers.server.ts` (módulo `server-only`): almacena las respuestas correctas; nunca se importa desde el cliente.
  - `src/lib/server-quiz/submit-quiz.action.ts` (Server Action): califica en el servidor, devuelve puntuación y explicaciones solo tras el envío, y escribe vía RPC `record_quiz_attempt`.
  - `src/app/academia/[moduleId]/[lessonId]/page.tsx`: `stripQuizAnswers()` elimina `answer` y `explanation` antes de pasar la lección al cliente.
  - `src/components/LessonStudy.tsx`: ya no importa `gradeQuiz` ni escribe directamente en `progress`; llama al Server Action y muestra explicaciones solo del resultado del servidor.
- Migración 011 crea `public.quiz_attempts` (RLS solo lectura propia), revoca `INSERT, UPDATE` en `progress` de `authenticated`, y añade `record_quiz_attempt` (SECURITY DEFINER).
- Verificación pendiente: buscar una respuesta conocida en `.next/static` tras `npm run build` para confirmar que ninguna respuesta correcta aparece en el bundle del cliente.

### SEC-05 — Recuperación de cuenta no implementada

**Estado: PENDIENTE.**

No se encontró flujo de restablecimiento de contraseña (`resetPasswordForEmail`/`updateUser`). Inicio, cierre, alta y callback de confirmación existen; no se probó el servicio de correo ni la configuración Auth externa. Añadir recuperación requiere configurar y probar las URLs/correo de Supabase, que no se verificaron aquí.

### SEC-06 — Avisos de dependencias adicionales

**Estado: FALLIDA — corregir junto con un plan de actualización revisado.**

`npm audit` reportó dependencias transitivas vulnerables bajo Monaco y herramientas de compilación/estilo. No se cambiaron versiones o el lockfile para no interferir con los cambios locales ya existentes. Repetir `npm audit` después de acordar versiones objetivo y actualizar de forma controlada.

## Base de datos: revisión estática de migraciones

No se encontraron vistas en las migraciones locales inspeccionadas. La ruta CLI convencional es `supabase/migrations`; existen copias 001/002 bajo `src/app/supabase/migrations`, que pueden desviarse con el tiempo y no se modificaron ni eliminaron.

| Recurso | RLS/políticas observadas en migraciones | Privilegios previstos por migración local 004 | Conclusión estática |
|---|---|---|---|
| `public.profiles` | RLS habilitada. `SELECT` para la propia fila y para administrador. No hay políticas de escritura. | `SELECT` autenticado. | Un estudiante no dispone de política para insertar/actualizar `is_admin`; no puede elevar su rol mediante esta tabla. ACL remoto no comprobado. |
| `public.invitations` | RLS habilitada. Política `FOR ALL` limitada por `current_user_is_admin()` en `USING` y `WITH CHECK`. | `SELECT`, `INSERT` autenticado; sin `UPDATE`/`DELETE`. | La página y la acción vuelven a comprobar `getUser()` y `profiles.is_admin` en servidor. ACL remoto no comprobado. |
| `public.progress` | RLS habilitada. `SELECT`, `INSERT` y `UPDATE` requieren `auth.uid() = user_id`; el `WITH CHECK` de actualización conserva esa condición. No hay política de borrado. | `SELECT`, `INSERT`, `UPDATE` autenticado. | Las políticas impiden apropiarse de filas de otro estudiante. Un estudiante sí puede manipular su propio `is_completed`/`best_score` directamente; esos valores no deben tratarse como credenciales o resultados certificados. |

Funciones y trigger observados:

- `public.current_user_is_admin()` es `SECURITY DEFINER`, `STABLE`, usa `SET search_path = ''`, referencia tablas con esquema explícito, revoca `EXECUTE` a `PUBLIC` y lo concede a `authenticated`.
- `public.handle_new_user()` es `SECURITY DEFINER`, usa `SET search_path = ''` y lee `NEW.raw_user_meta_data ->> 'invitation_code'`. `003` normaliza mayúsculas/espacios y ejecuta un `UPDATE ... WHERE is_used = FALSE ... RETURNING`; una sola transacción puede consumir el código. Código inválido, vencido con fecha, ya usado o ausente causa rechazo. La concurrencia es consistente por la actualización condicional, según lectura estática; no se ejecutó PostgreSQL para probarlo.
- El `expires_at IS NULL` anterior significa que una invitación sin fecha sigue siendo aceptable. La respuesta al cliente no distingue inválida/vencida/usada; es un error genérico, que evita filtrar estado del código.
- Hay restricción `UNIQUE` en el código y en la combinación usuario/módulo/lección; IDs UUID y claves foráneas en el esquema. No se observaron restricciones de dominio para puntajes o longitud del código. La app genera códigos criptográficamente aleatorios de 16 hexadecimales, pero una llamada directa a Supabase Auth puede evitar validaciones que solo existen en la Server Action; el trigger sigue exigiendo un código utilizable.
- No se comprobó la configuración remota, ACL reales, funciones/triggers creados manualmente, backups ni restauración.

### H3 — Duplicado de prefijo 005 y contradicción entre documentos

**Estado: IDENTIFICADO — no se modifica ninguna migración existente.**

- Existen dos migraciones con prefijo `005`: `20261026083730_005_public_signup_optional_invitation.sql` y `20261026083853_005_private_admin_helper.sql`.
- `docs/database-migrations.md` solo cita a `005_public_signup_optional_invitation` en la secuencia local (001 a 005) y no menciona la 005 privada ni el helper de admin.
- `README.md` afirmaba (sin evidencia remota) que las migraciones remotas estaban aplicadas hasta `009_public_signup_optional_invitation_reasserted`, y decía que copias históricas bajo `src/app/supabase/migrations/` fueron removidas, lo que contradice `docs/database-migrations.md` (que dice que no se borraron).
- Ninguna migración existente fue renombrada ni editada. Las nuevas migraciones 011 y 012 se añaden como archivos independientes.
- El estado real de migraciones en Supabase remoto no se conoce; no se asume ni se afirma.

## Autenticación, autorización y privacidad

**APROBADA — evidencia estática:**

- Cliente de navegador y servidor usan `@supabase/ssr` con la URL y clave publishable públicas. No se encontró referencia a `service_role` en el código inspeccionado.
- Las Server Actions de login y administración verifican datos/autenticación; la acción administrativa consulta `profiles.is_admin` antes de insertar. La página de invitaciones repite autorización del lado del servidor. El middleware protege `/practica` y `/academia`; las páginas de aprendizaje también validan la sesión. El administrador se autoriza por perfil, no por un botón de interfaz.
- El inicio de sesión no exige invitación. El registro valida código de 16 hex y contraseña de al menos ocho caracteres y entrega metadatos con `options.data`. El trigger de `003` comprueba validez, expiración y uso único.
- El callback no acepta una URL arbitraria de destino. El archivo `.gitignore` excluye `.env*.local`; `.env.local` no está rastreado según la comprobación local previa. Su contenido no fue abierto ni impreso.

**PENDIENTE — falta evidencia externa o una función:**

- No se probó configuración de confirmación de correo, URL allowlist, política de contraseña, MFA de administrador, límites de Auth, alertas por abuso ni recuperación de cuenta.
- No se hizo prueba de registro/login contra usuarios o invitaciones de prueba; no se consumieron invitaciones reales ni se llamaron operaciones remotas de Supabase.
- Los datos personales observables son correo, nombre, identificador de usuario, progreso por módulo/lección, puntaje/fecha de intento e invitaciones/caducidad/creador. Supabase Auth recibe y gestiona la contraseña. El editor ejecuta código en el navegador; no se encontró persistencia de ese código en las tablas revisadas.
- No se encontró política de privacidad, términos, calendario de retención, proceso de acceso/corrección/supresión, contacto de privacidad ni plan de respuesta a incidentes. La aplicabilidad de registro ante PRODHAB, transferencias internacionales, tratamiento de menores, consentimiento y plazos debe confirmarse con asesoría jurídica costarricense; esta auditoría no declara cumplimiento legal.

## Infraestructura, comunicaciones y ejecución de Python

- Se añadieron en `next.config.mjs` `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, una CSP parcial (`base-uri`, `object-src`, `frame-ancestors`), `Strict-Transport-Security` en producción y `poweredByHeader: false`.
- **APROBADA localmente:** el build servido en `127.0.0.1` entregó el recurso estático con las cabeceras anteriores y sin `X-Powered-By`. Esto prueba configuración local, no TLS, dominio, proxy ni cabeceras del alojamiento final.
- **PENDIENTE:** la CSP no define `default-src` ni `script-src`; no es una CSP estricta. Se necesita ensayar una política completa con Monaco, Worker, Pyodide/CDN y Auth antes de endurecerla. HSTS depende de que la producción solo atienda HTTPS; no incluye `includeSubDomains` ni `preload`.
- El Worker limita el código a 50.000 caracteres, stdout/stderr a 20.000, entrada a 20 líneas de 1.000 caracteres y la interfaz termina/reinicia el Worker tras 5 segundos; la inicialización tiene un límite de 60 segundos. Las pruebas existentes simulan Pyodide; no ejecutan Pyodide real en navegador móvil.
- Pyodide 0.24.1 se carga por `importScripts` desde jsDelivr sobre HTTPS. El Worker mantiene el código fuera del servidor y evita bloquear el hilo de interfaz, pero **no constituye una frontera de seguridad absoluta**. No se verificaron CDN, SRI, despliegue, aislamiento del navegador ni ejecución sin conexión.
- La app maneja errores visibles; no se encontró sistema central de auditoría, alertas o procedimiento de respuesta ante abuso/incidente. No se inspeccionó alojamiento, DNS, configuración TLS, snapshots, copias de seguridad o recuperación.

## Las siete áreas de protección

| Área | Estado | Evidencia / acción pendiente |
|---|---|---|
| 1. Infraestructura, alojamiento y recuperación | PENDIENTE | Proveedor, región, dominio, TLS en borde, copias, retención y restauración no están en el repositorio. |
| 2. Red, HTTPS y comunicaciones | PENDIENTE | Cabeceras observadas localmente; verificar HTTPS, proxy y HSTS en el dominio desplegado. CSP completa pendiente. |
| 3. Código y configuración | PENDIENTE | Next.js 16.4.3 instalado con corrección del DoS de Server Actions aplicada; auditoría de npm reportó 3 moderadas en postcss-selector-parser (parche 6.1.5 aplicado en lock). `.env*.local` excluido; no se leyó el archivo de secretos. |
| 4. Identidad, sesión y permisos | PENDIENTE | Hay verificaciones de servidor y RLS visibles; reset de contraseña, correo, rate limits, MFA admin y sesiones reales no probados. |
| 5. Base de datos y datos | PENDIENTE | RLS visible; privilegios efectivos remotos y triggers instalados no comprobados. Migración 004 local aún sin aplicar ni probar. |
| 6. Registro, monitoreo e incidentes | PENDIENTE | No hay evidencia de logs centralizados, alertas, responsables ni simulacro de respuesta. |
| 7. Mantenimiento, privacidad y cambios | FALLIDA | Dependencias vulnerables y ausencia de documentos/procesos de privacidad en el repositorio; revisión legal costarricense y ciclo de actualización pendientes. |

## Referencia OWASP

> Revisión de brechas, no verificación completa ni certificación ASVS.

| OWASP Top 10:2025 | Estado observado |
|---|---|
| A01 Broken Access Control | APROBADA estáticamente para políticas y guardas visibles; PENDIENTE para ACL y RLS remotos. |
| A02 Security Misconfiguration | Parcial: cabeceras locales configuradas; producción y CSP estricta pendientes. |
| A03 Software Supply Chain Failures | FALLIDA: avisos de dependencias y Next sin soporte. Pyodide depende de CDN fijado por versión. |
| A04 Cryptographic Failures | PENDIENTE: TLS/hosting y configuración Auth remotos no comprobados; solo clave publishable en código inspeccionado. |
| A05 Injection | APROBADA estáticamente para consultas PostgREST observadas (filtros tipados, sin SQL dinámico en app); no es prueba de penetración. |
| A06 Insecure Design | PENDIENTE: invitaciones sin fecha no caducan; el progreso es dato editable por su propietario y no debe considerarse certificación. |
| A07 Authentication Failures | Parcial: sesión/Auth y confirmación en código; recuperación, política remota, límites y flujos reales pendientes. |
| A08 Software or Data Integrity Failures | FALLIDA/PENDIENTE: dependencias vulnerables y CDN sin integridad verificable adicional; puntajes auto-reportados. |
| A09 Logging & Alerting Failures | PENDIENTE: no se hallaron monitoreo ni alertas documentadas. |
| A10 Mishandling of Exceptional Conditions | Parcial: errores de Auth/worker traducidos a mensajes generales; probar fallos de correo, red, DB y producción. |

El objetivo declarado es ASVS 5.0.0 nivel 2. Solo se revisó una selección de controles; **no se completó una matriz de requisitos del Nivel 2 ni se afirma conformidad**.

## Verificaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| `npm run lint` | APROBADA — Next ESLint sin avisos ni errores. |
| `npx --no-install tsc --noEmit` | APROBADA — salida 0, sin diagnósticos. |
| `npx --no-install vitest run` | APROBADA — 3 archivos, 11 pruebas. Incluye cinco casos nuevos del callback URL; worker/course son pruebas unitarias locales. |
| `npm run build` | APROBADA — build de producción completado con Next.js 16.4.3. El build muestra que Next cargó el entorno `.env.local`; no se inspeccionaron ni imprimieron valores. |
| Cabeceras HTTP del build local | APROBADA — `GET /academy-icon.svg` devolvió 200 y las cabeceras descritas; se mantuvo el chequeo fuera de rutas que consultan Supabase. |
| `npm audit` | FALLIDA — terminó con código 1 y reportó 10 avisos (2 críticos, 4 altos, 3 moderados, 1 bajo). No se ejecutó remediación automática. |
| `git diff --check` y control de archivos nuevos | APROBADA — sin errores de whitespace ni marcadores de conflicto; Git informó conversiones LF/CRLF previstas en archivos existentes. |
| Revisión de claves privilegiadas | APROBADA estáticamente — no se encontraron identificadores `service_role`/secretos en las rutas fuente/configuraciones inspeccionadas; `.env.local` está excluido por `.gitignore` y no está rastreado. No se ejecutó un escáner especializado de secretos. |
| Pruebas SQL/RLS locales | PENDIENTE — no hay `supabase`, `psql` ni `docker` disponibles. No se ejecutó SQL. |
| Flujos remotos de Auth/invitación/admin/progreso | PENDIENTE — no se usaron datos, invitaciones ni cuentas remotas. |
| Prueba móvil previa | APROBADA solo para `/` y `/login` sin sesión en 360, 390, 430, 768 y 1280 px; las rutas protegidas y el editor con sesión móvil no quedaron cubiertos por esa prueba. No se usaron dispositivos físicos. |

## Lista previa a publicar

1. Migrar Next.js y `eslint-config-next` a una línea soportada y corregida; adaptar React/App Router con pruebas de rutas/Auth/editor antes del despliegue.
2. Ejecutar `npm audit` de nuevo después de acordar versiones; resolver advisories transitivos de forma controlada y revisar lockfile.
3. Confirmar `NEXT_PUBLIC_SITE_URL` HTTPS en producción y allowlist de callback/confirmación en Supabase Auth; probar correo en staging con cuentas e invitaciones desechables.
4. Inspeccionar ACL, políticas, funciones, triggers y fecha de vencimiento de invitaciones en staging; aplicar la migración 004 solo con aprobación y respaldo/rollback verificado. Probar anónimo/estudiante/admin en DB local aislada.
5. Resolver invitaciones históricas con `expires_at IS NULL` y el consumo previo a confirmación sin invalidar códigos existentes.
6. Configurar y ensayar recuperación de contraseña, rate limits, MFA/controles de cuenta admin y recuperación de sesión.
7. Definir backups y restauración, monitoreo/alertas, contacto y procedimiento de incidentes.
8. Preparar política de privacidad/retención y derechos del titular; obtener revisión jurídica sobre Ley 8968, Reglamento 37554-JP, PRODHAB, ubicación/transferencias y posibles usuarios menores.
9. Verificar HTTPS, HSTS y una CSP compatible en el alojamiento final; probar rutas autenticadas y ejecución de Pyodide en navegadores/dispositivos móviles objetivo.

## Fuentes de referencia

- [OWASP Top 10:2025](https://top10.owasp.org/2025/0x00_2025-Introduction/) y [OWASP ASVS 5.0.0](https://asvs.owasp.org/).
- [Aviso oficial Next.js RCE de optimización de imágenes](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [aviso oficial Next.js DoS de Server Actions](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r), [actualización de seguridad de Next.js del 14-oct-2026](https://nextjs.org/blog/nextjs-security-update-october-14-2026) y [política de soporte](https://nextjs.org/support-policy).
- [Ley costarricense 8968](https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/L/2010-2019/2010-2014/2011/1153F/DCEF7.HTML), [Reglamento 37554-JP](https://www.pgrweb.go.cr/DOCS/NORMAS/1/VIGENTE/D/2010-2019/2010-2014/2012/12270/ECA5D.HTML) y [preguntas frecuentes de PRODHAB](https://www.prodhab.go.cr/preguntasfrecuentes.aspx). La interpretación y aplicabilidad a esta academia requieren asesoría legal.

## Actualización de auditoría — 25 de octubre de 2026

Esta sección actualiza los hallazgos de versión y recuperación de cuenta anteriores. No cambia la evidencia remota ausente ni representa certificación.

### Estado actualizado

- **SEC-01 — APROBADA localmente:** Next.js 16.4.3, React 19.3.1 y `eslint-config-next` 16.4.3 compilan con Node 24.22.1. Los Server Components ahora esperan `cookies`, `params` y `searchParams` donde corresponde. Next informa que el convention `middleware` está deprecado a favor de `proxy`; se conservó el archivo porque renombrar/moverlo requiere autorización específica bajo las instrucciones locales. La migración es compilable, con esta advertencia pendiente.
- **Registro público — PENDIENTE en remoto:** el formulario permite alta sin invitación y valida códigos opcionales. El flujo envía `full_name` e `invitation_code` en `options.data`. `005_public_signup_optional_invitation.sql` conserva el trigger de perfil y rechaza atómicamente códigos usados, caducados o inexistentes cuando se proporcionan. La migración no se ha aplicado; el trigger remoto 003 aún puede bloquear el registro sin código.
- **SEC-05 — APROBADA en código / PENDIENTE en servicio:** se añadieron solicitud y cambio de contraseña con Supabase Auth y callbacks internos fijos; no se probó el correo, URL allowlist o sesión recovery con Supabase real.
- **SEC-06 — FALLIDA con matiz verificable:** `npm audit --omit=dev` finaliza con 0 vulnerabilidades. El audit completo reporta 3 moderadas por `postcss-selector-parser` en Tailwind 3. El árbol local fija 6.1.5, que el mantenedor declara versión parchada de la rama 6.x; el advisory obtenido por npm todavía resume el rango como `<7.1.6` y sugiere Tailwind 4 (cambio mayor). Se mantuvo Tailwind 3 y no se aplicó un cambio mayor a ciegas. Repetir al sincronizar npm su advisory.

### Cambios locales de seguridad y validación

- `package.json`/`package-lock.json` fijan Next 16.4.3 y React 19.3.1, usan ESLint CLI y aplican overrides puntuales: `dompurify` 3.4.17 y `postcss-selector-parser` 6.1.5. El crítico de DOMPurify desapareció del audit de producción. La compatibilidad de ESLint 10 con el config Next está documentada por Next, aunque algunos plugins aún imprimen advertencias de peer durante npm install.
- `src/lib/supabase/server.ts` usa `await cookies()` y `server-only`; todos sus llamadores server-side esperan el cliente.
- `src/app/login/forgot-password/page.tsx`, `src/app/login/reset-password/page.tsx`, `src/app/login/actions.ts` y el callback implementan recuperación; los errores de Auth reales y la entrega de correo no se verificaron externamente.
- `tsconfig.json` recibió los cambios de compatibilidad solicitados automáticamente por Next durante el build (`target`, JSX y tipos generados); se conserva el diff.
- Supabase CLI, `psql` y Docker no están disponibles; no se ejecutó SQL, no se probó RLS en PostgreSQL, ni se accedió a Auth remoto. La migración 004 y 005 permanecen pendientes de revisión/aprobación.
- El build sólo verificó compilación/rutas. No se probaron sesiones, invitaciones reales, progreso remoto, roles o dispositivos físicos.
- Playwright probó `/`, `/login` y `/login/forgot-password` emulando 360, 390, 430, 768 y 1280 px; todas respondieron sin desbordamiento horizontal y los controles de formulario observados midieron al menos 44 px. No se probó `/practica` autenticado, Monaco/Pyodide con sesión, el panel administrativo ni teléfonos físicos.

### Resultado de pruebas de esta actualización

| Comprobación | Resultado |
|---|---|
| `npm run lint` | APROBADA, ESLint sin errores. |
| `npx --no-install tsc --noEmit` | APROBADA, sin diagnósticos. |
| `npx --no-install vitest run` | APROBADA, 4 archivos y 15 pruebas. |
| `npm run build` | APROBADA en Next.js 16.4.3; registra App Router y muestra la advertencia de `middleware` deprecado. |
| `npm audit --omit=dev` | APROBADA, 0 vulnerabilidades tras fijar DOMPurify. |
| `npm audit` | FALLIDA: 3 moderadas reportadas para el parser del toolchain Tailwind; el lock contiene la versión 6.1.5 con fix oficial para la rama Tailwind 3. |
| `npm audit --omit=dev` | APROBADA, 0 vulnerabilidades de dependencias de producción. |
| Playwright (servidor local de producción) | APROBADA para `/`, `/login` y `/login/forgot-password`, 5 anchos emulados; no cubre rutas autenticadas ni dispositivo físico. |
| Escaneo local de texto fuente/docs | APROBADA: no encontró U+FFFD ni caracteres de control inesperados; no se leyó `.env.local`. |
| `git diff --check` | APROBADA al cerrar el conjunto de cambios, sin errores de whitespace. |

### Fuentes técnicas añadidas

- [Guía oficial de actualización de Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [política de soporte de Next.js](https://nextjs.org/support-policy) y [configuración ESLint oficial de Next.js](https://nextjs.org/docs/app/api-reference/config/eslint).
- [Advisory de `postcss-selector-parser`](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf) y [release oficial 6.1.5](https://github.com/postcss/postcss-selector-parser/releases/tag/6.1.5), parche compatible con la rama 6 usada por Tailwind CSS 3.

No se afirma que el sitio esté listo para publicarse: siguen pendientes migración y pruebas de staging, inspección remota de RLS/ACL, configuración de correo, dominio/HTTPS, recuperación, respaldo y revisión legal.
