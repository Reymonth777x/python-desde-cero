export type QuizQuestion = { prompt: string; options: string[]; answer: number; explanation: string };
export type CourseExercise = { id: string; title: string; statement: string; starterCode: string; solution: string; tests: Array<{ input: string[]; expected: string }>; hints: string[]; difficulty: 'facil' | 'medio' | 'dificil'; xp: number; length: number };
export type CourseLesson = { id: string; section: string; title: string; objectives: string[]; explanation: string[]; example: string; exampleOutput: string; walkthrough: string[]; commonMistakes: string[]; exercise: CourseExercise; questions: QuizQuestion[]; assessment?: boolean; estimatedMinutes: number };
export type CourseModule = { id: string; number: string; title: string; summary: string; lessons: CourseLesson[]; optional?: boolean };
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
        "title": "Primer programa, salida y comentarios",
        "objectives": [
          "Utilizar print() para mostrar texto y valores.",
          "Escribir comentarios de una línea con #.",
          "Reconocer errores sencillos de sintaxis."
        ],
        "explanation": [
          "print() muestra información en la consola. El texto debe escribirse entre comillas; los números pueden escribirse sin ellas. Python ejecuta las instrucciones en orden, normalmente de arriba hacia abajo.",
          "Un comentario comienza con # y permite explicar una decisión o dejar una nota para quien lee el programa. Python ignora los comentarios durante la ejecución; una comilla sin cerrar o un paréntesis faltante puede producir un error de sintaxis.",
          "Cuando aparezca un error, lee el mensaje, localiza la línea indicada y revisa nombres, comillas y paréntesis antes de modificar otras partes. Un comentario útil añade contexto y no repite literalmente el código."
        ],
        "example": "# Mensaje de bienvenida\nprint(\"Hola, Python\")\nprint(2026)",
        "exampleOutput": "Hola, Python\n2026",
        "walkthrough": [
          "La primera línea es un comentario.",
          "La primera llamada muestra texto.",
          "La segunda llamada muestra un número."
        ],
        "commonMistakes": [
          "Escribir texto literal sin comillas.",
          "Cambiar mayúsculas en print() o dejar un paréntesis abierto."
        ],
        "exercise": {
          "id": "b1-e4",
          "title": "Presentación en tres líneas",
          "statement": "Muestra Ana, Estoy aprendiendo Python y 2026, cada uno en una línea.",
          "starterCode": "# completa el programa\n",
          "solution": "print(\"Ana\")\nprint(\"Estoy aprendiendo Python\")\nprint(2026)",
          "tests": [
            {
              "input": [],
              "expected": "Ana\nEstoy aprendiendo Python\n2026"
            }
          ],
          "hints": [
            "Usa tres llamadas print().",
            "El año puede mostrarse como número."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué carácter inicia un comentario de una línea en Python?",
            "options": [
              "//",
              "--",
              "**",
              "#"
            ],
            "answer": 3,
            "explanation": "El símbolo # hace que Python ignore el resto de esa línea como comentario."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 40
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
        "id": "b2-l2",
        "section": "2.2",
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
        "section": "2.4",
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
        "id": "b2-l5",
        "section": "2.5",
        "title": "Cadenas y salida formateada",
        "objectives": [
          "Combinar texto con variables y expresiones mediante f-strings.",
          "Limpiar y transformar cadenas con strip(), lower() y title().",
          "Presentar números con formato y etiquetas comprensibles."
        ],
        "explanation": [
          "Una cadena (str) representa texto y ofrece métodos para normalizarlo. strip() elimina espacios al principio y al final; lower() convierte las letras a minúsculas y title() pone en mayúscula inicial cada palabra. Las cadenas son inmutables: estos métodos devuelven un nuevo texto y no cambian la cadena original.",
          "Una f-string comienza con la letra f antes de las comillas. Dentro de llaves puedes insertar variables o expresiones, y la especificación :.2f permite mostrar dos decimales. Esta forma resulta más legible que concatenar manualmente texto y números.",
          "La salida es la conversación del programa con quien lo utiliza. Antes de mostrar un dato, limpia espacios innecesarios, conserva el formato adecuado y añade una etiqueta con su significado. Así evitas nombres inconsistentes y resultados que no se entienden."
        ],
        "example": "entrada = \"  ana perez  \"\nnombre = entrada.strip().title()\nprecio = 1250.5\nprint(nombre)\nprint(f\"Total: {precio:.2f} colones\")",
        "exampleOutput": "Ana Perez\nTotal: 1250.50 colones",
        "walkthrough": [
          "strip() elimina los espacios que rodean el nombre.",
          "title() devuelve una cadena con las palabras capitalizadas.",
          "La f-string presenta el precio con dos decimales y una etiqueta."
        ],
        "commonMistakes": [
          "Creer que strip() elimina los espacios que aparecen entre palabras.",
          "Olvidar la f antes de las comillas o mezclar texto y números con +."
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
                "3"
              ],
              "expected": "4500"
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
      {
        "id": "b2-l8",
        "section": "2.8",
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
        "id": "b3-l2",
        "section": "3.2",
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
        "id": "b3-l3",
        "section": "3.3",
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
        "section": "3.4",
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
        "section": "3.5",
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
        "id": "b3-l6",
        "section": "3.6",
        "title": "Listas: crear, consultar y recorrer",
        "objectives": [
          "Crear listas y consultar elementos mediante índices y cortes.",
          "Representar tablas sencillas mediante listas anidadas.",
          "Recorrer una colección de una y dos dimensiones."
        ],
        "explanation": [
          "Una lista agrupa varios valores y conserva el orden. Se escribe entre corchetes, permite añadir o quitar elementos y puede almacenar otros tipos de datos, incluidas más listas. len(lista) devuelve cuántos elementos contiene la lista exterior.",
          "Los índices comienzan en cero y los negativos cuentan desde el final. En una lista anidada se utilizan dos índices: tabla[fila][columna]. Por ejemplo, notas[1][0] consulta el primer valor de la segunda fila. Esta estructura representa una tabla o matriz pequeña.",
          "Un corte lista[inicio:fin] selecciona desde inicio hasta antes de fin. Para procesar una tabla se utilizan dos bucles: el exterior recorre cada fila y el interior recorre los valores de esa fila. Empieza con matrices pequeñas para no perder de vista qué índice estás consultando."
        ],
        "example": "notas = [[80, 90], [75, 85]]\nprint(notas[0][1])\nprint(notas[1][0])\n\nfor fila in notas:\n    print(fila)",
        "exampleOutput": "90\n75\n[80, 90]\n[75, 85]",
        "walkthrough": [
          "notas contiene dos listas; cada una representa una fila.",
          "notas[0][1] accede a la segunda nota de la primera fila.",
          "El bucle for recorre cada fila y la muestra completa."
        ],
        "commonMistakes": [
          "Olvidar que los índices empiezan en cero.",
          "Intercambiar el índice de fila y el de columna en una lista anidada."
        ],
        "exercise": {
          "id": "b3-e6",
          "title": "Sumar una tabla de calificaciones",
          "statement": "Con la matriz [[80, 90], [75, 85]], utiliza dos bucles for para sumar todas las calificaciones e imprime el total.",
          "starterCode": "notas = [[80, 90], [75, 85]]\ntotal = 0\n",
          "solution": "notas = [[80, 90], [75, 85]]\ntotal = 0\nfor fila in notas:\n    for nota in fila:\n        total += nota\nprint(total)",
          "tests": [
            {
              "input": [],
              "expected": "330"
            }
          ],
          "hints": [
            "El primer for recorre cada fila.",
            "El segundo for recorre las notas de la fila actual y las suma a total."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué índice permite acceder al primer elemento de una lista?",
            "options": [
              "0",
              "1",
              "-1",
              "len(lista)"
            ],
            "answer": 0,
            "explanation": "Los índices de las listas comienzan en cero."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 45
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
          "Bubble sort es un algoritmo didáctico que compara elementos vecinos y los intercambia cuando están desordenados. En cada pasada, un valor grande termina al final de la parte pendiente. No es eficiente para colecciones grandes, pero enseña a coordinar bucles, índices y comparaciones."
        ],
        "example": "colores = [\"azul\", \"rojo\", \"verde\"]\ncolores.append(\"negro\")\ncolores.insert(1, \"blanco\")\nretirado = colores.pop()\ncolores.sort()\nprint(colores)\nprint(retirado)",
        "exampleOutput": "['azul', 'blanco', 'rojo', 'verde']\nnegro",
        "walkthrough": [
          "append() añade negro al final de la lista.",
          "insert(1, ...) coloca blanco en la segunda posición.",
          "pop() retira y devuelve el último valor; sort() ordena los restantes."
        ],
        "commonMistakes": [
          "Esperar que sorted() modifique la lista original.",
          "Confundir pop(), que devuelve un elemento, con remove(), que busca un valor."
        ],
        "exercise": {
          "id": "b3-e7",
          "title": "Ordenar con bubble sort",
          "statement": "Completa el ordenamiento por burbuja para ordenar [5, 2, 4, 1] de menor a mayor y muestra la lista final.",
          "starterCode": "numeros = [5, 2, 4, 1]\nfor pasada in range(len(numeros)):\n    for indice in range(len(numeros) - 1 - pasada):\n        # compara e intercambia vecinos\n        pass\n",
          "solution": "numeros = [5, 2, 4, 1]\nfor pasada in range(len(numeros)):\n    for indice in range(len(numeros) - 1 - pasada):\n        if numeros[indice] > numeros[indice + 1]:\n            temporal = numeros[indice]\n            numeros[indice] = numeros[indice + 1]\n            numeros[indice + 1] = temporal\nprint(numeros)",
          "tests": [
            {
              "input": [],
              "expected": "[1, 2, 4, 5]"
            }
          ],
          "hints": [
            "Compara cada elemento con su vecino derecho.",
            "Intercambia cuando el primero sea mayor, conservando temporalmente uno de los valores."
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
      {
        "id": "b3-l9",
        "section": "3.9",
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
        "id": "b4-l9",
        "section": "4.9",
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
      }
    ]
  },
  {
    "id": "module-5",
    "number": "5",
    "title": "Proyecto aplicado y consolidación (extensión práctica)",
    "summary": "Ampliación opcional del curso: planifica, construye, prueba y mejora un gestor de inventario utilizando los cuatro módulos anteriores.",
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
        "title": "Proyecto final: gestor de inventario en consola",
        "objectives": [
          "Integrar entradas, decisiones, bucles, colecciones y funciones.",
          "Separar las acciones de listar y agregar productos.",
          "Comprobar el programa con más de un caso de prueba."
        ],
        "explanation": [
          "El proyecto final reúne las herramientas principales del curso en una aplicación de consola. Un inventario guarda registros con nombre y cantidad; el usuario puede consultar los productos, agregar existencias y salir del programa.",
          "Para mantener el código entendible, separa las operaciones en funciones. Una función lista productos, otra agrega unidades y el bucle principal muestra el menú y decide qué acción ejecutar. Los datos se conservan en una lista de diccionarios durante esta sesión.",
          "Un proyecto completo no necesita conceptos avanzados para ser útil. Su calidad depende de que resuelva bien el problema, valide entradas, maneje opciones no reconocidas y pueda explicarse. Una posible ampliación es guardar y recuperar los registros usando los archivos de la lección anterior."
        ],
        "example": "inventario = [{\"nombre\": \"Cuaderno\", \"cantidad\": 4}]\n\ndef mostrar_inventario():\n    for producto in inventario:\n        print(producto[\"nombre\"], producto[\"cantidad\"])\n\nmostrar_inventario()",
        "exampleOutput": "Cuaderno 4",
        "walkthrough": [
          "La lista almacena registros como diccionarios.",
          "mostrar_inventario() recorre los productos y presenta sus datos."
        ],
        "commonMistakes": [
          "Mezclar la lógica del menú con todos los cálculos dentro de un solo bloque extenso.",
          "No comprobar qué ocurre cuando el usuario selecciona una opción que no existe."
        ],
        "exercise": {
          "id": "b5-e4",
          "title": "Construir el resumen del inventario",
          "statement": "Crea la lista inventario con dos diccionarios que contengan nombre y cantidad. Recorre la lista e imprime cada nombre y cantidad separados por un espacio.",
          "starterCode": "inventario = [\n    {\"nombre\": \"Cuaderno\", \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"cantidad\": 10}\n]\n",
          "solution": "inventario = [\n    {\"nombre\": \"Cuaderno\", \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"cantidad\": 10}\n]\nfor producto in inventario:\n    print(producto[\"nombre\"], producto[\"cantidad\"])",
          "tests": [
            {
              "input": [],
              "expected": "Cuaderno 4\nLapiz 10"
            }
          ],
          "hints": [
            "Usa un for para recorrer la lista.",
            "Consulta nombre y cantidad en cada diccionario."
          ],
          "difficulty": "medio",
          "xp": 30,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué combinación representa mejor el proyecto de inventario del curso?",
            "options": [
              "Una cadena y una sola operación matemática",
              "Un conjunto sin registros ni nombres",
              "Una lista de diccionarios recorrida mediante funciones y decisiones",
              "Una única variable global con el menú completo"
            ],
            "answer": 2,
            "explanation": "La lista de diccionarios permite guardar productos y propiedades; las funciones y decisiones organizan las operaciones."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 30
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
