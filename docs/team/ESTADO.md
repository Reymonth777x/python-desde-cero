# Estado del proyecto — revisión de entrega para el equipo

## Estado de publicación

- Repositorio: `Reymonth777x/python-desde-cero`.
- Rama de trabajo: `fix/lider-20261028`.
- Revisión de integración: [PR #6](https://github.com/Reymonth777x/python-desde-cero/pull/6), dirigida a `master`.
- **No publicar mientras CI no esté verde.** La última ejecución completa confirmada antes de la corrección CSP pasó las pruebas unitarias, TypeScript, ESLint y build de Next.js, pero falló Playwright con 18 pruebas. Se han agregado correcciones de CSP/hidratación, se ha eliminado el runner iframe obsoleto y se están ejecutando nuevas pruebas. La PR debe permanecer sin fusionar hasta revisar el resultado del commit final.
- La URL de producción configurada por el workflow es `https://python-desdecero.com`; también existe la URL de respaldo en `workers.dev`. Verificar ambas tras un despliegue real.

## Cambios ya aplicados al repo de trabajo

- Proxy vuelve a verificar `profiles.is_admin` para rutas `/admin` y conserva la protección de rutas de aprendizaje.
- El login valida el destino `next`, presenta mensajes accesibles y separa el formulario cliente de la página servidor.
- El quiz no devuelve puntuación ni explicaciones si falla el RPC.
- Los datos serializados al navegador omiten respuestas correctas y soluciones.
- Las invitaciones permiten expiración vacía usando el valor predeterminado de la base y reportan errores comprensibles.
- Los índices de respuesta se equilibraron; la migración 020 agrega la segunda versión `correct_option_v2` y `submit_quiz_v2` sin modificar la clave que usa el código antiguo.
- Se reemplazó la CSP estática por CSP con nonce por respuesta y se dejó un tema inicial en HTML servidor; requiere verificación de navegador en CI.
- Se eliminó el route/worker auxiliar `/python-runner`, que no tenía consumidores en la aplicación actual; Python se ejecuta mediante `public/python-worker.js`.
- Se agregó guía de incorporación, roles, accesos y publicación para cuatro socios.

## Verificaciones remotas confirmadas

- Supabase remoto: `nuqydanbbgqcofcftshk`.
- Las migraciones 018, 019 y 020 aparecen en el historial remoto.
- 41 preguntas tienen clave `correct_option_v2`; el RPC v2 está autorizado para `authenticated` y denegado a `anon`.
- La migración 020 conserva intacta la columna `correct_option` antigua para que la versión anterior pueda seguir funcionando durante la transición.

## Pendientes antes de publicar

1. CI verde del último commit: tests, typecheck, lint, build Next, E2E y build Vinext.
2. Smoke test de producción del login, recuperación de contraseña, tema, quiz, progreso e invitaciones con cuentas de prueba.
3. Probar la ejecución Pyodide/Turtle real en navegador y confirmar que el límite de 5.000 comandos detiene programas demasiado gráficos.
4. Verificar cuál Worker responde por el dominio y confirmar la página después del despliegue.
5. Revisar las políticas de acceso de los cuatro socios, usar cuentas individuales y nunca compartir secretos del propietario.

## Regla de release

No se afirma que producción está actualizada hasta que el workflow de Cloudflare termine y la comprobación HTTP del dominio sea exitosa. No aplicar migraciones manuales fuera de `supabase/migrations/`.


## Última revisión técnica
- Se sustituyó la entrada `src/middleware.ts` por `src/proxy.ts`, según la convención de Next.js 16. El CI debe confirmar que los scripts HTML reciben nonce no vacío y que la interfaz hidrata antes de abrir la PR para revisión.
