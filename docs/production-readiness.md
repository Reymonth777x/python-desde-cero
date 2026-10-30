# Preparación para producción

**Última comprobación:** 30 de octubre de 2026, 10:37 UTC  
**Alcance:** GitHub, sitio público y Supabase de producción. Las consultas SQL y la inspección de configuración de base de datos fueron de solo lectura. No se ejecutaron migraciones ni se modificaron usuarios, invitaciones o datos.

## Estado ejecutivo

**Estado: DESPLEGADO, pero todavía no aprobado como lanzamiento educativo completo.**

El despliegue técnico actual está comprobado. El recorrido real de un estudiante, la protección del contenido del curso y la validación operativa de Auth siguen teniendo tareas pendientes.

### Evidencia de la versión publicada

- Rama principal: `master`, commit `ef6b1b7807dd9816ce6064ba5ae5ea6f11bf389f` (`ef6b1b7`).
- CI de `master`: ejecución [41040829424](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41040829424) finalizada correctamente.
- Despliegue manual de Cloudflare: ejecución [41041886743](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41041886743) finalizada correctamente. El job compiló Vinext, desplegó el Worker, comprobó el dominio raíz y ejecutó las verificaciones posteriores.
- La verificación posterior del despliegue comprobó la nueva portada y el marcador `data-testid="turnstile-widget"` en `/login`. Esto confirma que el widget se incluyó en el HTML servido; no demuestra por sí solo que una persona pueda completar el desafío ni que el flujo Auth completo funcione.
- La portada pública anuncia ahora cuatro módulos y 33 unidades obligatorias, más una extensión opcional de cuatro actividades. Esta cifra coincide con el catálogo actual del repositorio.
- La PR #28, que convierte el laboratorio móvil en una secuencia vertical, fue fusionada en `master`; sus pruebas CI pasaron. La emulación Playwright no sustituye pruebas en teléfonos físicos.
- La PR #31 registra `www.python-desdecero.com` como dominio adicional del Worker y añade una redirección 308 al dominio raíz. La configuración está en el repositorio; falta una verificación externa independiente de DNS, certificado y redirección de `www`.

## Supabase: estado observado en producción

Los proyectos de producción y desarrollo están separados y ambos aparecen activos. Producción se inspeccionó mediante el conector de Supabase y consultas SQL de solo lectura.

### Historial de migraciones

El historial remoto de producción contiene las migraciones con versión:

- `004` a `010`: grants, helper privado de administrador, restricciones de privilegios, optimización RLS, registro público opcional y endurecimiento de estados.
- `011_secure_quiz_submission`, `012_deny_direct_quiz_table_access`, `013_randomize_quiz_option_order`, `014_require_invitation_expiry` y `015_private_quiz_rpc_wrapper`.
- `018_lock_progress_writes_allow_invitation_delete`, `019_quiz_key_current_catalog_ids`, `020_balance_quiz_answer_positions_v2`.
- `021 scope_quiz_attempt_cleanup_to_current_user`, `022 protect_redeemed_invitation_history` y `023 add_three_core_integration_labs`.
- `024 add_required_pe1_assessments_and_project`, `025 add_module_2_hello_world_quiz`, `026 harden_quiz_rpc_invoker` y `027 harden_quiz_result_and_enforce_prerequisites`.

**No ejecutar un `db push` a ciegas.** El historial no registra las migraciones locales 001–003 con esos mismos números; tampoco registra las variantes locales 016 y 017. La migración local 028 (`20261030091000_028_grandfather_existing_module_progress.sql`) tampoco aparece en el historial remoto consultado. Las versiones y contenidos locales/remotos tienen divergencias documentadas en [docs/team/MIGRACIONES.md](team/MIGRACIONES.md). No repetir 024–027: ya están aplicadas en producción con versiones timestamp distintas de los prefijos de algunos archivos locales.

### RLS, grants y funciones

En la inspección efectiva se observó:

- `profiles`: RLS habilitada; el rol autenticado solo recibe `SELECT`. La política limita la lectura al propio perfil o a administración. `is_admin` tiene valor predeterminado falso y no se concede escritura directa al estudiante.
- `invitations`: RLS habilitada; `SELECT`, `INSERT` y `DELETE` concedidos a `authenticated`, con la política de administración como control de filas. El historial incluye la protección contra borrado de invitaciones ya utilizadas.
- `progress`: RLS habilitada y acceso directo de lectura limitado al propio usuario. La aplicación del progreso de evaluaciones se realiza a través del calificador privado; no habilitar escrituras directas del cliente sin revisar el diseño.
- `private.quiz_answer_key` y `private.quiz_attempts`: RLS habilitada y política de denegación de acceso directo.
- `public.submit_quiz_v2` es `SECURITY INVOKER`; la implementación autoritativa privada es `SECURITY DEFINER` y valida `auth.uid()`. El acceso al RPC público se concede a usuarios autenticados, no a `anon`.

Los hallazgos anteriores describen el estado consultado; no sustituyen pruebas de aislamiento entre dos cuentas reales ni una auditoría completa de todos los objetos y roles.

### Asesores de Supabase

