# Auditoría y plan académico — Python Essentials 1

Este documento describe el estado real del catálogo de aprendizaje y las condiciones que deben cumplirse antes de presentar el curso como una formación completa.

## Referencia curricular

La ruta principal sigue la estructura de Cisco Networking Academy — Python Essentials 1 (PE1):

1. Introducción a Python y la programación.
2. Tipos de datos, variables, operadores y operaciones básicas de entrada/salida.
3. Valores booleanos, ejecución condicional, ciclos, listas, procesamiento de listas y operaciones lógicas/bit a bit.
4. Funciones, tuplas, diccionarios, excepciones y procesamiento de datos.

PE1 no debe mezclarse con contenidos propios de Python Essentials 2. La alineación curricular no significa que esta plataforma sea Cisco ni que otorgue una certificación Cisco/PCEP.

## Referencia oficial de alcance PE1

La página oficial de Cisco Networking Academy consultada el 30-10-2026 describe cuatro módulos, 30 laboratorios prácticos, un proyecto final y una prueba final. El curso está diseñado para principiantes y estima unas 30 horas. La secuencia de módulos y secciones también está publicada allí.

- Curso oficial y secciones: https://www.netacad.com/ja/courses/python-essentials-1?courseLang=en-US
- Catálogo Cisco 2024 en español: https://www.netacad.com/sites/default/files/course-catalog-es.pdf

La rama de finalización incorpora una evaluación formal de M1, el proyecto final como requisito y un examen global de 12 preguntas. El código contiene 32 unidades principales (incluye evaluaciones, proyecto y examen) y cuatro unidades de extensión opcional. La migración que actualiza las claves privadas sigue pendiente de validación y aplicación en Supabase; no desplegar el nuevo catálogo hasta completar ese paso.

El módulo 3 ahora sigue la secuencia oficial de prerequisitos: decisiones → ciclos → lógica/bit a bit → listas → ordenamiento → operaciones y aplicaciones avanzadas con listas → evaluación. La práctica con listas anidadas aparece después de dominar listas simples.

El módulo 2 contiene literales, operadores, variables, comentarios, salida e interacción, pero aún requiere una pasada de alineación para incluir explícitamente “Hello, World!” como sección 2.1 y verificar que el orden y la numeración coincidan con la estructura oficial. Los laboratorios integradores de los módulos 2 y 4 se colocaron antes de sus evaluaciones; los módulos 2, 3 y 4 ahora terminan con su evaluación formal.

## Estado real del catálogo en la rama principal de trabajo

| Área | Estado en el código |
|---|---|
| Módulos principales PE1 | 4 |
| Lecciones/unidades principales | 32 (4 + 8 + 9 + 11; incluye evaluaciones, proyecto y examen) |
| Evaluaciones de módulo | 4; M1, M2, M3 y M4 |
| Laboratorios integradores | 3, ubicados al cierre de los módulos 2, 3 y 4 |
| Preguntas registradas | 66 esperadas tras la migración 024; remoto aún tiene 44 |
| Extensión adicional | 4 unidades opcionales en module-5 |
| Proyecto aplicado | Proyecto obligatorio b4-l10; cinco pruebas automáticas |
| Evaluación final global | b4-l11 implementado en código; 12 preguntas |

El módulo 5 está marcado explícitamente como opcional. Ahora se concentra en persistencia con archivos de texto; no sustituye el proyecto obligatorio ni el examen final.

### Medición inicial de calidad didáctica

- Las 30 unidades principales tienen una práctica ejecutable.
- En la auditoría inicial, 29 de las 30 prácticas tenían un solo caso automático; la práctica b3-l6 se amplió a tres entradas (varios valores, un solo valor y valores negativos).
- El catálogo principal contiene 39 preguntas conceptuales: la mayoría de las lecciones regulares solo tiene una pregunta.
- Las evaluaciones de módulo tienen 6, 5, 3 y 3 preguntas. El examen global suma 12 preguntas; el proyecto final incluye cinco casos automáticos.
- Esto no alcanza todavía el estándar de calidad definido abajo. Las prácticas restantes necesitan casos límite adecuados a cada objetivo y las evaluaciones requieren más preguntas de lectura, razonamiento y depuración.

