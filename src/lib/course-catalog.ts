export type CourseCatalogLesson = {
  id: string;
  section: string;
  title: string;
  assessment?: boolean;
  finalProject?: boolean;
  finalAssessment?: boolean;
};

export type CourseCatalogModule = {
  id: string;
  number: string;
  title: string;
  summary: string;
  lessons: CourseCatalogLesson[];
  optional?: boolean;
};

/**
 * Safe metadata for client-side navigation.
 * Never add quiz answers, explanations, examples, exercise solutions, or private grading data here.
 */
export const courseCatalog: CourseCatalogModule[] = [
  {
    "id": "module-1",
    "number": "1",
    "title": "Introducción a Python y a la programación",
    "summary": "Comprende problemas, algoritmos, lenguajes e intérprete; prepara un entorno y ejecuta tus primeros programas.",
    "lessons": [
      {
        "id": "b1-l1",
        "section": "1.1",
        "title": "Resolver problemas mediante algoritmos"
      },
      {
        "id": "b1-l2",
        "section": "1.2",
        "title": "Lenguajes e intérprete de Python"
      },
      {
        "id": "b1-l3",
        "section": "1.3",
        "title": "Preparar el entorno y ejecutar Python"
      },
      {
        "id": "b1-l4",
        "section": "1.4",
        "title": "Evaluación del módulo 1: fundamentos de programación",
        "assessment": true
      }
    ]
  },
  {
    "id": "module-2",
    "number": "2",
    "title": "Tipos de datos, variables, operadores y entrada/salida",
    "summary": "Representa datos, utiliza variables, construye expresiones, convierte valores y trabaja con entrada y salida.",
    "lessons": [
      {
        "id": "b2-l1",
        "section": "2.1",
        "title": "Tipos de datos y literales"
      },
      {
        "id": "b2-l2",
        "section": "2.2",
        "title": "Variables y nombres claros"
      },
      {
        "id": "b2-l3",
        "section": "2.3",
        "title": "Operadores aritméticos"
      },
      {
        "id": "b2-l4",
        "section": "2.4",
        "title": "Prioridad y conversión de expresiones"
      },
      {
        "id": "b2-l5",
        "section": "2.5",
        "title": "Cadenas, comentarios y salida formateada"
      },
      {
        "id": "b2-l6",
        "section": "2.6",
        "title": "Entrada de datos con input()"
      },
      {
        "id": "b2-l8",
        "section": "2.6 práctica",
        "title": "Laboratorio integrador: crear un recibo interactivo"
      },
      {
        "id": "b2-l7",
        "section": "2.7",
        "title": "Evaluación del módulo 2: tipos, operadores y E/S",
        "assessment": true
      }
    ]
  },
  {
    "id": "module-3",
    "number": "3",
    "title": "Valores booleanos, control de flujo, ciclos y listas",
    "summary": "Combina condiciones, toma decisiones, automatiza repeticiones y procesa listas con operadores lógicos, bit a bit y ordenamiento.",
    "lessons": [
      {
        "id": "b3-l1",
        "section": "3.1",
        "title": "Valores booleanos y comparaciones"
      },
      {
        "id": "b3-l3",
        "section": "3.2",
        "title": "Decisiones con if, elif y else"
      },
      {
        "id": "b3-l4",
        "section": "3.3",
        "title": "Repetición condicional con while"
      },
      {
        "id": "b3-l5",
        "section": "3.4",
        "title": "Recorridos con for, range(), break y continue"
      },
      {
        "id": "b3-l2",
        "section": "3.5",
        "title": "Operadores lógicos y operaciones bit a bit"
      },
      {
        "id": "b3-l6",
        "section": "3.6",
        "title": "Listas: crear, consultar y recorrer"
      },
      {
        "id": "b3-l7",
        "section": "3.7",
        "title": "Modificar, ordenar y procesar listas"
      },
      {
        "id": "b3-l9",
        "section": "3.7 práctica",
        "title": "Laboratorio integrador: analizar una tabla de calificaciones"
      },
      {
        "id": "b3-l8",
        "section": "3.8",
        "title": "Evaluación del módulo 3: lógica, ciclos y listas",
        "assessment": true
      }
    ]
  },
  {
    "id": "module-4",
    "number": "4",
    "title": "Funciones, tuplas, diccionarios y excepciones",
    "summary": "Crea funciones reutilizables, organiza registros y colecciones y controla errores para construir programas fiables.",
    "lessons": [
      {
        "id": "b4-l1",
        "section": "4.1",
        "title": "Crear y llamar funciones"
      },
      {
        "id": "b4-l2",
        "section": "4.2",
        "title": "Parámetros y argumentos"
      },
      {
        "id": "b4-l3",
        "section": "4.3",
        "title": "Devolver resultados con return"
      },
      {
        "id": "b4-l4",
        "section": "4.4",
        "title": "Variables locales y alcance"
      },
      {
        "id": "b4-l5",
        "section": "4.5",
        "title": "Tuplas: agrupar valores inmutables"
      },
      {
        "id": "b4-l6",
        "section": "4.6",
        "title": "Diccionarios: claves, valores y registros"
      },
      {
        "id": "b4-l7",
        "section": "4.7",
        "title": "Excepciones y manejo de errores"
      },
      {
        "id": "b4-l9",
        "section": "4.7 práctica",
        "title": "Laboratorio integrador: calcular un inventario con funciones"
      },
      {
        "id": "b4-l8",
        "section": "4.8",
        "title": "Evaluación del módulo 4: funciones y datos estructurados",
        "assessment": true
      },
      {
        "id": "b4-l10",
        "section": "4.9",
        "title": "Proyecto final obligatorio: gestor de inventario",
        "finalProject": true
      },
      {
        "id": "b4-l11",
        "section": "4.10",
        "title": "Examen final de Python: integración de los cuatro módulos",
        "assessment": true,
        "finalAssessment": true
      }]
  },
  {
    "id": "module-5",
    "number": "5",
    "title": "Archivos y persistencia (extensión práctica)",
    "summary": "Ampliación opcional posterior al curso: guarda, recupera y valida datos con archivos de texto.",
    "lessons": [
      {
        "id": "b5-l1",
        "section": "5.1",
        "title": "Leer y escribir archivos de texto"
      },
      {
        "id": "b5-l2",
        "section": "5.2",
        "title": "Validar y recuperar archivos con errores controlados"
      },
      {
        "id": "b5-l3",
        "section": "5.3",
        "title": "Diseñar, probar y mejorar un programa"
      },
      {
        "id": "b5-l4",
        "section": "5.4",
        "title": "Proyecto final: gestor de inventario en consola"
      }
    ],
    "optional": true
  }
];
