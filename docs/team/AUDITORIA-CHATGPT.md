# Auditoría de ChatGPT — Pendiente de recepción

Este documento contendrá el informe de auditoría externa de ChatGPT. Actualmente no se ha recibido.

Hallazgos conocidos del usuario (deben verificarse y corregirse):
- LAB-01: public/turtle_compat.py asigna atributos `speed` y `heading` que ocultan métodos del mismo nombre
- LAB-02: "Saludo interactivo" y "Reto de lógica" usan input() con lista de entradas vacía
- LAB-03: Límite explícito a comandos Turtle, tamaño del mensaje y datos serializados
- SEC-02: Código Python puede alcanzar el módulo JS de Pyodide (js/pyodide_js)
- AUTHZ-01: middleware.ts usa claims.role pero páginas admin usan profiles.is_admin
- AUTHZ-02: /practica debe rechazar sesiones inexistentes por sí misma
- ADMIN-01/02: Enlaces /admin/usuarios y /admin/auditoria apuntan a páginas inexistentes
- AUTH-02: requestPasswordReset no pasa captchaToken a resetPasswordForEmail
- SEC-03: scripts/seed-dev-users.mjs usa contraseñas fijas y las imprime
- AUD-01: /api/csp-report sin límite de tamaño
- HEAD-01: Revisar CSP y probar si se puede quitar 'unsafe-eval'
- SEO-01/02: metadata por ruta, metadataBase, imágenes Open Graph/Twitter, robots.ts y sitemap.ts
- CI-01: Workflow para PR con npm ci, tsc, vitest, build Next, build Vinext y npm audit
- UX: Progreso del estudiante debe calcularse contra catálogo real de lecciones