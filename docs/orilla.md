# Orilla

Orilla es una práctica de Python integrada en Python desde cero. La persona escribe Python y guía a Nilo, una lancha, por un río. La campaña tiene 12 tramos vinculados a conceptos de las lecciones, además de dos retos y un río abierto.

Rutas: `/orilla` (mapa) y `/orilla/[chapterId]` (un tramo). Las dos requieren inicio de sesión; `src/proxy.ts` protege el prefijo.

## Cómo se ejecuta

- Monaco edita el programa dentro de la página.
- `use-orilla-worker.ts` abre el Worker Pyodide existente y transfiere un `MessagePort` privado.
- El Worker carga `public/orilla-engine.py` una sola vez y recibe mensajes `orilla:run`; devuelve `orilla:result` o `orilla:error` por el mismo puerto.
- El motor recorre el AST para limitar los constructos disponibles, ejecuta el programa en un entorno acotado y devuelve eventos. La interfaz reproduce esos eventos en el mapa del río.
- La descarga del motor se sirve como recurso público `/orilla-engine.py`; no se solicita a una ruta protegida.

El resultado de Orilla es una práctica gamificada y el motor corre en el navegador. La RPC de Supabase verifica la sesión, el dueño de la fila, los tamaños y el orden de desbloqueo; conserva la mejor marca. **No vuelve a ejecutar ni certifica el programa**. Las estrellas y los tramos de Orilla no son calificaciones oficiales ni sustituyen las evaluaciones PE1, que conservan su calificador privado.

## Archivos principales

| Pieza | Archivo |
| --- | --- |
| Catálogo, apertura gradual y prerrequisitos | `src/lib/orilla/catalog.ts` |
| Mapas, objetivos y andamiaje | `src/lib/orilla/chapters/` |
| Motor Python restringido | `public/orilla-engine.py` |
| Protocolo con Pyodide | `src/lib/orilla/use-orilla-worker.ts` y `public/python-worker.js` |
| Mapa, editor y reproducción | `src/components/orilla/` |
| Lectura y escritura por cuenta | `src/app/orilla/` y RPC de Supabase |
| Migración | `supabase/migrations/20261031012927_029_orilla_runs.sql` |

## Desbloqueo y guardado

El primer tramo está disponible al iniciar. Cada tramo de campaña requiere que el anterior se haya superado. Los dos retos y el río abierto se abren después de c12. La página de un tramo cerrado no entrega el mapa ni el payload del motor.

La tabla `public.orilla_runs` guarda una fila por usuario y tramo. RLS permite leer solo la fila propia. La API revoca las escrituras directas; las Server Actions llaman a `record_orilla_run` y `clear_orilla_notes`. Un trigger impide cambiar el dueño o bajar estrellas, intentos y mejor marca.

## Pruebas

`npm test` ejecuta pruebas de catálogo, reproducción y Server Actions. `npm run test:orilla` carga Pyodide real, ejecuta las 15 soluciones de referencia y los casos adversariales de `tests/orilla/cases.json`. `npm run check:release` incluye ambos grupos.

## Agregar un tramo

1. Añadir metadatos y la apertura en `catalog.ts`.
2. Añadir datos en `chapters/<id>.ts` y registrarlos en `chapters/index.ts`.
3. Crear una solución de referencia en `tests/orilla/solutions/<id>.py`.
4. Actualizar el constraint de IDs mediante una migración nueva; no reescribir la migración aplicada.
