import 'server-only';
import type { CourseLesson, CourseModule, QuizQuestion } from './course-types';
export type { CourseExercise, CourseLesson, CourseModule, QuizQuestion } from './course-types';

export const courseModules: CourseModule[] = [
  {
    "id": "module-1",
    "number": "1",
    "title": "Introducción a Python y a la programación",
    "summary": "Comprende problemas, algoritmos, lenguajes e intérprete; prepara un entorno y ejecuta tus primeros programas.",
    "lessons": [
      {
        "id": "b1-l1",
        "section": "1.1",
        "title": "Resolver problemas mediante algoritmos",
        "objectives": [
          "Distinguir problema, algoritmo y programa.",
          "Identificar entradas, proceso y salida.",
          "Descomponer una tarea en pasos finitos y ordenados."
        ],
        "explanation": [
          "Programar comienza por entender una necesidad y definir el resultado correcto. Un algoritmo es una secuencia finita y ordenada de pasos que permite resolver esa tarea; cada paso debe ser claro y comprobable.",
          "Un algoritmo puede escribirse con palabras, diagramas o pseudocódigo antes de convertirse en Python. Un programa traduce esos pasos a instrucciones de un lenguaje que el intérprete puede ejecutar siguiendo un orden definido.",
          "Para calcular el cambio de una compra, identifica precio y pago como entradas, realiza la resta como proceso y muestra el resultado como salida. Separar estas etapas permite comprobar la lógica antes de escribir código."
        ],
        "example": "precio = 3200\npago = 5000\ncambio = pago - precio\nprint(cambio)",
        "exampleOutput": "1800",
        "walkthrough": [
          "Entrada: precio = 3200 y pago = 5000.",
          "Proceso: pago - precio calcula la diferencia.",
          "Salida: print(cambio) muestra 1800."
        ],
        "commonMistakes": [
          "Cambiar el orden de la resta y obtener un resultado negativo.",
          "Omitir una entrada o no definir la salida esperada."
        ],
        "exercise": {
          "id": "b1-e1",
          "title": "Calcular el cambio",
          "statement": "Con un precio de 3200 y un pago de 5000, calcula el cambio, guárdalo en cambio e imprímelo.",
          "starterCode": "precio = 3200\npago = 5000\n# calcula el cambio\n",
          "solution": "precio = 3200\npago = 5000\ncambio = pago - precio\nprint(cambio)",
          "tests": [
            {
              "input": [],
              "expected": "1800"
            }
          ],
          "hints": [
            "Identifica qué cantidad se resta de cuál.",
            "Guarda el resultado antes de imprimirlo."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué describe mejor un algoritmo?",
            "options": [
              "Un nombre que almacena un dato",
              "Un lenguaje que solo entiende el procesador",
              "Una secuencia finita y ordenada de pasos para resolver un problema",
              "Una ventana donde se escribe código"
            ],
            "answer": 2,
            "explanation": "Un algoritmo ordena pasos para llegar a un resultado y define cuándo termina."
          },
          {
            "prompt": "¿Qué diferencia a un programa de un algoritmo?",
            "options": [
              "El algoritmo siempre se escribe en Python",
              "El programa no necesita pasos ordenados",
              "El algoritmo solo sirve para cálculos matemáticos",
              "El programa expresa instrucciones mediante un lenguaje que puede ejecutarse"
            ],
            "answer": 3,
            "explanation": "El algoritmo describe el procedimiento; el programa lo expresa en un lenguaje ejecutable."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b1-l2",
        "section": "1.2",
        "title": "Lenguajes e intérprete de Python",
        "objectives": [
          "Distinguir lenguaje, código fuente e intérprete.",
          "Explicar la función del editor y la consola.",
          "Describir qué ocurre al ejecutar un programa."
        ],
        "explanation": [
          "Un lenguaje de programación ofrece reglas para expresar instrucciones. El código fuente es el texto que las contiene y debe cumplir la sintaxis del lenguaje para que pueda procesarse.",
          "Python utiliza un intérprete que analiza y ejecuta el código. Un editor o IDE permite escribir y organizarlo; la consola presenta resultados y errores. Cada herramienta cumple una función diferente.",
          "Esta academia usa Pyodide para ejecutar Python en el navegador mediante WebAssembly. En un equipo local puedes instalar Python y utilizar un editor; aunque cambie el entorno, las reglas del lenguaje y el razonamiento se mantienen."
        ],
        "example": "print(\"Escribo código en el editor\")\nprint(\"El intérprete ejecuta Python\")",
        "exampleOutput": "Escribo código en el editor\nEl intérprete ejecuta Python",
        "walkthrough": [
          "El editor contiene las instrucciones.",
          "El intérprete procesa el código.",
          "La consola presenta la salida."
        ],
        "commonMistakes": [
          "Confundir el editor con el lenguaje.",
          "Pensar que cualquier texto puede ejecutarse sin respetar la sintaxis."
        ],
        "exercise": {
          "id": "b1-e2",
          "title": "Distinguir las herramientas",
          "statement": "Muestra un mensaje que indique que el editor contiene el código y otro que Python ejecuta las instrucciones.",
          "starterCode": "# escribe dos mensajes\n",
          "solution": "print(\"El editor contiene el código\")\nprint(\"El intérprete ejecuta Python\")",
          "tests": [
            {
              "input": [],
              "expected": "El editor contiene el código\nEl intérprete ejecuta Python"
            }
          ],
          "hints": [
            "Escribe una llamada print() por mensaje.",
            "Mantén el texto entre comillas."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cuál es la función del intérprete de Python?",
            "options": [
              "Procesar y ejecutar instrucciones escritas en Python",
              "Diseñar la interfaz del editor",
              "Guardar contraseñas",
              "Convertir cualquier texto en código válido"
            ],
            "answer": 0,
            "explanation": "El intérprete analiza el código y ejecuta las instrucciones que cumplen las reglas del lenguaje."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b1-l3",
        "section": "1.3",
        "title": "Preparar el entorno y ejecutar Python",
        "objectives": [
          "Reconocer un entorno de ejecución y un archivo .py.",
          "Distinguir ejecución local y práctica en navegador.",
          "Comprobar que Python responde a instrucciones."
        ],
        "explanation": [
          "Para programar necesitas un entorno que pueda ejecutar Python. En un equipo local normalmente instalas la distribución oficial y ejecutas archivos desde una terminal o un editor.",
          "Los archivos Python suelen utilizar la extensión .py. Desde una terminal puedes ejecutar un archivo con python nombre_archivo.py; en algunos sistemas el comando disponible es python3. python --version permite consultar la versión instalada.",
          "El navegador de esta academia ya incluye Python mediante Pyodide, así que no necesitas instalarlo en tu dispositivo para completar las prácticas. Lo importante es comprobar que el intérprete responde y que puedes ejecutar instrucciones."
        ],
        "example": "print(\"Python está listo para ejecutar instrucciones\")",
        "exampleOutput": "Python está listo para ejecutar instrucciones",
        "walkthrough": [
          "Escribe una llamada print() en el editor.",
          "Pulsa Ejecutar para enviar el programa al intérprete.",
          "Comprueba el mensaje en la consola."
        ],
        "commonMistakes": [
          "Confundir el editor con la instalación del intérprete.",
          "Pensar que un error del código demuestra que Python no está instalado."
        ],
        "exercise": {
          "id": "b1-e3",
          "title": "Comprobar la ejecución",
          "statement": "Escribe una instrucción que muestre Python está listo para practicar y ejecútala.",
          "starterCode": "# comprueba que Python responde\n",
          "solution": "print(\"Python está listo para practicar\")",
          "tests": [
            {
              "input": [],
              "expected": "Python está listo para practicar"
            }
          ],
          "hints": [
            "Utiliza print().",
            "Escribe el mensaje como una cadena."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué comando suele ejecutar practica.py desde una terminal con Python disponible?",
            "options": [
              "open practica.py",
              "run-python practica.py",
              "python practica.py",
              "python install practica.py"
            ],
            "answer": 2,
            "explanation": "El comando python seguido del nombre del archivo solicita ejecutar ese archivo."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b1-l4",
        "section": "1.4",
        "title": "Evaluación del módulo 1: fundamentos de programación",
        "objectives": [
          "Distinguir un problema, un algoritmo, un programa y el código fuente.",
          "Explicar la función de Python y de su intérprete.",
          "Reconocer qué aporta un editor o IDE.",
          "Identificar errores básicos de sintaxis y ejecución."
        ],
        "explanation": [
          "Esta evaluación comprueba los fundamentos antes de trabajar con datos y operaciones. Un problema describe una necesidad; un algoritmo organiza pasos finitos y claros para resolverla; un programa expresa esos pasos en instrucciones que una computadora puede ejecutar.",
          "El código fuente es el texto escrito en un lenguaje de programación. Python tiene reglas propias. El intérprete procesa el código y ejecuta sus instrucciones; si encuentra una instrucción que no respeta la sintaxis, informa un error para que puedas corregirla.",
          "Un editor permite escribir y modificar el código. Un IDE reúne el editor y herramientas de apoyo, como ejecución y depuración. El editor, el intérprete y el programa no son lo mismo: cada uno cumple una función distinta."
        ],
        "example": "programa = \"Hola, Python\"\nprint(programa)",
        "exampleOutput": "Hola, Python",
        "walkthrough": [
          "La primera línea guarda el texto del mensaje en una variable.",
          "La segunda línea usa print() para mostrar el valor en la consola.",
          "El intérprete procesa las instrucciones en orden y produce el resultado."
        ],
        "commonMistakes": [
          "Confundir el código fuente con el resultado de la consola.",
          "Pensar que un IDE es el lenguaje de programación.",
          "Llamar algoritmo a pasos sin orden ni resultado definido."
        ],
        "exercise": {
          "id": "b1-e4",
          "title": "Describe entrada, proceso y salida",
          "statement": "Escribe tres instrucciones print() que describan un pequeño programa: primero la entrada, después el proceso y finalmente la salida.",
          "starterCode": "print(\"Entrada: dos números\")\n",
          "solution": "print(\"Entrada: dos números\")\nprint(\"Proceso: sumarlos\")\nprint(\"Salida: mostrar el resultado\")",
          "tests": [
            {
              "input": [],
              "expected": "Entrada: dos números\nProceso: sumarlos\nSalida: mostrar el resultado"
            }
          ],
          "hints": [
            "Usa una línea por etapa.",
            "Mantén las instrucciones en orden."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 10
        },
        "questions": [
          {
            "prompt": "¿Qué condición permite reconocer un algoritmo bien definido?",
            "options": [
              "Un programa ya ejecutado",
              "Una secuencia finita y ordenada de pasos para resolver un problema",
              "Una computadora completa",
              "Un lenguaje de marcado"
            ],
            "answer": 1,
            "explanation": "Un algoritmo organiza una solución en pasos claros, ordenados y finitos."
          },
          {
            "prompt": "¿Qué es el código fuente?",
            "options": [
              "El resultado de la consola",
              "Una pieza física",
              "El texto de instrucciones escrito en un lenguaje de programación",
              "Una copia de seguridad"
            ],
            "answer": 2,
            "explanation": "El código fuente es el conjunto de instrucciones que una persona escribe."
          },
          {
            "prompt": "¿Cuál es el trabajo principal del intérprete de Python?",
            "options": [
              "Procesar y ejecutar las instrucciones del programa",
              "Diseñar la interfaz",
              "Guardar contraseñas",
              "Convertir errores en respuestas correctas"
            ],
            "answer": 0,
            "explanation": "El intérprete procesa el código Python y ejecuta sus instrucciones."
          },
          {
            "prompt": "¿Qué herramienta suele reunir un editor y otras funciones de desarrollo?",
            "options": [
              "Una impresora",
              "Un sistema de archivos",
              "Un algoritmo",
              "Un entorno de desarrollo integrado (IDE)"
            ],
            "answer": 3,
            "explanation": "Un IDE integra el editor y herramientas de apoyo como ejecución y depuración."
          },
          {
            "prompt": "¿Qué indica normalmente un error de sintaxis?",
            "options": [
              "Que el computador no tiene pantalla",
              "Que una instrucción no respeta las reglas del lenguaje",
              "Que el programa terminó correctamente",
              "Que el algoritmo tiene demasiados pasos"
            ],
            "answer": 1,
            "explanation": "Un error de sintaxis aparece cuando el código no cumple las reglas del lenguaje."
          },
          {
            "prompt": "¿Cuál afirmación describe correctamente a Python?",
            "options": [
              "Es una pieza física",
              "Es un sistema operativo",
              "Es un lenguaje de programación con reglas para expresar instrucciones",
              "Es un editor de texto"
            ],
            "answer": 2,
            "explanation": "Python es un lenguaje de programación para expresar instrucciones."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 30
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
        "id": "b2-l9",
        "section": "2.1",
        "title": "Primer programa: Hello, World!",
        "objectives": [
          "Ejecutar una instrucción que muestre un mensaje en la consola.",
          "Reconocer print() como una función integrada de Python.",
          "Identificar el texto entre comillas como argumento de la función."
        ],
        "explanation": [
          "Un programa puede empezar con una instrucción que muestre un mensaje. En Python, print() envía a la consola los valores que recibe. Prueba con un mensaje corto y observa exactamente qué aparece.",
          "El nombre print identifica una función integrada. Los paréntesis indican que la estás llamando y el texto entre comillas es el argumento que le entregas. Las comillas delimitan una cadena; no aparecen en el resultado de la consola.",
          "Una llamada a print() termina normalmente con un salto de línea. También puedes pasar varios valores separados por comas: Python los muestra separados por un espacio. En esta primera práctica basta con un mensaje; después podrás combinarlo con variables y datos."
        ],
        "example": "print(\"Hola, mundo\")\nprint(\"Estoy aprendiendo\", \"Python\")",
        "exampleOutput": "Hola, mundo\nEstoy aprendiendo Python",
        "walkthrough": [
          "La primera llamada muestra la cadena Hola, mundo.",
          "La segunda llamada recibe dos argumentos y los separa con un espacio.",
          "Cada llamada escribe su resultado en una línea diferente."
        ],
        "commonMistakes": [
          "Olvidar una de las comillas que delimitan el texto.",
          "Escribir Print() con mayúscula: los nombres de las funciones distinguen mayúsculas y minúsculas.",
          "Olvidar el paréntesis de cierre."
        ],
        "exercise": {
          "id": "b2-e9",
          "title": "Mostrar tu primer mensaje",
          "statement": "Escribe un programa que muestre exactamente el mensaje Hola, mundo desde Python.",
          "starterCode": "# muestra el mensaje solicitado\n",
          "solution": "print(\"Hola, mundo desde Python\")",
          "tests": [
            {
              "input": [],
              "expected": "Hola, mundo desde Python"
            }
          ],
          "hints": [
            "Usa la función print().",
            "Escribe el mensaje entre comillas y no agregues texto extra."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 3
        },
        "questions": [
          {
            "prompt": "¿Qué hace print(\"Hola\") al ejecutarse?",
            "options": [
              "Guarda el texto en un archivo",
              "Muestra Hola en la consola",
              "Solicita que la persona escriba un dato",
              "Crea una variable llamada Hola"
            ],
            "answer": 1,
            "explanation": "print() muestra en la consola el valor que recibe. Las comillas delimitan la cadena y no forman parte del resultado mostrado."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 20
      },
      {
        "id": "b2-l1",
        "section": "2.2",
        "title": "Tipos de datos y literales",
        "objectives": [
          "Reconocer int, float, str y bool.",
          "Diferenciar texto de valores numéricos.",
          "Consultar el tipo de un valor mediante type()."
        ],
        "explanation": [
          "Un literal es un valor escrito directamente en el código. int representa enteros, float números con parte decimal, str texto y bool valores de verdad. Cada tipo ofrece operaciones y comportamientos diferentes.",
          "Las comillas hacen que un valor sea texto: \"25\" es una cadena mientras que 25 es un entero. True y False son los dos valores booleanos de Python y sirven para representar condiciones que pueden cumplirse o no.",
          "type() permite consultar el tipo de un valor. Es una herramienta útil cuando recibes información de otra fuente y todavía no sabes si llega como texto, entero o decimal."
        ],
        "example": "edad = 25\nprecio = 19.95\nnombre = \"Luis\"\nactivo = True\nprint(type(edad).__name__)\nprint(type(precio).__name__)\nprint(type(nombre).__name__)\nprint(type(activo).__name__)",
        "exampleOutput": "int\nfloat\nstr\nbool",
        "walkthrough": [
          "edad es un entero y precio un decimal.",
          "nombre es una cadena.",
          "activo es booleano."
        ],
        "commonMistakes": [
          "Confundir \"25\" con 25.",
          "Escribir true o false en minúsculas."
        ],
        "exercise": {
          "id": "b2-e1",
          "title": "Reconocer cuatro tipos",
          "statement": "Crea cantidad 8, precio 2.5, nombre Marta y estado True. Imprime el tipo de cada variable.",
          "starterCode": "cantidad = 8\nprecio = 2.5\nnombre = \"Marta\"\nestado = True\n",
          "solution": "cantidad = 8\nprecio = 2.5\nnombre = \"Marta\"\nestado = True\nprint(type(cantidad).__name__)\nprint(type(precio).__name__)\nprint(type(nombre).__name__)\nprint(type(estado).__name__)",
          "tests": [
            {
              "input": [],
              "expected": "int\nfloat\nstr\nbool"
            }
          ],
          "hints": [
            "Usa type(variable).__name__.",
            "Imprime un tipo por línea."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué tipo representa el valor 3.75?",
            "options": [
              "int",
              "str",
              "float",
              "bool"
            ],
            "answer": 2,
            "explanation": "Un número con parte decimal se representa normalmente mediante float."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b2-l3",
        "section": "2.3",
        "title": "Operadores aritméticos",
        "objectives": [
          "Aplicar suma, resta, multiplicación y división.",
          "Diferenciar /, // y %.",
          "Utilizar ** para calcular potencias."
        ],
        "explanation": [
          "Los operadores +, -, *, / y ** permiten sumar, restar, multiplicar, dividir y elevar a una potencia. Por ejemplo, 3 ** 2 produce nueve.",
          "/ realiza división real; // devuelve el cociente entero y % devuelve el residuo. Al dividir 17 entre 5, el cociente entero es tres y sobran dos unidades.",
          "// calcula cuántas cajas completas se pueden formar y % permite conocer unidades restantes. Elige el operador según necesites división decimal, cociente entero o residuo."
        ],
        "example": "print(8 + 4)\nprint(8 / 4)\nprint(17 // 5)\nprint(17 % 5)\nprint(2 ** 3)",
        "exampleOutput": "12\n2.0\n3\n2\n8",
        "walkthrough": [
          "La suma produce doce.",
          "17 // 5 devuelve tres.",
          "17 % 5 devuelve dos."
        ],
        "commonMistakes": [
          "Pensar que / y // son iguales.",
          "Confundir cociente y residuo."
        ],
        "exercise": {
          "id": "b2-e3",
          "title": "Calcular cajas y sobrantes",
          "statement": "Hay 23 cuadernos y cada caja guarda cinco. Imprime las cajas completas y las unidades sobrantes.",
          "starterCode": "cuadernos = 23\npor_caja = 5\n",
          "solution": "cuadernos = 23\npor_caja = 5\nprint(cuadernos // por_caja)\nprint(cuadernos % por_caja)",
          "tests": [
            {
              "input": [],
              "expected": "4\n3"
            }
          ],
          "hints": [
            "Usa // para las cajas completas.",
            "Usa % para los sobrantes."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué devuelve 17 % 5?",
            "options": [
              "2",
              "3",
              "5",
              "3.4"
            ],
            "answer": 0,
            "explanation": "El operador % devuelve el residuo; al dividir 17 entre 5 sobran dos."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b2-l4",
        "section": "2.3.1",
        "title": "Prioridad y conversión de expresiones",
        "objectives": [
          "Aplicar la prioridad de operadores.",
          "Agrupar operaciones mediante paréntesis.",
          "Convertir valores con int(), float() y str()."
        ],
        "explanation": [
          "Python evalúa primero los paréntesis, luego potencias, multiplicaciones y divisiones, y después sumas y restas. Los paréntesis permiten expresar el orden deseado con claridad.",
          "int() convierte una cadena numérica a entero; float() permite números decimales y str() transforma un valor en texto. int(\"doce\") falla porque la cadena no representa un entero válido.",
          "Antes de combinar datos, identifica el tipo y la operación que necesitas. Utiliza números para calcular y cadenas para construir mensajes; las conversiones deben tener un propósito."
        ],
        "example": "subtotal = 3 * (1200 + 300)\nprecio_texto = \"4500\"\nprecio = int(precio_texto)\nprint(subtotal)\nprint(precio + 500)",
        "exampleOutput": "4500\n5000",
        "walkthrough": [
          "Los paréntesis calculan primero 1200 + 300.",
          "int() convierte el texto en entero.",
          "El nuevo entero puede sumarse con 500."
        ],
        "commonMistakes": [
          "Sumar un entero y una cadena sin convertir.",
          "Suponer que int() convierte palabras."
        ],
        "exercise": {
          "id": "b2-e4",
          "title": "Convertir un subtotal",
          "statement": "Convierte \"1250\" a entero, multiplícalo por tres e imprime el subtotal.",
          "starterCode": "precio_texto = \"1250\"\n",
          "solution": "precio_texto = \"1250\"\nprecio = int(precio_texto)\nsubtotal = precio * 3\nprint(subtotal)",
          "tests": [
            {
              "input": [],
              "expected": "3750"
            }
          ],
          "hints": [
            "Utiliza int().",
            "Multiplica el valor convertido por tres."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué función convierte la cadena \"12\" en el entero 12?",
            "options": [
              "str()",
              "int()",
              "type()",
              "bool()"
            ],
            "answer": 1,
            "explanation": "int() convierte una cadena que representa un entero en un valor int."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b2-l2",
        "section": "2.4",
        "title": "Variables y nombres claros",
        "objectives": [
          "Crear variables mediante asignación.",
          "Elegir identificadores válidos y descriptivos.",
          "Actualizar una variable con su valor anterior."
        ],
        "explanation": [
          "Una variable es un nombre asociado a un valor durante la ejecución. El signo igual realiza una asignación: Python evalúa el lado derecho y guarda el resultado en el nombre izquierdo.",
          "Un identificador puede contener letras, números y guion bajo, pero no empezar con un número ni contener espacios. Nombres como precio_unitario y cantidad permiten entender mejor el programa.",
          "Una variable puede cambiar: puntos = puntos + 5 calcula un nuevo valor y lo asigna de nuevo. puntos += 5 expresa la misma actualización de forma abreviada y se usa en contadores y acumuladores."
        ],
        "example": "puntos = 10\npuntos += 5\nproducto = \"Cuaderno\"\nprint(producto)\nprint(puntos)",
        "exampleOutput": "Cuaderno\n15",
        "walkthrough": [
          "puntos comienza en diez y aumenta cinco.",
          "producto conserva el texto.",
          "La última línea muestra el valor actualizado."
        ],
        "commonMistakes": [
          "Usar espacios en nombres de variables.",
          "Confundir =, que asigna, con ==, que compara."
        ],
        "exercise": {
          "id": "b2-e2",
          "title": "Actualizar una cantidad",
          "statement": "Crea stock = 12, suma cinco unidades con += e imprime el valor final.",
          "starterCode": "stock = 12\n",
          "solution": "stock = 12\nstock += 5\nprint(stock)",
          "tests": [
            {
              "input": [],
              "expected": "17"
            }
          ],
          "hints": [
            "Usa += para actualizar la variable.",
            "Imprime después de asignar."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué hace total = total + 3?",
            "options": [
              "Compara total con 3",
              "Calcula el valor anterior más 3 y lo asigna nuevamente a total",
              "Crea una cadena llamada total",
              "Elimina total"
            ],
            "answer": 1,
            "explanation": "Python evalúa el lado derecho y asigna el nuevo resultado a total."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b2-l5",
        "section": "2.5",
        "title": "Cadenas, comentarios y salida formateada",
        "objectives": [
          "Combinar texto con variables y expresiones mediante f-strings.",
          "Limpiar y transformar cadenas con strip(), lower() y title().",
          "Presentar números con formato y etiquetas comprensibles.",
          "Documentar el propósito de una instrucción mediante comentarios breves con #."
        ],
        "explanation": [
          "Una cadena (str) representa texto y ofrece métodos para normalizarlo. strip() elimina espacios al principio y al final; lower() convierte las letras a minúsculas y title() pone en mayúscula inicial cada palabra. Las cadenas son inmutables: estos métodos devuelven un nuevo texto y no cambian la cadena original.",
          "Una f-string comienza con la letra f antes de las comillas. Dentro de llaves puedes insertar variables o expresiones, y la especificación :.2f permite mostrar dos decimales. Esta forma resulta más legible que concatenar manualmente texto y números.",
          "La salida es la conversación del programa con quien lo utiliza. Antes de mostrar un dato, limpia espacios innecesarios, conserva el formato adecuado y añade una etiqueta con su significado. Así evitas nombres inconsistentes y resultados que no se entienden.",
          "Un comentario comienza con # y sirve para explicar la intención de una parte del código. Python ignora ese texto al ejecutar el programa. Escribe comentarios breves que aporten contexto; no repitas palabra por palabra lo que la instrucción ya expresa."
        ],
        "example": "entrada = \"  ana perez  \"\n# Limpia los espacios y normaliza el nombre\nnombre = entrada.strip().title()\nprecio = 1250.5\n# Presenta el importe con dos decimales\nprint(nombre)\nprint(f\"Total: {precio:.2f} colones\")",
        "exampleOutput": "Ana Perez\nTotal: 1250.50 colones",
        "walkthrough": [
          "strip() elimina los espacios que rodean el nombre.",
          "title() devuelve una cadena con las palabras capitalizadas.",
          "La f-string presenta el precio con dos decimales y una etiqueta.",
          "Los comentarios explican la intención y no aparecen en la salida."
        ],
        "commonMistakes": [
          "Creer que strip() elimina los espacios que aparecen entre palabras.",
          "Olvidar la f antes de las comillas o mezclar texto y números con +.",
          "Escribir una nota sin el símbolo # y provocar un error de sintaxis."
        ],
        "exercise": {
          "id": "b2-e5",
          "title": "Limpiar y presentar un nombre",
          "statement": "Limpia el texto \"  python desde cero  \" con strip(), aplica title() y muestra el resultado en una f-string con la etiqueta Curso:.",
          "starterCode": "texto = \"  python desde cero  \"\n",
          "solution": "texto = \"  python desde cero  \"\nnombre = texto.strip().title()\nprint(f\"Curso: {nombre}\")",
          "tests": [
            {
              "input": [],
              "expected": "Curso: Python Desde Cero"
            }
          ],
          "hints": [
            "Primero elimina los espacios que rodean el texto.",
            "Aplica title() al resultado y úsalo dentro de una f-string."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué permite hacer una f-string?",
            "options": [
              "Ejecutar archivos externos",
              "Crear una función sin def",
              "Insertar variables y expresiones dentro de una cadena",
              "Repetir un bloque"
            ],
            "answer": 2,
            "explanation": "Una f-string evalúa las expresiones entre llaves y las inserta en el texto."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b2-l6",
        "section": "2.6",
        "title": "Entrada de datos con input()",
        "objectives": [
          "Leer información mediante input().",
          "Recordar que input() devuelve una cadena.",
          "Convertir la entrada antes de calcular."
        ],
        "explanation": [
          "input() permite que una persona escriba un dato durante la ejecución. La función puede mostrar una pregunta, espera la respuesta y devuelve lo escrito como cadena, incluso si se introduce una cifra.",
          "Para calcular, convierte el texto con int() o float(). Separa preguntar, leer, convertir, procesar y presentar para poder comprobar cada etapa.",
          "El laboratorio simula la entrada de consola mediante un campo de texto. Introduce una línea por cada llamada a input(); si el dato no representa un número, la conversión puede generar un error que estudiarás después."
        ],
        "example": "cantidad = int(input(\"Cantidad: \"))\nprecio = 1500\ntotal = cantidad * precio\nprint(f\"Total: {total}\")",
        "exampleOutput": "Entrada: 3\nSalida: Total: 4500",
        "walkthrough": [
          "input() recoge el texto.",
          "int() convierte a entero.",
          "El programa multiplica y presenta el total."
        ],
        "commonMistakes": [
          "No convertir input() antes de calcular.",
          "No suministrar una línea por cada llamada a input()."
        ],
        "exercise": {
          "id": "b2-e6",
          "title": "Calcular un precio desde la entrada",
          "statement": "Lee cantidad con input(), multiplícala por 1500 e imprime el total. Prueba con 3.",
          "starterCode": "cantidad = int(input())\n",
          "solution": "cantidad = int(input())\nprecio = 1500\nprint(cantidad * precio)",
          "tests": [
            {
              "input": [
                "0"
              ],
              "expected": "0"
            },
            {
              "input": [
                "1"
              ],
              "expected": "1500"
            },
            {
              "input": [
                "3"
              ],
              "expected": "4500"
            },
            {
              "input": [
                "5"
              ],
              "expected": "7500"
            }
          ],
          "hints": [
            "Utiliza input().",
            "Convierte el dato con int()."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué tipo devuelve input() inicialmente?",
            "options": [
              "int",
              "float",
              "bool",
              "str"
            ],
            "answer": 3,
            "explanation": "input() devuelve una cadena; la conversión numérica debe realizarse explícitamente."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b2-l8",
        "section": "2.6 práctica",
        "title": "Laboratorio integrador: crear un recibo interactivo",
        "objectives": [
          "Leer texto, precios y cantidades mediante input().",
          "Convertir cada dato al tipo que necesita el cálculo.",
          "Presentar un recibo con una salida formateada."
        ],
        "explanation": [
          "Un programa interactivo recibe información de la persona que lo utiliza. input() siempre devuelve una cadena, por lo que debes decidir si el dato representa texto, una cantidad entera o un importe con decimales antes de procesarlo.",
          "Para un recibo, el nombre del producto se puede limpiar con strip() y title(); el precio se convierte con float() y la cantidad con int(). Después se multiplica precio por cantidad. Separar lectura, conversión y cálculo facilita encontrar una entrada incorrecta.",
          "Una f-string permite presentar el resultado con una etiqueta y dos decimales. Antes de entregar un programa, pruébalo con más de un producto, precios con y sin decimales y cantidades mayores que uno; los casos de prueba deben confirmar que el cálculo no depende de un único ejemplo."
        ],
        "example": "producto = input(\"Producto: \").strip().title()\nprecio = float(input(\"Precio: \"))\ncantidad = int(input(\"Cantidad: \"))\ntotal = precio * cantidad\nprint(f\"{producto}: {total:.2f} colones\")",
        "exampleOutput": "Cuaderno: 2500.00 colones",
        "walkthrough": [
          "strip() elimina espacios que rodean el nombre y title() lo presenta de forma legible.",
          "float() permite que el precio tenga decimales; int() convierte la cantidad a entero.",
          "La f-string presenta el subtotal con dos posiciones decimales."
        ],
        "commonMistakes": [
          "Olvidar que input() entrega texto aunque la persona escriba una cifra.",
          "Convertir el precio con int() y perder los centavos."
        ],
        "exercise": {
          "id": "b2-e8",
          "title": "Emitir un recibo desde la entrada",
          "statement": "Lee tres líneas: el nombre del producto, su precio decimal y su cantidad entera. Limpia el nombre, calcula el total y muestra el recibo con dos decimales. Prueba con Cuaderno, 1250 y 2.",
          "starterCode": "producto = input()\nprecio = float(input())\ncantidad = int(input())\n",
          "solution": "producto = input().strip().title()\nprecio = float(input())\ncantidad = int(input())\ntotal = precio * cantidad\nprint(f\"{producto}: {total:.2f} colones\")",
          "tests": [
            {
              "input": [
                "cuaderno",
                "1250",
                "2"
              ],
              "expected": "Cuaderno: 2500.00 colones"
            },
            {
              "input": [
                "lapiz",
                "0.5",
                "4"
              ],
              "expected": "Lapiz: 2.00 colones"
            },
            {
              "input": [
                "  cuaderno universitario  ",
                "349.9",
                "1"
              ],
              "expected": "Cuaderno Universitario: 349.90 colones"
            },
            {
              "input": [
                "marcador",
                "1200.25",
                "3"
              ],
              "expected": "Marcador: 3600.75 colones"
            }
          ],
          "hints": [
            "Lee tres entradas en el orden indicado.",
            "Limpia el nombre antes de mostrarlo.",
            "Multiplica el precio por la cantidad y utiliza :.2f."
          ],
          "difficulty": "medio",
          "xp": 25,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Por qué se convierte precio con float() y cantidad con int()?",
            "options": [
              "Porque input() ya devuelve números",
              "Porque ambos datos deben conservarse como texto",
              "Porque el precio puede tener decimales y la cantidad debe ser entera",
              "Porque int() convierte cualquier palabra"
            ],
            "answer": 2,
            "explanation": "float() permite representar importes con parte decimal; int() representa cantidades enteras."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 55
      },
      {
        "id": "b2-l7",
        "section": "2.7",
        "title": "Evaluación del módulo 2: tipos, operadores y E/S",
        "objectives": [
          "Elegir tipos adecuados.",
          "Resolver expresiones y conversiones.",
          "Combinar entrada, cálculo y salida."
        ],
        "explanation": [
          "Esta evaluación integra tipos básicos, variables, asignación, operadores y conversión. Antes de responder, identifica si cada dato es texto, número o booleano y elige una operación compatible.",
          "Cuando aparecen varios operadores, sigue el orden de evaluación y utiliza paréntesis para mostrar la intención. Si una expresión contiene input(), recuerda que el dato inicial es texto y puede necesitar conversión.",
          "El reto combina cantidad, precio e impuesto. Calcula el subtotal, aplica el porcentaje y presenta el total con una etiqueta; la salida debe ser comprensible y producir el resultado esperado."
        ],
        "example": "cantidad = 2\nprecio = 2500\nsubtotal = cantidad * precio\nimpuesto = subtotal * 0.13\ntotal = subtotal + impuesto\nprint(f\"{total:.2f}\")",
        "exampleOutput": "5650.00",
        "walkthrough": [
          "Calcula subtotal con cantidad por precio.",
          "Calcula el 13% del subtotal.",
          "Suma y presenta dos decimales."
        ],
        "commonMistakes": [
          "Aplicar el impuesto a una sola unidad.",
          "Mostrar un número sin indicar su significado."
        ],
        "exercise": {
          "id": "b2-e7",
          "title": "Calcular una compra con impuesto",
          "statement": "Con dos productos de 2500 colones, calcula subtotal, impuesto del 13% y total. Muestra dos decimales.",
          "starterCode": "cantidad = 2\nprecio = 2500\n",
          "solution": "cantidad = 2\nprecio = 2500\nsubtotal = cantidad * precio\nimpuesto = subtotal * 0.13\ntotal = subtotal + impuesto\nprint(f\"{total:.2f}\")",
          "tests": [
            {
              "input": [],
              "expected": "5650.00"
            }
          ],
          "hints": [
            "Calcula subtotal.",
            "Multiplica por 0.13.",
            "Suma el impuesto."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué tipo produce 5 / 2?",
            "options": [
              "int",
              "float",
              "str",
              "bool"
            ],
            "answer": 1,
            "explanation": "La división / devuelve un valor decimal, 2.5 en este caso."
          },
          {
            "prompt": "¿Qué valor guarda x después de x = 4 y x += 2?",
            "options": [
              "6",
              "4",
              "42",
              "2"
            ],
            "answer": 0,
            "explanation": "La segunda instrucción suma dos al valor anterior."
          },
          {
            "prompt": "¿Qué función convierte una cadena numérica en decimal?",
            "options": [
              "int()",
              "float()",
              "str()",
              "type()"
            ],
            "answer": 1,
            "explanation": "float() convierte una cadena numérica válida en decimal."
          },
          {
            "prompt": "¿Qué devuelve 17 // 5?",
            "options": [
              "2",
              "3.4",
              "3",
              "4"
            ],
            "answer": 2,
            "explanation": "La división entera devuelve el cociente sin parte decimal."
          },
          {
            "prompt": "¿Qué devuelve input() antes de convertir la respuesta?",
            "options": [
              "int",
              "float",
              "bool",
              "str"
            ],
            "answer": 3,
            "explanation": "input() entrega texto y se debe convertir para hacer cálculos."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 50
      },
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
        "title": "Valores booleanos y comparaciones",
        "objectives": [
          "Reconocer True y False como valores bool.",
          "Utilizar operadores de comparación.",
          "Predecir el resultado de una expresión booleana."
        ],
        "explanation": [
          "El tipo bool representa dos valores: True y False. Una comparación produce uno de ellos y permite expresar si una condición se cumple, por ejemplo si una nota alcanza el mínimo o si una cuenta está activa.",
          "== y != comprueban igualdad y diferencia; >, <, >= y <= comparan magnitudes. El signo = realiza una asignación, por lo que no debe utilizarse como sustituto de ==.",
          "Antes de comparar, comprueba que los valores sean compatibles. Si la edad procede de input(), conviértela primero en entero; una comparación correcta facilita construir decisiones fiables."
        ],
        "example": "nota = 82\naprobado = nota >= 70\nprint(aprobado)\nprint(nota == 100)",
        "exampleOutput": "True\nFalse",
        "walkthrough": [
          "nota >= 70 comprueba si la nota alcanza el mínimo.",
          "nota == 100 compara igualdad exacta.",
          "Cada comparación produce un booleano."
        ],
        "commonMistakes": [
          "Usar = en vez de == al comparar.",
          "Creer que una comparación modifica la variable original."
        ],
        "exercise": {
          "id": "b3-e1",
          "title": "Comprobar una temperatura",
          "statement": "Guarda temperatura = 29 e imprime si es mayor o igual a 25.",
          "starterCode": "temperatura = 29\n",
          "solution": "temperatura = 29\nprint(temperatura >= 25)",
          "tests": [
            {
              "input": [],
              "expected": "True"
            }
          ],
          "hints": [
            "Usa >=.",
            "Imprime la comparación."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué operador comprueba que dos valores son distintos?",
            "options": [
              "=",
              "==",
              ">=",
              "!="
            ],
            "answer": 3,
            "explanation": "!= devuelve True cuando los valores comparados no son iguales."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b3-l3",
        "section": "3.2",
        "title": "Decisiones con if, elif y else",
        "objectives": [
          "Construir condiciones con if.",
          "Encadenar alternativas mediante elif.",
          "Cubrir los demás casos con else y sangría correcta."
        ],
        "explanation": [
          "if ejecuta un bloque cuando la condición es verdadera. La línea de control termina con dos puntos y el bloque se identifica por la sangría; si la condición es falsa, Python continúa con la siguiente parte de la estructura.",
          "elif permite comprobar otra condición cuando las anteriores fueron falsas. Python ejecuta únicamente la primera rama que se cumple, por eso el orden es importante si las condiciones se solapan.",
          "else cubre los casos que no cumplen ninguna condición anterior. Antes de escribir el código, prueba valores por debajo, iguales y por encima de cada límite para evitar dejar datos sin clasificar."
        ],
        "example": "nota = 84\nif nota >= 90:\n    print(\"Excelente\")\nelif nota >= 70:\n    print(\"Aprobado\")\nelse:\n    print(\"Debe reforzar\")",
        "exampleOutput": "Aprobado",
        "walkthrough": [
          "La primera condición es falsa para 84.",
          "La segunda condición es verdadera.",
          "else no se ejecuta porque una rama ya fue seleccionada."
        ],
        "commonMistakes": [
          "Poner primero una condición general que capture todos los valores.",
          "Olvidar los dos puntos o la sangría."
        ],
        "exercise": {
          "id": "b3-e3",
          "title": "Clasificar un envío",
          "statement": "Si peso es hasta 1 kg imprime Ligero; hasta 5 kg imprime Mediano; en otro caso Pesado.",
          "starterCode": "peso = 3.2\n",
          "solution": "peso = 3.2\nif peso <= 1:\n    print(\"Ligero\")\nelif peso <= 5:\n    print(\"Mediano\")\nelse:\n    print(\"Pesado\")",
          "tests": [
            {
              "input": [],
              "expected": "Mediano"
            }
          ],
          "hints": [
            "Comprueba primero el límite menor.",
            "Usa elif para el segundo intervalo."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué sucede si dos condiciones de una cadena if/elif/else podrían ser verdaderas?",
            "options": [
              "Python ejecuta la primera condición verdadera y salta el resto",
              "Se ejecutan todas las ramas",
              "Python elige siempre la última",
              "El programa produce error de sintaxis"
            ],
            "answer": 0,
            "explanation": "La cadena se detiene en la primera condición verdadera y omite las siguientes."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b3-l4",
        "section": "3.3",
        "title": "Repetición condicional con while",
        "objectives": [
          "Explicar que while repite mientras la condición sea verdadera.",
          "Actualizar la variable que controla el ciclo.",
          "Reconocer y evitar ciclos infinitos."
        ],
        "explanation": [
          "while ejecuta un bloque mientras su condición sea True. Resulta útil cuando el número de repeticiones depende de una situación, por ejemplo pedir un dato hasta que cumpla una regla.",
          "Un ciclo necesita avanzar hacia su final. Si la condición depende de un contador, este debe actualizarse dentro del bloque; si no cambia, el programa puede repetir la misma operación indefinidamente.",
          "Antes de utilizar while identifica el valor inicial, la condición para continuar y la instrucción que modifica los datos. Para depurar, comienza con pocos pasos y observa el cambio del contador."
        ],
        "example": "contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador += 1",
        "exampleOutput": "1\n2\n3",
        "walkthrough": [
          "El contador comienza en uno.",
          "Se imprime y aumenta en cada vuelta.",
          "Al llegar a cuatro, la condición es falsa."
        ],
        "commonMistakes": [
          "Olvidar actualizar el contador.",
          "Incrementar en la dirección incorrecta."
        ],
        "exercise": {
          "id": "b3-e4",
          "title": "Contar hasta cinco",
          "statement": "Utiliza while para imprimir los números del 1 al 5, uno por línea.",
          "starterCode": "contador = 1\n",
          "solution": "contador = 1\nwhile contador <= 5:\n    print(contador)\n    contador += 1",
          "tests": [
            {
              "input": [],
              "expected": "1\n2\n3\n4\n5"
            }
          ],
          "hints": [
            "La condición debe incluir cinco.",
            "Incrementa el contador en cada vuelta."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cuándo termina un bucle while?",
            "options": [
              "Cuando print() muestra un número",
              "Cuando el contador llega siempre a cero",
              "Después de diez vueltas",
              "Cuando su condición se vuelve falsa"
            ],
            "answer": 3,
            "explanation": "while evalúa la condición antes de cada vuelta y termina cuando es falsa."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b3-l5",
        "section": "3.4",
        "title": "Recorridos con for, range(), break y continue",
        "objectives": [
          "Recorrer secuencias mediante for.",
          "Interpretar inicio, límite y paso de range().",
          "Diferenciar break de continue."
        ],
        "explanation": [
          "for toma un elemento de una secuencia y ejecuta el bloque una vez por cada elemento. Es apropiado cuando se recorren listas o se conoce el rango de valores que se necesita procesar.",
          "range(fin) genera desde cero hasta fin sin incluirlo; range(inicio, fin, paso) permite elegir comienzo e incremento. range(2, 11, 2) produce 2, 4, 6, 8 y 10.",
          "break termina el ciclo más cercano y continue omite el resto de la vuelta actual para pasar a la siguiente. Utiliza cada instrucción cuando la regla del problema lo requiera, sin confundir sus efectos."
        ],
        "example": "for numero in range(1, 6):\n    if numero == 3:\n        continue\n    print(numero)",
        "exampleOutput": "1\n2\n4\n5",
        "walkthrough": [
          "range(1, 6) genera del uno al cinco.",
          "Cuando numero vale tres, continue omite print().",
          "El bucle sigue con cuatro y cinco."
        ],
        "commonMistakes": [
          "Esperar que range(5) incluya cinco.",
          "Confundir continue con break."
        ],
        "exercise": {
          "id": "b3-e5",
          "title": "Imprimir números pares",
          "statement": "Utiliza for y range() para mostrar los pares desde 2 hasta 10.",
          "starterCode": "for numero in range(2, 11, 2):\n    # muestra el número\n    pass\n",
          "solution": "for numero in range(2, 11, 2):\n    print(numero)",
          "tests": [
            {
              "input": [],
              "expected": "2\n4\n6\n8\n10"
            }
          ],
          "hints": [
            "Empieza en dos y usa paso dos.",
            "Usa once como límite para incluir diez."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué valores genera range(1, 4)?",
            "options": [
              "1, 2, 3",
              "0, 1, 2, 3",
              "1, 2, 3, 4",
              "2, 3, 4"
            ],
            "answer": 0,
            "explanation": "range se detiene antes del límite final."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b3-l2",
        "section": "3.5",
        "title": "Operadores lógicos y operaciones bit a bit",
        "objectives": [
          "Combinar condiciones con and, or y not.",
          "Diferenciar operadores lógicos y bit a bit.",
          "Interpretar operaciones &, | y ^ sobre enteros."
        ],
        "explanation": [
          "and exige que ambas condiciones sean verdaderas; or requiere que al menos una lo sea y not invierte un valor booleano. Estos operadores expresan reglas compuestas como comprobar que una cuenta esté activa y tenga saldo suficiente.",
          "Los operadores bit a bit actúan sobre la representación binaria de los enteros: & realiza AND, | realiza OR, ^ XOR, ~ invierte bits y << o >> desplazan posiciones. No son equivalentes a and y or, que evalúan condiciones.",
          "El número 5 se representa como 0101 y el 3 como 0011. La operación 5 & 3 conserva los bits que son uno en ambos operandos y produce 0001, que equivale a 1; estas operaciones se utilizan en máscaras, permisos y protocolos."
        ],
        "example": "activo = True\nsaldo = 1200\nprint(activo and saldo >= 1000)\nprint(not activo)\nprint(5 & 3)\nprint(5 | 3)",
        "exampleOutput": "True\nFalse\n1\n7",
        "walkthrough": [
          "and combina dos condiciones.",
          "not invierte True a False.",
          "5 & 3 conserva bits comunes y 5 | 3 combina posiciones activas."
        ],
        "commonMistakes": [
          "Usar & como sustituto automático de and.",
          "Confundir | con or en cualquier contexto."
        ],
        "exercise": {
          "id": "b3-e2",
          "title": "Combinar condiciones",
          "statement": "Crea edad = 22 y tiene_entrada = True. Imprime True si tiene edad suficiente y entrada.",
          "starterCode": "edad = 22\ntiene_entrada = True\n",
          "solution": "edad = 22\ntiene_entrada = True\nprint(edad >= 18 and tiene_entrada)",
          "tests": [
            {
              "input": [],
              "expected": "True"
            }
          ],
          "hints": [
            "Compara la edad con 18.",
            "and exige que ambas condiciones sean verdaderas."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué diferencia principal existe entre and y &?",
            "options": [
              "and combina condiciones booleanas; & opera bit a bit sobre enteros",
              "Son siempre el mismo operador",
              "and suma bits y & compara cadenas",
              "& solo sirve para repetir bucles"
            ],
            "answer": 0,
            "explanation": "and se utiliza para condiciones; & combina bits de valores enteros."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b3-l6",
        "section": "3.6",
        "title": "Listas: crear, consultar y recorrer",
        "objectives": [
          "Crear listas ordenadas y consultar elementos mediante índices.",
          "Usar índices positivos, negativos y len() para conocer posiciones y tamaño.",
          "Recorrer una lista con for y procesar cada elemento."
        ],
        "explanation": [
          "Una lista unidimensional guarda varios valores en un orden definido. Se escribe entre corchetes, por ejemplo edades = [18, 21, 19]. A diferencia de una cadena, una lista puede modificarse después de crearla: puedes añadir, cambiar o quitar elementos.",
          "Los índices empiezan en cero: edades[0] consulta el primer elemento y edades[1] el segundo. Los índices negativos cuentan desde el final, así que edades[-1] consulta el último. len(edades) devuelve la cantidad de elementos.",
          "Un bucle for puede recorrer los valores sin que tengas que calcular cada índice. Cuando los datos llegan como texto separado por espacios, split() crea una lista de cadenas; convierte cada valor con int() o float() antes de hacer operaciones numéricas."
        ],
        "example": "edades = [18, 21, 19]\\nprint(edades[0])\\nprint(edades[-1])\\nprint(len(edades))\\nfor edad in edades:\\n    print(edad)",
        "exampleOutput": "18\\n19\\n3\\n18\\n21\\n19",
        "walkthrough": [
          "La lista edades contiene tres números y conserva su orden.",
          "El índice 0 selecciona el primer elemento; -1 selecciona el último.",
          "len() cuenta los elementos y for visita cada valor una vez."
        ],
        "commonMistakes": [
          "Intentar acceder a un índice que no existe, como edades[3] en una lista de tres elementos.",
          "Confundir el índice con el valor almacenado en esa posición.",
          "Sumar cadenas obtenidas con split() sin convertirlas primero a números."
        ],
        "exercise": {
          "id": "b3-e6",
          "title": "Sumar números recibidos en una lista",
          "statement": "Lee una línea con números separados por espacios, conviértelos a enteros, recórrelos con for y muestra la suma.",
          "starterCode": "datos = input()\\nnumeros = datos.split()\\ntotal = 0\\n",
          "solution": "datos = input()\\nnumeros = datos.split()\\ntotal = 0\\nfor texto in numeros:\\n    total += int(texto)\\nprint(total)",
          "tests": [
            {
              "input": ["10 20 30"],
              "expected": "60"
            },
            {
              "input": ["5"],
              "expected": "5"
            },
            {
              "input": ["-2 7"],
              "expected": "5"
            }
          ],
          "hints": [
            "split() convierte la línea de entrada en una lista de cadenas.",
            "Recorre numeros con for y convierte cada texto con int() antes de sumarlo."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Si datos contiene el texto 8 12 4, ¿qué devuelve datos.split()?",
            "options": [
              "Una lista con las cadenas 8, 12 y 4",
              "El texto completo sin cambios",
              "Una lista con los números enteros 8, 12 y 4",
              "El número 12"
            ],
            "answer": 0,
            "explanation": "split() separa el texto y devuelve una lista de cadenas; int() convierte cada elemento cuando necesitas operar con números."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
      },
      {
        "id": "b3-l7",
        "section": "3.7",
        "title": "Modificar, ordenar y procesar listas",
        "objectives": [
          "Añadir, insertar y eliminar elementos mediante métodos de lista.",
          "Diferenciar sort() de sorted() y explicar cuándo usar cada uno.",
          "Comprender comparaciones e intercambios en bubble sort."
        ],
        "explanation": [
          "Las listas son mutables. append() añade al final, insert(posicion, valor) inserta en una posición, remove(valor) elimina la primera coincidencia y pop() elimina por índice y devuelve el elemento. Antes de eliminar o consultar, verifica que el elemento o índice exista.",
          "sort() ordena la lista original y no devuelve una lista nueva; sorted(lista) crea otra secuencia ordenada sin modificar la fuente. Ambos pueden recibir reverse=True para invertir el orden. Elige sort() cuando quieras modificar la colección y sorted() cuando necesites conservarla.",
          "Bubble sort es un algoritmo didáctico que compara elementos vecinos y los intercambia cuando están desordenados. En cada pasada completa, el mayor valor de la parte pendiente termina al final de esa parte. No es eficiente para colecciones grandes, pero ayuda a practicar índices y comparaciones.",
          "Primero observa una sola pasada con [5, 2, 4]. Se compara 5 con 2; como 5 es mayor, se intercambian y la lista queda [2, 5, 4]. Después se compara 5 con 4 y queda [2, 4, 5]. El valor mayor ya llegó al final.",
          "En el ejercicio, el bucle exterior repite las pasadas y el interior compara cada valor con el siguiente. range(len(numeros) - 1 - pasada) reduce el recorrido porque la parte final ya quedó ordenada. Usa indice + 1 solo mientras exista un vecino a la derecha.",
        ],
        "example": "colores = [\"azul\", \"rojo\", \"verde\"]\ncolores.append(\"negro\")\ncolores.insert(1, \"blanco\")\nretirado = colores.pop()\ncolores.sort()\nprint(colores)\nprint(retirado)\n\n# Una pasada de bubble sort\nnumeros = [5, 2, 4]\nfor indice in range(len(numeros) - 1):\n    if numeros[indice] > numeros[indice + 1]:\n        temporal = numeros[indice]\n        numeros[indice] = numeros[indice + 1]\n        numeros[indice + 1] = temporal\nprint(numeros)",
        "exampleOutput": "['azul', 'blanco', 'rojo', 'verde']\nnegro\n[2, 4, 5]",
        "walkthrough": [
          "append() añade negro al final de la lista.",
          "insert(1, ...) coloca blanco en la segunda posición.",
          "pop() retira y devuelve el último valor; sort() ordena los restantes.",
          "En la pasada guiada se compara 5 con 2; el intercambio deja [2, 5, 4].",
          "Después se compara 5 con 4 y queda [2, 4, 5]; el bucle exterior repetirá el recorrido en el ejercicio completo.",
        ],
        "commonMistakes": [
          "Esperar que sorted() modifique la lista original.",
          "Confundir pop(), que devuelve un elemento, con remove(), que busca un valor.",
          "Intercambiar dos valores sin guardar temporalmente uno de ellos.",
          "Intentar comparar con indice + 1 cuando ya no existe un vecino a la derecha.",
        ],
        "exercise": {
          "id": "b3-e7",
          "title": "Ordenar con bubble sort",
          "statement": "Completa el ordenamiento por burbuja para ordenar [5, 2, 4, 1] de menor a mayor y muestra la lista final.",
          "starterCode": "numeros = [5, 2, 4, 1]\nfor pasada in range(len(numeros) - 1):\n    for indice in range(len(numeros) - 1 - pasada):\n        # compara e intercambia vecinos\n        pass\n",
          "solution": "numeros = [5, 2, 4, 1]\nfor pasada in range(len(numeros)):\n    for indice in range(len(numeros) - 1 - pasada):\n        if numeros[indice] > numeros[indice + 1]:\n            temporal = numeros[indice]\n            numeros[indice] = numeros[indice + 1]\n            numeros[indice + 1] = temporal\nprint(numeros)",
          "tests": [
            {
              "input": [],
              "expected": "[1, 2, 4, 5]"
            }
          ],
          "hints": [
            "El bucle interior compara numeros[indice] con numeros[indice + 1].",
            "Intercambia solo cuando el valor de la izquierda sea mayor que el de la derecha.",
            "Guarda el primer valor en temporal antes de sobrescribirlo.",
            "La parte final ya ordenada se acorta en cada pasada mediante - pasada.",
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué método ordena una lista modificando el mismo objeto?",
            "options": [
              "sort()",
              "sorted()",
              "append()",
              "remove()"
            ],
            "answer": 0,
            "explanation": "sort() modifica la lista; sorted() devuelve una lista nueva."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b3-l9",
        "section": "3.7 práctica",
        "title": "Laboratorio integrador: analizar una tabla de calificaciones",
        "objectives": [
          "Representar una tabla mediante una lista de listas.",
          "Recorrer filas y valores con bucles anidados.",
          "Contar resultados que cumplen una condición."
        ],
        "explanation": [
          "Una lista de listas permite organizar datos en filas y columnas. Por ejemplo, cada fila puede representar las notas de un estudiante y cada posición una evaluación. Los índices empiezan en cero: notas[1][0] consulta el primer valor de la segunda fila.",
          "El primer bucle recorre las filas y el segundo recorre cada valor de la fila actual. Esta estructura permite calcular totales, promedios, máximos o cantidades que cumplen una condición sin escribir una instrucción diferente para cada celda.",
          "Una condición dentro del bucle permite contar solo los datos que cumplen una regla. En este laboratorio se considera aprobada una nota mayor o igual a 70. Prueba también una matriz con filas de distinta longitud y comprueba cómo cambia el resultado."
        ],
        "example": "notas = [[80, 90], [65, 75]]\naprobadas = 0\nfor fila in notas:\n    for nota in fila:\n        if nota >= 70:\n            aprobadas += 1\nprint(aprobadas)",
        "exampleOutput": "3",
        "walkthrough": [
          "notas contiene dos filas y cada fila contiene dos calificaciones.",
          "El bucle exterior obtiene una fila; el interior examina cada nota.",
          "La condición cuenta 80, 90 y 75 porque son mayores o iguales a 70."
        ],
        "commonMistakes": [
          "Recorrer solo la lista exterior y olvidar el segundo bucle.",
          "Comparar una fila completa con 70 en lugar de comparar cada nota."
        ],
        "exercise": {
          "id": "b3-e9",
          "title": "Contar las calificaciones aprobadas",
          "statement": "Utiliza la matriz [[70, 85], [60, 95]] y dos bucles for para contar cuántas notas son mayores o iguales a 70. Imprime el total.",
          "starterCode": "notas = [[70, 85], [60, 95]]\naprobadas = 0\n",
          "solution": "notas = [[70, 85], [60, 95]]\naprobadas = 0\nfor fila in notas:\n    for nota in fila:\n        if nota >= 70:\n            aprobadas += 1\nprint(aprobadas)",
          "tests": [
            {
              "input": [],
              "expected": "3"
            }
          ],
          "hints": [
            "El primer for recorre cada fila.",
            "El segundo for recorre las notas de la fila actual.",
            "Incrementa el contador solo cuando nota >= 70."
          ],
          "difficulty": "medio",
          "xp": 25,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Si notas = [[80, 90], [65, 75]], ¿qué devuelve notas[1][0]?",
            "options": [
              "90",
              "65",
              "75",
              "80"
            ],
            "answer": 1,
            "explanation": "El primer índice selecciona la segunda fila; el segundo selecciona su primer elemento, que es 65."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 60
      },
      {
        "id": "b3-l8",
        "section": "3.8",
        "title": "Evaluación del módulo 3: lógica, ciclos y listas",
        "objectives": [
          "Combinar comparaciones y operadores lógicos.",
          "Elegir estructuras de repetición adecuadas.",
          "Procesar colecciones y comprender el ordenamiento."
        ],
        "explanation": [
          "Esta evaluación integra comparaciones, operadores lógicos, control de flujo y listas. Para responder, calcula valores y sigue el orden real de ejecución; no supongas que Python evalúa todas las ramas de un condicional.",
          "Al trabajar con listas, identifica si necesitas consultar una posición, recorrer elementos, modificar contenido u ordenar. Si el problema requiere intercambiar vecinos, revisa los límites del recorrido y la condición de intercambio.",
          "El reto combina una lista, un bucle y una condición. Ejecuta un caso pequeño, compara la salida con lo esperado y corrige primero los límites o condiciones antes de modificar otras partes del programa."
        ],
        "example": "datos = [4, 1, 3]\nfor numero in datos:\n    if numero >= 3:\n        print(\"alto\")\n    else:\n        print(\"bajo\")",
        "exampleOutput": "alto\nbajo\nalto",
        "walkthrough": [
          "for recorre los elementos en orden.",
          "La condición separa valores mayores o iguales a tres.",
          "La salida conserva el orden de la lista."
        ],
        "commonMistakes": [
          "No considerar que range() excluye el límite final.",
          "Usar operadores bit a bit para una condición booleana simple."
        ],
        "exercise": {
          "id": "b3-e8",
          "title": "Clasificar una lista",
          "statement": "Recorre [2, 5, 1, 8]. Imprime Par para números pares e Impar para los demás.",
          "starterCode": "datos = [2, 5, 1, 8]\n",
          "solution": "datos = [2, 5, 1, 8]\nfor numero in datos:\n    if numero % 2 == 0:\n        print(\"Par\")\n    else:\n        print(\"Impar\")",
          "tests": [
            {
              "input": [],
              "expected": "Par\nImpar\nImpar\nPar"
            }
          ],
          "hints": [
            "Recorre la lista con for.",
            "Un número es par cuando el residuo al dividirlo entre dos es cero."
          ],
          "difficulty": "facil",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Si datos = [\"a\", \"b\", \"c\"], ¿qué devuelve datos[1]?",
            "options": [
              "\"a\"",
              "\"c\"",
              "\"1\"",
              "\"b\""
            ],
            "answer": 3,
            "explanation": "El índice uno representa el segundo elemento."
          },
          {
            "prompt": "¿Qué hace continue dentro de un bucle?",
            "options": [
              "Salta el resto de la iteración actual y continúa con la siguiente",
              "Termina el programa",
              "Finaliza el bucle inmediatamente",
              "Vuelve al inicio del archivo"
            ],
            "answer": 0,
            "explanation": "continue omite las instrucciones restantes de la vuelta y avanza a la siguiente."
          },
          {
            "prompt": "¿Qué operador bit a bit conserva los bits que son 1 en ambos operandos?",
            "options": [
              "&",
              "|",
              "^",
              "~"
            ],
            "answer": 0,
            "explanation": "El AND bit a bit conserva las posiciones que contienen un uno en ambos operandos."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 45
      },
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
        "title": "Crear y llamar funciones",
        "objectives": [
          "Definir una función con def.",
          "Llamar la función para ejecutar su bloque.",
          "Explicar por qué una función evita repetir código."
        ],
        "explanation": [
          "Una función agrupa instrucciones bajo un nombre. Se define con def, un nombre descriptivo, paréntesis y dos puntos; su cuerpo lleva sangría. Definirla no ejecuta su contenido: para ejecutarlo hay que llamarla.",
          "Las funciones permiten dividir un problema grande en tareas pequeñas. Un programa que calcula, valida y muestra datos puede organizar cada responsabilidad en una función separada.",
          "Una función puede no recibir datos ni devolver un resultado. Incluso en ese caso, debe tener un propósito claro y un nombre que describa la acción que realiza."
        ],
        "example": "def mostrar_bienvenida():\n    print(\"Bienvenido al sistema\")\n\nmostrar_bienvenida()",
        "exampleOutput": "Bienvenido al sistema",
        "walkthrough": [
          "def crea la función y almacena sus instrucciones.",
          "La llamada mostrar_bienvenida() ejecuta el bloque."
        ],
        "commonMistakes": [
          "Esperar que una función se ejecute solo por haberla definido.",
          "Olvidar los paréntesis cuando se quiere llamar a una función."
        ],
        "exercise": {
          "id": "b4-e1",
          "title": "Crear un saludo reutilizable",
          "statement": "Define una función llamada mostrar_mensaje que imprima Python se aprende practicando. Después llama la función.",
          "starterCode": "# define la función\n",
          "solution": "def mostrar_mensaje():\n    print(\"Python se aprende practicando\")\n\nmostrar_mensaje()",
          "tests": [
            {
              "input": [],
              "expected": "Python se aprende practicando"
            }
          ],
          "hints": [
            "Usa def seguido del nombre y paréntesis.",
            "Llama a la función después de definirla."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué palabra clave inicia una definición de función en Python?",
            "options": [
              "function",
              "def",
              "func",
              "return"
            ],
            "answer": 1,
            "explanation": "Las funciones se definen mediante la palabra clave def."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b4-l2",
        "section": "4.2",
        "title": "Parámetros y argumentos",
        "objectives": [
          "Distinguir parámetros de argumentos.",
          "Usar argumentos posicionales y con nombre.",
          "Definir parámetros con valores predeterminados."
        ],
        "explanation": [
          "Un parámetro es el nombre que aparece en la definición y representa el dato que recibirá la función. Un argumento es el valor concreto que entregamos al llamarla. Separar ambos conceptos permite escribir una solución reutilizable.",
          "Los argumentos posicionales se asignan según el orden de los parámetros. También puedes indicar el nombre del parámetro, por ejemplo calcular_total(precio=100, cantidad=2); esta llamada resulta más clara cuando hay varios valores.",
          "Un parámetro puede tener un valor predeterminado. En def calcular_total(precio, cantidad=1), cantidad vale uno cuando no se indica. Los parámetros obligatorios deben colocarse antes de los que tienen valor predeterminado, y una llamada puede sobrescribir ese valor."
        ],
        "example": "def calcular_total(precio, cantidad=1):\n    return precio * cantidad\n\nprint(calcular_total(2500))\nprint(calcular_total(precio=2500, cantidad=3))",
        "exampleOutput": "2500\n7500",
        "walkthrough": [
          "cantidad tiene el valor predeterminado uno.",
          "La primera llamada solo entrega precio y utiliza ese valor.",
          "La segunda llamada especifica cantidad=3 y calcula otro total."
        ],
        "commonMistakes": [
          "Olvidar un argumento obligatorio al llamar una función.",
          "Colocar un parámetro obligatorio después de uno con valor predeterminado."
        ],
        "exercise": {
          "id": "b4-e2",
          "title": "Calcular entradas con cantidad predeterminada",
          "statement": "Define calcular_entradas(precio, cantidad=1) para devolver el total. Muestra el costo de una entrada de 2500 y de tres entradas de 2500.",
          "starterCode": "# define calcular_entradas\n",
          "solution": "def calcular_entradas(precio, cantidad=1):\n    return precio * cantidad\n\nprint(calcular_entradas(2500))\nprint(calcular_entradas(2500, 3))",
          "tests": [
            {
              "input": [],
              "expected": "2500\n7500"
            }
          ],
          "hints": [
            "Declara cantidad=1 en la cabecera de la función.",
            "Utiliza return y llama la función una vez sin cantidad y otra vez con tres."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "En def saludar(nombre):, ¿qué representa nombre?",
            "options": [
              "Un argumento ya enviado",
              "Un parámetro de la función",
              "El valor que imprime Python automáticamente",
              "Un módulo importado"
            ],
            "answer": 1,
            "explanation": "nombre es el parámetro; el argumento se proporciona cuando se llama a saludar()."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b4-l3",
        "section": "4.3",
        "title": "Devolver resultados con return",
        "objectives": [
          "Distinguir print() de return.",
          "Guardar el valor devuelto por una función.",
          "Usar el resultado de una función en otra expresión."
        ],
        "explanation": [
          "print() muestra un valor en la consola; return entrega un resultado a la parte del programa que llamó a la función. Si solo imprimimos dentro de una función, no podemos reutilizar ese texto como resultado numérico.",
          "Cuando Python encuentra return, termina la ejecución de esa llamada y devuelve el valor. Si no se escribe return, la función devuelve None de manera implícita.",
          "Una función que calcula debería normalmente devolver el resultado en vez de imprimirlo. Así puede utilizarse en otros cálculos, guardarse en una variable o comprobarse en una prueba."
        ],
        "example": "def area_rectangulo(ancho, alto):\n    return ancho * alto\n\narea = area_rectangulo(5, 3)\nprint(area + 2)",
        "exampleOutput": "17",
        "walkthrough": [
          "La función devuelve 15, no lo imprime directamente.",
          "El programa guarda el valor en area y luego calcula 15 + 2."
        ],
        "commonMistakes": [
          "Confundir mostrar un resultado con devolverlo.",
          "Escribir instrucciones después de return esperando que se ejecuten en la misma llamada."
        ],
        "exercise": {
          "id": "b4-e3",
          "title": "Devolver un descuento",
          "statement": "Crea una función descuento(precio, rebaja) que devuelva el precio menos la rebaja. Imprime el resultado de descuento(5000, 750).",
          "starterCode": "# define la función\n",
          "solution": "def descuento(precio, rebaja):\n    return precio - rebaja\n\nprint(descuento(5000, 750))",
          "tests": [
            {
              "input": [],
              "expected": "4250"
            }
          ],
          "hints": [
            "La función debe devolver el cálculo con return.",
            "Usa print() al llamar la función para mostrar el valor."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué permite hacer return en una función?",
            "options": [
              "Mostrar siempre el valor en pantalla",
              "Entregar un valor a quien llamó a la función",
              "Repetir la función automáticamente",
              "Importar otro archivo"
            ],
            "answer": 1,
            "explanation": "return devuelve un valor que el programa puede guardar o utilizar en otra expresión."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 16
      },
      {
        "id": "b4-l4",
        "section": "4.4",
        "title": "Variables locales y alcance",
        "objectives": [
          "Identificar dónde existe una variable local.",
          "Evitar depender de variables globales innecesarias.",
          "Pasar datos explícitamente mediante parámetros."
        ],
        "explanation": [
          "El alcance (scope) determina en qué parte del programa puede utilizarse un nombre. Una variable creada dentro de una función es local y normalmente solo existe durante esa llamada.",
          "Las variables locales ayudan a aislar las tareas. En vez de modificar variables globales desde muchas partes del programa, es preferible pasar los datos necesarios como parámetros y devolver el resultado con return.",
          "Un nombre definido fuera de la función puede estar disponible dentro de ella para lectura, pero modificar estado global suele hacer el código más difícil de probar. Mantener los datos cerca de la tarea que los usa reduce dependencias."
        ],
        "example": "def calcular_iva(precio):\n    iva = precio * 0.13\n    return precio + iva\n\nprint(calcular_iva(1000))",
        "exampleOutput": "1130.0",
        "walkthrough": [
          "precio entra como parámetro.",
          "iva es local a la función; return entrega el total al programa principal."
        ],
        "commonMistakes": [
          "Intentar utilizar fuera de la función una variable que se creó dentro de ella.",
          "Usar global para compartir datos cuando bastaría con un parámetro o un retorno."
        ],
        "exercise": {
          "id": "b4-e4",
          "title": "Mantener el cálculo dentro de la función",
          "statement": "Define convertir_minutos(horas) que cree una variable local minutos y devuelva horas multiplicadas por 60. Imprime el resultado para 2 horas.",
          "starterCode": "# define convertir_minutos\n",
          "solution": "def convertir_minutos(horas):\n    minutos = horas * 60\n    return minutos\n\nprint(convertir_minutos(2))",
          "tests": [
            {
              "input": [],
              "expected": "120"
            }
          ],
          "hints": [
            "minutos se crea dentro de la función.",
            "Devuelve el resultado para poder imprimirlo fuera."
          ],
          "difficulty": "medio",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Una variable creada dentro de una función y usada solamente allí suele ser...",
            "options": [
              "Global",
              "Un argumento obligatorio",
              "Local",
              "Un módulo"
            ],
            "answer": 2,
            "explanation": "Una variable local pertenece al ámbito de la función en la que se define."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b4-l5",
        "section": "4.5",
        "title": "Tuplas: agrupar valores inmutables",
        "objectives": [
          "Crear tuplas y consultar elementos por índice.",
          "Explicar la inmutabilidad de una tupla.",
          "Desempaquetar una tupla en variables."
        ],
        "explanation": [
          "Una tupla agrupa valores en un orden fijo y suele escribirse entre paréntesis, por ejemplo coordenada = (10, 20). Sus índices comienzan en cero, igual que los de una lista, por lo que puedes consultar cada elemento mediante su posición.",
          "La característica fundamental es que una tupla es inmutable: no permite reemplazar, agregar o eliminar directamente sus elementos después de crearla. Resulta útil para agrupar datos relacionados que deben mantenerse estables, como coordenadas o medidas.",
          "El desempaquetado asigna cada elemento a una variable según su posición: x, y = coordenada. La cantidad de nombres debe coincidir con la cantidad de valores, salvo que se utilice una técnica de desempaquetado extendido."
        ],
        "example": "coordenada = (10, 20)\nx, y = coordenada\nprint(x)\nprint(y)",
        "exampleOutput": "10\n20",
        "walkthrough": [
          "La tupla guarda dos valores ordenados.",
          "El primer valor se asigna a x.",
          "El segundo valor se asigna a y."
        ],
        "commonMistakes": [
          "Intentar cambiar un elemento de la tupla.",
          "Desempaquetar variables en un orden distinto al de los valores."
        ],
        "exercise": {
          "id": "b4-e5",
          "title": "Desempaquetar una coordenada",
          "statement": "Crea punto = (12, 7), desempaquétalo en x e y e imprime ambos valores.",
          "starterCode": "punto = (12, 7)\n",
          "solution": "punto = (12, 7)\nx, y = punto\nprint(x)\nprint(y)",
          "tests": [
            {
              "input": [],
              "expected": "12\n7"
            }
          ],
          "hints": [
            "Declara x e y en el mismo orden de la tupla.",
            "Imprime primero x y después y."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué característica distingue a una tupla de una lista?",
            "options": [
              "Solo almacena enteros",
              "No conserva el orden",
              "Una tupla no permite modificar sus elementos después de crearla",
              "Siempre tiene dos elementos"
            ],
            "answer": 2,
            "explanation": "Las tuplas son secuencias ordenadas e inmutables."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b4-l6",
        "section": "4.6",
        "title": "Diccionarios: claves, valores y registros",
        "objectives": [
          "Crear diccionarios con claves y valores.",
          "Consultar y actualizar registros mediante claves.",
          "Procesar una lista de diccionarios con un bucle."
        ],
        "explanation": [
          "Un diccionario relaciona claves con valores y representa datos con atributos identificables, como nombre, precio y cantidad. Se escribe entre llaves; cada clave identifica un dato y las claves de un mismo diccionario son únicas.",
          "Puedes consultar registro[\"nombre\"], actualizar un valor con registro[\"precio\"] = 700 o utilizar get(\"stock\", 0) cuando una clave podría faltar. Si accedes mediante corchetes a una clave inexistente, Python genera KeyError.",
          "Una lista de diccionarios representa varios registros con la misma estructura. Un bucle for puede recorrer cada producto y calcular su importe usando precio por cantidad; esta combinación aparece en inventarios, listas de estudiantes y catálogos."
        ],
        "example": "productos = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10},\n    {\"nombre\": \"Mouse\", \"precio\": 6500, \"cantidad\": 1}\n]\ntotal = 0\nfor producto in productos:\n    subtotal = producto[\"precio\"] * producto[\"cantidad\"]\n    total += subtotal\n    print(f\"{producto['nombre']}: {subtotal}\")\nprint(f\"Inventario: {total}\")",
        "exampleOutput": "Cuaderno: 3600\nLapiz: 2000\nMouse: 6500\nInventario: 12100",
        "walkthrough": [
          "Cada diccionario representa un producto con las mismas tres claves.",
          "for obtiene un registro por vuelta y calcula precio por cantidad.",
          "El acumulador suma cada subtotal y presenta el valor completo."
        ],
        "commonMistakes": [
          "Usar una clave distinta de la que existe en el registro.",
          "Sumar solo el precio unitario y olvidar multiplicarlo por la cantidad."
        ],
        "exercise": {
          "id": "b4-e6",
          "title": "Calcular el valor de varios productos",
          "statement": "Crea dos productos como diccionarios dentro de una lista: Cuaderno cuesta 900 y hay 4; Lápiz cuesta 200 y hay 10. Recorre la lista y muestra el valor total del inventario.",
          "starterCode": "productos = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10}\n]\ntotal = 0\n",
          "solution": "productos = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10}\n]\ntotal = 0\nfor producto in productos:\n    total += producto[\"precio\"] * producto[\"cantidad\"]\nprint(total)",
          "tests": [
            {
              "input": [],
              "expected": "5600"
            }
          ],
          "hints": [
            "Recorre productos con for producto in productos.",
            "Suma precio por cantidad en cada vuelta."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué estructura permite consultar un valor mediante una clave descriptiva?",
            "options": [
              "Una tupla",
              "Un rango",
              "Una cadena",
              "Un diccionario"
            ],
            "answer": 3,
            "explanation": "Los diccionarios relacionan claves con valores y permiten consultar por la clave."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b4-l7",
        "section": "4.7",
        "title": "Excepciones y manejo de errores",
        "objectives": [
          "Distinguir errores de sintaxis de excepciones durante la ejecución.",
          "Manejar ValueError, KeyError e IndexError con bloques except específicos.",
          "Utilizar else y finally para completar el control de errores."
        ],
        "explanation": [
          "Una excepción interrumpe el flujo normal de ejecución. ValueError puede aparecer al convertir texto no numérico en entero; KeyError al consultar una clave inexistente en un diccionario; IndexError al acceder a una posición que no existe en una lista.",
          "try contiene instrucciones que podrían fallar y except captura el tipo de excepción esperado. Puedes utilizar varios bloques except para responder de manera distinta a cada problema. Evita un except general que oculte defectos reales.",
          "else se ejecuta cuando el bloque try termina sin excepción; finally se ejecuta al final tanto si ocurrió un error como si no. Esta estructura permite separar el procesamiento correcto, los mensajes de error y las tareas que siempre deben completarse."
        ],
        "example": "registro = {\"edad\": \"veinte\"}\ntry:\n    edad = int(registro[\"edad\"])\nexcept KeyError:\n    print(\"Falta el campo edad\")\nexcept ValueError:\n    print(\"La edad debe ser numérica\")\nelse:\n    print(f\"Edad: {edad}\")\nfinally:\n    print(\"Validación finalizada\")",
        "exampleOutput": "La edad debe ser numérica\nValidación finalizada",
        "walkthrough": [
          "try intenta leer el campo y convertirlo a entero.",
          "ValueError activa el bloque que explica qué tipo de dato se esperaba.",
          "finally presenta su mensaje aunque la conversión no haya funcionado."
        ],
        "commonMistakes": [
          "Capturar todos los errores con except: sin distinguir el motivo.",
          "Pensar que else se ejecuta cuando ocurre una excepción."
        ],
        "exercise": {
          "id": "b4-e7",
          "title": "Manejar una clave inexistente",
          "statement": "Intenta consultar la clave edad en el diccionario persona = {\"nombre\": \"Ana\"}. Si falta la clave, captura KeyError e imprime Dato no encontrado.",
          "starterCode": "persona = {\"nombre\": \"Ana\"}\n",
          "solution": "persona = {\"nombre\": \"Ana\"}\ntry:\n    print(persona[\"edad\"])\nexcept KeyError:\n    print(\"Dato no encontrado\")",
          "tests": [
            {
              "input": [],
              "expected": "Dato no encontrado"
            }
          ],
          "hints": [
            "La consulta persona[\"edad\"] puede generar KeyError.",
            "Coloca la consulta dentro de try y captura KeyError."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué excepción ocurre normalmente al ejecutar int(\"hola\")?",
            "options": [
              "IndexError",
              "KeyError",
              "FileNotFoundError",
              "ValueError"
            ],
            "answer": 3,
            "explanation": "ValueError aparece cuando el contenido no es válido para la conversión."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
      },
      {
        "id": "b4-l9",
        "section": "4.7 práctica",
        "title": "Laboratorio integrador: calcular un inventario con funciones",
        "objectives": [
          "Representar productos mediante una lista de diccionarios.",
          "Crear una función con un parámetro predeterminado.",
          "Recorrer los registros y acumular un total."
        ],
        "explanation": [
          "Una aplicación puede guardar varios productos como una lista de diccionarios. Cada diccionario conserva las mismas claves, como nombre, precio y cantidad; esto permite recorrer los registros sin crear una variable diferente para cada producto.",
          "Una función puede recibir un producto y un impuesto. Si el parámetro impuesto tiene un valor predeterminado, la llamada puede omitirlo y utilizar la tasa establecida. La función devuelve un resultado para que el programa principal pueda acumularlo.",
          "El bucle recorre la lista, llama a la función para cada registro y suma los resultados. Separar el cálculo en una función facilita probarlo y reutilizarlo. Comprueba el total con una operación manual antes de presentar el informe."
        ],
        "example": "def valor_con_iva(producto, impuesto=0.13):\n    subtotal = producto[\"precio\"] * producto[\"cantidad\"]\n    return subtotal * (1 + impuesto)\n\nproductos = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10}\n]\ntotal = 0\nfor producto in productos:\n    total += valor_con_iva(producto)\nprint(f\"Valor con impuesto: {total:.2f}\")",
        "exampleOutput": "Valor con impuesto: 6328.00",
        "walkthrough": [
          "Cada diccionario contiene el nombre, precio y cantidad de un producto.",
          "valor_con_iva() calcula el subtotal y aplica el 13% predeterminado.",
          "El bucle suma el valor de cada registro y presenta el importe acumulado."
        ],
        "commonMistakes": [
          "Olvidar que el parámetro impuesto ya tiene un valor predeterminado.",
          "Sumar solo el precio unitario y omitir la cantidad disponible."
        ],
        "exercise": {
          "id": "b4-e9",
          "title": "Calcular el valor total con impuesto",
          "statement": "Define valor_con_iva(producto, impuesto=0.13), que devuelva precio por cantidad más el 13%. Recorre los dos productos del ejemplo y muestra el total con dos decimales.",
          "starterCode": "productos = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10}\n]\n",
          "solution": "def valor_con_iva(producto, impuesto=0.13):\n    subtotal = producto[\"precio\"] * producto[\"cantidad\"]\n    return subtotal * (1 + impuesto)\n\nproductos = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10}\n]\ntotal = 0\nfor producto in productos:\n    total += valor_con_iva(producto)\nprint(f\"{total:.2f}\")",
          "tests": [
            {
              "input": [],
              "expected": "6328.00"
            }
          ],
          "hints": [
            "Define la función antes de recorrer los productos.",
            "Multiplica precio por cantidad antes de aplicar el impuesto.",
            "Suma el resultado de la función para cada producto."
          ],
          "difficulty": "medio",
          "xp": 25,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué hace el parámetro impuesto=0.13 en valor_con_iva(producto, impuesto=0.13)?",
            "options": [
              "Permite omitir impuesto en la llamada y utilizar 0.13",
              "Obliga a que cada llamada entregue un segundo argumento",
              "Convierte el producto en un diccionario",
              "Hace que la función se ejecute dos veces"
            ],
            "answer": 0,
            "explanation": "Un parámetro predeterminado se utiliza cuando la llamada no entrega un valor para ese argumento."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 65
      },
      {
        "id": "b4-l8",
        "section": "4.8",
        "title": "Evaluación del módulo 4: funciones y datos estructurados",
        "objectives": [
          "Diseñar funciones con parámetros y return.",
          "Seleccionar listas, tuplas y diccionarios según los datos.",
          "Manejar excepciones y validar resultados."
        ],
        "explanation": [
          "Esta evaluación integra funciones, parámetros, return, alcance, tuplas, diccionarios y excepciones. Una solución puede utilizar una función para calcular, un diccionario para representar un registro y una tupla para agrupar valores relacionados.",
          "Al leer un problema, identifica qué datos recibe la función, qué nombres están disponibles en cada ámbito y qué resultado devuelve. Cuando una clave falta o una conversión falla, reconoce la excepción correspondiente.",
          "El reto calcula el valor de un producto mediante un diccionario y una función. Revisa los argumentos y compara el resultado con una operación manual; una solución de calidad es legible, comprobable y fácil de modificar."
        ],
        "example": "def total_producto(precio, cantidad):\n    return precio * cantidad\n\nproducto = {\"precio\": 900, \"cantidad\": 4}\nprint(total_producto(producto[\"precio\"], producto[\"cantidad\"]))",
        "exampleOutput": "3600",
        "walkthrough": [
          "La función recibe precio y cantidad.",
          "El diccionario conserva los datos.",
          "return devuelve el producto."
        ],
        "commonMistakes": [
          "Consultar una clave que no existe.",
          "Imprimir dentro de una función cuando se requiere devolver un resultado."
        ],
        "exercise": {
          "id": "b4-e8",
          "title": "Procesar un producto",
          "statement": "Define total_producto(precio, cantidad). Guarda precio 900 y cantidad 4 en un diccionario e imprime el total.",
          "starterCode": "",
          "solution": "def total_producto(precio, cantidad):\n    return precio * cantidad\n\nproducto = {\"precio\": 900, \"cantidad\": 4}\nprint(total_producto(producto[\"precio\"], producto[\"cantidad\"]))",
          "tests": [
            {
              "input": [],
              "expected": "3600"
            }
          ],
          "hints": [
            "Define la función antes de llamarla.",
            "Pasa los valores del diccionario como argumentos."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué diferencia hay entre parámetro y argumento?",
            "options": [
              "El parámetro siempre es texto",
              "El parámetro aparece en la definición y el argumento se entrega al llamar la función",
              "El argumento se escribe en def",
              "Significan lo mismo"
            ],
            "answer": 1,
            "explanation": "El parámetro es el nombre declarado; el argumento es el valor enviado."
          },
          {
            "prompt": "¿Qué devuelve return 25?",
            "options": [
              "Lo muestra automáticamente",
              "Repite la función",
              "El valor 25 a quien llamó a la función",
              "Cierra el intérprete"
            ],
            "answer": 2,
            "explanation": "return entrega el valor, pero no lo imprime automáticamente."
          },
          {
            "prompt": "¿Qué bloque captura ValueError?",
            "options": [
              "else ValueError",
              "finally ValueError",
              "if ValueError",
              "except ValueError"
            ],
            "answer": 3,
            "explanation": "Las excepciones se capturan con except y el tipo correspondiente."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 45
      },
      {
        "id": "b4-l10",
        "section": "4.9",
        "title": "Proyecto final obligatorio: gestor de inventario",
        "objectives": [
          "Representar productos y cantidades con diccionarios.",
          "Crear funciones que validen y actualicen registros.",
          "Recorrer cantidades para calcular un total.",
          "Manejar entradas inválidas y excepciones.",
          "Ejecutar y superar seis pruebas automáticas."
        ],
        "explanation": [
          "El proyecto integra las herramientas centrales del curso en un gestor de inventario de consola. Cada producto tiene un nombre y una cantidad. Un diccionario asocia cada nombre con su cantidad y permite actualizar un registro.",
          "La función agregar_producto concentra las reglas: el nombre no puede estar vacío y la cantidad debe ser positiva. La función total_unidades recorre los valores y suma las cantidades. Separar ambas operaciones facilita revisar y reutilizar el código.",
          "El programa recibe datos con input(), convierte la cantidad a entero y controla ValueError cuando la entrada no es numérica. Ejecuta seis casos de prueba y corrige el código hasta superarlos. La finalización se registra después de aprobar también la revisión conceptual."
        ],
        "example": "inventario = {\"Cuaderno\": 3}\n\ndef total_unidades(datos):\n    total = 0\n    for cantidad in datos.values():\n        total += cantidad\n    return total\n\nprint(\"Total:\", total_unidades(inventario))",
        "exampleOutput": "Total: 3",
        "walkthrough": [
          "El diccionario guarda el nombre y la cantidad.",
          "La función recorre los valores y suma las unidades.",
          "return devuelve el total para mostrarlo."
        ],
        "commonMistakes": [
          "Aceptar nombres vacíos o cantidades cero o negativas.",
          "Usar print() cuando la función debe devolver el total con return.",
          "No manejar ValueError al convertir texto no numérico."
        ],
        "exercise": {
          "id": "b4-e10",
          "title": "Construye y valida el gestor de inventario",
          "statement": "Lee cuántos registros vas a agregar. Para cada uno, lee el nombre y la cantidad. Guarda cada producto en un diccionario, acumula las cantidades cuando el nombre se repite, rechaza nombres vacíos y cantidades no positivas o no numéricas, y al final muestra el total de unidades.",
          "starterCode": "inventario = {}\n\ndef agregar_producto(inventario, nombre, cantidad):\n    # Limpia y valida el nombre y la cantidad.\n    # Si el producto existe, acumula las unidades.\n    return False\n\ndef total_unidades(inventario):\n    # Suma las cantidades guardadas.\n    return 0\n\nregistros = int(input())\nfor _ in range(registros):\n    nombre = input()\n    try:\n        cantidad = int(input())\n    except ValueError:\n        print(\"Cantidad no válida\")\n        continue\n    if agregar_producto(inventario, nombre, cantidad):\n        print(f\"{nombre.strip()}: {inventario[nombre.strip()]}\")\n    else:\n        print(\"Datos no válidos\")\n\nprint(\"Total:\", total_unidades(inventario))",
          "solution": "inventario = {}\n\ndef agregar_producto(inventario, nombre, cantidad):\n    nombre = nombre.strip()\n    if not nombre or cantidad <= 0:\n        return False\n    inventario[nombre] = inventario.get(nombre, 0) + cantidad\n    return True\n\ndef total_unidades(inventario):\n    total = 0\n    for cantidad in inventario.values():\n        total += cantidad\n    return total\n\nregistros = int(input())\nfor _ in range(registros):\n    nombre = input()\n    try:\n        cantidad = int(input())\n    except ValueError:\n        print(\"Cantidad no válida\")\n        continue\n    if agregar_producto(inventario, nombre, cantidad):\n        print(f\"{nombre.strip()}: {inventario[nombre.strip()]}\")\n    else:\n        print(\"Datos no válidos\")\n\nprint(\"Total:\", total_unidades(inventario))",
          "tests": [
            {
              "input": [
                "1",
                "Cuaderno",
                "3"
              ],
              "expected": "Cuaderno: 3\nTotal: 3"
            },
            {
              "input": [
                "3",
                "Lapiz",
                "10",
                "Cuaderno",
                "3",
                "Lapiz",
                "2"
              ],
              "expected": "Lapiz: 10\nCuaderno: 3\nLapiz: 12\nTotal: 15"
            },
            {
              "input": [
                "1",
                "",
                "5"
              ],
              "expected": "Datos no válidos\nTotal: 0"
            },
            {
              "input": [
                "1",
                "Cuaderno",
                "0"
              ],
              "expected": "Datos no válidos\nTotal: 0"
            },
            {
              "input": [
                "1",
                "Cuaderno",
                "abc"
              ],
              "expected": "Cantidad no válida\nTotal: 0"
            },
            {
              "input": [
                "1",
                "Cuaderno",
                "-2"
              ],
              "expected": "Datos no válidos\nTotal: 0"
            }
          ],
          "hints": [
            "Normaliza el nombre con strip().",
            "Usa get(nombre, 0) para acumular existencias.",
            "Rechaza cantidades menores o iguales a cero.",
            "Recorre inventario.values() para calcular el total.",
            "Captura ValueError al convertir la cantidad."
          ],
          "difficulty": "dificil",
          "xp": 100,
          "length": 90
        },
        "questions": [
          {
            "prompt": "¿Qué estructura asocia cada nombre de producto con su cantidad?",
            "options": [
              "Una cadena",
              "Una tupla sin nombres",
              "Una lista de caracteres",
              "Un diccionario"
            ],
            "answer": 3,
            "explanation": "Un diccionario asocia claves con valores."
          },
          {
            "prompt": "¿Qué responsabilidad debe reunir agregar_producto()?",
            "options": [
              "Dibujar el inventario",
              "Validar los datos y actualizar el registro",
              "Cerrar el intérprete",
              "Convertir todo a texto"
            ],
            "answer": 1,
            "explanation": "La función centraliza validación y actualización."
          },
          {
            "prompt": "¿Qué condición evita guardar una entrada inválida?",
            "options": [
              "Aceptar cualquier valor",
              "Permitir cantidades negativas",
              "Rechazar nombre vacío o cantidad menor o igual a cero",
              "Convertir el nombre en número"
            ],
            "answer": 2,
            "explanation": "Un producto necesita nombre no vacío y cantidad positiva."
          },
          {
            "prompt": "¿Por qué total_unidades() recorre inventario.values()?",
            "options": [
              "Porque necesita sumar las cantidades",
              "Porque values() elimina productos",
              "Porque ordena nombres",
              "Porque no se pueden consultar claves"
            ],
            "answer": 0,
            "explanation": "values() entrega las cantidades que se deben sumar."
          },
          {
            "prompt": "¿Qué excepción debe capturarse si int() recibe el texto abc?",
            "options": [
              "IndexError",
              "ValueError",
              "KeyError",
              "NameError"
            ],
            "answer": 1,
            "explanation": "ValueError indica que el texto no representa un entero válido."
          }
        ],
        "finalProject": true,
        "estimatedMinutes": 90
      },
      {
        "id": "b4-l11",
        "section": "4.10",
        "title": "Examen final de Python: integración de los cuatro módulos",
        "objectives": [
          "Comprobar programación, algoritmos, Python y ejecución.",
          "Razonar sobre tipos de datos, operadores y entrada/salida.",
          "Interpretar condiciones, ciclos, lógica y listas.",
          "Reconocer funciones, tuplas, diccionarios y excepciones."
        ],
        "explanation": [
          "Este examen integra los aprendizajes de los cuatro módulos. No introduce bibliotecas nuevas ni contenidos avanzados: comprueba que puedes interpretar instrucciones breves, reconocer resultados y elegir soluciones para problemas básicos.",
          "Lee cada fragmento con atención. Sigue las instrucciones en el orden en que Python las ejecuta, identifica el tipo de cada dato y comprueba cómo cambian las variables. Cuando haya un ciclo, anota las iteraciones antes de elegir la salida.",
          "Necesitas al menos 75% para aprobar. Si no alcanzas ese puntaje, revisa las lecciones y el proyecto final, identifica los temas difíciles y vuelve a intentarlo. El resultado queda asociado a tu cuenta mediante la calificación del servidor."
        ],
        "example": "valores = [3, 1, 2]\nvalores.sort()\nprint(valores)",
        "exampleOutput": "[1, 2, 3]",
        "walkthrough": [
          "La lista contiene tres números en un orden inicial.",
          "sort() organiza los elementos de menor a mayor.",
          "print() muestra el contenido actualizado."
        ],
        "commonMistakes": [
          "Responder por intuición sin seguir el orden de ejecución.",
          "Confundir el valor de return con lo que se imprime.",
          "Olvidar que input() produce texto y debe convertirse al operar con números."
        ],
        "exercise": {
          "id": "b4-e11",
          "title": "Lectura de código para el examen final",
          "statement": "Lee el ejemplo y comprueba cómo cambia la lista después de llamar sort(). Este examen se responde en las preguntas; no necesita ejecutar código adicional.",
          "starterCode": "",
          "solution": "",
          "tests": [
            {
              "input": [],
              "expected": "[1, 2, 3]"
            }
          ],
          "hints": [
            "Sigue las instrucciones en orden.",
            "sort() modifica la lista."
          ],
          "difficulty": "medio",
          "xp": 50,
          "length": 45
        },
        "questions": [
          {
            "prompt": "¿Qué característica debe cumplir un algoritmo?",
            "options": [
              "Tener pasos finitos, ordenados y comprensibles",
              "Incluir una interfaz gráfica",
              "Usar solo números",
              "Ejecutarse sin computadora"
            ],
            "answer": 0,
            "explanation": "Un algoritmo describe pasos finitos y ordenados."
          },
          {
            "prompt": "¿Qué componente procesa y ejecuta un programa Python?",
            "options": [
              "El teclado",
              "El sistema de archivos",
              "El intérprete de Python",
              "El monitor"
            ],
            "answer": 2,
            "explanation": "El intérprete procesa las instrucciones Python."
          },
          {
            "prompt": "¿Cuál es el tipo de dato de \"7\" y el de 7?",
            "options": [
              "Ambos int",
              "\"7\" es str y 7 es int",
              "\"7\" es float y 7 es str",
              "Ambos booleanos"
            ],
            "answer": 1,
            "explanation": "Las comillas indican texto; el número sin comillas es entero."
          },
          {
            "prompt": "¿Qué resultado produce 5 // 2?",
            "options": [
              "2",
              "2.5",
              "1",
              "3"
            ],
            "answer": 0,
            "explanation": "La división entera devuelve la parte entera del cociente."
          },
          {
            "prompt": "¿Qué devuelve input() antes de convertir el valor?",
            "options": [
              "Un diccionario",
              "Un entero",
              "Un booleano",
              "Una cadena de texto"
            ],
            "answer": 3,
            "explanation": "input() entrega texto aunque se escriban dígitos."
          },
          {
            "prompt": "¿Qué resultado tiene 8 >= 8?",
            "options": [
              "8",
              "False",
              "True",
              "None"
            ],
            "answer": 2,
            "explanation": "La comparación es verdadera porque 8 es igual a 8."
          },
          {
            "prompt": "¿Qué hace break dentro de un ciclo?",
            "options": [
              "Reinicia el intérprete",
              "Termina el ciclo inmediatamente",
              "Salta a la siguiente función",
              "Convierte la variable a texto"
            ],
            "answer": 1,
            "explanation": "break termina el ciclo que se está ejecutando."
          },
          {
            "prompt": "¿Qué valores produce range(2, 5)?",
            "options": [
              "2, 3, 4",
              "2, 3, 4, 5",
              "1, 2, 3, 4, 5",
              "3, 4, 5"
            ],
            "answer": 0,
            "explanation": "El límite final no se incluye."
          },
          {
            "prompt": "Si valores = [4, 8, 12], ¿qué obtiene valores[-1]?",
            "options": [
              "4",
              "8",
              "Un error siempre",
              "12"
            ],
            "answer": 3,
            "explanation": "El índice -1 consulta el último elemento."
          },
          {
            "prompt": "¿Qué hace bubble sort?",
            "options": [
              "Convierte elementos en texto",
              "Elimina repetidos",
              "Compara vecinos e intercambia los que están desordenados",
              "Agrupa elementos en un diccionario"
            ],
            "answer": 2,
            "explanation": "Bubble sort compara elementos adyacentes e intercambia cuando corresponde."
          },
          {
            "prompt": "¿Cuál es la diferencia entre print() y return?",
            "options": [
              "Ambos cierran la función",
              "print() muestra información y return entrega un valor a quien llamó",
              "return solo usa cadenas",
              "print() devuelve siempre un número"
            ],
            "answer": 1,
            "explanation": "print() muestra en la salida; return devuelve un valor."
          },
          {
            "prompt": "¿Qué excepción puede producir int(\"abc\")?",
            "options": [
              "ValueError",
              "IndexError",
              "KeyError",
              "TypeError"
            ],
            "answer": 0,
            "explanation": "ValueError indica que el texto no representa un entero válido."
          }
        ],
        "assessment": true,
        "finalAssessment": true,
        "estimatedMinutes": 45
      }
   ]
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
        "title": "Leer y escribir archivos de texto",
        "objectives": [
          "Abrir un archivo con open().",
          "Escribir y leer texto usando los modos w y r.",
          "Utilizar with para cerrar el archivo de forma segura."
        ],
        "explanation": [
          "Las variables viven mientras se ejecuta el programa, pero un archivo permite conservar información después de terminarlo. open() abre un archivo y el modo indica qué operación se realizará: w escribe y puede reemplazar el contenido; r lee un archivo existente; a agrega al final.",
          "El bloque with administra el recurso y cierra el archivo al terminar, incluso si ocurre un error. Para leer todo el contenido de un archivo pequeño se puede usar read(); para recorrerlo línea por línea, utiliza un for.",
          "En el laboratorio del navegador, el sistema de archivos de Pyodide es virtual y pertenece al entorno local de ejecución. Este ejercicio enseña lectura y escritura, pero no equivale a guardar progreso en la cuenta ni garantiza que el archivo sobreviva al reinicio del entorno."
        ],
        "example": "with open(\"nota.txt\", \"w\", encoding=\"utf-8\") as archivo:\n    archivo.write(\"Mi primer archivo\\n\")\n\nwith open(\"nota.txt\", \"r\", encoding=\"utf-8\") as archivo:\n    contenido = archivo.read()\n\nprint(contenido.strip())",
        "exampleOutput": "Mi primer archivo",
        "walkthrough": [
          "El primer with abre nota.txt en modo escritura y guarda una línea.",
          "El segundo with lee el archivo y strip() elimina el salto de línea final antes de mostrarlo."
        ],
        "commonMistakes": [
          "Abrir en modo w pensando que agrega contenido; w reemplaza el contenido anterior.",
          "Olvidar cerrar archivos manualmente cuando no se utiliza with."
        ],
        "exercise": {
          "id": "b5-e1",
          "title": "Guardar una nota breve",
          "statement": "Escribe el texto Python es una herramienta en el archivo resumen.txt, vuelve a leer el contenido e imprímelo sin el salto de línea final.",
          "starterCode": "",
          "solution": "with open(\"resumen.txt\", \"w\", encoding=\"utf-8\") as archivo:\n    archivo.write(\"Python es una herramienta\\n\")\n\nwith open(\"resumen.txt\", \"r\", encoding=\"utf-8\") as archivo:\n    contenido = archivo.read()\n\nprint(contenido.strip())",
          "tests": [
            {
              "input": [],
              "expected": "Python es una herramienta"
            }
          ],
          "hints": [
            "Usa w para guardar y r para leer.",
            "strip() retira el salto de línea final."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué modo de open() se usa normalmente para leer un archivo existente?",
            "options": [
              "w",
              "r",
              "a",
              "x"
            ],
            "answer": 1,
            "explanation": "r abre un archivo para lectura."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 18
      },
      {
        "id": "b5-l2",
        "section": "5.2",
        "title": "Validar y recuperar archivos con errores controlados",
        "objectives": [
          "Reconocer FileNotFoundError.",
          "Usar try/except para dar una alternativa cuando falta un archivo.",
          "Distinguir un error esperado de un fallo que requiere corregir el programa."
        ],
        "explanation": [
          "Un archivo puede no existir, tener una ruta incorrecta o no estar disponible. Al intentar abrir un archivo inexistente en modo lectura, Python genera FileNotFoundError.",
          "Puedes capturar ese caso con try/except y ofrecer una acción útil, como indicar que todavía no hay datos o crear un archivo inicial. La respuesta debe ayudar a la persona a entender qué debe hacer después.",
          "No todos los errores se deben ignorar. Captura el caso esperado y deja que los fallos no previstos sigan siendo visibles durante el desarrollo; así no escondes defectos reales."
        ],
        "example": "try:\n    with open(\"configuracion.txt\", \"r\", encoding=\"utf-8\") as archivo:\n        print(archivo.read())\nexcept FileNotFoundError:\n    print(\"Aún no hay configuración guardada\")",
        "exampleOutput": "Aún no hay configuración guardada  (si el archivo no existe)",
        "walkthrough": [
          "try contiene la operación de lectura.",
          "Si no encuentra el archivo, se ejecuta el mensaje del bloque except."
        ],
        "commonMistakes": [
          "Capturar todos los errores con except: sin distinguir el motivo.",
          "Dar por hecho que un archivo existe porque el programa lo creó en otra ejecución."
        ],
        "exercise": {
          "id": "b5-e2",
          "title": "Informar si falta el archivo",
          "statement": "Intenta leer datos.txt. Si no existe, imprime Archivo pendiente; si existe, imprime su contenido.",
          "starterCode": "",
          "solution": "try:\n    with open(\"datos.txt\", \"r\", encoding=\"utf-8\") as archivo:\n        print(archivo.read())\nexcept FileNotFoundError:\n    print(\"Archivo pendiente\")",
          "tests": [
            {
              "input": [],
              "expected": "Archivo pendiente"
            }
          ],
          "hints": [
            "Abre en modo r.",
            "Captura FileNotFoundError y muestra el mensaje solicitado."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué excepción representa el intento de leer un archivo que no existe?",
            "options": [
              "ValueError",
              "IndexError",
              "FileNotFoundError",
              "ZeroDivisionError"
            ],
            "answer": 2,
            "explanation": "FileNotFoundError indica que no se encuentra el archivo o la ruta solicitada."
          },
          {
            "prompt": "¿Por qué se recomienda with open(...) as archivo?",
            "options": [
              "Porque cierra el archivo automáticamente al salir del bloque",
              "Porque hace que todos los archivos sean permanentes",
              "Porque convierte el contenido a números",
              "Porque impide que ocurra cualquier excepción"
            ],
            "answer": 0,
            "explanation": "with administra el ciclo de vida del archivo y garantiza que se cierre al finalizar el bloque."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 18
      },
      {
        "id": "b5-l3",
        "section": "5.3",
        "title": "Diseñar, probar y mejorar un programa",
        "objectives": [
          "Traducir un problema en entradas, procesos y salidas.",
          "Escribir pasos o pseudocódigo antes de programar.",
          "Probar resultados normales, límites y entradas no válidas."
        ],
        "explanation": [
          "Un proyecto pequeño también necesita diseño. Antes de escribir código, explica qué problema resolverá, quién lo usará y qué información debe recibir, calcular y presentar.",
          "El pseudocódigo describe los pasos con palabras sencillas, sin preocuparse todavía por la sintaxis exacta de Python. Luego se transforma cada paso en instrucciones y funciones; esta separación permite revisar la lógica antes de depurar detalles técnicos.",
          "Probar significa comparar el resultado real con el esperado. Incluye casos normales, valores límite y entradas incorrectas. Una prueba que falla no es tiempo perdido: indica qué parte de la solución debes revisar."
        ],
        "example": "precio = 1500\ncantidad = 2\nesperado = 3000\nobtenido = precio * cantidad\nprint(\"Correcto\" if obtenido == esperado else \"Revisar cálculo\")",
        "exampleOutput": "Correcto",
        "walkthrough": [
          "El programa define los datos de prueba y el resultado esperado.",
          "La comparación permite decidir si el cálculo coincide."
        ],
        "commonMistakes": [
          "Probar únicamente un caso sencillo y asumir que todos los demás funcionarán.",
          "Cambiar varias partes del código a la vez sin identificar qué causó el error."
        ],
        "exercise": {
          "id": "b5-e3",
          "title": "Escribir una prueba de cálculo",
          "statement": "Calcula 1250 * 4, guárdalo en obtenido y compara con esperado = 5000. Imprime Prueba superada si coinciden y Prueba fallida en caso contrario.",
          "starterCode": "esperado = 5000\n",
          "solution": "esperado = 5000\nobtenido = 1250 * 4\nif obtenido == esperado:\n    print(\"Prueba superada\")\nelse:\n    print(\"Prueba fallida\")",
          "tests": [
            {
              "input": [],
              "expected": "Prueba superada"
            }
          ],
          "hints": [
            "Calcula el valor antes de compararlo.",
            "Usa if/else para mostrar el resultado de la comprobación."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué aporta escribir pseudocódigo antes de programar?",
            "options": [
              "Evita tener que comprobar resultados",
              "Describe los pasos de la solución sin depender de la sintaxis exacta",
              "Convierte automáticamente el texto en Python",
              "Garantiza que no habrá errores"
            ],
            "answer": 1,
            "explanation": "El pseudocódigo ayuda a ordenar la lógica antes de escribir código ejecutable."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 18
      },
      {
        "id": "b5-l4",
        "section": "5.4",
        "title": "Extensión: guardar y recuperar un inventario en un archivo",
        "objectives": [
          "Guardar registros en un archivo de texto.",
          "Leer el archivo para recuperar productos guardados.",
          "Separar cada nombre y cantidad mediante un formato sencillo."
        ],
        "explanation": [
          "En el proyecto obligatorio el inventario existe mientras el programa está en ejecución. Un archivo permite conservar la información para consultarla después de cerrar el programa.",
          "El modo w abre un archivo para escribir; el modo r abre para leer. La instrucción with administra el archivo y asegura que se cierre al salir del bloque.",
          "Cada producto se guarda en una línea con formato nombre;cantidad. Al leer, split(';') separa los dos datos. Es una introducción a la persistencia con texto plano."
        ],
        "example": "productos = [(\"Cuaderno\", 4), (\"Lapiz\", 10)]\nwith open(\"inventario.txt\", \"w\", encoding=\"utf-8\") as archivo:\n    for nombre, cantidad in productos:\n        archivo.write(f\"{nombre};{cantidad}\\n\")\nwith open(\"inventario.txt\", \"r\", encoding=\"utf-8\") as archivo:\n    print(archivo.read(), end=\"\")",
        "exampleOutput": "Cuaderno;4\nLapiz;10",
        "walkthrough": [
          "La lista contiene productos y cantidades.",
          "El archivo se abre en modo w y se escribe una línea por producto.",
          "Luego se abre en modo r y se muestra el contenido."
        ],
        "commonMistakes": [
          "Abrir en modo w cuando se quería leer y reemplazar el contenido anterior.",
          "No usar el mismo delimitador al guardar y recuperar.",
          "No incluir encoding=\"utf-8\" al trabajar con nombres con tildes."
        ],
        "exercise": {
          "id": "b5-e4",
          "title": "Persistir los productos en un archivo de texto",
          "statement": "Guarda los dos productos en inventario.txt, uno por línea y con formato nombre;cantidad. Después lee el archivo e imprime su contenido.",
          "starterCode": "productos = [(\"Cuaderno\", 4), (\"Lapiz\", 10)]\n",
          "solution": "productos = [(\"Cuaderno\", 4), (\"Lapiz\", 10)]\nwith open(\"inventario.txt\", \"w\", encoding=\"utf-8\") as archivo:\n    for nombre, cantidad in productos:\n        archivo.write(f\"{nombre};{cantidad}\\n\")\nwith open(\"inventario.txt\", \"r\", encoding=\"utf-8\") as archivo:\n    print(archivo.read(), end=\"\")",
          "tests": [
            {
              "input": [],
              "expected": "Cuaderno;4\nLapiz;10"
            }
          ],
          "hints": [
            "Usa with open(..., \"w\", encoding=\"utf-8\") para escribir.",
            "Recorre la lista y escribe una línea por producto.",
            "Abre el mismo archivo con modo r y muestra su contenido."
          ],
          "difficulty": "medio",
          "xp": 30,
          "length": 20
        },
        "questions": [
          {
            "prompt": "¿Qué ventaja ofrece with open(...)?",
            "options": [
              "Cierra el archivo automáticamente al salir del bloque",
              "Convierte el archivo en un diccionario",
              "Impide cualquier error",
              "Siempre elimina los datos anteriores"
            ],
            "answer": 0,
            "explanation": "with administra el recurso y cierra el archivo al salir del bloque."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 25
      }
    ],
    "optional": true
  }
];

export function findCourseModule(moduleId: string): CourseModule | undefined { return courseModules.find((m) => m.id === moduleId); }
export function findCourseLesson(moduleId: string, lessonId: string): CourseLesson | undefined { return findCourseModule(moduleId)?.lessons.find((l) => l.id === lessonId); }
export function gradeQuiz(questions: QuizQuestion[], answers: number[]): { score: number; passed: boolean; correct: number; total: number } {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) if (answers[i] === questions[i].answer) correct++;
  const total = questions.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { score, passed: score >= 75, correct, total };
}
