export type QuizQuestion = { prompt: string; options: string[]; answer: number; explanation: string };
export type CourseExercise = { id: string; title: string; statement: string; starterCode: string; solution: string; tests: Array<{ input: string[]; expected: string }>; hints: string[]; difficulty: 'facil' | 'medio' | 'dificil'; xp: number; length: number };
export type CourseLesson = { id: string; section: string; title: string; objectives: string[]; explanation: string[]; example: string; exampleOutput: string; walkthrough: string[]; commonMistakes: string[]; exercise: CourseExercise; questions: QuizQuestion[]; assessment?: boolean; estimatedMinutes: number };
export type CourseModule = { id: string; number: string; title: string; summary: string; lessons: CourseLesson[] };
export const courseModules: CourseModule[] = [
  {
    "id": "module-1",
    "number": "1",
    "title": "Fundamentos y primer programa",
    "summary": "Comprende qué es un programa, escribe instrucciones, usa variables y tipos básicos, realiza cálculos y recibe datos del usuario.",
    "lessons": [
      {
        "id": "b1-l1",
        "section": "1.1",
        "title": "Qué es un programa y tu primera salida",
        "objectives": [
          "Explicar con tus palabras qué es un programa y qué es una instrucción.",
          "Ejecutar instrucciones en orden y mostrar mensajes con print().",
          "Distinguir texto literal de una instrucción de Python."
        ],
        "explanation": [
          "Programar consiste en describir pasos precisos para que una computadora resuelva una tarea. Una secuencia de pasos ordenados que permite llegar a un resultado se llama algoritmo; cuando expresamos esos pasos en un lenguaje como Python, construimos un programa.",
          "Python ejecuta normalmente las instrucciones de arriba hacia abajo. Cada línea debe estar escrita con una sintaxis que el intérprete pueda entender. Los paréntesis y las comillas tienen significado: print() es una función y el texto que queremos mostrar debe ir entre comillas.",
          "La función print() muestra uno o varios valores en la consola. No guarda el resultado ni lo convierte en un archivo: simplemente presenta información para que una persona pueda leerla. Los comentarios que empiezan con # sirven para explicar el código y Python no los ejecuta."
        ],
        "example": "print(\"Hola, Python\")\nprint(\"Estoy aprendiendo paso a paso\")",
        "exampleOutput": "Hola, Python\nEstoy aprendiendo paso a paso",
        "walkthrough": [
          "La primera llamada a print() muestra la primera línea; la segunda llamada muestra la siguiente.",
          "El texto va entre comillas porque es una cadena de caracteres. Cambiar el contenido de las comillas cambia el mensaje, no la estructura de la instrucción."
        ],
        "commonMistakes": [
          "Olvidar una comilla o un paréntesis produce un error de sintaxis.",
          "Escribir Print() con mayúscula no es lo mismo que print(): Python distingue mayúsculas y minúsculas."
        ],
        "exercise": {
          "id": "b1-e1",
          "title": "Presentación en dos líneas",
          "statement": "Muestra tu nombre en la primera línea y la frase Estoy aprendiendo Python en la segunda.",
          "starterCode": "# Escribe tu solución debajo\n",
          "solution": "print(\"Alex\")\nprint(\"Estoy aprendiendo Python\")",
          "tests": [
            {
              "input": [],
              "expected": "Alex\nEstoy aprendiendo Python"
            }
          ],
          "hints": [
            "Utiliza dos instrucciones print().",
            "Cada texto debe estar entre comillas."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cuál es la función principal de print() en un programa sencillo?",
            "options": [
              "Guardar datos en un archivo",
              "Convertir texto a número",
              "Mostrar valores en la consola",
              "Repetir instrucciones"
            ],
            "answer": 2,
            "explanation": "print() envía los valores a la salida de texto para que podamos verlos."
          },
          {
            "prompt": "¿Qué representa un algoritmo?",
            "options": [
              "Un tipo especial de variable",
              "Una instrucción exclusiva de Python",
              "Un error que detiene el programa",
              "Una secuencia ordenada de pasos para resolver una tarea"
            ],
            "answer": 3,
            "explanation": "La opción correcta está en la posición configurada por el banco de evaluación: un algoritmo describe pasos ordenados para resolver un problema."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 12
      },
      {
        "id": "b1-l2",
        "section": "1.2",
        "title": "Variables: dar nombre a los datos",
        "objectives": [
          "Crear variables mediante asignación.",
          "Elegir nombres descriptivos que respeten las reglas de Python.",
          "Actualizar un valor y utilizarlo en otra expresión."
        ],
        "explanation": [
          "Una variable es un nombre asociado a un valor. La asignación se realiza con un solo signo igual (=): Python evalúa el lado derecho y guarda el resultado bajo el nombre del lado izquierdo.",
          "Los nombres pueden contener letras, números y guion bajo, pero no pueden empezar con un número ni contener espacios. Es recomendable usar nombres que expliquen el propósito del dato, por ejemplo precio_unitario o nombre_cliente.",
          "Una variable puede recibir un nuevo valor más adelante. Cuando una expresión utiliza una variable, Python consulta el valor que tiene en ese momento; por eso, el orden de las asignaciones importa."
        ],
        "example": "producto = \"Cuaderno\"\nprecio = 850\nprecio = precio + 150\nprint(producto)\nprint(precio)",
        "exampleOutput": "Cuaderno\n1000",
        "walkthrough": [
          "producto guarda una cadena de texto y precio guarda un número entero.",
          "La asignación precio = precio + 150 calcula 850 + 150 y después sustituye el valor anterior por 1000."
        ],
        "commonMistakes": [
          "Usar = cuando se quiere comparar dos valores; la comparación se estudia en el siguiente módulo.",
          "Poner espacios en un nombre, por ejemplo precio final, no es válido. Usa precio_final."
        ],
        "exercise": {
          "id": "b1-e2",
          "title": "Calcular un subtotal",
          "statement": "Crea las variables precio = 1200 y cantidad = 3. Calcula subtotal multiplicando ambos valores e imprime el resultado.",
          "starterCode": "precio = 1200\ncantidad = 3\n# Calcula el subtotal\n",
          "solution": "precio = 1200\ncantidad = 3\nsubtotal = precio * cantidad\nprint(subtotal)",
          "tests": [
            {
              "input": [],
              "expected": "3600"
            }
          ],
          "hints": [
            "El operador de multiplicación es *.",
            "Guarda el resultado en una tercera variable."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Después de ejecutar cantidad = 4 y luego cantidad = cantidad + 2, ¿qué valor tiene cantidad?",
            "options": [
              "6",
              "4",
              "42",
              "Error: una variable no puede cambiar"
            ],
            "answer": 0,
            "explanation": "La asignación vuelve a calcular la expresión y actualiza la variable. La opción correcta se mantiene en el índice 0 del banco actual."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 12
      },
      {
        "id": "b1-l3",
        "section": "1.3",
        "title": "Tipos de datos y operaciones aritméticas",
        "objectives": [
          "Reconocer int, float y str en ejemplos cotidianos.",
          "Aplicar suma, resta, multiplicación, división y módulo.",
          "Predecir el resultado respetando la prioridad de operaciones."
        ],
        "explanation": [
          "Los valores que maneja un programa tienen tipos. int representa números enteros, float representa números con parte decimal y str representa texto. El tipo determina qué operaciones tienen sentido y cómo se comporta un valor.",
          "Los operadores aritméticos habituales son +, -, *, /, //, % y **. El operador / realiza una división que produce un número decimal; // calcula el cociente entero, % obtiene el residuo y ** eleva a una potencia.",
          "Python respeta la prioridad matemática: primero resuelve paréntesis, potencias, multiplicación y división, y después suma y resta. Cuando una expresión sea difícil de leer, agrúpala con paréntesis para que la intención quede clara."
        ],
        "example": "precio = 1250\nunidades = 3\ntotal = precio * unidades\nprint(total)\nprint(10 % 3)",
        "exampleOutput": "3750\n1",
        "walkthrough": [
          "1250 y 3 son valores int; la multiplicación devuelve 3750.",
          "10 % 3 devuelve 1 porque al dividir 10 entre 3 sobra una unidad."
        ],
        "commonMistakes": [
          "Confundir / con //: 7 / 2 produce 3.5, mientras que 7 // 2 produce 3.",
          "Olvidar la prioridad de operaciones. Usa paréntesis cuando quieras hacer explícito el orden."
        ],
        "exercise": {
          "id": "b1-e3",
          "title": "Costo con descuento",
          "statement": "Un producto cuesta 2400 y se compran 2 unidades. Aplica un descuento de 500 al total y muestra cuánto se paga.",
          "starterCode": "precio = 2400\ncantidad = 2\ndescuento = 500\n",
          "solution": "precio = 2400\ncantidad = 2\ndescuento = 500\ntotal = precio * cantidad - descuento\nprint(total)",
          "tests": [
            {
              "input": [],
              "expected": "4300"
            }
          ],
          "hints": [
            "Calcula primero el precio por la cantidad.",
            "Resta el descuento al subtotal."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué valor devuelve 17 % 5?",
            "options": [
              "3",
              "5",
              "2",
              "3.4"
            ],
            "answer": 2,
            "explanation": "El operador módulo devuelve el residuo. La clave de evaluación mantiene la respuesta en el índice 2."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 14
      },
      {
        "id": "b1-l4",
        "section": "1.4",
        "title": "Entrada, conversión y salida",
        "objectives": [
          "Leer datos escritos por el usuario con input().",
          "Entender que input() devuelve texto.",
          "Convertir una entrada a int o float antes de hacer cálculos."
        ],
        "explanation": [
          "Un programa interactivo recibe información, la procesa y presenta un resultado. input() pausa el programa y devuelve como texto lo que la persona escribe; incluso si escribe 25, el tipo recibido es str.",
          "Si necesitamos realizar operaciones numéricas, debemos convertir el texto. int() convierte una cadena que representa un entero y float() permite números decimales. Una conversión falla si el texto no representa el tipo esperado; más adelante aprenderás a manejar ese error.",
          "Un flujo de entrada-proceso-salida tiene tres etapas: leer los datos, calcular con ellos y mostrar una respuesta. Separar esas etapas facilita encontrar errores y cambiar el programa sin reescribirlo por completo."
        ],
        "example": "cantidad = int(input())\nprecio = 750\nprint(cantidad * precio)",
        "exampleOutput": "3\n2250  (si la entrada es 3)",
        "walkthrough": [
          "input() obtiene el valor escrito y lo entrega como str.",
          "int() convierte esa cadena a entero; luego el programa multiplica la cantidad por el precio."
        ],
        "commonMistakes": [
          "Intentar sumar directamente un str y un int, por ejemplo input() + 5.",
          "Olvidar convertir la entrada cuando se necesita una operación matemática."
        ],
        "exercise": {
          "id": "b1-e4",
          "title": "Calcular el doble de una cantidad",
          "statement": "Lee un número entero desde la entrada estándar, calcula su doble e imprime el resultado.",
          "starterCode": "# La persona escribirá un número\n",
          "solution": "numero = int(input())\nprint(numero * 2)",
          "tests": [
            {
              "input": [],
              "expected": "14"
            }
          ],
          "hints": [
            "Lee con input().",
            "Convierte el texto a entero usando int()."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué tipo de dato devuelve input() antes de convertirlo?",
            "options": [
              "int",
              "float",
              "bool",
              "str"
            ],
            "answer": 3,
            "explanation": "input() devuelve una cadena de texto; la conversión depende de int() o float()."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 14
      }
    ]
  },
  {
    "id": "module-2",
    "number": "2",
    "title": "Decisiones y repetición",
    "summary": "Compara datos, construye condiciones, controla alternativas y automatiza tareas repetitivas con while y for.",
    "lessons": [
      {
        "id": "b2-l1",
        "section": "2.1",
        "title": "Valores booleanos y comparaciones",
        "objectives": [
          "Identificar True y False como valores booleanos.",
          "Usar ==, !=, >, <, >= y <= para comparar.",
          "Leer el resultado booleano de una expresión."
        ],
        "explanation": [
          "El tipo bool solo tiene dos valores: True y False. Una comparación produce uno de esos valores, por lo que puede utilizarse directamente para decidir qué instrucciones ejecutar.",
          "El operador == pregunta si dos valores son iguales; != pregunta si son distintos. Los operadores >, <, >= y <= comparan magnitudes. No confundas == con =: uno compara y el otro asigna.",
          "Las comparaciones deben hacerse entre valores compatibles. Por ejemplo, compara una edad convertida a int con otro entero, no con el texto \"18\". Las comparaciones también pueden combinarse con and, or y not, que se practicarán cuando construyamos condiciones."
        ],
        "example": "edad = 20\nes_mayor = edad >= 18\nprint(es_mayor)\nprint(edad != 18)",
        "exampleOutput": "True\nTrue",
        "walkthrough": [
          "edad >= 18 pregunta si la edad es al menos 18.",
          "El resultado de cada comparación es un booleano que print() puede mostrar."
        ],
        "commonMistakes": [
          "Escribir = en lugar de == dentro de una comparación.",
          "Comparar un número con texto sin convertir previamente la entrada."
        ],
        "exercise": {
          "id": "b2-e1",
          "title": "Comparar una temperatura",
          "statement": "Guarda temperatura = 29 y muestra True si es mayor o igual que 25; muestra el booleano directamente.",
          "starterCode": "temperatura = 29\n",
          "solution": "temperatura = 29\nprint(temperatura >= 25)",
          "tests": [
            {
              "input": [],
              "expected": "True"
            }
          ],
          "hints": [
            "Usa >= para incluir también el límite.",
            "No conviertas el resultado a texto: imprime la comparación."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué operador comprueba que dos valores no sean iguales?",
            "options": [
              "=",
              "==",
              "!=",
              "<="
            ],
            "answer": 2,
            "explanation": "!= devuelve True cuando los dos valores son diferentes."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 12
      },
      {
        "id": "b2-l2",
        "section": "2.2",
        "title": "Tomar decisiones con if y else",
        "objectives": [
          "Construir una condición con if.",
          "Añadir else para cubrir el caso contrario.",
          "Respetar los dos puntos y la sangría del bloque."
        ],
        "explanation": [
          "if permite ejecutar un bloque solamente cuando una condición es verdadera. La condición se escribe después de if y termina con dos puntos (:); las instrucciones que pertenecen al bloque llevan sangría.",
          "else define el bloque alternativo cuando la condición del if es falsa. Un if puede existir sin else, pero cuando la tarea exige cubrir ambos casos, else hace explícito el resultado contrario.",
          "La sangría en Python no es decoración: define qué instrucciones pertenecen a cada bloque. Mantén el mismo nivel de espacios dentro de un bloque y evita mezclar tabuladores y espacios."
        ],
        "example": "saldo = 1200\nif saldo >= 1000:\n    print(\"Compra autorizada\")\nelse:\n    print(\"Saldo insuficiente\")",
        "exampleOutput": "Compra autorizada",
        "walkthrough": [
          "Python evalúa saldo >= 1000.",
          "Como la condición es verdadera, ejecuta el primer bloque y omite else."
        ],
        "commonMistakes": [
          "Olvidar los dos puntos después de la condición.",
          "No indentar las instrucciones del bloque o indentar de forma inconsistente."
        ],
        "exercise": {
          "id": "b2-e2",
          "title": "Clasificar una edad",
          "statement": "Si edad es al menos 18, imprime Adulto; en caso contrario, imprime Menor de edad.",
          "starterCode": "edad = 16\n",
          "solution": "edad = 16\nif edad >= 18:\n    print(\"Adulto\")\nelse:\n    print(\"Menor de edad\")",
          "tests": [
            {
              "input": [],
              "expected": "Menor de edad"
            }
          ],
          "hints": [
            "La condición debe comparar edad con 18.",
            "El bloque else resuelve el caso contrario."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cuándo se ejecuta el bloque else asociado a un if?",
            "options": [
              "Siempre después de if",
              "Cuando la condición de if es falsa",
              "Cuando la condición de if es verdadera",
              "Solo si hay un bucle"
            ],
            "answer": 1,
            "explanation": "else se ejecuta si ninguna condición anterior de esa estructura se cumplió."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 12
      },
      {
        "id": "b2-l3",
        "section": "2.3",
        "title": "Elegir entre varias opciones con elif",
        "objectives": [
          "Construir una cadena if/elif/else.",
          "Ordenar condiciones desde la más específica o restrictiva.",
          "Evitar rangos que se solapen o dejen casos sin tratar."
        ],
        "explanation": [
          "elif significa \"si no, si...\" y permite comprobar otra condición cuando las anteriores fueron falsas. Python revisa la cadena en orden y ejecuta únicamente el primer bloque cuya condición resulte verdadera.",
          "El orden de las condiciones cambia el resultado. Si primero compruebas nota >= 60, una nota de 95 entra ahí y nunca llega a la condición nota >= 90. Coloca primero el rango más alto cuando las categorías son acumulativas.",
          "else puede cerrar la estructura para cubrir los casos restantes. Antes de escribir código, define los rangos con claridad y prueba mentalmente los valores del límite, justo por debajo y justo por encima."
        ],
        "example": "nota = 84\nif nota >= 90:\n    print(\"Excelente\")\nelif nota >= 70:\n    print(\"Aprobado\")\nelse:\n    print(\"Debe reforzar\")",
        "exampleOutput": "Aprobado",
        "walkthrough": [
          "La condición nota >= 90 es falsa.",
          "La segunda condición nota >= 70 es verdadera; por eso se ejecuta Aprobado y se omite else."
        ],
        "commonMistakes": [
          "Ordenar primero una condición general que captura todos los casos.",
          "Dejar sin definir qué debe pasar exactamente en los valores límite."
        ],
        "exercise": {
          "id": "b2-e3",
          "title": "Categorizar un envío",
          "statement": "Si peso es hasta 1 kg imprime Ligero; si es hasta 5 kg imprime Mediano; para valores mayores imprime Pesado.",
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
            "elif solo se evalúa cuando el if anterior fue falso."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "En una cadena if/elif/else, ¿qué sucede si dos condiciones podrían ser verdaderas?",
            "options": [
              "Python ejecuta la primera condición verdadera y salta el resto",
              "Se ejecutan ambas",
              "Python elige la última",
              "El programa siempre falla"
            ],
            "answer": 0,
            "explanation": "La cadena se detiene en el primer bloque cuya condición sea verdadera."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 14
      },
      {
        "id": "b2-l4",
        "section": "2.4",
        "title": "Repetir acciones con while",
        "objectives": [
          "Explicar que while repite mientras la condición sea verdadera.",
          "Actualizar la variable de control dentro del bucle.",
          "Evitar bucles infinitos con una condición de salida."
        ],
        "explanation": [
          "while ejecuta un bloque repetidamente mientras su condición sea True. Es útil cuando el número de repeticiones depende de una condición, por ejemplo seguir solicitando un dato hasta que sea válido.",
          "Un bucle necesita una forma de avanzar. En un contador, actualizamos el valor dentro del bloque; si nunca cambia la condición de salida, el ciclo puede repetirse indefinidamente.",
          "Antes de ejecutar un while, identifica el valor inicial, la condición para continuar y la instrucción que acerca al programa a terminar. Esas tres decisiones evitan muchos errores."
        ],
        "example": "contador = 1\nwhile contador <= 3:\n    print(contador)\n    contador += 1",
        "exampleOutput": "1\n2\n3",
        "walkthrough": [
          "contador comienza en 1.",
          "Después de cada impresión aumenta en uno; al llegar a 4, la condición resulta falsa y el bucle termina."
        ],
        "commonMistakes": [
          "Olvidar incrementar o modificar el contador.",
          "Usar una condición que nunca puede volverse falsa."
        ],
        "exercise": {
          "id": "b2-e4",
          "title": "Contar intentos",
          "statement": "Usa while para imprimir los números del 1 al 5, uno por línea.",
          "starterCode": "contador = 1\n",
          "solution": "contador = 1\nwhile contador <= 5:\n    print(contador)\n    contador += 1",
          "tests": [
            {
              "input": [],
              "expected": "1\n2\n3\n4\n5"
            }
          ],
          "hints": [
            "La condición debe permitir llegar hasta 5.",
            "Incrementa el contador en cada vuelta."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué hace que un bucle while termine en un programa correcto?",
            "options": [
              "Que la variable sea de tipo texto",
              "Que la condición llegue a ser falsa",
              "Que se use print() al final",
              "Que siempre tenga exactamente diez vueltas"
            ],
            "answer": 1,
            "explanation": "while deja de repetir cuando su condición ya no es verdadera."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b2-l5",
        "section": "2.5",
        "title": "Recorrer secuencias con for y range",
        "objectives": [
          "Usar for para recorrer elementos de una secuencia.",
          "Comprender que range(n) empieza en 0 y termina antes de n.",
          "Definir inicio, límite y paso con range()."
        ],
        "explanation": [
          "for recorre los elementos de una secuencia y ejecuta su bloque una vez por cada elemento. Es apropiado cuando queremos procesar una lista o repetir una acción un número conocido de veces.",
          "range(fin) genera números desde 0 hasta fin - 1. range(inicio, fin) empieza en el valor indicado y se detiene antes de fin. También podemos usar range(inicio, fin, paso) para avanzar en intervalos.",
          "El nombre de la variable de control representa el elemento actual. Dentro del bloque podemos usarlo para calcular o mostrar resultados; al terminar el recorrido, el bucle for finaliza automáticamente."
        ],
        "example": "for numero in range(2, 11, 2):\n    print(numero)",
        "exampleOutput": "2\n4\n6\n8\n10",
        "walkthrough": [
          "range(2, 11, 2) comienza en 2, avanza de 2 en 2 y se detiene antes de 11.",
          "Cada valor generado se asigna a numero antes de ejecutar print()."
        ],
        "commonMistakes": [
          "Esperar que range(5) incluya el 5; genera 0, 1, 2, 3 y 4.",
          "Olvidar que el límite final no se incluye."
        ],
        "exercise": {
          "id": "b2-e5",
          "title": "Tabla de multiplicar",
          "statement": "Utiliza for y range para imprimir la tabla del 7, desde 7 hasta 70, un resultado por línea.",
          "starterCode": "for numero in range(1, 11):\n    # calcula el producto\n    pass\n",
          "solution": "for numero in range(1, 11):\n    print(7 * numero)",
          "tests": [
            {
              "input": [],
              "expected": "7\n14\n21\n28\n35\n42\n49\n56\n63\n70"
            }
          ],
          "hints": [
            "range(1, 11) genera diez valores.",
            "Multiplica cada valor por 7."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué números produce range(3, 7)?",
            "options": [
              "3, 4, 5, 7",
              "3, 4, 5, 6, 7",
              "3, 4, 5, 6",
              "2, 3, 4, 5"
            ],
            "answer": 2,
            "explanation": "El rango comienza en 3 y termina antes de 7: incluye 3, 4, 5 y 6."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b2-l6",
        "section": "2.6",
        "title": "Controlar un bucle con break y continue",
        "objectives": [
          "Explicar la diferencia entre break y continue.",
          "Usar break para salir de un bucle antes de terminar el recorrido.",
          "Usar continue para saltar una iteración."
        ],
        "explanation": [
          "break termina inmediatamente el bucle más cercano que lo contiene. Se usa cuando ya encontramos lo que buscábamos o cuando una condición indica que no debemos seguir.",
          "continue no termina todo el bucle: omite el resto del bloque de la vuelta actual y pasa a la siguiente iteración. Conviene usarlo cuando algunos elementos deben ignorarse y otros deben procesarse.",
          "Estos controles deben responder a una regla clara. Si un bucle se vuelve difícil de seguir por muchos break y continue, suele ser mejor dividir la tarea o expresar la condición de forma más directa."
        ],
        "example": "for numero in range(1, 6):\n    if numero == 3:\n        continue\n    print(numero)",
        "exampleOutput": "1\n2\n4\n5",
        "walkthrough": [
          "Cuando numero vale 3, continue omite print(numero).",
          "Las demás iteraciones se procesan con normalidad."
        ],
        "commonMistakes": [
          "Confundir continue con break: uno salta una vuelta y el otro termina el bucle.",
          "Colocar break en una posición que termina el bucle antes de procesar los datos necesarios."
        ],
        "exercise": {
          "id": "b2-e6",
          "title": "Detener una búsqueda",
          "statement": "Recorre los números del 1 al 10 y detén el bucle cuando encuentres el 6. Imprime cada número antes de detenerte.",
          "starterCode": "for numero in range(1, 11):\n    # completa la condición de salida\n    pass\n",
          "solution": "for numero in range(1, 11):\n    print(numero)\n    if numero == 6:\n        break",
          "tests": [
            {
              "input": [],
              "expected": "1\n2\n3\n4\n5\n6"
            }
          ],
          "hints": [
            "Usa break cuando numero sea igual a 6.",
            "Imprime antes de break para incluir el 6 en la salida."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué sucede después de ejecutar continue dentro de un bucle?",
            "options": [
              "Termina el programa completo",
              "Sale del bucle para siempre",
              "Reinicia el programa desde la primera línea",
              "Pasa directamente a la siguiente iteración"
            ],
            "answer": 3,
            "explanation": "continue salta las instrucciones restantes de esa vuelta y sigue con la iteración siguiente."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b2-l7",
        "section": "2.7",
        "title": "Evaluación del módulo 2: decisiones y bucles",
        "objectives": [
          "Combinar comparaciones y decisiones en un mismo programa.",
          "Elegir entre while y for según el problema.",
          "Predecir el resultado de una secuencia de condiciones."
        ],
        "explanation": [
          "Esta evaluación reúne los conceptos del módulo: comparaciones booleanas, condicionales y bucles. No se trata de memorizar palabras clave, sino de leer el problema, identificar su condición y elegir una estructura que lo resuelva con claridad.",
          "Antes de responder, sigue el orden exacto de ejecución. En una cadena if/elif/else solo entra el primer bloque verdadero; en un bucle, revisa cuándo se actualiza la condición y qué valores genera range().",
          "En la práctica final deberás combinar una condición con un recorrido. Si cometes un error, vuelve al ejemplo del tema correspondiente, ejecuta una versión pequeña y después intenta de nuevo."
        ],
        "example": "for numero in range(1, 6):\n    if numero % 2 == 0:\n        print(\"par\")\n    else:\n        print(\"impar\")",
        "exampleOutput": "impar\npar\nimpar\npar\nimpar",
        "walkthrough": [
          "for recorre cinco enteros.",
          "% obtiene el residuo de la división entre 2: residuo cero significa par."
        ],
        "commonMistakes": [
          "Elegir una respuesta sin simular el orden de ejecución.",
          "Olvidar que range() excluye el límite final."
        ],
        "exercise": {
          "id": "b2-e7",
          "title": "Clasificador de números",
          "statement": "Recorre del 1 al 8. Imprime Par para los múltiplos de 2 e Impar para los demás.",
          "starterCode": "for numero in range(1, 9):\n    # decide qué mensaje mostrar\n    pass\n",
          "solution": "for numero in range(1, 9):\n    if numero % 2 == 0:\n        print(\"Par\")\n    else:\n        print(\"Impar\")",
          "tests": [
            {
              "input": [],
              "expected": "Impar\nPar\nImpar\nPar\nImpar\nPar\nImpar\nPar"
            }
          ],
          "hints": [
            "Usa for para recorrer los ocho números.",
            "El operador % 2 permite comprobar si el residuo es cero."
          ],
          "difficulty": "medio",
          "xp": 25,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué valor booleano produce 8 != 8?",
            "options": [
              "True",
              "False",
              "8",
              "Error"
            ],
            "answer": 1,
            "explanation": "Los dos valores son iguales; por tanto, la condición de desigualdad es falsa."
          },
          {
            "prompt": "¿Qué bloque se ejecuta si x es 4 en if x > 5 / elif x == 4 / else?",
            "options": [
              "elif",
              "if",
              "else",
              "ninguno"
            ],
            "answer": 0,
            "explanation": "La comparación del elif es la primera verdadera después del if falso."
          },
          {
            "prompt": "¿Qué imprime range(1, 4) al recorrerlo con print?",
            "options": [
              "0, 1, 2, 3",
              "1, 2, 3",
              "1, 2, 3, 4",
              "2, 3, 4"
            ],
            "answer": 1,
            "explanation": "range(1, 4) genera 1, 2 y 3."
          },
          {
            "prompt": "¿Qué instrucción termina inmediatamente el bucle actual?",
            "options": [
              "continue",
              "pass",
              "break",
              "return siempre"
            ],
            "answer": 2,
            "explanation": "break detiene el bucle que lo contiene más cerca."
          },
          {
            "prompt": "¿Qué debe cambiar dentro de un while con contador para que pueda terminar?",
            "options": [
              "La condición nunca debe cambiar",
              "Hay que cambiar el nombre",
              "Debe ejecutarse print() dos veces",
              "La condición debe cambiar hasta ser falsa"
            ],
            "answer": 3,
            "explanation": "Un bucle while termina cuando la condición se vuelve falsa; normalmente se actualiza su variable de control."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 25
      }
    ]
  },
  {
    "id": "module-3",
    "number": "3",
    "title": "Colecciones y tratamiento de datos",
    "summary": "Guarda varios valores, consulta y modifica listas, procesa texto y organiza registros con diccionarios y otras colecciones.",
    "lessons": [
      {
        "id": "b3-l1",
        "section": "3.1",
        "title": "Listas: agrupar datos en orden",
        "objectives": [
          "Crear listas con corchetes.",
          "Acceder a elementos mediante índices.",
          "Comprender que el primer índice es 0."
        ],
        "explanation": [
          "Una lista agrupa varios valores en una sola variable y conserva su orden. Se escribe entre corchetes, con los elementos separados por comas; puede contener números, cadenas u otros tipos.",
          "Cada elemento ocupa una posición llamada índice. En Python el primer índice es 0, el segundo es 1 y así sucesivamente. Un índice fuera del rango provoca IndexError, por lo que conviene comprobar la longitud antes de acceder a posiciones dinámicas.",
          "len(lista) devuelve cuántos elementos contiene. También puedes acceder al último elemento con índice -1, una forma útil cuando no conoces de antemano cuántos elementos hay."
        ],
        "example": "herramientas = [\"teclado\", \"mouse\", \"monitor\"]\nprint(herramientas[0])\nprint(herramientas[-1])\nprint(len(herramientas))",
        "exampleOutput": "teclado\nmonitor\n3",
        "walkthrough": [
          "herramientas[0] consulta el primer elemento.",
          "herramientas[-1] consulta el último y len() cuenta los tres elementos."
        ],
        "commonMistakes": [
          "Pensar que el primer índice es 1 en lugar de 0.",
          "Consultar una posición que no existe, como lista[5] en una lista de tres elementos."
        ],
        "exercise": {
          "id": "b3-e1",
          "title": "Consultar una lista de tareas",
          "statement": "Crea la lista tareas con tres textos: estudiar, practicar y descansar. Imprime el segundo elemento.",
          "starterCode": "# crea la lista\n",
          "solution": "tareas = [\"estudiar\", \"practicar\", \"descansar\"]\nprint(tareas[1])",
          "tests": [
            {
              "input": [],
              "expected": "practicar"
            }
          ],
          "hints": [
            "El segundo elemento tiene índice 1.",
            "Usa corchetes para acceder a la lista."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué índice permite acceder al primer elemento de una lista?",
            "options": [
              "1",
              "-1",
              "len(lista)",
              "0"
            ],
            "answer": 3,
            "explanation": "En Python los índices de lista comienzan en cero."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 13
      },
      {
        "id": "b3-l2",
        "section": "3.2",
        "title": "Modificar listas: añadir, reemplazar y quitar",
        "objectives": [
          "Añadir elementos con append().",
          "Reemplazar un elemento usando su índice.",
          "Eliminar elementos con remove() o pop()."
        ],
        "explanation": [
          "Las listas son mutables: se pueden modificar después de crearlas. append(valor) añade un elemento al final y len() permite comprobar cómo cambió el tamaño.",
          "Para reemplazar un elemento, asigna un nuevo valor a su posición, por ejemplo tareas[0] = \"leer\". remove(valor) elimina la primera coincidencia; pop(indice) elimina y devuelve el elemento de la posición indicada.",
          "Antes de quitar un valor, asegúrate de que existe. remove() produce ValueError cuando no encuentra el elemento y pop() produce IndexError si el índice no existe."
        ],
        "example": "tareas = [\"leer\", \"estudiar\"]\ntareas.append(\"practicar\")\ntareas[0] = \"investigar\"\ntareas.remove(\"estudiar\")\nprint(tareas)",
        "exampleOutput": "['investigar', 'practicar']",
        "walkthrough": [
          "append() agrega practicar al final.",
          "La primera posición cambia y remove() retira estudiar."
        ],
        "commonMistakes": [
          "Confundir append() con extend(): append añade un elemento, aunque ese elemento sea otra lista.",
          "Intentar eliminar un valor que no está presente."
        ],
        "exercise": {
          "id": "b3-e2",
          "title": "Actualizar una lista de invitados",
          "statement": "Parte de invitados = [\"Ana\", \"Luis\"]. Añade Marta, cambia Luis por Lucía y muestra la lista completa.",
          "starterCode": "invitados = [\"Ana\", \"Luis\"]\n",
          "solution": "invitados = [\"Ana\", \"Luis\"]\ninvitados.append(\"Marta\")\ninvitados[1] = \"Lucía\"\nprint(invitados)",
          "tests": [
            {
              "input": [],
              "expected": "['Ana', 'Lucía', 'Marta']"
            }
          ],
          "hints": [
            "Agrega primero con append().",
            "El índice 1 corresponde al segundo nombre."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué método añade un único elemento al final de una lista?",
            "options": [
              "append()",
              "remove()",
              "sort()",
              "clear()"
            ],
            "answer": 0,
            "explanation": "append() incorpora el elemento al final de la lista."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 14
      },
      {
        "id": "b3-l3",
        "section": "3.3",
        "title": "Cadenas: analizar y transformar texto",
        "objectives": [
          "Reconocer que str es una secuencia de caracteres.",
          "Usar lower(), upper(), strip() y split().",
          "Buscar texto y unir palabras con join()."
        ],
        "explanation": [
          "Una cadena (str) representa texto y es inmutable: los métodos no cambian la cadena original, sino que devuelven una nueva. Puedes guardar ese resultado en otra variable o sobrescribir la anterior.",
          "lower() y upper() cambian el uso de mayúsculas; strip() elimina espacios al inicio y al final; split() separa una cadena y devuelve una lista. Estos métodos ayudan a normalizar datos ingresados por personas.",
          "El método join() une una lista de cadenas con un separador. Por ejemplo, \"-\".join(codigos) coloca un guion entre los elementos. El separador es quien llama al método, no la lista."
        ],
        "example": "entrada = \"  Python desde cero  \"\nlimpia = entrada.strip().lower()\npalabras = limpia.split()\nprint(palabras)",
        "exampleOutput": "['python', 'desde', 'cero']",
        "walkthrough": [
          "strip() elimina los espacios exteriores.",
          "lower() normaliza el texto y split() divide por espacios."
        ],
        "commonMistakes": [
          "Esperar que strip() elimine espacios entre palabras.",
          "Llamar join() sobre una lista en vez de sobre el separador de texto."
        ],
        "exercise": {
          "id": "b3-e3",
          "title": "Limpiar un nombre",
          "statement": "Convierte el texto \"  MARIA LOPEZ  \" a minúsculas y elimina los espacios de los extremos. Imprime el resultado.",
          "starterCode": "nombre = \"  MARIA LOPEZ  \"\n",
          "solution": "nombre = \"  MARIA LOPEZ  \"\nprint(nombre.strip().lower())",
          "tests": [
            {
              "input": [],
              "expected": "maria lopez"
            }
          ],
          "hints": [
            "strip() elimina espacios exteriores.",
            "lower() cambia letras a minúsculas."
          ],
          "difficulty": "facil",
          "xp": 10,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué devuelve split() cuando se aplica a una cadena?",
            "options": [
              "Una lista de partes de la cadena",
              "Un número entero",
              "La misma cadena sin espacios",
              "Un valor booleano"
            ],
            "answer": 0,
            "explanation": "split() divide la cadena y devuelve una lista con los fragmentos."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 14
      },
      {
        "id": "b3-l4",
        "section": "3.4",
        "title": "Recorrer colecciones y acumular resultados",
        "objectives": [
          "Recorrer cada elemento con for.",
          "Acumular una suma o un contador.",
          "Usar sum(), min(), max() y len() cuando corresponda."
        ],
        "explanation": [
          "Un bucle for puede recorrer directamente los elementos de una lista. En cada repetición, la variable de control representa el valor actual, por lo que normalmente no necesitas gestionar índices manuales.",
          "Un acumulador guarda un resultado parcial y se actualiza en cada vuelta. Para sumar precios, se inicia total en 0 y se agrega cada precio; para contar elementos que cumplen una condición, se incrementa un contador.",
          "Python incluye funciones útiles como sum(), min(), max() y len(). Aprende a reconocer cuándo una función integrada expresa mejor la intención que escribir un bucle manual; en otros casos, el bucle permite añadir filtros o cálculos propios."
        ],
        "example": "precios = [1200, 800, 1500]\ntotal = 0\nfor precio in precios:\n    total += precio\nprint(total)\nprint(len(precios))",
        "exampleOutput": "3500\n3",
        "walkthrough": [
          "total empieza en cero y recibe cada precio una sola vez.",
          "len(precios) devuelve el número de productos de la lista."
        ],
        "commonMistakes": [
          "Olvidar inicializar el acumulador antes del bucle.",
          "Reiniciar total dentro del bucle, lo que impediría acumular todos los valores."
        ],
        "exercise": {
          "id": "b3-e4",
          "title": "Sumar calificaciones",
          "statement": "Dada la lista notas = [80, 95, 70, 85], calcula e imprime la suma de todas las notas recorriendo la lista con for.",
          "starterCode": "notas = [80, 95, 70, 85]\ntotal = 0\n",
          "solution": "notas = [80, 95, 70, 85]\ntotal = 0\nfor nota in notas:\n    total += nota\nprint(total)",
          "tests": [
            {
              "input": [],
              "expected": "330"
            }
          ],
          "hints": [
            "Inicializa total en cero.",
            "Suma cada nota dentro del for."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué función integrada devuelve cuántos elementos contiene una lista?",
            "options": [
              "sum()",
              "max()",
              "type()",
              "len()"
            ],
            "answer": 3,
            "explanation": "len() devuelve la cantidad de elementos de una secuencia o colección."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b3-l5",
        "section": "3.5",
        "title": "Diccionarios: relacionar claves y valores",
        "objectives": [
          "Crear un diccionario con llaves.",
          "Consultar un valor mediante su clave.",
          "Añadir o actualizar pares clave-valor."
        ],
        "explanation": [
          "Un diccionario organiza información mediante parejas clave: valor. Es apropiado cuando un dato tiene atributos identificables, como nombre, correo y edad, en vez de depender solamente de posiciones numéricas.",
          "Las claves deben ser únicas y normalmente se usan cadenas. Para consultar un valor escribimos registro[\"nombre\"]. También podemos usar get() cuando queremos un valor alternativo si una clave no existe.",
          "Para añadir o actualizar un dato se asigna a una clave: registro[\"ciudad\"] = \"San José\". El mismo código crea la clave si no existía o reemplaza su valor si ya estaba presente."
        ],
        "example": "persona = {\"nombre\": \"Sofía\", \"edad\": 22}\npersona[\"ciudad\"] = \"San José\"\nprint(persona[\"nombre\"])\nprint(persona[\"ciudad\"])",
        "exampleOutput": "Sofía\nSan José",
        "walkthrough": [
          "El diccionario comienza con dos claves.",
          "La asignación de ciudad añade un nuevo par; la consulta devuelve su valor."
        ],
        "commonMistakes": [
          "Confundir la clave con el valor: se consulta usando la clave.",
          "Asumir que una clave inexistente devuelve None al usar corchetes; en ese caso se produce KeyError."
        ],
        "exercise": {
          "id": "b3-e5",
          "title": "Ficha de producto",
          "statement": "Crea un diccionario producto con las claves nombre y precio. Guarda \"Mouse\" y 6500, agrega la clave disponible con el valor True e imprime el precio.",
          "starterCode": "producto = {}\n",
          "solution": "producto = {\"nombre\": \"Mouse\", \"precio\": 6500}\nproducto[\"disponible\"] = True\nprint(producto[\"precio\"])",
          "tests": [
            {
              "input": [],
              "expected": "6500"
            }
          ],
          "hints": [
            "Las claves son cadenas entre comillas.",
            "La asignación a disponible agrega un tercer dato."
          ],
          "difficulty": "facil",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué estructura de Python permite consultar un dato mediante una clave descriptiva?",
            "options": [
              "Un diccionario",
              "Una tupla",
              "Un rango",
              "Un comentario"
            ],
            "answer": 0,
            "explanation": "Un diccionario relaciona claves con valores y permite buscar por la clave."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b3-l6",
        "section": "3.6",
        "title": "Tuplas, conjuntos y pertenencia",
        "objectives": [
          "Reconocer tuplas y conjuntos por su sintaxis y propósito.",
          "Consultar si un valor está en una colección con in.",
          "Eliminar duplicados mediante set() cuando el orden no es la prioridad."
        ],
        "explanation": [
          "Una tupla agrupa valores en un orden fijo y no se modifica después de crearla. Se escribe normalmente entre paréntesis y resulta útil para representar un conjunto pequeño de datos relacionados, como coordenadas (x, y).",
          "Un conjunto (set) almacena valores únicos. Al convertir una lista a set(), los duplicados desaparecen; no debes depender del orden de impresión de un conjunto.",
          "El operador in comprueba pertenencia y devuelve True o False. Puedes usarlo con listas, cadenas, tuplas, conjuntos y diccionarios; en un diccionario, comprueba las claves."
        ],
        "example": "coordenada = (10, 20)\ncolores = {\"azul\", \"rojo\", \"azul\"}\nprint(coordenada[0])\nprint(len(colores))\nprint(\"rojo\" in colores)",
        "exampleOutput": "10\n2\nTrue",
        "walkthrough": [
          "La tupla conserva la coordenada x en la posición 0.",
          "El conjunto elimina el color repetido y la operación in comprueba pertenencia."
        ],
        "commonMistakes": [
          "Intentar modificar una tupla después de crearla.",
          "Confiar en el orden de los elementos de un conjunto."
        ],
        "exercise": {
          "id": "b3-e6",
          "title": "Detectar ingredientes repetidos",
          "statement": "Convierte la lista ingredientes = [\"arroz\", \"sal\", \"arroz\", \"aceite\"] en un conjunto y muestra cuántos ingredientes distintos hay.",
          "starterCode": "ingredientes = [\"arroz\", \"sal\", \"arroz\", \"aceite\"]\n",
          "solution": "ingredientes = [\"arroz\", \"sal\", \"arroz\", \"aceite\"]\nunicos = set(ingredientes)\nprint(len(unicos))",
          "tests": [
            {
              "input": [],
              "expected": "3"
            }
          ],
          "hints": [
            "set() mantiene solo valores únicos.",
            "Usa len() para contar el conjunto."
          ],
          "difficulty": "medio",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cuál es una propiedad de los conjuntos (set)?",
            "options": [
              "Sus elementos son únicos y no se garantiza su orden",
              "Permiten elementos duplicados en orden fijo",
              "Solo almacenan texto",
              "Se accede a cada elemento mediante índices"
            ],
            "answer": 0,
            "explanation": "Un set elimina duplicados y no ofrece acceso por índice como una lista."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b3-l7",
        "section": "3.7",
        "title": "Proyecto guiado: inventario sencillo",
        "objectives": [
          "Representar productos mediante diccionarios.",
          "Agrupar varios productos en una lista.",
          "Recorrer registros y calcular un total."
        ],
        "explanation": [
          "Un inventario pequeño puede modelarse como una lista de diccionarios. Cada diccionario representa un producto y guarda sus propiedades; la lista permite agregar nuevos productos y recorrerlos en orden.",
          "Para calcular el valor de inventario, cada registro aporta precio multiplicado por cantidad. El total se acumula mientras recorremos la lista. Este patrón aparece en tiendas, bibliotecas, listas de asistencia y muchas aplicaciones cotidianas.",
          "Un buen programa separa datos y operaciones: primero se define la estructura, después se recorre y se calcula. Antes de añadir un menú interactivo, comprueba que las operaciones básicas producen resultados correctos con datos pequeños."
        ],
        "example": "inventario = [\n    {\"nombre\": \"Cuaderno\", \"precio\": 900, \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"precio\": 200, \"cantidad\": 10}\n]\nvalor = 0\nfor producto in inventario:\n    valor += producto[\"precio\"] * producto[\"cantidad\"]\nprint(valor)",
        "exampleOutput": "5600",
        "walkthrough": [
          "La lista contiene dos diccionarios, uno por producto.",
          "En cada vuelta se multiplica precio por cantidad y se suma al acumulador valor."
        ],
        "commonMistakes": [
          "Usar un índice de lista para consultar un diccionario, o viceversa.",
          "Calcular solo el precio unitario y olvidar multiplicarlo por la cantidad."
        ],
        "exercise": {
          "id": "b3-e7",
          "title": "Valorar existencias",
          "statement": "Con los dos productos del ejemplo, calcula cuántas unidades hay en total. No sumes precios: suma las cantidades.",
          "starterCode": "inventario = [\n    {\"nombre\": \"Cuaderno\", \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"cantidad\": 10}\n]\nunidades = 0\n",
          "solution": "inventario = [\n    {\"nombre\": \"Cuaderno\", \"cantidad\": 4},\n    {\"nombre\": \"Lapiz\", \"cantidad\": 10}\n]\nunidades = 0\nfor producto in inventario:\n    unidades += producto[\"cantidad\"]\nprint(unidades)",
          "tests": [
            {
              "input": [],
              "expected": "14"
            }
          ],
          "hints": [
            "Recorre la lista de diccionarios.",
            "Suma el valor asociado a la clave cantidad."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cómo se representa mejor una colección de varios productos, cada uno con nombre, precio y cantidad?",
            "options": [
              "Una lista de diccionarios",
              "Una cadena con todos los datos mezclados",
              "Una única tupla sin nombres de campos",
              "Un conjunto de precios únicamente"
            ],
            "answer": 0,
            "explanation": "Una lista de diccionarios conserva el orden de los productos y agrupa las propiedades de cada registro."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 20
      },
      {
        "id": "b3-l8",
        "section": "3.8",
        "title": "Evaluación del módulo 3: colecciones y datos",
        "objectives": [
          "Elegir la colección adecuada para el tipo de información.",
          "Procesar listas y diccionarios mediante recorridos.",
          "Interpretar operaciones habituales de cadenas y colecciones."
        ],
        "explanation": [
          "En este módulo aprendiste a seleccionar una estructura según la pregunta: lista si importa el orden y se modifica el conjunto; diccionario si cada dato tiene una clave; tupla para agrupar valores fijos; conjunto para mantener elementos únicos.",
          "La evaluación combina acceso, modificación, recorrido y selección de estructuras. Cuando leas un ejercicio, identifica qué dato necesitas consultar y qué operación se aplicará sobre él.",
          "El reto práctico integra una lista de registros y un acumulador. Comprueba cada paso con pocos elementos antes de trabajar con una colección más grande."
        ],
        "example": "ventas = [1200, 800, 500]\nprint(sum(ventas))\nprint(800 in ventas)",
        "exampleOutput": "2500\nTrue",
        "walkthrough": [
          "sum() agrega los valores numéricos de la lista.",
          "in comprueba si 800 aparece en la colección."
        ],
        "commonMistakes": [
          "Elegir un set cuando el orden de los datos sí importa.",
          "Olvidar que los índices empiezan en cero o que las cadenas no se modifican en el sitio."
        ],
        "exercise": {
          "id": "b3-e8",
          "title": "Resumen de ventas",
          "statement": "Calcula la suma y el promedio de ventas = [1000, 1500, 2000]. Imprime primero la suma y después el promedio.",
          "starterCode": "ventas = [1000, 1500, 2000]\n",
          "solution": "ventas = [1000, 1500, 2000]\ntotal = sum(ventas)\npromedio = total / len(ventas)\nprint(total)\nprint(promedio)",
          "tests": [
            {
              "input": [],
              "expected": "4500\n1500.0"
            }
          ],
          "hints": [
            "Usa sum() para calcular el total.",
            "Divide el total entre len(ventas) para obtener el promedio."
          ],
          "difficulty": "medio",
          "xp": 25,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Si datos = [\"a\", \"b\", \"c\"], ¿qué devuelve datos[1]?",
            "options": [
              "Una lista vacía",
              "El valor None",
              "\"a\"",
              "\"b\""
            ],
            "answer": 3,
            "explanation": "El índice 1 es la segunda posición de la lista."
          },
          {
            "prompt": "¿Qué hace diccionario.get(\"zona\", \"sin dato\") si la clave zona no existe?",
            "options": [
              "Devuelve \"sin dato\"",
              "Agrega zona automáticamente",
              "Devuelve la lista completa",
              "Lanza siempre IndexError"
            ],
            "answer": 0,
            "explanation": "get() devuelve el valor alternativo indicado cuando la clave no existe."
          },
          {
            "prompt": "¿Qué estructura elimina duplicados al convertir una lista?",
            "options": [
              "set()",
              "str()",
              "tuple()",
              "dict()"
            ],
            "answer": 0,
            "explanation": "set() crea un conjunto y conserva una sola aparición de cada valor."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 25
      }
    ]
  },
  {
    "id": "module-4",
    "number": "4",
    "title": "Funciones y programas fiables",
    "summary": "Divide programas en funciones, utiliza parámetros y return, maneja errores y aprovecha módulos de Python.",
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
          "Definir parámetros en la cabecera de una función.",
          "Enviar argumentos al llamar una función.",
          "Usar más de un parámetro y mantener el orden correcto."
        ],
        "explanation": [
          "Un parámetro es un nombre que aparece en la definición y representa el dato que recibirá la función. Un argumento es el valor concreto que entregamos cuando la llamamos.",
          "Los parámetros permiten reutilizar una función con distintos datos. Si la función calcula un subtotal, no debe tener un precio fijo escrito en su interior: recibe el precio y la cantidad como argumentos.",
          "Los argumentos posicionales se asignan según el orden de los parámetros. Puedes mejorar la legibilidad usando argumentos con nombre, por ejemplo calcular_total(precio=100, cantidad=2)."
        ],
        "example": "def calcular_total(precio, cantidad):\n    total = precio * cantidad\n    print(total)\n\ncalcular_total(500, 3)",
        "exampleOutput": "1500",
        "walkthrough": [
          "La definición indica que se necesitan dos valores.",
          "La llamada entrega 500 a precio y 3 a cantidad."
        ],
        "commonMistakes": [
          "Llamar una función con menos argumentos de los requeridos.",
          "Cambiar el orden de los argumentos posicionales sin actualizar el significado de la función."
        ],
        "exercise": {
          "id": "b4-e2",
          "title": "Calcular el costo de entradas",
          "statement": "Define calcular_entradas(precio, cantidad) para mostrar el costo total. Pruébala con precio 2500 y cantidad 2.",
          "starterCode": "# define calcular_entradas\n",
          "solution": "def calcular_entradas(precio, cantidad):\n    print(precio * cantidad)\n\ncalcular_entradas(2500, 2)",
          "tests": [
            {
              "input": [],
              "expected": "5000"
            }
          ],
          "hints": [
            "La función recibe precio y cantidad.",
            "Multiplica los dos parámetros."
          ],
          "difficulty": "facil",
          "xp": 15,
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
        "title": "Manejar errores de entrada con try y except",
        "objectives": [
          "Reconocer que una conversión puede fallar.",
          "Capturar ValueError mediante try/except.",
          "Dar un mensaje comprensible cuando la entrada no es válida."
        ],
        "explanation": [
          "Los errores de ejecución aparecen mientras el programa trabaja. Por ejemplo, int(\"hola\") produce ValueError porque el texto no representa un entero válido.",
          "try contiene instrucciones que podrían producir una excepción. Si ocurre la excepción indicada en except, Python ejecuta ese bloque en vez de terminar con el error sin tratar.",
          "Captura el tipo de error que realmente esperas. Un except demasiado general puede ocultar problemas de programación; para una conversión numérica, ValueError suele ser la excepción apropiada."
        ],
        "example": "texto = \"veinte\"\ntry:\n    edad = int(texto)\n    print(edad)\nexcept ValueError:\n    print(\"Escribe un número entero\")",
        "exampleOutput": "Escribe un número entero",
        "walkthrough": [
          "Python intenta convertir texto a entero.",
          "La conversión falla y el bloque except ValueError muestra un mensaje alternativo."
        ],
        "commonMistakes": [
          "Usar try/except para esconder cualquier error sin entenderlo.",
          "Poner el código que no puede fallar dentro de try innecesariamente."
        ],
        "exercise": {
          "id": "b4-e5",
          "title": "Validar una conversión",
          "statement": "Intenta convertir el texto \"12a\" a entero. Si se produce ValueError, imprime Entrada inválida.",
          "starterCode": "",
          "solution": "try:\n    numero = int(\"12a\")\n    print(numero)\nexcept ValueError:\n    print(\"Entrada invalida\")",
          "tests": [
            {
              "input": [],
              "expected": "Entrada invalida"
            }
          ],
          "hints": [
            "La conversión int() es la instrucción que puede fallar.",
            "Captura específicamente ValueError."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué excepción se produce normalmente al intentar int(\"hola\")?",
            "options": [
              "IndexError",
              "KeyError",
              "ValueError",
              "FileNotFoundError"
            ],
            "answer": 2,
            "explanation": "ValueError indica que el tipo es correcto para la operación, pero el contenido no representa un entero válido."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 17
      },
      {
        "id": "b4-l6",
        "section": "4.6",
        "title": "Importar y utilizar módulos",
        "objectives": [
          "Explicar qué aporta un módulo.",
          "Importar el módulo math y llamar a una de sus funciones.",
          "Reconocer que la biblioteca estándar ofrece herramientas ya disponibles."
        ],
        "explanation": [
          "Un módulo es un archivo o conjunto de código que ofrece funciones, clases y valores reutilizables. import permite acceder a ese conjunto sin copiar su implementación dentro del programa.",
          "La biblioteca estándar de Python incluye módulos para tareas habituales. math contiene operaciones matemáticas; datetime trabaja con fechas y horas; random permite generar valores pseudoaleatorios.",
          "Al escribir import math, utilizamos la función como math.sqrt(25). El prefijo indica de qué módulo procede y ayuda a evitar confusiones entre nombres."
        ],
        "example": "import math\nradio = 3\narea = math.pi * radio ** 2\nprint(round(area, 2))\nprint(math.sqrt(81))",
        "exampleOutput": "28.27\n9.0",
        "walkthrough": [
          "math.pi proporciona una aproximación de pi.",
          "sqrt() calcula la raíz cuadrada y round() limita los decimales mostrados."
        ],
        "commonMistakes": [
          "Olvidar el prefijo del módulo cuando se importó con import math.",
          "Confundir la función sqrt() con una variable propia llamada math."
        ],
        "exercise": {
          "id": "b4-e6",
          "title": "Calcular una raíz",
          "statement": "Importa math, calcula la raíz cuadrada de 144 usando math.sqrt() e imprime el resultado.",
          "starterCode": "# importa el módulo\n",
          "solution": "import math\nprint(math.sqrt(144))",
          "tests": [
            {
              "input": [],
              "expected": "12.0"
            }
          ],
          "hints": [
            "Escribe import math al inicio.",
            "Llama a math.sqrt() con el número 144."
          ],
          "difficulty": "medio",
          "xp": 15,
          "length": 5
        },
        "questions": [
          {
            "prompt": "Después de escribir import math, ¿cómo se llama a la raíz cuadrada de 49?",
            "options": [
              "sqrt(49) sin prefijo siempre",
              "import.sqrt(49)",
              "math = sqrt(49)",
              "math.sqrt(49)"
            ],
            "answer": 3,
            "explanation": "Con import math se accede a la función mediante math.sqrt()."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 15
      },
      {
        "id": "b4-l7",
        "section": "4.7",
        "title": "Organizar una solución con varias funciones",
        "objectives": [
          "Dividir un problema en tareas pequeñas.",
          "Asignar una responsabilidad clara a cada función.",
          "Conectar funciones mediante parámetros y valores devueltos."
        ],
        "explanation": [
          "Un programa crece mejor cuando se separan responsabilidades. Una función puede calcular un subtotal, otra aplicar un impuesto y otra presentar el resultado; cada parte se entiende y comprueba de forma independiente.",
          "Al diseñar la solución, primero identifica entradas, procesos y salidas. Después asigna una función a cada tarea y decide qué datos necesita y qué resultado debe devolver.",
          "Las funciones no deben duplicar trabajo ni depender de variables globales. Una buena estructura hace más sencillo corregir errores y ampliar el programa cuando aparecen requisitos nuevos."
        ],
        "example": "def subtotal(precio, cantidad):\n    return precio * cantidad\n\ndef con_impuesto(monto):\n    return monto * 1.13\n\nbase = subtotal(1000, 2)\nprint(con_impuesto(base))",
        "exampleOutput": "2260.0",
        "walkthrough": [
          "subtotal calcula el costo base y devuelve un número.",
          "con_impuesto recibe ese resultado y calcula el total con 13% de impuesto."
        ],
        "commonMistakes": [
          "Crear una función enorme que mezcla entrada, cálculo, almacenamiento y salida.",
          "Hacer que una función dependa de variables globales que podrían pasarse como parámetros."
        ],
        "exercise": {
          "id": "b4-e7",
          "title": "Separar cálculo y presentación",
          "statement": "Define una función calcular_promedio(a, b, c) que devuelva el promedio. Luego imprime el promedio de 80, 90 y 100.",
          "starterCode": "",
          "solution": "def calcular_promedio(a, b, c):\n    return (a + b + c) / 3\n\nprint(calcular_promedio(80, 90, 100))",
          "tests": [
            {
              "input": [],
              "expected": "90.0"
            }
          ],
          "hints": [
            "Agrupa el cálculo en una función.",
            "Devuelve la operación y muestra el resultado en la llamada."
          ],
          "difficulty": "medio",
          "xp": 20,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Qué ventaja aporta separar un programa en funciones pequeñas?",
            "options": [
              "Obliga a repetir cada cálculo",
              "Impide usar parámetros",
              "Hace imposible probar partes",
              "Permite aislar responsabilidades y reutilizar tareas"
            ],
            "answer": 3,
            "explanation": "Las funciones pequeñas se pueden entender, reutilizar y probar por separado."
          }
        ],
        "assessment": false,
        "estimatedMinutes": 18
      },
      {
        "id": "b4-l8",
        "section": "4.8",
        "title": "Evaluación del módulo 4: funciones y errores",
        "objectives": [
          "Definir y llamar funciones con parámetros.",
          "Elegir entre print() y return según el objetivo.",
          "Usar excepciones específicas para entradas no válidas."
        ],
        "explanation": [
          "La evaluación final del módulo combina diseño de funciones, parámetros, valores de retorno, alcance y manejo de excepciones. Concéntrate en qué datos recibe cada función y qué resultado entrega.",
          "En los ejercicios, distingue las instrucciones que muestran algo de las que calculan un resultado reutilizable. Comprueba también que una conversión problemática tenga un manejo de error que no oculte otros fallos.",
          "Para el reto práctico, construye primero la función de cálculo y prueba varios argumentos. Después conecta la función a la parte que muestra o valida los datos."
        ],
        "example": "def doble(numero):\n    return numero * 2\n\nprint(doble(6))",
        "exampleOutput": "12",
        "walkthrough": [
          "La función recibe el número como parámetro.",
          "return devuelve el valor que print() muestra."
        ],
        "commonMistakes": [
          "Confundir parámetro con argumento.",
          "Asumir que except captura errores si el código problemático no está dentro del try."
        ],
        "exercise": {
          "id": "b4-e8",
          "title": "Integrar función y validación",
          "statement": "Define una función es_positivo(numero) que devuelva True si el número es mayor que cero. Imprime el resultado para -3.",
          "starterCode": "",
          "solution": "def es_positivo(numero):\n    return numero > 0\n\nprint(es_positivo(-3))",
          "tests": [
            {
              "input": [],
              "expected": "False"
            }
          ],
          "hints": [
            "La comparación devuelve un booleano.",
            "Devuelve la comparación desde la función."
          ],
          "difficulty": "medio",
          "xp": 25,
          "length": 5
        },
        "questions": [
          {
            "prompt": "¿Cuál es la diferencia entre parámetro y argumento?",
            "options": [
              "Son palabras intercambiables en una misma línea",
              "El parámetro aparece en la definición y el argumento se entrega al llamar la función",
              "El argumento solo se utiliza dentro de return",
              "El parámetro siempre debe ser un texto"
            ],
            "answer": 1,
            "explanation": "El parámetro es el nombre en la definición; el argumento es el valor que se pasa al llamar."
          },
          {
            "prompt": "¿Qué sucede cuando una función ejecuta return 25?",
            "options": [
              "Muestra 25 automáticamente en pantalla",
              "Repite la función",
              "Devuelve el valor 25 a quien la llamó",
              "Cierra el intérprete de Python"
            ],
            "answer": 2,
            "explanation": "return entrega el valor de regreso; para mostrarlo se puede envolver la llamada en print()."
          },
          {
            "prompt": "¿Qué bloque maneja una conversión que produce ValueError?",
            "options": [
              "else ValueError",
              "finally ValueError",
              "if ValueError",
              "except ValueError"
            ],
            "answer": 3,
            "explanation": "La excepción se captura mediante un bloque except del tipo adecuado."
          }
        ],
        "assessment": true,
        "estimatedMinutes": 25
      }
    ]
  },
  {
    "id": "module-5",
    "number": "5",
    "title": "Archivos y proyecto integrador",
    "summary": "Guarda información en archivos de texto, valida datos y construye una aplicación de consola que integra las habilidades del curso.",
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
    ]
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
