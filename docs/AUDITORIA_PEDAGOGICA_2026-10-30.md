# Auditoría pedagógica del curso Python desde cero

**Fecha:** 30 de octubre de 2026  
**Rama de referencia:** `master`, commit `1a8d123d4d3b78ba0be1cd0cd2ba363211e19ae8`  
**Alcance:** lectura de las 33 lecciones obligatorias de los módulos 1–4 y de las 4 lecciones opcionales del módulo 5 en `src/lib/course.ts`, contrastadas con el catálogo de navegación. Se revisaron objetivos, explicación, ejemplo, recorrido guiado, ejercicio, código inicial, nivel y preguntas.

## Conclusión ejecutiva

No recomiendo borrar lecciones ni reordenar módulos de forma masiva. La secuencia general cubre los fundamentos de forma progresiva, y varias actividades parecidas son refuerzo deliberado, no duplicados. Sí hay saltos verificables entre lo que una lección explica y lo que pide hacer en su ejercicio, además de un desajuste concreto entre el código inicial y la solución del proyecto final.

**Regla para la corrección:** conservar IDs de módulo/lección y los registros de progreso existentes. Cualquier cambio de orden debe tratarse como una migración de producto y navegación, no como un simple cambio editorial.

## Hallazgos priorizados

### P1 — El proyecto final no prepara correctamente el caso de entrada no numérica

**Ubicación:** módulo 4, `b4-l10`, «Proyecto final obligatorio: gestor de inventario».

- El enunciado exige rechazar cantidades no numéricas.
- Uno de los seis casos de prueba entrega `abc` y espera `Cantidad no válida` y que el programa continúe hasta mostrar el total.
- El código inicial convierte directamente con `cantidad = int(input())` antes de llamar a `agregar_producto()`. Esa conversión genera `ValueError` y detiene el programa si el alumno conserva el esqueleto.
- La solución sí mueve la conversión dentro de un bloque `try/except ValueError` y continúa con `continue`. Por tanto, el patrón necesario aparece en la solución, pero no en el código inicial que el alumno recibe.

**Corrección propuesta:** hacer que el código inicial muestre claramente dónde capturar `ValueError`, sin entregar la solución completa. El enunciado, los cinco pasos/hints, el código inicial, la solución y los seis casos de prueba deben describir el mismo flujo. Agregar una indicación de que una entrada inválida no debe terminar todo el programa.

**Regresión requerida:** ejecutar los seis casos del proyecto contra la solución de referencia y comprobar que el código inicial no induce un flujo incompatible con el caso `abc`. No exponer `solution` ni `tests[].expected` al cliente.

### P1 — Bubble Sort se evalúa sin una demostración guiada del algoritmo

**Ubicación:** módulo 3, `b3-l7`, «Modificar, ordenar y procesar listas».

- El objetivo incluye comprender comparaciones e intercambios en Bubble Sort.
- La explicación describe el algoritmo en un párrafo.
- El ejemplo ejecutable usa `colores.sort()`, es decir, el método incorporado de Python; no implementa Bubble Sort.
- El ejercicio exige completar dos bucles anidados, comparar vecinos e intercambiarlos para ordenar una lista desde cero.

El ejemplo enseña cómo ordenar con una herramienta ya hecha, mientras el ejercicio evalúa cómo construir el algoritmo manualmente. Es un salto importante para un principiante.

**Corrección propuesta:** conservar la comparación entre `sort()` y Bubble Sort, pero añadir antes un ejemplo trabajado del algoritmo manual con una sola pasada sobre una lista pequeña. Mostrar qué pareja se compara, cuándo se intercambia y cómo queda la lista. Luego añadir una práctica parcial con un intercambio y finalmente dejar el ejercicio completo.

**Regresión requerida:** la práctica debe ordenar la lista de prueba sin llamar a `sort()` ni `sorted()`; comprobar también una lista ya ordenada, una lista inversa y una lista de un elemento.

### P1 — Se usan variables antes de enseñar formalmente variables

**Ubicación:** módulo 2, `b2-l4` (sección 2.3.1), antes de `b2-l2` (sección 2.4).

`b2-l4` utiliza `subtotal`, `precio_texto` y `precio` en su ejemplo y ejercicio. La lección explícita «Variables y nombres claros» aparece después. Aunque los ejemplos son sencillos, la secuencia hace que el alumno use asignación y nombres de variables antes de que se expliquen.

Hay además una brecha interna: `b2-l4` declara como objetivo practicar `int()`, `float()` y `str()`, pero ejemplo, ejercicio y pregunta se concentran en convertir texto a entero. No se ve una práctica equivalente de `float()` y `str()` en esa misma lección.