En el módulo 3 se corrigió la progresión: comparaciones y decisiones → while → for → operadores lógicos y bit a bit → listas simples → modificación/ordenamiento → aplicación avanzada con listas anidadas → evaluación. La primera lección de listas trabaja listas unidimensionales; las listas anidadas aparecen después de practicar índices y recorridos, antes de la evaluación del módulo.


## Hallazgos que deben corregirse

### 1. Módulo 1: falta el cierre evaluativo

El módulo 1 termina con b1-l4, ahora titulado “Primer contacto con un programa Python”. La unidad es una vista previa breve para comprobar que el intérprete ejecuta un programa; no es una evaluación formal del módulo 1.

**Corrección requerida:**
- Cerrar el módulo 1 con una evaluación de fundamentos: algoritmo, programa, código fuente, intérprete, lenguaje Python, IDE e instalación/ejecución.
- Mantener print() en b1-l4 solo como demostración de ejecución, sin enseñar su sintaxis en profundidad. La explicación formal de salida, cadenas y comentarios está en el módulo 2.
- No declarar PE1 completo hasta que exista la evaluación del módulo 1 y se guarde el resultado correctamente.

### 2. Módulo 2: secuencia y límites de conceptos

Debe cubrir de forma explícita y ordenada: Hello, World!, literales, tipos numéricos y texto, operadores, precedencia, variables, comentarios, print() e input() con conversiones.

**Corrección requerida:**
- Evitar volver a enseñar el primer programa en dos módulos.
- Mantener un único lugar principal para cada concepto y utilizar las unidades posteriores para practicarlo, no para repetir la misma explicación.
- Distinguir texto (str) de números y explicar por qué input() devuelve texto antes de introducir int() y float().

### 3. Módulo 3: temas difíciles con andamiaje

Los operadores bit a bit y el algoritmo bubble sort pertenecen al temario PE1; no deben eliminarse por parecer avanzados. Sí deben aparecer después de dominar comparaciones, booleanos, condiciones, ciclos y listas.

**Corrección requerida:**
- Introducir primero comparaciones y valores booleanos.
- Enseñar if, elif y else antes de exigir programas con decisiones.
- Practicar while, luego for y range(), antes de combinar ciclos.
- Presentar and, or y not antes de &, | y ^.
- Construir listas, índices y recorridos antes de modificar, ordenar y procesar listas.
- Explicar bubble sort con una lista pequeña, una tabla de cada pasada y el motivo de cada intercambio.

### 4. Módulo 4: funciones y estructuras de datos

La progresión debe ser: definir/llamar funciones, parámetros/argumentos, return, alcance, varios parámetros, tuplas, diccionarios y excepciones. Los ejercicios integradores deben exigir que el estudiante combine esos elementos sin introducir librerías o técnicas que aún no se hayan enseñado.

### 5. Extensión opcional

El módulo 5 contiene archivos, validación y un proyecto de inventario. Debe permanecer claramente rotulado como extensión opcional posterior a PE1. La lectura/escritura de archivos no debe aparecer como conocimiento obligatorio para aprobar PE1.

## Estándar didáctico obligatorio por lección

Antes de publicar o considerar terminada una lección, debe cumplir lo siguiente:

1. **Objetivo observable:** qué podrá hacer el estudiante al terminar.
2. **Prerequisitos:** qué debe conocer y dónde se enseñó.
3. **Explicación propia:** concepto, para qué sirve, cuándo usarlo y errores habituales.
4. **Ejemplo resuelto:** código breve, resultado esperado y explicación línea por línea.
5. **Práctica guiada:** una tarea con pasos y pistas graduadas.
6. **Reto independiente:** problema distinto que obligue a aplicar el concepto.
7. **Pruebas automáticas:** al menos tres casos útiles cuando el ejercicio lo permita, incluyendo un caso límite o de entrada inválida.
8. **Retroalimentación:** explicar por qué la solución funciona o falla; no limitarse a “correcto/incorrecto”.
9. **Evaluación conceptual:** preguntas que midan comprensión y lectura de código, no solo memoria de definiciones.
10. **Progresión:** ninguna lección debe exigir una función, estructura o concepto que todavía no se haya presentado.

## Evaluaciones y finalización

- Cada módulo debe terminar con una evaluación propia y un umbral visible de aprobación.
- El estudiante debe poder revisar la explicación de sus errores después de entregar.
- La calificación y el progreso solo se muestran como guardados después de una confirmación real del servidor.
- La ruta PE1 necesita una evaluación final global independiente de las evaluaciones de módulo.
- El proyecto final debe ser obligatorio para la finalización completa y evaluar análisis, diseño, implementación, pruebas y depuración.
- Una calificación no debe otorgarse por ejecutar cualquier código ni por pulsar “completar”; debe corresponder a evidencias de aprendizaje.

