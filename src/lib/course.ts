export type QuizQuestion = { prompt: string; options: string[]; answer: number; explanation: string };
export type CourseExercise = { id: string; title: string; statement: string; starterCode: string; solution: string; tests: Array<{ input: string[]; expected: string }>; hints: string[]; difficulty: 'facil' | 'medio' | 'dificil'; xp: number; length: number };
export type CourseLesson = { id: string; section: string; title: string; objectives: string[]; explanation: string[]; example: string; exercise: CourseExercise; questions: QuizQuestion[]; assessment?: boolean };
export type CourseModule = { id: string; number: string; title: string; summary: string; lessons: CourseLesson[] };

// Catálogo didáctico alineado con la secuencia de Cisco Python Essentials 1.
export const courseModules: CourseModule[] = [
  {
    "id": "module-1",
    "number": "1",
    "title": "Introducción a Python y la programación",
    "summary": "Qué es programar, cómo funciona Python y cómo preparar el entorno para empezar.",
    "lessons": [
      {
        "id": "b1-l1",
        "section": "Lección",
        "title": "Qué significa programar",
        "objectives": [
          "Explicar qué es un programa y reconocer una secuencia de instrucciones."
        ],
        "explanation": [
          "Programar consiste en escribir instrucciones claras para que una computadora realice una tarea. Un algoritmo es una serie ordenada de pasos para resolver un problema. En Python podemos empezar con instrucciones sencillas que se ejecutan de arriba hacia abajo."
        ],
        "example": "print(\"Hola\")\nprint(\"Estoy aprendiendo Python\")",
        "exercise": {
          "id": "b1-e1",
          "title": "Mostrar un saludo",
          "statement": "Escribe dos instrucciones print(): una que muestre Hola y otra que muestre Estoy aprendiendo.",
          "starterCode": "# Escribe tus instrucciones aquí\n",
          "solution": "print(\"Hola\")\nprint(\"Estoy aprendiendo\")",
          "tests": [
            {
              "input": [],
              "expected": "Hola\nEstoy aprendiendo"
            }
          ],
          "hints": [
            "Usa print() una vez por cada línea que quieras mostrar."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué es un programa?",
            "options": [
              "Una secuencia de instrucciones para la computadora",
              "Una pieza física del teclado",
              "Un archivo de imágenes",
              "Una conexión a Internet"
            ],
            "answer": 0,
            "explanation": "Un programa contiene instrucciones que la computadora ejecuta."
          }
        ]
      },
      {
        "id": "b1-l2",
        "section": "Lección",
        "title": "Conoce Python y el intérprete",
        "objectives": [
          "Reconocer Python como lenguaje de programación e identificar la función del intérprete."
        ],
        "explanation": [
          "Python es un lenguaje de programación de propósito general. Es conocido por una sintaxis legible. El intérprete lee y ejecuta las instrucciones del programa. El código que escribimos se suele guardar en archivos con extensión .py."
        ],
        "example": "print(\"Python ejecuta instrucciones\")",
        "exercise": {
          "id": "b1-e2",
          "title": "Mostrar una frase",
          "statement": "Escribe una instrucción que muestre Python está listo.",
          "starterCode": "",
          "solution": "print(\"Python está listo\")",
          "tests": [
            {
              "input": [],
              "expected": "Python está listo"
            }
          ],
          "hints": [
            "La función print() muestra texto entre comillas."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Para qué sirve el intérprete de Python?",
            "options": [
              "Para ejecutar instrucciones Python",
              "Para diseñar piezas de computadora",
              "Para crear una conexión Wi-Fi",
              "Para cambiar el tamaño de la pantalla"
            ],
            "answer": 0,
            "explanation": "El intérprete ejecuta el código Python."
          }
        ]
      },
      {
        "id": "b1-l3",
        "section": "Lección",
        "title": "Prepara tu entorno de trabajo",
        "objectives": [
          "Identificar dónde descargar Python y comprobar que está instalado."
        ],
        "explanation": [
          "En una computadora puedes descargar Python desde el sitio oficial python.org. En Windows, durante la instalación conviene activar la opción para agregar Python al PATH. Después puedes comprobar la instalación con python --version o py --version. Este laboratorio usa Python en el navegador, por lo que no necesitas instalarlo para practicar aquí."
        ],
        "example": "python --version\n# En algunos equipos de Windows:\npy --version",
        "exercise": {
          "id": "b1-e3",
          "title": "Comprueba una versión",
          "statement": "Escribe un programa Python que muestre el texto Entorno preparado. Esta práctica comprueba que puedes ejecutar código en el laboratorio.",
          "starterCode": "",
          "solution": "print(\"Entorno preparado\")",
          "tests": [
            {
              "input": [],
              "expected": "Entorno preparado"
            }
          ],
          "hints": [
            "En el laboratorio no escribas el comando de terminal: escribe una instrucción Python con print()."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Cuál es la fuente oficial para descargar Python?",
            "options": [
              "python.org",
              "python-free-downloads.example",
              "Una página de juegos",
              "El editor de texto"
            ],
            "answer": 0,
            "explanation": "Python se distribuye desde python.org."
          }
        ]
      },
      {
        "id": "b1-l4",
        "section": "Evaluación",
        "title": "Evaluación del módulo 1",
        "objectives": [
          "Comprobar los conceptos básicos de programación, Python e intérprete."
        ],
        "explanation": [
          "Esta evaluación repasa qué es un programa, qué hace Python y cómo se ejecuta una instrucción. Lee cada pregunta y selecciona una respuesta."
        ],
        "example": "print(\"Primero\")\nprint(\"Después\")",
        "exercise": {
          "id": "b1-e4",
          "title": "Secuencia de instrucciones",
          "statement": "Haz que el programa muestre primero Inicio y después Fin.",
          "starterCode": "",
          "solution": "print(\"Inicio\")\nprint(\"Fin\")",
          "tests": [
            {
              "input": [],
              "expected": "Inicio\nFin"
            }
          ],
          "hints": [
            "Cada llamada a print() muestra una línea."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué es un algoritmo?",
            "options": [
              "Una secuencia ordenada de pasos para resolver una tarea",
              "Un tipo de monitor",
              "Un error de teclado",
              "Un lenguaje exclusivo para páginas web"
            ],
            "answer": 0,
            "explanation": "Un algoritmo describe pasos ordenados para alcanzar un resultado."
          },
          {
            "prompt": "¿Qué es Python?",
            "options": [
              "Un lenguaje de programación",
              "Un sistema operativo",
              "Una marca de teclado",
              "Un navegador web"
            ],
            "answer": 0,
            "explanation": "Python es un lenguaje de programación."
          },
          {
            "prompt": "¿Qué hace el intérprete?",
            "options": [
              "Ejecuta el código Python",
              "Limpia la memoria del monitor",
              "Crea contraseñas",
              "Convierte el teclado en pantalla"
            ],
            "answer": 0,
            "explanation": "El intérprete ejecuta las instrucciones escritas en Python."
          },
          {
            "prompt": "¿Qué extensión suele tener un archivo Python?",
            "options": [
              ".py",
              ".jpg",
              ".mp3",
              ".html"
            ],
            "answer": 0,
            "explanation": "Los archivos de código Python suelen usar la extensión .py."
          },
          {
            "prompt": "¿Qué muestra print(\"Hola\")?",
            "options": [
              "Hola",
              "print Hola",
              "\"Hola\" con comillas siempre",
              "No muestra nada"
            ],
            "answer": 0,
            "explanation": "print() muestra el contenido indicado."
          }
        ],
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
        "title": "Tu primer programa: Hello World",
        "objectives": [
          "Usar print() para mostrar información."
        ],
        "explanation": [
          "La función print() escribe información en la salida. El texto debe colocarse entre comillas. Los números pueden mostrarse sin comillas. Una instrucción por línea ayuda a leer el programa."
        ],
        "example": "print(\"Hello World\")\nprint(2026)",
        "exercise": {
          "id": "b2-e1",
          "title": "Saludo personalizado",
          "statement": "Muestra en pantalla las frases Hola, mundo y Mi primer programa usando dos llamadas a print().",
          "starterCode": "",
          "solution": "print(\"Hola, mundo\")\nprint(\"Mi primer programa\")",
          "tests": [
            {
              "input": [],
              "expected": "Hola, mundo\nMi primer programa"
            }
          ],
          "hints": [
            "Escribe dos llamadas independientes a print()."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué función muestra información en pantalla?",
            "options": [
              "print()",
              "input()",
              "type()",
              "int()"
            ],
            "answer": 0,
            "explanation": "print() muestra información en la salida."
          }
        ]
      },
      {
        "id": "b2-l2",
        "section": "Lección",
        "title": "Literales y tipos de datos",
        "objectives": [
          "Distinguir enteros, decimales, texto y valores booleanos."
        ],
        "explanation": [
          "Un literal es un valor escrito directamente en el código. 12 es un entero (int), 3.5 es un decimal (float), \"café\" es texto (str) y True o False son valores booleanos (bool). Las comillas convierten el contenido en texto."
        ],
        "example": "print(12)\nprint(3.5)\nprint(\"café\")\nprint(True)",
        "exercise": {
          "id": "b2-e2",
          "title": "Reconoce tipos básicos",
          "statement": "Muestra el número 25, el decimal 2.5, el texto Python y el valor True, cada uno en una línea.",
          "starterCode": "",
          "solution": "print(25)\nprint(2.5)\nprint(\"Python\")\nprint(True)",
          "tests": [
            {
              "input": [],
              "expected": "25\n2.5\nPython\nTrue"
            }
          ],
          "hints": [
            "No pongas comillas alrededor de los números ni de True."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué tipo de dato es \"25\"?",
            "options": [
              "str",
              "int",
              "float",
              "bool"
            ],
            "answer": 0,
            "explanation": "Al estar entre comillas, 25 es una cadena de texto."
          }
        ]
      },
      {
        "id": "b2-l3",
        "section": "Lección",
        "title": "Operadores aritméticos",
        "objectives": [
          "Aplicar suma, resta, multiplicación y división."
        ],
        "explanation": [
          "Los operadores aritméticos permiten calcular: + suma, - resta, * multiplica y / divide. Python respeta el orden matemático de las operaciones: primero paréntesis, después multiplicación y división y, finalmente, suma y resta."
        ],
        "example": "print(8 + 4)\nprint(8 * 4)\nprint((8 + 4) * 2)",
        "exercise": {
          "id": "b2-e3",
          "title": "Calcula un total",
          "statement": "Crea las variables precio = 8 y cantidad = 3, calcula el total y muéstralo.",
          "starterCode": "precio = 8\ncantidad = 3\n",
          "solution": "precio = 8\ncantidad = 3\ntotal = precio * cantidad\nprint(total)",
          "tests": [
            {
              "input": [],
              "expected": "24"
            }
          ],
          "hints": [
            "Multiplica precio por cantidad y muestra el resultado."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Cuánto vale 3 + 2 * 4 en Python?",
            "options": [
              "11",
              "20",
              "14",
              "24"
            ],
            "answer": 0,
            "explanation": "La multiplicación se realiza antes que la suma: 3 + 8 = 11."
          }
        ]
      },
      {
        "id": "b2-l4",
        "section": "Lección",
        "title": "Variables y asignación",
        "objectives": [
          "Crear variables con nombres claros y asignarles valores."
        ],
        "explanation": [
          "Una variable es un nombre asociado a un valor. El signo = asigna el valor de la derecha al nombre de la izquierda; no significa igualdad matemática. Los nombres pueden incluir letras, números y guion bajo, pero no pueden empezar por un número ni ser palabras reservadas."
        ],
        "example": "nombre = \"Ana\"\nedad = 20\nprint(nombre)\nprint(edad)",
        "exercise": {
          "id": "b2-e4",
          "title": "Guarda tus datos",
          "statement": "Crea una variable ciudad con el texto San José y otra anio con el número 2026. Muestra ambas.",
          "starterCode": "",
          "solution": "ciudad = \"San José\"\nanio = 2026\nprint(ciudad)\nprint(anio)",
          "tests": [
            {
              "input": [],
              "expected": "San José\n2026"
            }
          ],
          "hints": [
            "Usa comillas para el texto y no para el número."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué hace el signo = en una asignación?",
            "options": [
              "Asigna un valor a una variable",
              "Compara dos valores",
              "Multiplica dos números",
              "Finaliza el programa"
            ],
            "answer": 0,
            "explanation": "El signo = asigna el valor de la derecha a la variable de la izquierda."
          }
        ]
      },
      {
        "id": "b2-l5",
        "section": "Lección",
        "title": "Comentarios en Python",
        "objectives": [
          "Escribir comentarios para explicar el código."
        ],
        "explanation": [
          "Los comentarios comienzan con #. Python no ejecuta el texto que aparece después de # en esa línea. Los comentarios sirven para explicar una decisión o recordar qué hace un fragmento de código."
        ],
        "example": "# Calcula el precio final\nprecio = 100\nprint(precio)",
        "exercise": {
          "id": "b2-e5",
          "title": "Documenta un cálculo",
          "statement": "Agrega un comentario que diga Calcula el total y muestra el resultado de 4 + 6.",
          "starterCode": "",
          "solution": "# Calcula el total\nprint(4 + 6)",
          "tests": [
            {
              "input": [],
              "expected": "10"
            }
          ],
          "hints": [
            "El comentario comienza con # y la operación va dentro de print()."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué símbolo inicia un comentario de una línea?",
            "options": [
              "#",
              "//",
              "<!--",
              "**"
            ],
            "answer": 0,
            "explanation": "En Python, # inicia un comentario de una línea."
          }
        ]
      },
      {
        "id": "b2-l6",
        "section": "Lección",
        "title": "Entrada y salida de datos",
        "objectives": [
          "Leer información con input() y convertir texto a número cuando haga falta."
        ],
        "explanation": [
          "input() permite recibir texto escrito por el usuario y siempre devuelve una cadena (str). Si necesitas operar con ese dato como número entero, puedes convertirlo con int(); para decimales puedes usar float(). Después puedes mostrar el resultado con print()."
        ],
        "example": "nombre = input(\"¿Cómo te llamas? \")\nprint(\"Hola\", nombre)\nedad = int(input(\"Edad: \"))\nprint(edad + 1)",
        "exercise": {
          "id": "b2-e6",
          "title": "Saluda al usuario",
          "statement": "Lee un nombre con input() y muestra Hola seguido del nombre.",
          "starterCode": "",
          "solution": "nombre = input()\nprint(\"Hola\", nombre)",
          "tests": [
            {
              "input": [
                "Ada"
              ],
              "expected": "Hola Ada"
            }
          ],
          "hints": [
            "input() recoge el dato; print() muestra el saludo."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué tipo de dato devuelve input()?",
            "options": [
              "str",
              "int",
              "float",
              "bool"
            ],
            "answer": 0,
            "explanation": "input() devuelve texto. Para usar un número debes convertirlo."
          }
        ]
      },
      {
        "id": "b2-l7",
        "section": "Evaluación",
        "title": "Evaluación del módulo 2",
        "objectives": [
          "Comprobar el uso de print(), literales, operadores, variables, comentarios e input()."
        ],
        "explanation": [
          "Resuelve las preguntas sobre los elementos básicos del lenguaje. Para aprobar necesitas al menos 75%."
        ],
        "example": "cantidad = 3\nprecio = 5\nprint(cantidad * precio)",
        "exercise": {
          "id": "b2-e7",
          "title": "Calcula una compra",
          "statement": "Lee un precio entero y una cantidad entera, multiplica ambos y muestra el total.",
          "starterCode": "",
          "solution": "precio = int(input())\ncantidad = int(input())\nprint(precio * cantidad)",
          "tests": [
            {
              "input": [
                "5",
                "3"
              ],
              "expected": "15"
            }
          ],
          "hints": [
            "Convierte las dos entradas con int() antes de multiplicar."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué muestra print(2 + 3)?",
            "options": [
              "5",
              "23",
              "2 + 3",
              "6"
            ],
            "answer": 0,
            "explanation": "La suma de 2 y 3 es 5."
          },
          {
            "prompt": "¿Cuál es un literal float?",
            "options": [
              "4.25",
              "4",
              "\"4.25\"",
              "False"
            ],
            "answer": 0,
            "explanation": "Un número con parte decimal es float."
          },
          {
            "prompt": "¿Qué instrucción asigna 7 a x?",
            "options": [
              "x = 7",
              "7 == x",
              "x + 7",
              "int(x)"
            ],
            "answer": 0,
            "explanation": "La asignación coloca el valor a la derecha del signo =."
          },
          {
            "prompt": "¿Qué símbolo inicia un comentario?",
            "options": [
              "#",
              "&",
              "$",
              "@"
            ],
            "answer": 0,
            "explanation": "El símbolo # inicia comentarios."
          },
          {
            "prompt": "¿Qué debes hacer con input() para sumar la entrada como entero?",
            "options": [
              "Convertirla con int()",
              "Convertirla con print()",
              "Usar #",
              "Quitar los paréntesis"
            ],
            "answer": 0,
            "explanation": "input() devuelve str y debe convertirse con int() para sumar como entero."
          }
        ],
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
        "title": "Valores booleanos y decisiones",
        "objectives": [
          "Comparar valores y usar una condición if/else."
        ],
        "explanation": [
          "Una comparación produce True o False. Operadores como ==, !=, > y < comparan valores. La instrucción if ejecuta un bloque cuando la condición es verdadera; else permite indicar qué hacer en caso contrario."
        ],
        "example": "edad = 18\nif edad >= 18:\n    print(\"Mayor de edad\")\nelse:\n    print(\"Menor de edad\")",
        "exercise": {
          "id": "b3-e1",
          "title": "Comprueba una condición",
          "statement": "Define temperatura = 30. Si es mayor que 25 muestra Hace calor; en caso contrario muestra Está fresco.",
          "starterCode": "temperatura = 30\n",
          "solution": "temperatura = 30\nif temperatura > 25:\n    print(\"Hace calor\")\nelse:\n    print(\"Está fresco\")",
          "tests": [
            {
              "input": [],
              "expected": "Hace calor"
            }
          ],
          "hints": [
            "Escribe if y else con dos puntos y usa sangría en sus bloques."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué valor produce la expresión 5 > 3?",
            "options": [
              "True",
              "False",
              "5",
              "3"
            ],
            "answer": 0,
            "explanation": "5 es mayor que 3, por lo que la comparación es True."
          }
        ]
      },
      {
        "id": "b3-l2",
        "section": "Lección",
        "title": "Repeticiones con while, for y range",
        "objectives": [
          "Elegir un bucle while o for para repetir instrucciones."
        ],
        "explanation": [
          "while repite mientras una condición sea verdadera. for recorre elementos de una secuencia. range(n) genera números desde 0 hasta n-1. En un while recuerda actualizar la condición para evitar un ciclo que no termina."
        ],
        "example": "for numero in range(3):\n    print(numero)\n\ncontador = 0\nwhile contador < 2:\n    print(contador)\n    contador = contador + 1",
        "exercise": {
          "id": "b3-e2",
          "title": "Cuenta del 1 al 3",
          "statement": "Usa un bucle for y range() para mostrar 1, 2 y 3, cada número en una línea.",
          "starterCode": "",
          "solution": "for numero in range(1, 4):\n    print(numero)",
          "tests": [
            {
              "input": [],
              "expected": "1\n2\n3"
            }
          ],
          "hints": [
            "range(1, 4) incluye 1, 2 y 3."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Cuántas veces se ejecuta for x in range(4)?",
            "options": [
              "4",
              "3",
              "5",
              "1"
            ],
            "answer": 0,
            "explanation": "range(4) genera 0, 1, 2 y 3: cuatro valores."
          }
        ]
      },
      {
        "id": "b3-l3",
        "section": "Lección",
        "title": "Operadores lógicos y de bits",
        "objectives": [
          "Combinar condiciones con and, or y not; reconocer operaciones bit a bit."
        ],
        "explanation": [
          "and es verdadero cuando las dos condiciones son verdaderas; or cuando al menos una lo es; not invierte un valor booleano. Python también ofrece operadores bit a bit como & y | para trabajar con la representación binaria de enteros. En este curso primero practica la lógica booleana."
        ],
        "example": "tiene_entrada = True\nes_mayor = False\nprint(tiene_entrada and es_mayor)\nprint(tiene_entrada or es_mayor)\nprint(not tiene_entrada)",
        "exercise": {
          "id": "b3-e3",
          "title": "Combina condiciones",
          "statement": "Define edad = 20 y tiene_entrada = True. Muestra si puede entrar cuando tiene al menos 18 años y tiene entrada.",
          "starterCode": "edad = 20\ntiene_entrada = True\n",
          "solution": "edad = 20\ntiene_entrada = True\nprint(edad >= 18 and tiene_entrada)",
          "tests": [
            {
              "input": [],
              "expected": "True"
            }
          ],
          "hints": [
            "Usa and para exigir que las dos condiciones sean verdaderas."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Cuándo es verdadero A and B?",
            "options": [
              "Cuando A y B son verdaderos",
              "Cuando al menos uno es verdadero",
              "Cuando A es falso",
              "Siempre"
            ],
            "answer": 0,
            "explanation": "and necesita que ambas condiciones sean verdaderas."
          }
        ]
      },
      {
        "id": "b3-l4",
        "section": "Lección",
        "title": "Crear y consultar listas",
        "objectives": [
          "Crear una lista, consultar elementos mediante índices y agregar valores."
        ],
        "explanation": [
          "Una lista guarda varios valores en orden. Se escribe entre corchetes. Los índices comienzan en 0, así que frutas[0] devuelve el primer elemento. append() agrega un elemento al final."
        ],
        "example": "frutas = [\"manzana\", \"pera\"]\nprint(frutas[0])\nfrutas.append(\"uva\")\nprint(frutas)",
        "exercise": {
          "id": "b3-e4",
          "title": "Amplía una lista",
          "statement": "Crea una lista colores con rojo y azul, agrega verde con append() y muestra la lista completa.",
          "starterCode": "",
          "solution": "colores = [\"rojo\", \"azul\"]\ncolores.append(\"verde\")\nprint(colores)",
          "tests": [
            {
              "input": [],
              "expected": "['rojo', 'azul', 'verde']"
            }
          ],
          "hints": [
            "Usa corchetes para la lista y append() para añadir el nuevo elemento."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué índice corresponde al primer elemento de una lista?",
            "options": [
              "0",
              "1",
              "-0.5",
              "Depende del tamaño"
            ],
            "answer": 0,
            "explanation": "En Python, los índices de lista comienzan en 0."
          }
        ]
      },
      {
        "id": "b3-l5",
        "section": "Lección",
        "title": "Ordenar una lista: bubble sort",
        "objectives": [
          "Explicar la idea del ordenamiento burbuja comparando elementos vecinos."
        ],
        "explanation": [
          "Bubble sort recorre una lista varias veces. Compara dos elementos vecinos y los intercambia si están en el orden incorrecto. Los valores mayores van desplazándose hacia el final. Es un algoritmo didáctico; para programas reales normalmente se usa sort() o sorted()."
        ],
        "example": "numeros = [4, 2, 3]\nfor i in range(len(numeros)):\n    for j in range(0, len(numeros) - i - 1):\n        if numeros[j] > numeros[j + 1]:\n            numeros[j], numeros[j + 1] = numeros[j + 1], numeros[j]\nprint(numeros)",
        "exercise": {
          "id": "b3-e5",
          "title": "Ordena tres números",
          "statement": "Ordena la lista [3, 1, 2] con el método sort() y muestra el resultado. En esta actividad practicamos el resultado del ordenamiento, no el algoritmo interno.",
          "starterCode": "numeros = [3, 1, 2]\n",
          "solution": "numeros = [3, 1, 2]\nnumeros.sort()\nprint(numeros)",
          "tests": [
            {
              "input": [],
              "expected": "[1, 2, 3]"
            }
          ],
          "hints": [
            "Llama al método sort() sobre la lista."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué hace bubble sort cuando encuentra dos vecinos fuera de orden?",
            "options": [
              "Los intercambia",
              "Borra la lista",
              "Convierte ambos en texto",
              "Detiene Python"
            ],
            "answer": 0,
            "explanation": "El ordenamiento burbuja intercambia los elementos vecinos que están fuera de orden."
          }
        ]
      },
      {
        "id": "b3-l6",
        "section": "Lección",
        "title": "Operaciones comunes con listas",
        "objectives": [
          "Consultar el tamaño, insertar y eliminar elementos de una lista."
        ],
        "explanation": [
          "len(lista) devuelve la cantidad de elementos. insert(indice, valor) inserta en una posición; remove(valor) elimina por valor; pop() elimina y devuelve el último elemento. sort() ordena la lista existente."
        ],
        "example": "numeros = [3, 1, 2]\nprint(len(numeros))\nnumeros.sort()\nprint(numeros)",
        "exercise": {
          "id": "b3-e6",
          "title": "Modifica una lista",
          "statement": "Con la lista tareas = ['leer', 'practicar'], agrega 'repasar' al final y muestra cuántos elementos contiene.",
          "starterCode": "tareas = [\"leer\", \"practicar\"]\n",
          "solution": "tareas = [\"leer\", \"practicar\"]\ntareas.append(\"repasar\")\nprint(len(tareas))",
          "tests": [
            {
              "input": [],
              "expected": "3"
            }
          ],
          "hints": [
            "Agrega un elemento con append() y cuenta con len()."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué devuelve len([10, 20, 30])?",
            "options": [
              "3",
              "2",
              "30",
              "60"
            ],
            "answer": 0,
            "explanation": "La lista contiene tres elementos."
          }
        ]
      },
      {
        "id": "b3-l7",
        "section": "Lección",
        "title": "Listas anidadas y procesamiento",
        "objectives": [
          "Leer elementos de una lista que contiene otras listas."
        ],
        "explanation": [
          "Una lista puede contener otras listas. Esto permite representar filas y columnas. Por ejemplo, matriz[0][1] consulta el segundo valor de la primera fila. Puedes recorrer cada fila con for y después recorrer sus valores."
        ],
        "example": "matriz = [[1, 2], [3, 4]]\nprint(matriz[0][1])\nfor fila in matriz:\n    print(fila)",
        "exercise": {
          "id": "b3-e7",
          "title": "Suma una fila",
          "statement": "Dada matriz = [[2, 3], [4, 5]], muestra el primer elemento de la segunda fila.",
          "starterCode": "matriz = [[2, 3], [4, 5]]\n",
          "solution": "matriz = [[2, 3], [4, 5]]\nprint(matriz[1][0])",
          "tests": [
            {
              "input": [],
              "expected": "4"
            }
          ],
          "hints": [
            "La segunda fila tiene índice 1 y su primer elemento tiene índice 0."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Cómo se accede al primer elemento de la segunda fila de matriz?",
            "options": [
              "matriz[1][0]",
              "matriz[0][1]",
              "matriz[2][1]",
              "matriz[1, 0]"
            ],
            "answer": 0,
            "explanation": "Los índices empiezan en 0: fila 1 y columna 0."
          }
        ]
      },
      {
        "id": "b3-l8",
        "section": "Evaluación",
        "title": "Evaluación del módulo 3",
        "objectives": [
          "Comprobar comparaciones, condiciones, bucles y procesamiento de listas."
        ],
        "explanation": [
          "La evaluación combina decisiones, repeticiones y colecciones. Comprueba cada pregunta antes de enviar."
        ],
        "example": "numeros = [1, 2, 3]\nfor numero in numeros:\n    print(numero * 2)",
        "exercise": {
          "id": "b3-e8",
          "title": "Duplica los valores",
          "statement": "Recorre [1, 2, 3] con for y muestra cada número multiplicado por 2.",
          "starterCode": "",
          "solution": "for numero in [1, 2, 3]:\n    print(numero * 2)",
          "tests": [
            {
              "input": [],
              "expected": "2\n4\n6"
            }
          ],
          "hints": [
            "Usa un bucle for y multiplica cada elemento por 2."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué produce 10 == 10?",
            "options": [
              "True",
              "False",
              "10",
              "Error"
            ],
            "answer": 0,
            "explanation": "Los valores son iguales."
          },
          {
            "prompt": "¿Qué hace else?",
            "options": [
              "Ejecuta el bloque cuando la condición if no se cumple",
              "Repite siempre",
              "Declara una lista",
              "Convierte texto en número"
            ],
            "answer": 0,
            "explanation": "else ofrece el bloque alternativo."
          },
          {
            "prompt": "¿Qué valores produce range(2)?",
            "options": [
              "0 y 1",
              "1 y 2",
              "0, 1 y 2",
              "2 y 3"
            ],
            "answer": 0,
            "explanation": "range(2) genera 0 y 1."
          },
          {
            "prompt": "¿Qué método añade un elemento al final de una lista?",
            "options": [
              "append()",
              "remove()",
              "sort()",
              "len()"
            ],
            "answer": 0,
            "explanation": "append() agrega un elemento al final."
          },
          {
            "prompt": "¿Qué valor consulta matriz[1][0] en [[2, 3], [4, 5]]?",
            "options": [
              "4",
              "2",
              "3",
              "5"
            ],
            "answer": 0,
            "explanation": "El índice [1] selecciona la segunda fila y [0] el primer elemento."
          }
        ],
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
        "title": "Crear y llamar funciones",
        "objectives": [
          "Definir una función con def y ejecutarla usando su nombre y paréntesis."
        ],
        "explanation": [
          "Una función agrupa instrucciones que pueden reutilizarse. Se define con def, un nombre y paréntesis. El bloque de la función debe llevar sangría. Definir la función no la ejecuta: también debes llamarla."
        ],
        "example": "def saludar():\n    print(\"Hola\")\n\nsaludar()",
        "exercise": {
          "id": "b4-e1",
          "title": "Define un saludo",
          "statement": "Define una función llamada bienvenida() que muestre Bienvenido y luego llámala.",
          "starterCode": "",
          "solution": "def bienvenida():\n    print(\"Bienvenido\")\n\nbienvenida()",
          "tests": [
            {
              "input": [],
              "expected": "Bienvenido"
            }
          ],
          "hints": [
            "Usa def para definir la función y escribe bienvenida() para llamarla."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué palabra inicia la definición de una función?",
            "options": [
              "def",
              "if",
              "for",
              "return"
            ],
            "answer": 0,
            "explanation": "def se utiliza para definir una función."
          }
        ]
      },
      {
        "id": "b4-l2",
        "section": "Lección",
        "title": "Parámetros y argumentos",
        "objectives": [
          "Enviar información a una función mediante parámetros."
        ],
        "explanation": [
          "Un parámetro es una variable que aparece en la definición de la función. Un argumento es el valor que se envía cuando se llama. Así puedes reutilizar la misma función con diferentes datos."
        ],
        "example": "def saludar(nombre):\n    print(\"Hola\", nombre)\n\nsaludar(\"Ana\")",
        "exercise": {
          "id": "b4-e2",
          "title": "Saludo con nombre",
          "statement": "Define una función mostrar_nombre(nombre) que muestre el nombre recibido y llámala con Ana.",
          "starterCode": "",
          "solution": "def mostrar_nombre(nombre):\n    print(nombre)\n\nmostrar_nombre(\"Ana\")",
          "tests": [
            {
              "input": [],
              "expected": "Ana"
            }
          ],
          "hints": [
            "Escribe nombre entre los paréntesis de la definición y envía \"Ana\" al llamar."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "En def saludar(nombre), ¿qué es nombre?",
            "options": [
              "Un parámetro",
              "Un argumento ya enviado",
              "Un operador",
              "Una lista"
            ],
            "answer": 0,
            "explanation": "nombre es el parámetro que recibirá el valor al llamar la función."
          }
        ]
      },
      {
        "id": "b4-l3",
        "section": "Lección",
        "title": "Devolver resultados con return",
        "objectives": [
          "Distinguir entre mostrar un valor con print() y devolverlo con return."
        ],
        "explanation": [
          "print() muestra información en la salida. return termina la función y devuelve un resultado para que el programa pueda guardarlo o utilizarlo en otro cálculo."
        ],
        "example": "def sumar(a, b):\n    return a + b\n\nresultado = sumar(3, 4)\nprint(resultado)",
        "exercise": {
          "id": "b4-e3",
          "title": "Crea una función que suma",
          "statement": "Define sumar(a, b) para devolver la suma de dos números. Llama la función con 4 y 5 y muestra el resultado.",
          "starterCode": "",
          "solution": "def sumar(a, b):\n    return a + b\n\nprint(sumar(4, 5))",
          "tests": [
            {
              "input": [],
              "expected": "9"
            }
          ],
          "hints": [
            "La línea return debe devolver a + b."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué hace return?",
            "options": [
              "Devuelve un resultado desde la función",
              "Muestra siempre el texto en pantalla",
              "Crea un bucle",
              "Importa otro archivo"
            ],
            "answer": 0,
            "explanation": "return entrega un valor al código que llamó la función."
          }
        ]
      },
      {
        "id": "b4-l4",
        "section": "Lección",
        "title": "Variables locales y alcance",
        "objectives": [
          "Reconocer que una variable definida dentro de una función es local."
        ],
        "explanation": [
          "El alcance indica en qué parte del programa se puede utilizar un nombre. Una variable creada dentro de una función es local a esa función. Es recomendable pasar datos mediante parámetros y devolver resultados mediante return."
        ],
        "example": "def calcular():\n    total = 10\n    return total\n\nprint(calcular())",
        "exercise": {
          "id": "b4-e4",
          "title": "Devuelve un total",
          "statement": "Define una función total_compra() que cree una variable local total = 12 y devuelva su valor. Muestra el resultado.",
          "starterCode": "",
          "solution": "def total_compra():\n    total = 12\n    return total\n\nprint(total_compra())",
          "tests": [
            {
              "input": [],
              "expected": "12"
            }
          ],
          "hints": [
            "Crea total dentro de la función y devuelve ese valor con return."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Dónde existe una variable local creada dentro de una función?",
            "options": [
              "Dentro de esa función",
              "En todos los archivos siempre",
              "Solo en el teclado",
              "En la base de datos"
            ],
            "answer": 0,
            "explanation": "Una variable local se utiliza dentro de la función donde se define."
          }
        ]
      },
      {
        "id": "b4-l5",
        "section": "Lección",
        "title": "Funciones con varios datos",
        "objectives": [
          "Definir funciones que reciben más de un parámetro."
        ],
        "explanation": [
          "Una función puede recibir varios parámetros separados por comas. Al llamar la función, los argumentos se envían en el mismo orden, salvo que se utilicen argumentos con nombre. Mantén los nombres claros y prueba la función con valores sencillos."
        ],
        "example": "def calcular_total(precio, cantidad):\n    return precio * cantidad\n\nprint(calcular_total(5, 3))",
        "exercise": {
          "id": "b4-e5",
          "title": "Calcula el precio final",
          "statement": "Define calcular_total(precio, cantidad) y devuelve precio * cantidad. Muestra el resultado de calcular_total(7, 2).",
          "starterCode": "",
          "solution": "def calcular_total(precio, cantidad):\n    return precio * cantidad\n\nprint(calcular_total(7, 2))",
          "tests": [
            {
              "input": [],
              "expected": "14"
            }
          ],
          "hints": [
            "La función recibe dos parámetros: precio y cantidad."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Cómo se separan varios parámetros en una definición?",
            "options": [
              "Con comas",
              "Con puntos",
              "Con barras",
              "Con dos puntos entre cada nombre"
            ],
            "answer": 0,
            "explanation": "Los parámetros se separan con comas."
          }
        ]
      },
      {
        "id": "b4-l6",
        "section": "Lección",
        "title": "Tuplas y diccionarios",
        "objectives": [
          "Reconocer tuplas y diccionarios y consultar valores."
        ],
        "explanation": [
          "Una tupla agrupa valores en orden y se escribe normalmente entre paréntesis. Un diccionario guarda pares clave-valor entre llaves. Puedes consultar un valor del diccionario escribiendo su clave entre corchetes."
        ],
        "example": "coordenadas = (10, 20)\npersona = {\"nombre\": \"Ana\", \"edad\": 20}\nprint(coordenadas[0])\nprint(persona[\"nombre\"])",
        "exercise": {
          "id": "b4-e6",
          "title": "Consulta un diccionario",
          "statement": "Crea un diccionario producto con las claves nombre y precio. Usa Pan y 500 como valores y muestra el precio.",
          "starterCode": "",
          "solution": "producto = {\"nombre\": \"Pan\", \"precio\": 500}\nprint(producto[\"precio\"])",
          "tests": [
            {
              "input": [],
              "expected": "500"
            }
          ],
          "hints": [
            "Usa llaves y accede al valor por medio de la clave \"precio\"."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué estructura almacena pares clave-valor?",
            "options": [
              "Diccionario",
              "Tupla",
              "Cadena",
              "Número entero"
            ],
            "answer": 0,
            "explanation": "Los diccionarios almacenan información como pares clave-valor."
          }
        ]
      },
      {
        "id": "b4-l7",
        "section": "Lección",
        "title": "Manejo básico de excepciones",
        "objectives": [
          "Identificar un error de ejecución y manejarlo con try/except."
        ],
        "explanation": [
          "Una excepción es un error detectado mientras el programa se ejecuta. try contiene las instrucciones que pueden fallar y except define qué hacer si ocurre una excepción concreta. Por ejemplo, int(\"hola\") produce ValueError."
        ],
        "example": "try:\n    numero = int(input())\n    print(numero)\nexcept ValueError:\n    print(\"Escribe un número válido\")",
        "exercise": {
          "id": "b4-e7",
          "title": "Valida un número",
          "statement": "Intenta convertir el texto hola a entero. Si ocurre ValueError muestra Entrada inválida.",
          "starterCode": "",
          "solution": "try:\n    numero = int(\"hola\")\n    print(numero)\nexcept ValueError:\n    print(\"Entrada inválida\")",
          "tests": [
            {
              "input": [],
              "expected": "Entrada inválida"
            }
          ],
          "hints": [
            "Coloca int(\"hola\") dentro de try y maneja ValueError en except."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué bloque se ejecuta cuando ocurre la excepción indicada?",
            "options": [
              "except",
              "try siempre después",
              "def",
              "return"
            ],
            "answer": 0,
            "explanation": "except permite manejar una excepción."
          }
        ]
      },
      {
        "id": "b4-l8",
        "section": "Evaluación",
        "title": "Evaluación del módulo 4",
        "objectives": [
          "Comprobar funciones, parámetros, return, tuplas, diccionarios y excepciones."
        ],
        "explanation": [
          "Esta evaluación cierra el recorrido básico de Python Essentials 1. Revisa las ideas clave y responde todas las preguntas."
        ],
        "example": "def doble(numero):\n    return numero * 2\n\nprint(doble(5))",
        "exercise": {
          "id": "b4-e8",
          "title": "Función final",
          "statement": "Define una función bienvenida(nombre) que devuelva el texto Hola seguido del nombre. Muestra el resultado para Ada.",
          "starterCode": "",
          "solution": "def bienvenida(nombre):\n    return \"Hola \" + nombre\n\nprint(bienvenida(\"Ada\"))",
          "tests": [
            {
              "input": [],
              "expected": "Hola Ada"
            }
          ],
          "hints": [
            "Devuelve una cadena formada por \"Hola \" y el parámetro nombre."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 1
        },
        "questions": [
          {
            "prompt": "¿Qué palabra se usa para definir una función?",
            "options": [
              "def",
              "while",
              "except",
              "class"
            ],
            "answer": 0,
            "explanation": "def define funciones."
          },
          {
            "prompt": "¿Qué diferencia a return de print()?",
            "options": [
              "return devuelve un valor; print() lo muestra",
              "Son exactamente iguales",
              "print() crea una función",
              "return solo funciona en listas"
            ],
            "answer": 0,
            "explanation": "return devuelve un dato; print() lo escribe en la salida."
          },
          {
            "prompt": "¿Qué estructura se escribe normalmente entre paréntesis y no se modifica?",
            "options": [
              "Tupla",
              "Lista",
              "Diccionario",
              "Variable"
            ],
            "answer": 0,
            "explanation": "Una tupla es una colección ordenada que normalmente no se modifica."
          },
          {
            "prompt": "¿Cómo se obtiene el valor asociado a la clave nombre?",
            "options": [
              "persona[\"nombre\"]",
              "persona.nombre()",
              "persona(nombre)",
              "persona->nombre"
            ],
            "answer": 0,
            "explanation": "Los diccionarios se consultan usando la clave entre corchetes."
          },
          {
            "prompt": "¿Qué excepción suele producir int(\"hola\")?",
            "options": [
              "ValueError",
              "IndexError",
              "KeyError",
              "NameError"
            ],
            "answer": 0,
            "explanation": "ValueError aparece cuando el texto no representa un entero válido."
          }
        ],
        "assessment": true
      }
    ]
  }
];

export function findCourseModule(moduleId: string): CourseModule | undefined {
  return courseModules.find((courseModule) => courseModule.id === moduleId);
}

export function findCourseLesson(moduleId: string, lessonId: string): CourseLesson | undefined {
  return findCourseModule(moduleId)?.lessons.find((lesson) => lesson.id === lessonId);
}

export function gradeQuiz(questions: QuizQuestion[], answers: number[]): { score: number; passed: boolean; correct: number; total: number } {
  const correct = questions.reduce((sum, question, index) => sum + Number(answers[index] === question.answer), 0);
  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  return { score, passed: total > 0 && score >= 75, correct, total };
}