- **Advertencia de seguridad:** la protección de contraseñas filtradas está desactivada. Revisar y habilitarla según las capacidades del plan y la configuración de Auth.
- **Información de rendimiento:** dos índices de invitaciones aparecen sin uso observado. No eliminarlos sin analizar consultas, volumen y planes de ejecución.

## Bloqueos antes de declarar el producto listo

### P0 — Recorrido real del estudiante

1. Ejecutar pruebas de registro, confirmación de correo, inicio, cierre y recuperación con cuentas desechables en producción controlada o staging.
2. Completar una primera lección, ejecutar código, enviar la evaluación, fallar y aprobar; comprobar que la nota y el progreso se conservan después de cerrar sesión y volver a entrar.
3. Repetir el aislamiento con dos estudiantes: cada uno solo debe consultar su propio progreso e intentos.
4. Probar Turnstile de extremo a extremo: carga del widget, token válido, expiración, error y rechazo del servidor cuando falta o es inválido.
5. Resolver la barrera de valor antes del registro. Recomendación: publicar una lección de muestra real (por ejemplo, la primera unidad), con ejecución de Python en el navegador y sin guardar progreso ni revelar respuestas. Pedir cuenta al guardar progreso o presentar evaluaciones. No abrir todo el contenido privado por defecto.

Las pruebas Playwright actuales cubren carga de páginas, cambios entre formularios, mensajes y redirecciones. No demuestran por sí solas entrega real de correo ni un ciclo completo contra Auth con dos cuentas.

### P0 — Exposición de respuestas en el repositorio público

El repositorio es público. `src/lib/course.ts` está marcado como `server-only`, lo que ayuda a evitar que sus datos se incluyan en el bundle del navegador; sin embargo, el archivo fuente público contiene campos como `answer` y `exercise.solution`. Cualquier persona puede leerlos directamente en GitHub.

**Acción requerida:** decidir la visibilidad del repositorio y retirar las claves de respuestas/soluciones del código público. Mantener un módulo `server-only` no protege un archivo que el público puede descargar desde el propio repositorio. El issue [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21) ya registra esta decisión pendiente.

### P1 — Gobierno del repositorio y documentación

- La rama `master` aparece sin protección. Completar el issue [#23](https://github.com/Reymonth777x/python-desde-cero/issues/23): PR obligatorio, una aprobación, conversaciones resueltas y checks `test-and-build` y `powershell-launcher`.
- `docs/ESTADO.md` todavía describe hitos antiguos H0–H10 y pendientes que no representan bien el estado actual. Mantener una única fuente de estado y retirar instrucciones obsoletas.
- En CI, la auditoría `npm audit` es informativa y tiene `continue-on-error: true`; un CI verde no equivale a cero vulnerabilidades. Revisar los resultados y mantener una política de actualización de dependencias.

### P1 — Correo, recuperación y operación

- Verificar URL allowlist, plantillas, proveedor SMTP, entrega de confirmación y recuperación. No se da por configurado SPF, DKIM o DMARC sin comprobación DNS y prueba de entrega.
- Verificar límites de Auth, MFA/controles de administrador y alertas contra abuso.
- Confirmar copias de seguridad y ejecutar una prueba documentada de restauración. La existencia de un proyecto activo no demuestra que haya un backup recuperable.

### P1 — Móvil y accesibilidad

- Probar el editor, ejecución Pyodide, entrada `input()`, gráficos Turtle, selector de temas y formularios en teléfonos físicos (iOS y Android) y redes lentas.
- La PR #28 ya ordena el laboratorio en una sola secuencia vertical. Validar teclado virtual, foco, scroll al resultado, paneles y desbordamiento en dispositivos reales.
- El selector de temas usa un diálogo móvil centrado con scroll interno en el código actual; su aspecto real todavía debe revisarse en dispositivos.

### P1 — Privacidad y legal

Revisar política de privacidad, términos, cookies, retención, proceso de acceso/corrección/supresión y tratamiento de menores con asesoría adecuada para Costa Rica. Este documento no constituye una certificación legal ni afirma cumplimiento de PRODHAB.

## Ajustes de producto recomendados

- Sustituir el ejemplo principal de Turtle/`for` por una demostración coherente con la primera unidad de principiantes, como entradas, proceso y salida o un primer `print()`.
- La portada ya anuncia 33 unidades, pero debe explicar resultados observables, duración estimada respaldada por el plan de lecciones y qué evidencia obtiene el estudiante al completar el PE1.
- Unificar la demostración de portada con la experiencia de la primera lección; evitar que el usuario pruebe un laboratorio aislado y luego encuentre una academia distinta.
- El sitemap contiene solo portada, login y recuperación; `robots.txt` excluye el contenido de Academia. Mantener privado el curso si corresponde, pero considerar una lección introductoria pública e indexable.
- Definir el uso de la marca y agregar una licencia solo después de decidir qué material del curso y del código puede reutilizarse.

## Regla operativa

- No ejecutar `supabase db push`, `migration repair`, `db reset` ni cambios de ACL en producción hasta reconciliar los historiales, probar en desarrollo y verificar respaldo/rollback.
- No declarar Auth, progreso, evaluaciones, correo o móvil como aprobados por el solo hecho de que el build o el despliegue estén verdes.
- Toda modificación de producción debe pasar por PR, CI y verificación posterior del dominio publicado.
