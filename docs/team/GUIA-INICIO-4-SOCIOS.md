# Guía de incorporación para el equipo de 4 socios

## Objetivo y forma de trabajar

Cada socio usa su propia cuenta de GitHub y trabaja en una rama. Nadie comparte contraseñas, cookies de sesión, tokens personales ni archivos `.env.local`. El repositorio puede ser público; los permisos de escritura se conceden por persona.

## Roles de la primera ronda

| Socio | Responsabilidad principal | Qué entrega antes de cerrar su tarea |
|---|---|---|
| 1. Coordinación y producto | Prioridades, tareas, revisión final de alcance y comunicación del equipo | Issue con objetivo, criterio de aceptación y responsable |
| 2. Curso y evaluaciones | Contenido de módulos/lecciones y preguntas en `src/lib/course.ts` | Verifica respuesta correcta, explicación, navegación y prueba de regresión |
| 3. Laboratorio y calidad | Editor, Web Worker, Pyodide, Turtle, móvil/accesibilidad y E2E | Reproduce el caso, añade prueba y confirma que el laboratorio ejecuta código real |
| 4. Auth, datos y operaciones | Supabase, políticas RLS, migraciones, progreso e invitaciones | SQL revisado, permisos comprobados y plan de reversión |

**Rotación:** cambien los roles técnicos entre socios al inicio de cada sprint (una semana o un módulo), para que todos aprendan el proyecto. El rol de revisión de producción se asigna explícitamente en cada release; el dueño de las credenciales productivas no se rota compartiendo sus claves.

## Dar acceso a las plataformas

### GitHub
1. El propietario invita a cada socio por separado desde **Settings → Collaborators** (o desde el equipo de la organización si se mueve el repositorio a una organización).
2. Los socios aceptan con sus propias cuentas y activan la autenticación de dos factores.
3. Los cuatro pueden proponer ramas y PR. No se trabaja directamente sobre `master`.
4. Cada PR debe tener una persona responsable y una revisión de otro socio. Se fusiona únicamente con CI verde y criterio de aceptación cumplido.

### Supabase
- Inviten a cada socio con su cuenta individual y el rol mínimo que permita su tarea, en vez de entregar el acceso del propietario.
- Solo el responsable de datos prepara/revisa las migraciones. No se ejecutan SQL de una rama contra producción “para probar”.
- Para pruebas funcionales, usen cuentas de prueba y nunca los datos personales de estudiantes.
- La llave publicable `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` está pensada para el cliente; **la service-role key, secretos JWT y credenciales del propietario nunca van al repo, al navegador ni a un chat**.

### Cloudflare y producción
- El despliegue se ejecuta desde GitHub Actions después de que el CI de `master` termine correctamente.
- `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` se guardan en **Repository Settings → Secrets and variables → Actions**. No se escriben en archivos del proyecto ni se copian entre socios.
- Limiten quién puede cambiar los secrets y el workflow de despliegue. Si un socio necesita operar producción, el propietario debe concederle acceso individual por la plataforma.
- Un cambio de base de datos y su cambio de código deben ser compatibles durante el despliegue; conservar un rollback viable.

## Preparar cada computadora

Requisitos del proyecto: Node.js 24 (la misma versión que CI) y npm.

```bash
git clone https://github.com/Reymonth777x/python-desde-cero.git
cd python-desde-cero
git switch master
git pull
npm ci
```

1. Copien `.env.example` como `.env.local`.
2. Pongan la URL del proyecto Supabase de desarrollo y su llave publicable. Para desarrollo local, `NEXT_PUBLIC_SITE_URL=http://localhost:3000`; si Next arranca en otro puerto, usen el puerto real.
3. Mantengan las variables productivas y secretos fuera de `.env.local` compartido, capturas, commits y documentos.
4. Arranquen con `npm run dev` y abran `http://localhost:3000`.

No creen cuentas nuevas sobre la base productiva para hacer pruebas. Usen el entorno acordado de desarrollo y cuentas de prueba.

## Ramas, PR y pruebas

Nombres sencillos:

- `feat/<issue>-<tema>`: función nueva.
- `fix/<issue>-<tema>`: reparación.
- `docs/<tema>`: documentación sin cambios de lógica.

Antes de abrir PR, ejecutar como mínimo:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run build:vinext
```

Después, revisen el resultado del CI de GitHub. Las pruebas de integración con Supabase y navegador no se consideran aprobadas solo porque los tests unitarios pasen.

### Criterios de aceptación de cada tarea

- El cambio resuelve un problema concreto y no duplica una función existente.
- La interfaz funciona con ratón y teclado, en móvil y escritorio cuando corresponda.
- Hay una prueba o una explicación concreta del porqué no se puede automatizar.
- Si cambia la base, se incluye una migración fechada en `supabase/migrations/`, se revisan RLS/permisos y se documenta reversión.
- No se añaden secretos, archivos de build ni dependencias sin uso.
- La PR declara riesgos y pruebas reales; no se marca como lista mientras los checks fallen.

## Reunión semanal de 20 minutos

1. Cada socio indica qué terminó, qué demostración lo comprueba y qué bloquea lo siguiente.
2. El equipo acuerda máximo tres prioridades para el siguiente sprint.
3. Se rotan los roles de curso, laboratorio y datos; se asigna un revisor que no sea el autor.
4. Se actualizan `docs/team/ESTADO.md`, `docs/team/DECISIONES.md` y `docs/team/MIGRACIONES.md` con hechos confirmados.

**Regla de equipo:** la IA puede proponer cambios, explicar errores y preparar pruebas, pero un socio debe entender la modificación, revisar el diff y responsabilizarse de su aceptación. No se fusiona código solo porque lo haya producido una IA.
