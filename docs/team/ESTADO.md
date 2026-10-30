# Estado operativo — 30 de octubre de 2026

> Este archivo es la referencia operativa breve. Los informes históricos en `docs/informes/` no demuestran el estado actual de producción.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`, rama de producción: `master`.
- PR #37 (muestra pública ejecutable y sitemap) y PR #38 (andamiaje didáctico de Bubble Sort) están integrados en `master`.
- La última versión de contenido verificada en producción es el workflow **41048515179**, SHA `2940723e3a37a6556770169d0ae692e6bab2d943` (PR #43 integrado). Cloudflare publicó el Worker y verificó el dominio personalizado y la versión nueva.
- La portada pública muestra ahora el ejemplo `cambio.py` de la primera lección (precio 3200, pago 5000, salida 1800), con una acción principal hacia la muestra. La ruta `/muestra` responde con la lección real, y el sitemap contiene cinco URLs.
- El mismo post-deploy verificó el HTML de `/login` con el marcador Turnstile y la redirección HTTP 308 de `www.python-desdecero.com` al dominio principal.
- El PR #54 añade una protección adicional contra ejecuciones `workflow_run` obsoletas; permanece como mejora de despliegue separada hasta integrarse.

## Experiencia del alumno

- La portada tiene un camino principal a `/muestra`, una lección real pública, con conceptos, ejemplo, ejercicio y editor Python.
- La muestra no entrega preguntas de quiz, claves, soluciones ni progreso privado al navegador.
- `/academia` y `/practica` siguen requiriendo sesión.
- `/estudiante` solo se mantiene como redirect de compatibilidad hacia `/academia`; no se muestra como un panel independiente.
- El esquema actual solo representa estudiantes y administradores mediante `profiles.is_admin`. No hay rol ni panel docente.
- No hay juegos publicados. El prototipo de cocina se retira del código activo; Orilla es una iniciativa futura separada y no se cuenta como funcionalidad pendiente de esta versión.

## Turnstile y autenticación

- GitHub Actions tiene una Sitekey pública válida disponible para el build de producción.
- El despliegue 41048515179 comprobó que el HTML de `/login` contiene `data-testid="turnstile-widget"`.
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
5. Integrar PR #54 cuando sus checks estén verdes; su protección compara el SHA del CI concluido con el HEAD de `master` para impedir despliegues atrasados. Verificar el post-deploy del nuevo HEAD y comprobar que el Worker sirve la misma versión.

## Regla de cambios de datos

Las migraciones ya aplicadas en producción no se borran ni se reescriben a ciegas. Cualquier divergencia se resuelve primero comparando el historial remoto, los archivos locales y el esquema real.
