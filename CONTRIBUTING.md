# Guía de Contribución

Gracias por considerar contribuir a **Python desde cero**. Este es un proyecto educativo independiente para enseñar programación en Python desde cero.

## Cómo contribuir

1. **Reporte de errores**: abra un issue describiendo el problema, los pasos para reproducirlo y el comportamiento esperado.
2. **Mejoras de documentación**: las correcciones y ampliaciones de `README.md` y los archivos de `docs/` son bienvenidas.
3. **Mejoras de código**: abra un pull request con cambios pequeños y enfocados. No reescriba arquitectura ni reemplace dependencias sin una justificación documentada.
4. **Contenido del curso**: las adiciones al currículo de Python PE1 deben ser contenido original. No copie materiales protegidos por derechos de autor de terceros.

## Reglas no negociables

- No se admiten cambios que debiliten la autenticación, las políticas RLS o la seguridad de la aplicación.
- No se aceptan commits que suban `.env.local`, claves API, tokens o cualquier secreto.
- No se ejecutan migraciones de base de datos remotas sin autorización explícita del propietario.
- No se fuerza-push ni se sobrescribe el historial remoto.
- Todos los cambios deben pasar `npm test`, `npm run build`, `npm run typecheck` y `npm run lint` antes de fusionarse.

## Flujo de trabajo sugerido

1. Cree una rama a partir de `master`.
2. Haga cambios pequeños y reversibles.
3. Ejecute `npm test`, `npm run build`, `npm run typecheck` y `npm run lint`.
4. Abra un pull request describiendo el cambio y su motivación.
5. El propietario revisará y aprobará antes de fusionar.

## Licencia

Este proyecto aún no tiene licencia aplicada. El propietario decidirá los términos de reutilización del código fuente y del contenido educativo.
