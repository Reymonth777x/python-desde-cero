# Estado operativo — 30 de octubre de 2026

> Este archivo es la referencia operativa breve. Los informes históricos en `docs/informes/` no demuestran el estado actual de producción.

## Repositorio y publicación

- Repositorio: `Reymonth777x/python-desde-cero`, rama de producción: `master`.
- PR #37 (muestra pública ejecutable y sitemap) y PR #38 (andamiaje didáctico de Bubble Sort) están integrados en `master`.
- La última publicación comprobada es el workflow **41046973667**, commit `994a579b7c1750a55de6f2302668bafdea8725cf`. El Worker se publicó y los pasos posteriores confirmaron el dominio personalizado y el marcador Turnstile en el HTML de `/login`.
- La ruta pública `/muestra` responde y el sitemap publicado incluye esa URL (cinco entradas). La petición a `www.python-desdecero.com` termina en el apex; el PR #43 añade una prueba de CI que exige HTTP 308 explícito para esta redirección.
- PR #43 contiene cambios adicionales de portada, rutas y retirada del prototipo de cocina; hasta que se integre y publique, esos cambios siguen siendo solo una propuesta.

## Experiencia del alumno

- La portada tiene un camino principal a `/muestra`, una lección real pública, con conceptos, ejemplo, ejercicio y editor Python.
- La muestra no entrega preguntas de quiz, claves, soluciones ni progreso privado al navegador.
- `/academia` y `/practica` siguen requiriendo sesión.
- `/estudiante` solo se mantiene como redirect de compatibilidad hacia `/academia`; no se muestra como un panel independiente.
- El esquema actual solo representa estudiantes y administradores mediante `profiles.is_admin`. No hay rol ni panel docente.
- No hay juegos publicados. El prototipo de cocina se retira del código activo; Orilla es una iniciativa futura separada y no se cuenta como funcionalidad pendiente de esta versión.

## Turnstile y autenticación

- GitHub Actions tiene una Sitekey pública válida disponible para el build de producción.
- El despliegue 41046973667 comprobó que el HTML de `/login` contiene `data-testid="turnstile-widget"`.
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
5. Integrar PR #43 solo con CI verde, publicar su nuevo HEAD y verificar las nuevas aserciones de dominio, sitemap, muestra pública, Turnstile y `www` 308. Un job `deploy` omitido no es una publicación.

## Regla de cambios de datos

Las migraciones ya aplicadas en producción no se borran ni se reescriben a ciegas. Cualquier divergencia se resuelve primero comparando el historial remoto, los archivos locales y el esquema real.
