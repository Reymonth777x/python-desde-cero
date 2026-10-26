export type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type CourseLesson = {
  id: string;
  section: string;
  title: string;
  objectives: string[];
  explanation: string[];
  example: string;
  exercise: string;
  questions: QuizQuestion[];
  assessment?: boolean;
};

export type CourseModule = {
  id: string;
  number: string;
  title: string;
  summary: string;
  lessons: CourseLesson[];
};

const q = (
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
): QuizQuestion => ({ prompt, options, answer, explanation });

const lesson = (
  id: string,
  section: string,
  title: string,
  objective: string,
  explanation: string[],
  example: string,
  exercise: string,
  questions: QuizQuestion[],
  assessment = false,
): CourseLesson => ({
  id,
  section,
  title,
  objectives: [objective],
  explanation,
  example,
  exercise,
  questions,
  assessment,
});

export const courseModules: CourseModule[] = [
  {
    id: 'module-1',
    number: '01',
    title: 'Introducción a Python y la programación',
    summary:
      'Descubre cómo se resuelven problemas con instrucciones y cómo preparar Python para escribir y ejecutar programas.',
    lessons: [
      lesson(
        'lesson-1',
        '1.1',
        'Introducción a la programación',
        'Describir un problema como una secuencia de pasos claros y verificables.',
        [
          'Programar consiste en expresar una solución mediante instrucciones que una computadora puede ejecutar. Antes de escribir código, conviene identificar los datos de entrada, el proceso y el resultado esperado.',
          'Un algoritmo es una secuencia finita y ordenada de pasos. Una receta sencilla puede servir como modelo: recibe datos, transforma esos datos y produce una salida.',
        ],
        'minutos = 90\nhoras = minutos // 60\nresto = minutos % 60\nprint(horas, resto)',
        'Adapta el ejemplo para convertir 135 minutos. Anota qué valor esperas y compruébalo en el laboratorio.',
        [q('¿Qué describe mejor un algoritmo?', ['Una secuencia finita de pasos para resolver un problema', 'Una colección de imágenes del programa', 'El nombre de un lenguaje de programación'], 0, 'Un algoritmo organiza los pasos necesarios para transformar entradas en un resultado.')],
      ),
      lesson(
        'lesson-2',
        '1.2',
        'Introducción a Python',
        'Reconocer Python como un lenguaje y distinguir código fuente de su ejecución.',
        [
          'Python es un lenguaje de propósito general con una sintaxis diseñada para ser legible. El intérprete lee el código y ejecuta las instrucciones en el orden correspondiente.',
          'Los espacios, los nombres y los signos de puntuación forman parte del programa. Un error de sintaxis impide que Python interprete una instrucción; un error de ejecución aparece mientras el programa trabaja.',
        ],
        'print("Hola, Python")\nprint(2 + 3)',
        'Escribe dos instrucciones print: una que muestre tu nombre y otra que muestre el resultado de una suma.',
        [q('¿Qué hace el intérprete de Python?', ['Lee y ejecuta instrucciones Python', 'Convierte cualquier programa en una página web', 'Crea automáticamente una base de datos'], 0, 'El intérprete ejecuta el código Python y comunica errores cuando no puede continuar.')],
      ),
      lesson(
        'lesson-3',
        '1.3',
        'Descargar e instalar Python',
        'Identificar las piezas necesarias para editar y ejecutar un programa local.',
        [
          'En una computadora propia se necesita una instalación de Python 3 y un editor de texto o entorno de desarrollo. La instalación oficial incluye el intérprete; el editor puede ser una aplicación separada.',
          'Después de instalar, se puede verificar la versión desde una terminal. En esta academia el laboratorio usa Pyodide en el navegador, por lo que no tienes que instalar nada para practicar aquí.',
        ],
        'python --version\n# En algunos equipos el comando es: python3 --version',
        'Explica la diferencia entre el intérprete local y el laboratorio del navegador. Prueba el código Python del laboratorio sin instalar programas.',
        [q('¿Qué necesitas para ejecutar Python en una computadora local?', ['Un intérprete de Python y un lugar para escribir código', 'Solamente una hoja de cálculo', 'Una cuenta de administrador de la academia'], 0, 'El intérprete ejecuta Python; un editor facilita escribir y organizar los archivos.')],
      ),
      lesson(
        'lesson-4',
        '1.4',
        'Evaluación del módulo 1',
        'Comprobar los conceptos iniciales de algoritmo, código e intérprete.',
        [
          'Antes de continuar, revisa cómo se representan los pasos de una solución, qué papel cumple el lenguaje y qué distingue un error de sintaxis de uno que ocurre durante la ejecución.',
          'Esta comprobación es original y formativa. Para aprobarla necesitas responder correctamente al menos tres de las cuatro preguntas.',
        ],
        'entrada = 4\nresultado = entrada * 2\nprint(resultado)',
        'Responde las cuatro preguntas. Si una respuesta no es correcta, vuelve a las lecciones del módulo y reintenta.',
        [
          q('¿Cuál es un algoritmo?', ['Pasos ordenados para alcanzar un resultado', 'Un tipo de monitor', 'Una contraseña para Python'], 0, 'Un algoritmo define pasos finitos para resolver un problema.'),
          q('¿Qué ejecuta las instrucciones de Python?', ['El intérprete', 'El teclado', 'El nombre del archivo'], 0, 'El intérprete analiza y ejecuta el programa.'),
          q('¿Cuándo aparece un error de sintaxis?', ['Cuando el código no cumple las reglas del lenguaje', 'Cuando el programa imprime un resultado', 'Cuando se cambia el tamaño de la ventana'], 0, 'La sintaxis determina cómo deben escribirse las instrucciones.'),
          q('¿Qué suele formar parte de un problema computacional?', ['Entradas, proceso y salida', 'Solo una salida sin datos', 'Un botón sin instrucciones'], 0, 'Identificar entradas, proceso y salida ayuda a diseñar una solución.'),
        ],
        true,
      ),
    ],
  },
  {
    id: 'module-2',
    number: '02',
    title: 'Tipos de datos, variables, operadores y entrada/salida',
    summary:
      'Trabaja con valores, expresiones, variables y la comunicación básica de un programa con una persona.',
    lessons: [
      lesson('lesson-1', '2.1', 'Tu primer programa: Hello, World!', 'Mostrar información con print y reconocer una cadena de texto.', ['print() envía un valor a la salida estándar. Una cadena de texto se escribe entre comillas simples o dobles; las comillas no forman parte de lo que se muestra.', 'Cada instrucción se ejecuta en orden. Puedes imprimir varias líneas y combinar texto con valores numéricos.'], 'print("Hola, mundo")\nprint(3 + 4)', 'Cambia el saludo y añade una segunda línea que muestre una operación aritmética.', [q('¿Qué muestra print("Hola")?', ['Hola', '"print"', 'Un error siempre'], 0, 'print muestra el contenido de la cadena, sin las comillas que delimitan el texto.')]),
      lesson('lesson-2', '2.2', 'Literales y tipos de datos', 'Diferenciar enteros, números decimales, cadenas y valores booleanos.', ['Un literal es un valor escrito directamente en el código. Python reconoce, entre otros, enteros (int), decimales (float), cadenas (str) y valores lógicos (bool).', 'El tipo determina qué operaciones tienen sentido. Por ejemplo, sumar dos enteros produce un número; concatenar dos cadenas produce texto.'], 'edad = 16\nprecio = 2.5\nnombre = "Ana"\nactivo = True\nprint(type(precio))', 'Crea una variable de cada tipo y muestra su tipo con type().', [q('¿Cuál es el tipo de 2.5?', ['float', 'str', 'bool'], 0, 'Un número con parte decimal se representa como float.')]),
      lesson('lesson-3', '2.3', 'Operadores y expresiones', 'Aplicar operadores aritméticos y respetar la precedencia.', ['Los operadores +, -, *, /, //, %, y ** permiten construir expresiones. Python evalúa primero los paréntesis, después potencias, multiplicaciones y divisiones, y finalmente sumas y restas.', 'La división / produce un float. La división entera // descarta la parte fraccionaria y % devuelve el residuo.'], 'print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(17 % 5)', 'Calcula cuántos paquetes de 6 unidades se llenan con 29 unidades y cuántas sobran.', [q('¿Qué resultado produce 17 % 5?', ['2', '3', '3.4'], 0, 'Cinco cabe tres veces en 17 y sobran 2; ese residuo lo devuelve %.')]),
      lesson('lesson-4', '2.4', 'Variables y asignación', 'Usar nombres descriptivos para guardar y actualizar valores.', ['Una variable asocia un nombre con un valor. La asignación = guarda el valor de la expresión de la derecha bajo el nombre de la izquierda; no es una igualdad matemática.', 'Los nombres pueden contener letras, números y guion bajo, pero no empezar con un número. Python distingue mayúsculas y minúsculas.'], 'puntos = 10\npuntos = puntos + 5\nprint(puntos)', 'Crea precio y cantidad, calcula total con una nueva variable y muestra el resultado.', [q('¿Qué ocurre en puntos = puntos + 5?', ['Se actualiza puntos sumándole cinco', 'Se comprueba si puntos vale cinco', 'Se crea una igualdad permanente'], 0, 'La expresión de la derecha se calcula y su resultado se asigna al nombre de la izquierda.')]),
      lesson('lesson-5', '2.5', 'Comentarios y legibilidad', 'Añadir comentarios útiles sin cambiar el comportamiento del programa.', ['Un comentario empieza con # y continúa hasta el final de esa línea. Python lo ignora al ejecutar el programa.', 'Los comentarios explican decisiones o intenciones que no son evidentes en el código. Conviene preferir nombres claros y comentarios breves, evitando repetir literalmente lo que ya dice la instrucción.'], '# Calcula el precio con impuesto\nprecio = 100\nimpuesto = 0.13\nprint(precio * (1 + impuesto))', 'Añade un comentario que explique una decisión del programa y deja que el código haga el cálculo.', [q('¿Qué hace Python con el texto después de # en una línea?', ['Lo trata como comentario', 'Lo ejecuta como una variable', 'Lo convierte en número'], 0, 'El texto que sigue a # en una línea es un comentario.')]),
      lesson('lesson-6', '2.6', 'Interacción con la persona usuaria', 'Leer texto con input y convertirlo cuando se necesita un número.', ['input() muestra una invitación opcional y devuelve siempre una cadena. Para hacer cálculos, convierte la respuesta con int() o float() según corresponda.', 'En el laboratorio puedes proporcionar líneas de entrada antes de ejecutar el programa. Cada llamada a input() consume una línea; si faltan líneas, Python informa que la entrada terminó.'], 'nombre = input("Nombre: ")\nedad = int(input("Edad: "))\nprint("Hola", nombre)\nprint(edad + 1)', 'En el laboratorio, proporciona un nombre y una edad en la caja de entrada. Modifica el programa para mostrar la edad del próximo año.', [q('¿Qué tipo devuelve input() antes de convertirlo?', ['str', 'int', 'bool'], 0, 'input devuelve texto; int() o float() convierten ese texto para cálculos.')]),
      lesson('lesson-7', '2.7', 'Evaluación del módulo 2', 'Comprobar el uso de tipos, variables, operadores y entrada/salida.', ['En esta evaluación formativa se combinan literales, asignaciones, precedencia, comentarios y lectura de datos. Necesitas al menos tres respuestas correctas de cuatro para completar el módulo.', 'Si fallas una pregunta, el sistema muestra retroalimentación y te permite revisar el tema antes de intentarlo de nuevo.'], 'unidades = int(input("Unidades: "))\nprecio = 12\nprint(unidades * precio)', 'Responde todas las preguntas. Después prueba el ejemplo en el laboratorio con un valor de entrada.', [q('¿Qué tipo devuelve input()?', ['str', 'float', 'list'], 0, 'La conversión de texto a número debe ser explícita.'), q('¿Qué resultado tiene 2 + 3 * 4?', ['14', '20', '24'], 0, 'La multiplicación se evalúa antes que la suma.'), q('¿Qué operador obtiene el residuo?', ['%', '/', '**'], 0, 'El operador módulo % devuelve el residuo de una división entera.'), q('¿Qué instrucción asigna el resultado a total?', ['total = precio * unidades', 'total == precio * unidades', 'print = precio * unidades'], 0, 'La asignación usa un solo signo igual y guarda el valor calculado.')] , true),
    ],
  },
  {
    id: 'module-3',
    number: '03',
    title: 'Valores booleanos, control de flujo y listas',
    summary:
      'Toma decisiones, repite instrucciones y organiza colecciones de valores mediante listas.',
    lessons: [
      lesson('lesson-1', '3.1', 'Decisiones con if, elif y else', 'Elegir qué bloque ejecutar según una condición.', ['Una condición produce True o False. if ejecuta su bloque cuando la condición es verdadera; elif permite probar otra condición y else cubre los casos restantes.', 'La indentación define los bloques en Python. Mantén el mismo nivel de sangría dentro de cada bloque.'], 'temperatura = 22\nif temperatura >= 30:\n    print("Calor")\nelif temperatura >= 18:\n    print("Templado")\nelse:\n    print("Frío")', 'Crea una condición que indique si una nota es aprobatoria cuando vale al menos 70.', [q('¿Qué bloque cubre los casos que no cumplieron las condiciones anteriores?', ['else', 'elif obligatorio', 'finally'], 0, 'else se ejecuta cuando ninguna condición anterior fue verdadera.')]),
      lesson('lesson-2', '3.2', 'Repetición con while y for', 'Repetir instrucciones con una condición o una secuencia.', ['while repite un bloque mientras su condición sea verdadera; actualiza el estado para evitar que el ciclo sea infinito. for recorre los elementos de una secuencia.', 'range(inicio, fin) produce valores desde inicio hasta antes de fin. Es común usarlo cuando se conoce cuántas repeticiones se necesitan.'], 'for numero in range(1, 4):\n    print(numero)\n\ncontador = 3\nwhile contador > 0:\n    contador -= 1', 'Imprime los números del 1 al 5 con for y luego repite el ejercicio con while.', [q('¿Qué valores produce range(1, 4)?', ['1, 2 y 3', '1, 2, 3 y 4', '0, 1, 2, 3 y 4'], 0, 'El límite final de range no se incluye.')]),
      lesson('lesson-3', '3.3', 'Lógica y operaciones booleanas', 'Combinar condiciones con and, or y not.', ['and requiere que ambas condiciones sean verdaderas; or requiere que al menos una lo sea; not invierte un valor lógico.', 'Las comparaciones como ==, !=, <, <=, > y >= producen booleanos. Puedes agrupar condiciones con paréntesis para hacer explícita la intención.'], 'edad = 20\ntiene_permiso = True\nprint(edad >= 18 and tiene_permiso)', 'Expresa una condición que permita entrar a una actividad si se tiene invitación o se es administrador.', [q('¿Cuándo es verdadero A and B?', ['Cuando A y B son verdaderos', 'Cuando cualquiera es verdadero', 'Cuando ambos son falsos'], 0, 'and exige que sus dos operandos sean verdaderos.')]),
      lesson('lesson-4', '3.4', 'Crear y recorrer listas', 'Guardar varios valores ordenados en una lista.', ['Una lista se escribe entre corchetes y conserva el orden de sus elementos. Los índices empiezan en cero; un índice fuera del rango produce IndexError.', 'len(lista) informa cuántos elementos tiene. Puedes recorrerla directamente con for para procesar cada valor.'], 'colores = ["verde", "crema", "gris"]\nprint(colores[0])\nfor color in colores:\n    print(color)', 'Crea una lista con tres temas que te interesen y muestra cada uno en una línea.', [q('¿Qué índice tiene el primer elemento de una lista?', ['0', '1', '-1 siempre'], 0, 'Los índices de las listas comienzan en cero.')]),
      lesson('lesson-5', '3.5', 'Ordenamiento burbuja', 'Explicar cómo comparaciones vecinas pueden ordenar una lista.', ['El ordenamiento burbuja compara pares adyacentes e intercambia los que están en el orden incorrecto. Cada pasada mueve un valor grande hacia el final.', 'Es un algoritmo fácil de estudiar, aunque no es adecuado para grandes volúmenes. Python ofrece sorted() y list.sort() para programas reales.'], 'datos = [4, 2, 3]\nfor i in range(len(datos) - 1):\n    if datos[i] > datos[i + 1]:\n        datos[i], datos[i + 1] = datos[i + 1], datos[i]\nprint(datos)', 'Traza a mano una pasada del algoritmo con [5, 1, 4]. ¿Qué lista resulta después de comparar pares vecinos una vez?', [q('¿Qué hace una comparación de vecinos en bubble sort?', ['Intercambia el par si está en el orden incorrecto', 'Elimina ambos elementos', 'Convierte la lista en texto'], 0, 'El intercambio local desplaza valores hacia su posición ordenada.')]),
      lesson('lesson-6', '3.6', 'Operaciones con listas', 'Añadir, quitar y consultar elementos de una lista.', ['append(valor) agrega al final, remove(valor) elimina la primera coincidencia y el operador in comprueba pertenencia.', 'Modificar una lista mientras se recorre puede saltarse elementos. Para filtrar, suele ser más claro crear una lista nueva o recorrer una copia.'], 'notas = [80, 65]\nnotas.append(90)\nprint(65 in notas)\nnotas.remove(65)', 'Agrega una cuarta nota, comprueba si una nota aparece y elimina un valor que ya no corresponda.', [q('¿Qué método agrega un elemento al final?', ['append()', 'remove()', 'sort()'], 0, 'append añade un elemento al final de la lista.')]),
      lesson('lesson-7', '3.7', 'Listas: recorridos y patrones', 'Procesar una lista para calcular un resultado agregado.', ['Una acumulación inicia con un valor neutro y actualiza el resultado en cada iteración. Para una suma, el acumulador comienza en cero.', 'Las expresiones por comprensión ofrecen una forma compacta de crear listas; primero domina el recorrido explícito para comprender cada paso.'], 'valores = [3, 5, 2]\ntotal = 0\nfor valor in valores:\n    total += valor\nprint(total)', 'Calcula el promedio de una lista no vacía: suma sus valores y divide entre len(lista).', [q('¿Con qué valor inicia normalmente un acumulador de suma?', ['0', '1', 'None siempre'], 0, 'Cero es el elemento neutro de la suma.')]),
      lesson('lesson-8', '3.8', 'Evaluación del módulo 3', 'Comprobar decisiones, ciclos, lógica y listas.', ['La evaluación reúne conceptos de condiciones, repetición, booleanos y procesamiento de listas. Se aprueba con al menos tres respuestas correctas de cuatro.', 'Revisa la retroalimentación antes de reintentar. Esta prueba original no sustituye la evaluación oficial del curso Cisco.'], 'valores = [2, 4, 6]\nif all(valor % 2 == 0 for valor in valores):\n    print("Todos son pares")', 'Responde las cuatro preguntas y luego cambia el ejemplo para incluir un número impar.', [q('¿Qué tipo de valor produce 5 > 2?', ['bool', 'str', 'list'], 0, 'Una comparación produce True o False.'), q('¿Qué ciclo recorre directamente los valores de una lista?', ['for', 'while sin condición', 'if'], 0, 'for puede recorrer cada elemento de una secuencia.'), q('¿Qué devuelve len([4, 9])?', ['2', '1', '13'], 0, 'La lista contiene dos elementos.'), q('¿Qué operador lógico exige ambas condiciones verdaderas?', ['and', 'or', 'not'], 0, 'and requiere que las dos condiciones se cumplan.')], true),
    ],
  },
  {
    id: 'module-4',
    number: '04',
    title: 'Funciones, tuplas, diccionarios y excepciones',
    summary:
      'Divide programas en funciones y procesa colecciones y errores de forma controlada.',
    lessons: [
      lesson('lesson-1', '4.1', 'Definir y llamar funciones', 'Agrupar instrucciones reutilizables bajo un nombre.', ['def inicia una función. El bloque indentado contiene su cuerpo; la función solo se ejecuta cuando se la llama.', 'Las funciones pequeñas con nombres claros facilitan probar y mantener un programa.'], 'def saludar():\n    print("Hola")\n\nsaludar()', 'Define una función mostrar_inicio que imprima el título de tu proyecto y llámala.', [q('¿Qué palabra inicia una definición de función?', ['def', 'func', 'return'], 0, 'Python usa def para definir una función.')]),
      lesson('lesson-2', '4.2', 'Parámetros y argumentos', 'Enviar información a una función mediante parámetros.', ['Un parámetro es un nombre incluido en la definición; un argumento es el valor que se entrega al llamar la función.', 'Los argumentos posicionales se asocian por orden. Los argumentos con nombre hacen explícita la asociación y permiten mejorar la legibilidad.'], 'def saludar(nombre):\n    print("Hola", nombre)\n\nsaludar("Ada")', 'Modifica la función para recibir nombre y ciudad y producir un saludo con ambos datos.', [q('En saludar("Ada"), ¿qué es "Ada"?', ['Un argumento', 'Un parámetro', 'El nombre de la función'], 0, 'El valor pasado en la llamada es un argumento.')]),
      lesson('lesson-3', '4.3', 'Devolver resultados', 'Usar return para entregar un valor calculado.', ['return termina la llamada y entrega un valor al punto donde se llamó la función. print muestra información, pero no sustituye a return.', 'Un valor devuelto puede guardarse en una variable, combinarse en una expresión o enviarse a otra función.'], 'def area_rectangulo(ancho, alto):\n    return ancho * alto\n\narea = area_rectangulo(4, 3)\nprint(area)', 'Escribe una función que reciba dos números y devuelva el menor de ellos.', [q('¿Qué hace return?', ['Devuelve un valor y finaliza la función', 'Imprime siempre el valor', 'Repite la función'], 0, 'return entrega el resultado al código que llamó la función.')]),
      lesson('lesson-4', '4.4', 'Alcance de las variables', 'Distinguir variables locales de valores globales.', ['Una variable creada dentro de una función es local a esa llamada. Los parámetros también son locales.', 'Preferir parámetros y valores devueltos suele ser más claro que modificar variables globales, porque hace visibles las dependencias.'], 'tasa = 0.13\ndef calcular_impuesto(precio):\n    impuesto = precio * tasa\n    return impuesto\n\nprint(calcular_impuesto(100))', 'Refactoriza el ejemplo para pasar la tasa como segundo parámetro en lugar de leerla desde fuera.', [q('¿Dónde existe una variable local creada dentro de una función?', ['Dentro del ámbito de esa función', 'En todas las funciones automáticamente', 'Solo en el archivo del sistema'], 0, 'Una variable local se define y se usa en el ámbito de la función.')]),
      lesson('lesson-5', '4.5', 'Funciones con varios parámetros', 'Diseñar funciones que reciban varios datos relacionados.', ['Una función puede recibir varios parámetros. El orden de los argumentos posicionales debe corresponder a la definición.', 'Los valores predeterminados permiten omitir argumentos opcionales. Coloca parámetros obligatorios antes de los parámetros con valor predeterminado.'], 'def presentar(nombre, curso="Python PE1"):\n    return f"{nombre} estudia {curso}"\n\nprint(presentar("Sam"))', 'Crea una función convertir_a_minutos que reciba horas y minutos y devuelva el total.', [q('¿Dónde se colocan los parámetros con valor predeterminado?', ['Después de los parámetros obligatorios', 'Antes de todos los parámetros', 'Fuera de los paréntesis'], 0, 'Los parámetros predeterminados van al final de la lista de parámetros.')]),
      lesson('lesson-6', '4.6', 'Tuplas y diccionarios', 'Elegir una colección según cómo se organiza la información.', ['Una tupla almacena una secuencia ordenada que normalmente no se modifica; un diccionario asocia claves únicas con valores.', 'Las tuplas se escriben normalmente con paréntesis; los diccionarios usan llaves y pares clave: valor. Usa una clave descriptiva para recuperar el dato asociado.'], 'coordenada = (9.9, -84.1)\nestudiante = {"nombre": "Luz", "nivel": 1}\nprint(estudiante["nombre"])', 'Crea un diccionario para un libro con título y páginas y muestra el título.', [q('¿Qué estructura permite buscar un valor mediante una clave?', ['dict', 'tuple', 'float'], 0, 'Un diccionario asocia claves con valores.')]),
      lesson('lesson-7', '4.7', 'Manejo de excepciones', 'Responder a un error esperado mediante try y except.', ['Una excepción representa una condición anormal durante la ejecución. try contiene la operación que podría fallar y except describe cómo recuperarse.', 'Captura el tipo de error que esperas. Evita un except general que silencie problemas que no sabes resolver.'], 'texto = "12"\ntry:\n    numero = int(texto)\nexcept ValueError:\n    print("Escribe un entero válido")', 'Prueba int("doce") y captura ValueError mostrando un mensaje que ayude a corregir la entrada.', [q('¿Qué bloque maneja una excepción lanzada dentro de try?', ['except', 'else obligatorio', 'import'], 0, 'except ejecuta el tratamiento previsto para una excepción.')]),
      lesson('lesson-8', '4.8', 'Evaluación del módulo 4', 'Comprobar funciones, alcance, colecciones y excepciones.', ['La evaluación integra funciones y estructuras que permiten organizar un programa. Se aprueba con al menos tres respuestas correctas de cuatro.', 'El contenido es de elaboración propia y sirve como práctica; no es una reproducción de la prueba oficial.'], 'def dividir_seguro(total, partes):\n    if partes == 0:\n        return None\n    return total / partes', 'Responde las preguntas y explica por qué la función devuelve None cuando no se puede dividir.', [q('¿Qué palabra define una función?', ['def', 'class', 'for'], 0, 'def introduce una definición de función.'), q('¿Qué palabra entrega un valor desde una función?', ['return', 'print', 'input'], 0, 'return devuelve un resultado al llamador.'), q('¿Qué colección asocia claves con valores?', ['dict', 'tuple', 'bool'], 0, 'Los diccionarios relacionan claves y valores.'), q('¿Qué bloque maneja errores previstos?', ['except', 'elif', 'while'], 0, 'except captura las excepciones especificadas.')], true),
    ],
  },
];

export function findCourseModule(moduleId: string) {
  return courseModules.find((courseModule) => courseModule.id === moduleId);
}

export function findCourseLesson(moduleId: string, lessonId: string) {
  return findCourseModule(moduleId)?.lessons.find(
    (courseLesson) => courseLesson.id === lessonId,
  );
}

export { gradeQuiz } from './course-grading';
