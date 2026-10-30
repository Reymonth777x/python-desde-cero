## Resumen
<!-- ¿Qué cambia y qué problema resuelve? -->

## Pruebas realizadas
- [ ] `npm run verify`
- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] `npm run build:vinext`
- [ ] Revisé el CI de esta PR y no oculté fallos como “selectores”.

## Base de datos / autenticación
- [ ] No hay cambios de base de datos.
- [ ] Si hay cambios SQL, añadí migración con timestamp a `supabase/migrations/`.
- [ ] Revisé RLS, privilegios y autorización en servidor.
- [ ] Documenté reversión/compatibilidad de migración.
- [ ] Probé con cuentas de prueba; no con datos reales de estudiantes.

## Seguridad y producto
- [ ] No añadí credenciales, tokens, `.env.local` ni datos personales.
- [ ] No envié respuestas correctas ni secretos del servidor al navegador.
- [ ] Revisé móvil/teclado/accesibilidad cuando aplica.
- [ ] El cambio no duplica una función existente o expliqué por qué hace falta.
- [ ] Incluí una prueba o expliqué la limitación de la comprobación manual.

## Riesgo / reversión
<!-- ¿Qué podría romperse? ¿Cómo volvemos atrás? -->
