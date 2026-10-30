# Decisiones técnicas

## D001: Separar la página de acceso del formulario
**Decisión:** Mantener `src/app/login/page.tsx` como Server Component y separar `LoginForm` como componente cliente.
**Motivo:** Next.js 16 entrega `searchParams` como promesa; resolverlo en el servidor evita aserciones frágiles y permite que el formulario gestione sus estados de carga con `useFormStatus()`.
**Archivos afectados:** `src/app/login/page.tsx`, `src/app/login/LoginForm.tsx`

## D002: Excluir logs locales del control de versiones
**Decisión:** Mantener `dev-server.*.log` en `.gitignore`.
**Motivo:** Evitar subir logs del servidor de desarrollo al repositorio.

## D003: CSP con nonce por respuesta
**Decisión:** La CSP de páginas se genera en `src/proxy.ts`, con nonce único por respuesta. Se reenvía a la solicitud para que Next.js pueda autorizar sus scripts y el layout lee headers para forzar render por petición.
**Motivo:** Evitar que una CSP estática bloquee scripts inline necesarios para hidratar componentes. No habilitar `unsafe-inline` ni `unsafe-eval` de forma general en producción. Validar la compatibilidad también con Vinext/Cloudflare antes de publicar.

## D004: Un solo ejecutor de Python
**Decisión:** La app usa `public/python-worker.js` a través de `src/lib/use-python-worker.ts`. Se retiraron `src/app/python-runner/page.tsx` y `src/lib/runner-worker.ts`, que solo servían al arnés de pruebas de iframe y no tenían consumidores en el flujo real.
**Motivo:** Mantener dos rutas de ejecución agrega código y pruebas que no cubren el Worker usado por la aplicación. Las pruebas E2E ahora apuntan a la portada y al Worker real.

## D005: Equipo de cuatro socios y secretos individuales
**Decisión:** Cada socio usa su cuenta; el acceso a GitHub, Supabase y Cloudflare se concede de forma individual y con privilegios mínimos. Los secretos de producción solo se administran desde GitHub Actions y las plataformas.
**Motivo:** Evitar compartir credenciales del propietario, mejorar la trazabilidad y facilitar la rotación de responsabilidades.

## D006: No publicar roles que el modelo de datos no soporta
**Decisión:** El producto mantiene dos permisos: estudiante y administrador mediante `profiles.is_admin`. No se publica ni se anuncia un rol docente hasta que existan su modelo de autorización y sus pantallas reales. `/estudiante` queda únicamente como redirección de compatibilidad a `/academia`; `/docente` se retira.
**Motivo:** Una ruta de redirección no es un panel ni constituye un rol. Los permisos deben reflejar el esquema y las capacidades disponibles.

## D007: Retirar el prototipo de cocina del producto activo
**Decisión:** El componente `GameCanvas` y `src/lib/game/**` se retiran del árbol ejecutable porque no tienen consumidores activos. No hay juego publicado en el producto actual. El historial Git conserva el prototipo.
**Motivo:** Evitar mantener código muerto y documentación que presenta una función inexistente como completada. Orilla queda como proyecto futuro independiente y no forma parte del alcance ni de la readiness de esta versión.