### Diseño propuesto del proyecto final obligatorio

**Proyecto: gestor de inventario de una tienda pequeña, ejecutado en memoria.** Se mantiene dentro de PE1: no requiere archivos, bases de datos, clases, paquetes externos ni conceptos de Python Essentials 2.

Requisitos mínimos:
- Mantener productos en una lista de diccionarios.
- Mostrar un menú que se repita hasta elegir salir.
- Agregar productos con nombre, precio y cantidad.
- Buscar y actualizar productos; eliminar un producto cuando corresponda.
- Calcular el valor total del inventario.
- Separar responsabilidades en funciones con parámetros y valores de retorno.
- Validar entradas, evitar precios o existencias negativas y manejar conversiones incorrectas con excepciones.
- Probar los flujos principales y explicar al menos dos errores encontrados y corregidos.

Rúbrica de 100 puntos:
- Funcionalidad y requisitos: 30.
- Uso correcto de listas y diccionarios: 20.
- Diseño de funciones y alcance: 15.
- Validación y manejo de excepciones: 15.
- Pruebas y depuración: 10.
- Claridad, nombres y formato del código: 10.

Umbral recomendado: 75/100, con retroalimentación por criterio. El estudiante debe poder volver a entregar después de corregir.

### Diseño propuesto del examen final PE1

- 25 preguntas, con al menos cinco preguntas de integración entre módulos.
- Combinar predicción de salida, lectura de código, detección de errores, selección de estructuras y razonamiento sobre casos límite.
- Cubrir los cuatro módulos; no incluir archivos, POO, paquetes externos ni temas no enseñados.
- Umbral recomendado: 75%.
- Mostrar explicación por respuesta y un resumen por competencia, no solo una nota total.


## Puerta de calidad antes de publicar

No marcar el curso como terminado hasta verificar:

- [ ] Cuatro módulos PE1 y sus contenidos en el orden correcto.
- [ ] Evaluación formal en cada uno de los cuatro módulos.
- [ ] Treinta prácticas diferenciadas, sin copiar el mismo enunciado cambiando solo nombres o números.
- [ ] Un proyecto final PE1 y una evaluación global.
- [ ] Las lecciones avanzadas tienen prerequisitos y ejemplos progresivos.
- [ ] No hay claves de respuestas desincronizadas con las preguntas visibles.
- [ ] Las pruebas de cada ejercicio se ejecutan en el mismo entorno que usa el estudiante.
- [ ] Las evaluaciones se guardan, recuperan y aíslan por usuario.
- [ ] La extensión opcional no altera el porcentaje ni el certificado de finalización PE1.
- [ ] Revisión pedagógica completa en español antes de traducir el catálogo al inglés.

## Fuentes de referencia

- Cisco Networking Academy, Python Essentials 1: estructura de cuatro módulos, laboratorios, evaluación y proyecto final.
- OpenEDG Python Institute, objetivos de aprendizaje de nivel inicial y alineación con PCEP.

El contenido de esta plataforma debe ser original y didácticamente equivalente en objetivos; no se deben copiar lecciones, evaluaciones, capturas ni soluciones propietarias de Cisco.


## Cambios preparados en la rama de finalización

- b1-l4 se convierte en evaluación formal del módulo 1 con seis preguntas.
- b4-l10 contiene el proyecto obligatorio de inventario y cinco casos de prueba locales.
- b4-l11 contiene el examen global de 12 preguntas y requiere haber completado el proyecto.
- El módulo 5 permanece opcional y pasa a tratar persistencia con archivos.
- La migración 024 agrega/actualiza 23 claves privadas sin borrar filas ni modificar intentos o progreso.
- **Bloqueo antes de producción:** la migración 024 no está aplicada. El remoto todavía contiene 44 claves; el nuevo catálogo espera 66. Probarla primero en una instancia de desarrollo y coordinar su aplicación antes de desplegar el nuevo código.
- **Calidad pendiente:** la ruta principal aún debe completar el repaso de “Hello, World!” y la numeración de M2, y ampliar las prácticas regulares con casos límite y depuración.
