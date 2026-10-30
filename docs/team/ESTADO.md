# Estado operativo — 30 de octubre de 2026

> Este archivo es la referencia operativa breve. Los informes históricos en `docs/informes/` no demuestran el estado actual de producción.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`, rama de producción: `master`.
- PR #37 (muestra pública ejecutable y sitemap) y PR #38 (andamiaje didáctico de Bubble Sort) están integrados en `master`.
- La última publicación comprobada es el workflow **41045380505**, commit `5818eb529283123b4d4adb7a60aec3b121f7d7da`. El Worker se publicó y los pasos de verificación confirmaron el dominio y el marcador Turnstile en el HTML de `/login`.
- Los commits posteriores de muestra/sitemap y Bubble Sort necesitan su propia pasada CI y publicación antes de considerarse visibles en producción.
- Cloudflare tiene vinculados `python-desdecero.com` y `www.python-desdecero.com`. El proxy envía `www` al dominio principal con redirect 308; la petición pública se observó terminar en el apex.

## Experiencia del alumno

- La portada tiene un camino principal a `/muestra`, una lección real pública, con conceptos, ejemplo, ejercicio y editor Python.
- La muestra no entrega preguntas de quiz, claves, soluciones ni progreso privado al navegador.
- `/academia` y `/practica` siguen requiriendo sesión.
- `/estudiante` solo se mantiene como redirect de compatibilidad hacia `/academia`; no se muestra como un panel independiente.
- El esquema actual solo representa estudiantes y administradores mediante `profiles.is_admin`. No hay rol ni panel docente.
- No hay juegos publicados. El prototipo de cocina se retira del código activo; Orilla es una iniciativa futura separada y no se cuenta como funcionalidad pendiente de esta versión.

## Turnstile y autenticación

- GitHub Actions tiene una Sitekey pública válida disponible para el build de producción.
- El despliegue 41045380505 comprobó que el HTML de `/login` contiene `data-testid="turnstile-widget"`.
- Eso confirma el renderizado del widget en el HTML, **no** que el desafío interactivo se haya completado ni que Supabase Auth esté validando su Secret key.
- Registro, confirmación de correo, login y recuperación con una cuenta y un buzón reales siguen pendientes de prueba integral. No afirmar que Auth está cerrado hasta probarlos.

## Supabase de producción

- Proyecto: `nuqydanbbgqcofcftshk`, estado `ACTIVE_HEALTHY`.
- Existen `public.progress`, `public.invitations`, `private.quiz_attempts` y `private.quiz_answer_key`; las tablas comprobadas tienen RLS activado.
- `public.submit_quiz_v2` existe y permite ejecución a `authenticated`, no a `anon`. La clave de respuestas permanece en el esquema privado con políticas de denegación directa.
- El historial remoto registra 22 migraciones, con versiones e identificadores distintos a algunos archivos locales antiguos. No ejecutar `db push`, `migration repair` ni `db reset` en producción sin reconciliación documentada y respaldo.
- Advisor de Auth: protección de contraseñas filtradas desactivada; es una mejora de seguridad pendiente. No se eliminarán índices por las dos alertas informativas de índices sin uso sin evidencia de carga real.

## Próximas verificaciones antes de declarar Auth y aprendizaje cerrados

1. Confirmar en Supabase Auth de producción que la protección CAPTCHA usa Cloudflare Turnstile y la Secret key privada correcta. La Secret key no debe entrar al repositorio ni a variables `NEXT_PUBLIC_*`.
2. Probar, con un correo de prueba controlado, registro, confirmación, login, logout y recuperación/cambio de contraseña en el dominio final.
3. Completar la primera lección y su evaluación con un estudiante autenticado; confirmar persistencia de resultado y progreso al recargar.
4. Activar la protección contra contraseñas filtradas en Supabase Auth.
5. Esperar CI y despliegue del HEAD actual; comprobar que cada publicación termina con los jobs de despliegue y verificación en verde. Un job `deploy` omitido no es una publicación.

## Regla de cambios de datos

Las migraciones ya aplicadas en producción no se borran ni se reescriben a ciegas. Cualquier divergencia se resuelve primero comparando el historial remoto, los archivos locales y el esquema real.
