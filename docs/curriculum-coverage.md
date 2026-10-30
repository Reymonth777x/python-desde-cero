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

La rama de finalización incorpora una evaluación formal de M1, el proyecto final como requisito y un examen global de 12 preguntas. El código contiene 33 unidades principales (incluye evaluaciones, proyecto y examen) y cuatro unidades de extensión opcional. Las migraciones 024 y 025 ya se probaron en Supabase DEV: 67 claves, todas con respuesta v2. Producción todavía requiere la aplicación coordinada de ambas migraciones antes de desplegar el catálogo.

El módulo 3 ahora sigue la secuencia oficial de prerequisitos: decisiones → ciclos → lógica/bit a bit → listas → ordenamiento → operaciones y aplicaciones avanzadas con listas → evaluación. La práctica con listas anidadas aparece después de dominar listas simples.

El módulo 2 ahora sigue la secuencia: 2.1 primer programa “Hello, World!”, 2.2 literales y tipos, 2.3 operadores, 2.3.1 prioridad y conversiones, 2.4 variables, 2.5 cadenas, comentarios y salida formateada, 2.6 entrada del usuario, laboratorio integrador y 2.7 evaluación. Los laboratorios integradores de los módulos 2 y 4 se colocaron antes de sus evaluaciones; los módulos 2, 3 y 4 ahora terminan con su evaluación formal.

## Estado real del catálogo en la rama principal de trabajo

| Área | Estado en el código |
|---|---|
| Módulos principales PE1 | 4 |
| Lecciones/unidades principales | 33 (4 + 9 + 9 + 11; incluye evaluaciones, proyecto y examen) |
| Evaluaciones de módulo | 4; M1, M2, M3 y M4 |
| Laboratorios integradores | 3, ubicados al cierre de los módulos 2, 3 y 4 |
| Preguntas registradas | 67 esperadas en el catálogo; DEV verificado con 67 claves v2. Producción tiene 44 claves v2 del catálogo anterior |
| Extensión adicional | 4 unidades opcionales en module-5 |
| Proyecto aplicado | Proyecto obligatorio b4-l10; cinco pruebas automáticas |
| Evaluación final global | b4-l11 implementado en código; 12 preguntas |

El módulo 5 está marcado explícitamente como opcional. Ahora se concentra en persistencia con archivos de texto; no sustituye el proyecto obligatorio ni el examen final.

### Medición inicial de calidad didáctica

- El núcleo ahora contiene 33 unidades: 27 lecciones/laboratorios, cuatro evaluaciones de módulo, un proyecto final obligatorio y un examen global. El proyecto suma cinco casos de prueba; no se debe confundir el total de unidades con el objetivo de 30 laboratorios oficiales.
- En la auditoría inicial, 29 de las 30 prácticas tenían un solo caso automático; la práctica b3-l6 se amplió a tres entradas (varios valores, un solo valor y valores negativos).
- El catálogo principal contiene 40 preguntas conceptuales: la mayoría de las lecciones regulares solo tiene una pregunta.
- Las evaluaciones de módulo tienen 6, 5, 3 y 3 preguntas. El examen global suma 12 preguntas; el proyecto final incluye cinco casos automáticos.
- Esto no alcanza todavía el estándar de calidad definido abajo. Las prácticas restantes necesitan casos límite adecuados a cada objetivo y las evaluaciones requieren más preguntas de lectura, razonamiento y depuración.

En el módulo 3 se corrigió la progresión: comparaciones y decisiones → while → for → operadores lógicos y bit a bit → listas simples → modificación/ordenamiento → aplicación avanzada con listas anidadas → evaluación. La primera lección de listas trabaja listas unidimensionales; las listas anidadas aparecen después de practicar índices y recorridos, antes de la evaluación del módulo.


## Hallazgos que deben corregirse

### 1. Módulo 1: evaluación formal incorporada en la rama

b1-l4 ahora es “Evaluación del módulo 1: fundamentos de programación”, con seis preguntas sobre algoritmo, código fuente, intérprete, IDE, errores de sintaxis y Python como lenguaje.

**Estado de integración:** la migración 024 (evaluación M1, proyecto y examen final) y la 025 (pregunta Hello, World!) ya se aplicaron y verificaron en DEV. No desplegar a producción hasta que ambas migraciones se apliquen allí de forma coordinada con el código.

### 2. Módulo 2: secuencia y límites de conceptos

Debe cubrir de forma explícita y ordenada: Hello, World!, literales, tipos numéricos y texto, operadores, precedencia, variables, comentarios, print() e input() con conversiones.