**Corrección propuesta:** mantener el orden de secciones 2.3.1 y 2.4, pero incorporar en `b2-l4` una explicación breve y visible de que una variable es un nombre que guarda un valor, con un ejemplo mínimo. La lección 2.4 debe seguir siendo la explicación formal y completa. Completar la práctica de conversiones con casos sencillos de `float()` y `str()`, o ajustar los objetivos para no prometer contenido que no se practica.

**Regresión requerida:** una persona que terminó 2.3 puede resolver el ejercicio de 2.3.1 con las pistas de esa lección; la lección 2.4 sigue profundizando nombres, asignación y actualización.

### P1 — La lección de operadores bit a bit promete más de lo que practica

**Ubicación:** módulo 3, `b3-l2`, sección 3.5.

- Los objetivos mencionan operadores lógicos y operaciones bit a bit.
- La explicación enumera `&`, `|`, `^`, `~`, `<<` y `>>`.
- El ejemplo solo muestra `and`, `not`, `&` y `|`.
- El ejercicio únicamente combina una condición de edad y una variable booleana; no pide resolver una operación bit a bit.
- La pregunta compara `and` con `&`, pero no reemplaza una práctica de cálculo.

**Corrección propuesta:** conservar el contenido bit a bit —no eliminarlo por parecer avanzado— y enseñar la diferencia por etapas. Añadir una tabla binaria guiada para `5 & 3`, `5 | 3` y `5 ^ 3`; presentar desplazamientos con un ejemplo pequeño; dejar `~` como ejemplo explicado o reto adicional si el resultado con enteros negativos necesita más contexto. Incluir al menos un ejercicio bit a bit independiente del ejercicio de condiciones lógicas.

**Regresión requerida:** preguntas y ejercicios deben distinguir los resultados de `and` y `&`; incluir pruebas para AND, OR, XOR y desplazamiento, sin mezclar ambos grupos como si fueran equivalentes.

### P2 — La primera unidad ya exige código antes de establecer una ruta clara de primer programa

**Ubicación:** módulo 1, `b1-l1`, `b1-l2`, `b1-l3` y después módulo 2, `b2-l9`.

La primera lección trata algoritmos, entradas, proceso y salidas, pero su ejemplo y ejercicio emplean asignaciones y `print()`. La segunda vuelve a pedir mensajes con `print()`; la tercera pide ejecutar otra instrucción `print()`. El primer tratamiento formal de «Hello, World!» aparece al inicio del módulo 2.

La repetición no es necesariamente mala: practicar una salida sencilla varias veces puede ayudar. El problema es que no se explica claramente si esas primeras llamadas son una demostración anticipada o si se espera que el estudiante ya domine la sintaxis.

**Corrección propuesta:** hacer que 1.1 evalúe principalmente el algoritmo con pasos o pseudocódigo y que, si aparece Python, se entregue el código guiado. En 1.2 explicar el papel del editor, intérprete y consola sin volver a pedir dos mensajes casi idénticos. En 1.3 mostrar la ejecución como una comprobación breve. Reservar 2.1 para enseñar formalmente la sintaxis de `print("Hola, mundo")`.

**Regresión requerida:** al terminar cada unidad, el alumno puede distinguir qué concepto se está evaluando y no necesita una instrucción de Python que aún no se ha explicado.

### P2 — El laboratorio de listas introduce matrices y bucles anidados en una actividad integradora

**Ubicación:** módulo 3, `b3-l9`, laboratorio de tabla de calificaciones.

El ejemplo sí contiene una solución completa con dos bucles anidados y el recorrido explica las filas y columnas. Aun así, es la primera práctica que pide recorrer una lista de listas y contar según una condición. Para un alumno principiante, es un aumento de dificultad respecto a los recorridos de listas de `b3-l6`.

**Corrección propuesta:** antes del ejercicio integrador, añadir dos pasos guiados: imprimir cada fila y luego visitar cada valor de una fila. Después combinar recorrido y condición para contar las notas aprobadas. No hace falta crear otra lección obligatoria ni cambiar el ID existente.

**Regresión requerida:** probar matrices con varias filas, con una sola fila y con filas de longitudes diferentes; verificar el conteo esperado.

## Repeticiones: qué conservar y qué variar

No encontré evidencia para eliminar actividades por ser copias exactas. Sí hay contextos que se concentran:

- `b2-l8` y `b2-l7` trabajan compras, productos, cantidades e importes. Es razonable como práctica y evaluación de entrada/salida; para comprobar transferencia y no solo memoria, conviene que la evaluación use un contexto o datos distintos.
- `b4-l9`, `b4-l8` y `b4-l10` vuelven al inventario. La repetición puede ser útil porque pasa de una función sencilla a un laboratorio y luego a un proyecto con validación. Mantenerla, pero hacer explícito el avance de dificultad y no repetir el mismo procedimiento sin una habilidad nueva.
- La salida con `print()` en el módulo 1 y la lección Hello World del módulo 2 también puede ser refuerzo; debe distinguirse la demostración inicial del aprendizaje formal de sintaxis.

