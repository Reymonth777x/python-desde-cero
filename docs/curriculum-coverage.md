# Matriz de trazabilidad — Currículo Python desde cero

Este documento compara los temas del programa Python PE1 con las lecciones, ejemplos, ejercicios y evaluaciones implementadas en el código fuente. Cada fila indica si el tema está cubierto y en qué lección.

## Ámbito del curso implementado

- **Módulos**: 4 (module-1 a module-4)
- **Lecciones totales**: 27
- **Evaluaciones (module assessments)**: 4 (una al final de cada módulo)
- **Lección de capacitación final**: incluida en el módulo 4 (lesson-8)

## Matriz de cobertura por tema

| Tema PE1 | Estado | Lección(es) | Observaciones |
|----------|--------|-------------|---------------|
| Algoritmos y pasos de solución | Cubierto | module-1 / lesson-1 | Introducción a la programación |
| Intérprete de Python vs código fuente | Cubierto | module-1 / lesson-2 | Introducción a Python |
| Ejecución de Python local vs navegador | Cubierto | module-1 / lesson-3 | Instalación y ejecución |
| Evaluación del módulo 1 | Cubierto | module-1 / lesson-4 | 4 preguntas, umbral 75% |
| Literales y tipos de datos | Cubierto | module-2 / lesson-2 | int, float, str, bool |
| print() y salida de información | Cubierto | module-2 / lesson-1 | Hello, World! |
| Operadores aritméticos y precedencia | Cubierto | module-2 / lesson-3 | +, -, *, /, //, %, ** |
| Variables y asignación | Cubierto | module-2 / lesson-4 | `=`, nombres válidos |
| Comentarios y legibilidad | Cubierto | module-2 / lesson-5 | `#` comentario |
| input() y entrada de datos | Cubierto | module-2 / lesson-6 | Lectura de texto y conversión |
| Evaluación del módulo 2 | Cubierto | module-2 / lesson-7 | 4 preguntas, umbral 75% |
| if, elif, else | Cubierto | module-3 / lesson-1 | Estructuras de decisión |
| while y for | Cubierto | module-3 / lesson-2 | Bucles con condición y secuencia |
| range() | Cubierto | module-3 / lesson-2 | `range(1, 4)` |
| Lógica booleana (and, or, not) | Cubierto | module-3 / lesson-3 | Operadores lógicos |
| Listas | Cubierto | module-3 / lesson-4 | Creación, indexación, recorrido |
| Ordenamiento burbuja | Cubierto | module-3 / lesson-5 | Algoritmo educativo |
| Operaciones con listas | Cubierto | module-3 / lesson-6 | Agregar, eliminar, buscar |
| Evaluación del módulo 3 | Cubierto | module-3 / lesson-7 | 4 preguntas, umbral 75% |
| Definición de funciones | Cubierto | module-4 / lesson-1 | `def` |
| Parámetros y argumentos | Cubierto | module-4 / lesson-2 | Posicionales y con nombre |
| return y devolución de resultados | Cubierto | module-4 / lesson-3 | `return` vs `print` |
| Alcance de variables | Cubierto | module-4 / lesson-4 | Local vs global |
| Funciones con varios parámetros | Cubierto | module-4 / lesson-5 | Parámetros predeterminados |
| Tuplas y diccionarios | Cubierto | module-4 / lesson-6 | Colecciones |
| Manejo de excepciones | Cubierto | module-4 / lesson-7 | `try` / `except` |
| Evaluación del módulo 4 | Cubierto | module-4 / lesson-8 | 4 preguntas, umbral 75% |

## Temas del PE1 no cubiertos en esta versión

Los siguientes temas del programa Cisco PE1 no tienen una lección dedicada en la implementación actual:

| Tema | Estado | Nota |
|------|--------|------|
| Cadenas de texto (manipulación de strings) | No cubierto | No hay lección dedicada a métodos de cadena, formateo o índices de strings |
| Archivos (lectura y escritura de archivos) | No cubierto | No hay lección sobre `open()`, lectura/escritura de archivos |
| Módulos y paquetes (import) | No cubierto | No hay lección sobre importar módulos estándar |

## Notas sobre el contenido

- Todo el contenido del curso es de elaboración propia e independiente.
- El curso no está afiliado ni acreditado por Cisco Networking Academy.
- Cada lección incluye: objetivos, explicación, ejemplo ejecutable, ejercicio práctico y preguntas de evaluación con retroalimentación.
- Las evaluaciones de módulo requieren al menos 75% de respuestas correctas para completarse.
- El progreso se guarda por usuario autenticado con restricción `UNIQUE(user_id, module_id, lesson_id)` para evitar duplicados.

## Próximos pasos sugeridos (P2/P3)

1. Agregar lección dedicada a cadenas de texto (métodos comunes, formateo, índices).
2. Agregar lección dedicada a archivos (lectura y escritura con `open()`).
3. Agregar lección dedicada a módulos y paquetes (`import`, biblioteca estándar).
4. Considerar una lección de proyecto integrador/capstone al final del curso.