**Corrección incorporada en la rama:**
- Añadir Hello, World! como primera unidad de M2, con explicación, ejemplo, práctica y una pregunta conceptual propia.
- Colocar tipos y literales antes de operadores; operadores y precedencia antes de variables; y conversiones/entrada antes del laboratorio.
- Mantener una explicación principal por concepto y usar laboratorios para combinarlo, no para repetir la misma lección.
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

### Proyecto final obligatorio implementado en la rama

b4-l10 requiere construir un gestor de inventario de consola con diccionarios, funciones, validación de nombres y cantidades, y manejo de ValueError. Incluye cinco casos automáticos: dos productos válidos, nombre vacío, cantidad cero y cantidad no numérica. El estudiante debe ejecutar las pruebas locales y aprobar cinco preguntas conceptuales con al menos 75%.

**Limitación deliberada:** la comparación de salidas se ejecuta en el navegador mediante el Worker de Python; no constituye una certificación ni una atestación inviolable del código ejecutado. La nota de las preguntas sí se calcula en el servidor a partir de claves privadas. Las migraciones 024 y 025 están aplicadas en DEV; en producción siguen pendientes.

### Examen final PE1 implementado en la rama

- b4-l11 contiene 12 preguntas sobre los cuatro módulos.
- Combina tipos, operadores, entrada/salida, condiciones, ciclos, listas, bubble sort, funciones y excepciones.
- No introduce archivos, POO ni paquetes externos como requisito de PE1.
- Umbral de aprobación: 75%.
- Las claves privadas del examen se añaden mediante la migración 024 y se verificaron en DEV; producción sigue pendiente.


## Puerta de calidad antes de publicar

No marcar el curso como terminado hasta verificar:

- [x] Cuatro módulos PE1 y sus contenidos en el orden revisado; M2 incorpora Hello, World! en 2.1 y respeta la progresión de prerequisitos.
- [x] Evaluación formal incluida en el código para los cuatro módulos (M1–M4); claves 024 verificadas en DEV.
- [ ] Treinta prácticas diferenciadas, sin copiar el mismo enunciado cambiando solo nombres o números.
- [x] Proyecto obligatorio y examen global incluidos en el código; claves 024 verificadas en DEV.
- [ ] Las lecciones avanzadas tienen prerequisitos y ejemplos progresivos.
- [x] No hay claves desincronizadas en DEV: 67 claves v2 para 67 preguntas del catálogo.
- [ ] Completar la matriz de pruebas de los ejercicios regulares con casos límite; el proyecto final ejecuta cinco casos en el Worker del estudiante.
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
- b2-l9 introduce “Hello, World!” como sección 2.1 de M2, antes de tipos y literales.
- El módulo 5 permanece opcional y pasa a tratar persistencia con archivos.
- La migración 024 agrega/actualiza 24 claves privadas sin borrar filas ni modificar intentos o progreso.
- La migración 025 agrega la clave privada de la nueva pregunta b2-l9 sin tocar intentos ni progreso.
- **Bloqueo antes de producción:** 024 y 025 se aplicaron en DEV y dejaron 67 claves v2. Producción todavía tiene 44 claves v2 del catálogo anterior; ambas migraciones deben aplicarse allí de forma coordinada antes de desplegar.
- **Calidad pendiente:** ampliar las prácticas regulares con casos límite, depuración y retroalimentación más específica.

## Integración y estado real de la rama

La evaluación de M1, el proyecto, el examen global y la lección Hello, World! están escritos en el catálogo de la rama. La migración 024 añade/actualiza claves para las nuevas evaluaciones y el proyecto; la migración 025 añade la clave de b2-l9. DEV quedó con 67 claves, todas con correct_option_v2 no nulo. Producción aún tiene 44 claves v2 del catálogo anterior y no se modificó.

No fusionar ni desplegar el cambio de catálogo hasta:
1. Confirmar que el CI completo pasa después de los cambios de M2 y que sus credenciales de prueba apuntan solo a DEV.
2. Obtener autorización del responsable para aplicar 024 y 025 en producción y hacerlo de forma coordinada con el código.
3. Verificar las 67 claves v2 y los permisos del RPC en producción después de la migración.
4. Realizar una prueba real de guardar una evaluación con una cuenta de prueba autenticada; en DEV todavía no hay usuarios de prueba, por lo que la escritura end-to-end aún no se ha confirmado.

La secuencia M2 ya incluye Hello, World! y está ordenada. La calidad pedagógica global aún requiere ampliar casos límite y retroalimentación de prácticas regulares. El curso no debe anunciarse como equivalente a Cisco PE1 ni como preparación suficiente para PCEP.