**Decisión:** variar los contextos de las evaluaciones cuando ayude a comprobar comprensión, pero no eliminar ejercicios solo por compartir un tema.

## Orden de corrección recomendado

1. Alinear el código inicial y la solución de `b4-l10` con el caso de entrada no numérica.
2. Añadir una demostración paso a paso de Bubble Sort en `b3-l7`.
3. Corregir el andamiaje de variables y conversiones en `b2-l4`.
4. Completar la práctica de operadores bit a bit en `b3-l2`.
5. Aclarar la primera ruta de código en las lecciones del módulo 1.
6. Añadir ejercicios puente para listas de listas en `b3-l9` y variar contextos en las evaluaciones.

## Límites de esta auditoría

- Esta revisión estudia la estructura y el contenido que existen en el repositorio; no demuestra por sí sola la alineación oficial con cada pregunta, dominio o versión de Cisco NetAcad/Python Essentials 1. Esa comparación debe hacerse con el temario oficial disponible para el equipo y registrarse por objetivo, sin copiar materiales protegidos.
- No se ejecutaron cambios en `src/lib/course.ts`, en las respuestas privadas, en la base de datos ni en el progreso de estudiantes.
- Este documento es una auditoría de contenido; no afirma que las lecciones ya estén corregidas.

## Pruebas de aceptación para la siguiente PR

- Conservar los IDs `b1-l1`…`b5-l4` y no cambiar las claves de progreso existentes.
- Ejecutar `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` y `npm run test:e2e`.
- Verificar los seis casos del proyecto `b4-l10`, incluidos nombre vacío, cantidad cero, cantidad negativa y texto no numérico.
- Verificar Bubble Sort con casos ordenado, inverso, repetidos y de un solo elemento.
- Verificar ejemplos y ejercicios separados de operadores lógicos y bit a bit.
- Confirmar que ninguna respuesta, solución ni salida esperada se incluye en la serialización enviada al navegador.


## Seguimiento verificado — 30 de octubre de 2026

La revisión de este documento fue una fotografía inicial del contenido. Al corte de hoy, los siguientes puntos ya están implementados en `src/lib/course.ts` y protegidos por pruebas en `src/lib/course.test.ts`:

| Hallazgo inicial | Estado comprobado | Evidencia en código/pruebas |
|---|---|---|
| Proyecto `b4-l10` se detenía al recibir una cantidad no numérica | Corregido: el código inicial guía el manejo de `ValueError`; los seis casos cubren entradas válidas, nombre vacío, cero, negativa y texto no numérico | Pruebas del catálogo y verificador de ejercicios |
| Bubble Sort se pedía sin demostrar el algoritmo | Corregido: hay una pasada trabajada y una implementación completa por comparación de vecinos; no usa `sort()` ni `sorted()` | Prueba de Bubble Sort en `course.test.ts` |
| Variables se usaban antes de presentarlas en `b2-l4` | Mejorado: `b2-l4` define una variable explícitamente antes del ejemplo y la lección formal `b2-l2` desarrolla nombres y actualización | Prueba `presenta variables antes de usarlas...` |
| `b2-l4` prometía `int()`, `float()` y `str()` sin practicarlas todas | Corregido: ejemplo y ejercicio aplican las tres conversiones y muestran salida esperada | Prueba de conversiones en `course.test.ts` |
| Los operadores bit a bit no tenían práctica propia suficiente | Corregido: el ejercicio incluye AND, OR, XOR y desplazamientos, separados de la condición lógica | Prueba `separa operadores logicos...` |
| El módulo 1 exigía `print()` antes de enseñarlo formalmente | Aclarado: las primeras llamadas se describen como demostraciones guiadas; la sintaxis formal se enseña en M2, 2.1 | Prueba `presenta variables y print como demostraciones guiadas...` |
| La primera práctica con listas anidadas no tenía pasos puente | Corregido: se guía el recorrido por filas y luego por valores antes de contar | Prueba `guia el recorrido de listas de listas...` |
| El examen global repetía la pregunta sobre el tipo devuelto por `input()` | Variado: la pregunta final ahora verifica el formato de salida de una f-string con dos decimales | Prueba del resultado `Total: 1250.50` |

La verificación automatizada más reciente del repositorio, workflow CI **41114821771**, terminó correctamente: 62 casos de ejecución para 36 actividades, Vitest, TypeScript, ESLint, build de Next, E2E y build de Vinext.

### Pendiente de revisión humana

La corrección de estos hallazgos no equivale a certificar las 33 unidades. Todavía requiere una pasada humana completa para comprobar claridad, dificultad, pertinencia de cada ejemplo, retroalimentación y alineación sección por sección con el temario oficial vigente. No se debe dar el curso por finalizado hasta completar esa revisión y las pruebas autenticadas con cuentas de DEV.
