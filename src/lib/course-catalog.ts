export type CourseCatalogLesson = { id: string; section: string; title: string; assessment?: boolean };
export type CourseCatalogModule = { id: string; number: string; title: string; summary: string; lessons: CourseCatalogLesson[] };

export const courseModules: CourseCatalogModule[] = [
  {
    "id": "module-1",
    "number": "1",
    "title": "Introducción a Python y la programación",
    "summary": "Qué es programar, cómo funciona Python y cómo preparar el entorno para empezar.",
    "lessons": [
      {
        "id": "b1-l1",
        "section": "Lección",
        "title": "Qué significa programar"
      },
      {
        "id": "b1-l2",
        "section": "Lección",
        "title": "Conoce Python y el intérprete"
      },
      {
        "id": "b1-l3",
        "section": "Lección",
        "title": "Prepara tu entorno de trabajo"
      },
      {
        "id": "b1-l4",
        "section": "Evaluación",
        "title": "Evaluación del módulo 1",
        "assessment": true
      }
    ]
  },
  {
    "id": "module-2",
    "number": "2",
    "title": "Tipos de datos, variables, operadores y entrada/salida",
    "summary": "Trabaja con valores, guarda información en variables, calcula y recibe datos del usuario.",
    "lessons": [
      {
        "id": "b2-l1",
        "section": "Lección",
        "title": "Tu primer programa: Hello World"
      },
      {
        "id": "b2-l2",
        "section": "Lección",
        "title": "Literales y tipos de datos"
      },
      {
        "id": "b2-l3",
        "section": "Lección",
        "title": "Operadores aritméticos"
      },
      {
        "id": "b2-l4",
        "section": "Lección",
        "title": "Variables y asignación"
      },
      {
        "id": "b2-l5",
        "section": "Lección",
        "title": "Comentarios en Python"
      },
      {
        "id": "b2-l6",
        "section": "Lección",
        "title": "Entrada y salida de datos"
      },
      {
        "id": "b2-l7",
        "section": "Evaluación",
        "title": "Evaluación del módulo 2",
        "assessment": true
      }
    ]
  },
  {
    "id": "module-3",
    "number": "3",
    "title": "Booleanos, decisiones, ciclos y listas",
    "summary": "Compara valores, controla el flujo del programa y procesa colecciones de datos.",
    "lessons": [
      {
        "id": "b3-l1",
        "section": "Lección",
        "title": "Valores booleanos y decisiones"
      },
      {
        "id": "b3-l2",
        "section": "Lección",
        "title": "Repeticiones con while, for y range"
      },
      {
        "id": "b3-l3",
        "section": "Lección",
        "title": "Operadores lógicos y de bits"
      },
      {
        "id": "b3-l4",
        "section": "Lección",
        "title": "Crear y consultar listas"
      },
      {
        "id": "b3-l5",
        "section": "Lección",
        "title": "Ordenar una lista: bubble sort"
      },
      {
        "id": "b3-l6",
        "section": "Lección",
        "title": "Operaciones comunes con listas"
      },
      {
        "id": "b3-l7",
        "section": "Lección",
        "title": "Listas anidadas y procesamiento"
      },
      {
        "id": "b3-l8",
        "section": "Evaluación",
        "title": "Evaluación del módulo 3",
        "assessment": true
      }
    ]
  },
  {
    "id": "module-4",
    "number": "4",
    "title": "Funciones, tuplas, diccionarios y excepciones",
    "summary": "Organiza programas en funciones y usa estructuras de datos y manejo básico de errores.",
    "lessons": [
      {
        "id": "b4-l1",
        "section": "Lección",
        "title": "Crear y llamar funciones"
      },
      {
        "id": "b4-l2",
        "section": "Lección",
        "title": "Parámetros y argumentos"
      },
      {
        "id": "b4-l3",
        "section": "Lección",
        "title": "Devolver resultados con return"
      },
      {
        "id": "b4-l4",
        "section": "Lección",
        "title": "Variables locales y alcance"
      },
      {
        "id": "b4-l5",
        "section": "Lección",
        "title": "Funciones con varios datos"
      },
      {
        "id": "b4-l6",
        "section": "Lección",
        "title": "Tuplas y diccionarios"
      },
      {
        "id": "b4-l7",
        "section": "Lección",
        "title": "Manejo básico de excepciones"
      },
      {
        "id": "b4-l8",
        "section": "Evaluación",
        "title": "Evaluación del módulo 4",
        "assessment": true
      }
    ]
  }
];
