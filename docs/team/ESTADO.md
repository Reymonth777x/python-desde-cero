# Estado actual del proyecto — 30 de octubre de 2026

## Rama y Pull Request

- Rama de trabajo: fix/lider-20261028.
- PR principal: #6, todavía en draft; no fusionar ni publicar hasta cerrar los bloqueos de este documento.
- PR #8: no fusionar directamente. Está basado en una historia antigua, reutiliza un timestamp de migración ya aplicado en remoto y contiene variantes incompatibles de evaluaciones/invitaciones.
- PR #14 y #15: cerrados como duplicados/PR con base incorrecta. El cambio de Turtle está en la rama principal de trabajo.
- No se ha desplegado una versión nueva a producción durante esta ronda.

## Cambios incorporados en esta ronda

- Turtle: encuadre automático, cursor real con forma/color/orientación y respeto por hideturtle(); pruebas unitarias nuevas.
- Módulo 3: secuencia de aprendizaje corregida para enseñar decisiones y ciclos antes de operadores bit a bit; listas simples antes de listas anidadas.
- Práctica b3-l6: ahora acepta varias entradas y valida tres casos, incluidos un único elemento y números negativos.
- Inicio: la portada es Server Component y delega la interacción a HomePageClient; enlaces de sesión y resumen de progreso consultan Supabase desde el servidor para evitar desincronización del estado cliente.
- Entorno local: el lanzador usa Supabase CLI 2.121.0 mediante npx, por lo que no exige instalación global. No aplica migraciones automáticamente mientras exista divergencia de historial.
- Documentación académica y de migraciones actualizada con los hallazgos reales.

## Estado académico real

- PE1 tiene cuatro módulos principales.
- El catálogo tiene 30 unidades principales y cuatro unidades opcionales de extensión.
- El módulo 5 es opcional y está fuera del PE1; no se debe sumar al progreso ni presentarlo como módulo oficial.
- Hay tres evaluaciones formales de módulo; falta la evaluación del módulo 1.
- b1-l4 ahora es una vista previa breve del intérprete, no una lección de comentarios ni una evaluación. La explicación formal de print(), cadenas y comentarios se trasladó al contenido de módulo 2; falta la evaluación formal de módulo 1.
- Falta una evaluación global PE1.
- El proyecto final está dentro de la extensión opcional; debe convertirse en un requisito de graduación PE1, sin exigir lectura de archivos como conocimiento central.
- En la auditoría inicial, 29 de 30 prácticas principales tenían un único caso automático; b3-l6 ya tiene tres. Hace falta ampliar los demás casos de prueba con entradas límite y errores típicos.
- Las lecciones de nivel medio y los temas bit a bit/bubble sort necesitan andamiaje, ejemplos resueltos y prerequisitos visibles.

## Estado de autenticación, evaluaciones e invitaciones

- El código actual de la rama usa submit_quiz_v2 y las claves correctas se mantienen en el servidor.
- La lectura de solo esquema confirmó que la RPC existe y que las claves activas del catálogo tienen correct_option_v2 configurado.
- No se pudo reproducir un intento real de estudiante porque no se dispone de una sesión de prueba autenticada en esta ejecución. La verificación con cuentas reales sigue pendiente.
- Las invitaciones no utilizadas se pueden eliminar; las utilizadas se conservan como historial.
- El código personalizado debe persistirse exactamente; dejar el campo vacío genera un código aleatorio.
- La nueva portada consulta la sesión y el progreso desde el servidor, pero requiere E2E autenticado para confirmar el comportamiento real.

## Divergencia crítica de migraciones

El historial remoto y la carpeta local no coinciden. Los detalles están en docs/team/MIGRACIONES.md.

- El remoto contiene las versiones 011–015 con timestamps distintos a las variantes locales.
- El remoto no registra las migraciones base 001–003 ni algunas migraciones locales posteriores.
- Las variantes locales 011–015 no son equivalentes a las versiones remotas; unas crean public.quiz_attempts/private.quiz_keys y otras usan private.quiz_attempts/private.quiz_answer_key.
- Las migraciones locales 016–017 no aparecen aplicadas en remoto y no se encontró uso activo de sus tablas en el código principal.
- No ejecutar db push, migration repair ni db reset contra producción hasta reconciliar el historial y verificar el esquema.

## Validación CI

- En el SHA 353842412cd63e0c81b80a8d28b3e1e346477d3d se aprobaron Vitest, TypeScript, ESLint y build Next.js.
- Los checks E2E y Vinext seguían en curso en esa ejecución.
- Hay commits posteriores de portada, currículo, launcher y documentación; se debe esperar el workflow del HEAD actual antes de declarar CI verde.
- La inspección interactiva del sitio de producción no llegó a ejecutarse porque el servicio de navegador externo no tenía saldo suficiente. No afirmar que el dominio público fue probado.

## Cómo iniciar el entorno local y consultar usuarios de prueba

Desde la raíz del repositorio, en PowerShell:

    .\scripts\start-local.ps1

El lanzador inicia Supabase local, lee las variables locales y ejecuta el seed de desarrollo. No aplica migraciones ni restablece la base.

En otra terminal PowerShell:

    Get-Content .local\dev-users.credentials.json

El archivo contiene el administrador y dos estudiantes con contraseñas aleatorias. Está excluido de Git; no copiarlo al repositorio ni compartirlo. El seed solo admite endpoints loopback.

Si el seed falla porque falta el esquema local, detenerse y reportar el error. No ejecutar db reset ni conectar el proyecto remoto para “arreglarlo”.

## Bloqueos antes de declarar la versión lista

1. Completar la evaluación formal del módulo 1 y alinear primer programa/comentarios con el módulo 2 mediante una migración creada con Supabase CLI.
2. Añadir evaluación global y proyecto final obligatorio PE1.
3. Ampliar las prácticas y evaluaciones para que comprueben comprensión, depuración y casos límite.
4. Verificar guardado de evaluaciones y progreso con dos estudiantes y un administrador reales.
5. Verificar login, registro, logout, recuperación, navegación y resumen de progreso.
6. Probar creación/guardado de códigos personalizados, generación automática y eliminación de invitaciones no utilizadas; confirmar que las utilizadas no se borran.
7. Completar E2E, Vinext y pruebas en un entorno local con migraciones reconciliadas.
8. Reconciliar migraciones con evidencia antes de cualquier despliegue.
9. Fusionar PR #6 solo con checks verdes y revisión final; después comprobar producción y el dominio.
