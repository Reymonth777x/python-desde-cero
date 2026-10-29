# Decisiones Técnicas — Ronda 2

## D001: Usar solución de PR #5 para login/page.tsx
**Decisión:** Adoptar la solución de PR #5 de ChatGPT en lugar de la corrección previa (`use(searchParams!)`).
**Motivo:** PR #5 usa Server Component con `await searchParams` (correcto para Next.js 16) y separa `LoginForm` como client component con `useFormStatus()` para estados de carga. La solución previa usaba `use(searchParams!)` con aserción `!` frágil.
**Archivos afectados:** `src/app/login/page.tsx`, `src/app/login/LoginForm.tsx`

## D002: Excluir dev-server.*.log del control de versiones
**Decisión:** Agregar `dev-server.*.log` a `.gitignore`.
**Motivo:** Evitar subir logs del servidor de desarrollo al repositorio.

## Pendientes de decisión
- ¿Rol docente distinto de admin? (pendiente con el líder)
- ¿Laboratorio público con demo y sesión solo para guardar? (pendiente con el líder)

## D003: CSP con nonce por respuesta
**Decisión:** La CSP de páginas se genera en `src/proxy.ts`, con nonce único por respuesta, se reenvía a la solicitud para que Next.js pueda autorizar sus scripts y el layout lee headers para forzar render por petición. Se elimina el encabezado CSP estático que no incluía nonce.
**Motivo:** El CI de navegador mostró HTML servido pero fallos de interactividad; una CSP estática sin nonce bloquea scripts inline que Next usa para hidratar componentes. No habilitar `unsafe-inline` ni `unsafe-eval` de forma general en producción. Validar la compatibilidad también con Vinext/Cloudflare antes de publicar.

## D004: Un solo ejecutor de Python
**Decisión:** La app usa `public/python-worker.js` a través de `src/lib/use-python-worker.ts`. Se retiraron `src/app/python-runner/page.tsx` y `src/lib/runner-worker.ts`, que solo servían al arnés de pruebas de iframe y no tenían consumidores en el flujo real.
**Motivo:** Mantener dos rutas de ejecución agrega código y pruebas que no cubren el Worker usado por la aplicación. Las pruebas E2E ahora apuntan a la portada y al Worker real.

## D005: Equipo de cuatro socios y secretos individuales
**Decisión:** Cada socio usa su cuenta; acceso a GitHub, Supabase y Cloudflare se concede de forma individual y con privilegios mínimos. Los secrets de producción solo se administran desde GitHub Actions/las plataformas.
**Motivo:** Evitar compartir credenciales del propietario, mejorar la trazabilidad y facilitar la rotación de responsabilidades.
