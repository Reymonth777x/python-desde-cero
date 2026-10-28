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
    title: 'IntroducciÃ³n a Python y la programaciÃ³n',
    summary:
      'Descubre cÃ³mo se resuelven problemas con instrucciones y cÃ³mo preparar Python para escribir y ejecutar programas.',
    lessons: [
      lesson(
        'lesson-1',
        '1.1',
        'IntroducciÃ³n a la programaciÃ³n',
        'Describir un problema como una secuencia de pasos claros y verificables.',
        [
          'Programar consiste en expresar una soluciÃ³n mediante instrucciones que una computadora puede ejecutar. Antes de escribir cÃ³digo, conviene identificar los datos de entrada, el proceso y el resultado esperado.',
          'Un algoritmo es una secuencia finita y ordenada de pasos. Una receta sencilla puede servir como modelo: recibe datos, transforma esos datos y produce una salida.',
        ],
        'minutos = 90\nhoras = minutos // 60\nresto = minutos % 60\nprint(horas, resto)',
        'Adapta el ejemplo para convertir 135 minutos. Anota quÃ© valor esperas y compruÃ©balo en el laboratorio.',
        [q('Â¿QuÃ© describe mejor un algoritmo?', ['Una secuencia finita de pasos para resolver un problema', 'Una colecciÃ³n de imÃ¡genes del programa', 'El nombre de un lenguaje de programaciÃ³n'], 0, 'Un algoritmo organiza los pasos necesarios para transformar entradas en un resultado.')],
      ),
      lesson(
        'lesson-2',
        '1.2',
        'IntroducciÃ³n a Python',
        'Reconocer Python como un lenguaje y distinguir cÃ³digo fuente de su ejecuciÃ³n.',
        [
          'Python es un lenguaje de propÃ³sito general con una sintaxis diseÃ±ada para ser legible. El intÃ©rprete lee el cÃ³digo y ejecuta las instrucciones en el orden correspondiente.',
          'Los espacios, los nombres y los signos de puntuaciÃ³n forman parte del programa. Un error de sintaxis impide que Python interprete una instrucciÃ³n; un error de ejecuciÃ³n aparece mientras el programa trabaja.',
        ],
        'print("Hola, Python")\nprint(2 + 3)',
        'Escribe dos instrucciones print: una que muestre tu nombre y otra que muestre el resultado de una suma.',
        [q('Â¿QuÃ© hace el intÃ©rprete de Python?', ['Lee y ejecuta instrucciones Python', 'Convierte cualquier programa en una pÃ¡gina web', 'Crea automÃ¡ticamente una base de datos'], 0, 'El intÃ©rprete ejecuta el cÃ³digo Python y comunica errores cuando no puede continuar.')],
      ),
      lesson(
        'lesson-3',
        '1.3',
        'Descargar e instalar Python',
        'Identificar las piezas necesarias para editar y ejecutar un programa local.',
        [
          'En una computadora propia se necesita una instalaciÃ³n de Python 3 y un editor de texto o entorno de desarrollo. La instalaciÃ³n oficial incluye el intÃ©rprete; el editor puede ser una aplicaciÃ³n separada.',
          'DespuÃ©s de instalar, se puede verificar la versiÃ³n desde una terminal. En esta academia el laboratorio usa Pyodide en el navegador, por lo que no tienes que instalar nada para practicar aquÃ­.',
        ],
        'python --version\n# En algunos equipos el comando es: python3 --version',
        'Explica la diferencia entre el intÃ©rprete local y el laboratorio del navegador. Prueba el cÃ³digo Python del laboratorio sin instalar programas.',
        [q('Â¿QuÃ© necesitas para ejecutar Python en una computadora local?', ['Un intÃ©rprete de Python y un lugar para escribir cÃ³digo', 'Solamente una hoja de cÃ¡lculo', 'Una cuenta de administrador de la academia'], 0, 'El intÃ©rprete ejecuta Python; un editor facilita escribir y organizar los archivos.')],
      ),
      lesson(
        'lesson-4',
        '1.4',
        'EvaluaciÃ³n del mÃ³dulo 1',
        'Comprobar los conceptos iniciales de algoritmo, cÃ³digo e intÃ©rprete.',
        [
          'Antes de continuar, revisa cÃ³mo se representan los pasos de una soluciÃ³n, quÃ© papel cumple el lenguaje y quÃ© distingue un error de sintaxis de uno que ocurre durante la ejecuciÃ³n.',
          'Esta comprobaciÃ³n es original y formativa. Para aprobarla necesitas responder correctamente al menos tres de las cuatro preguntas.',
        ],
        'entrada = 4\nresultado = entrada * 2\nprint(resultado)',
        'Responde las cuatro preguntas. Si una respuesta no es correcta, vuelve a las lecciones del mÃ³dulo y reintenta.',
        [
          q('Â¿CuÃ¡l es un algoritmo?', ['Pasos ordenados para alcanzar un resultado', 'Un tipo de monitor', 'Una contraseÃ±a para Python'], 0, 'Un algoritmo define pasos finitos para resolver un problema.'),
          q('Â¿QuÃ© ejecuta las instrucciones de Python?', ['El intÃ©rprete', 'El teclado', 'El nombre del archivo'], 0, 'El intÃ©rprete analiza y ejecuta el programa.'),
          q('Â¿CuÃ¡ndo aparece un error de sintaxis?', ['Cuando el cÃ³digo no cumple las reglas del lenguaje', 'Cuando el programa imprime un resultado', 'Cuando se cambia el tamaÃ±o de la ventana'], 0, 'La sintaxis determina cÃ³mo deben escribirse las instrucciones.'),
          q('Â¿QuÃ© suele formar parte de un problema computacional?', ['Entradas, proceso y salida', 'Solo una salida sin datos', 'Un botÃ³n sin instrucciones'], 0, 'Identificar entradas, proceso y salida ayuda a diseÃ±ar una soluciÃ³n.'),
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
      'Trabaja con valores, expresiones, variables y la comunicaciÃ³n bÃ¡sica de un programa con una persona.',
    lessons: [
      lesson('lesson-1', '2.1', 'Tu primer programa: Hello, World!', 'Mostrar informaciÃ³n con print y reconocer una cadena de texto.', ['print() envÃ­a un valor a la salida estÃ¡ndar. Una cadena de texto se escribe entre comillas simples o dobles; las comillas no forman parte de lo que se muestra.', 'Cada instrucciÃ³n se ejecuta en orden. Puedes imprimir varias lÃ­neas y combinar texto con valores numÃ©ricos.'], 'print("Hola, mundo")\nprint(3 + 4)', 'Cambia el saludo y aÃ±ade una segunda lÃ­nea que muestre una operaciÃ³n aritmÃ©tica.', [q('Â¿QuÃ© muestra print("Hola")?', ['Hola', '"print"', 'Un error siempre'], 0, 'print muestra el contenido de la cadena, sin las comillas que delimitan el texto.')]),
      lesson('lesson-2', '2.2', 'Literales y tipos de datos', 'Diferenciar enteros, nÃºmeros decimales, cadenas y valores booleanos.', ['Un literal es un valor escrito directamente en el cÃ³digo. Python reconoce, entre otros, enteros (int), decimales (float), cadenas (str) y valores lÃ³gicos (bool).', 'El tipo determina quÃ© operaciones tienen sentido. Por ejemplo, sumar dos enteros produce un nÃºmero; concatenar dos cadenas produce texto.'], 'edad = 16\nprecio = 2.5\nnombre = "Ana"\nactivo = True\nprint(type(precio))', 'Crea una variable de cada tipo y muestra su tipo con type().', [q('Â¿CuÃ¡l es el tipo de 2.5?', ['float', 'str', 'bool'], 0, 'Un nÃºmero con parte decimal se representa como float.')]),
      lesson('lesson-3', '2.3', 'Operadores y expresiones', 'Aplicar operadores aritmÃ©ticos y respetar la precedencia.', ['Los operadores +, -, *, /, //, %, y ** permiten construir expresiones. Python evalÃºa primero los parÃ©ntesis, despuÃ©s potencias, multiplicaciones y divisiones, y finalmente sumas y restas.', 'La divisiÃ³n / produce un float. La divisiÃ³n entera // descarta la parte fraccionaria y % devuelve el residuo.'], 'print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(17 % 5)', 'Calcula cuÃ¡ntos paquetes de 6 unidades se llenan con 29 unidades y cuÃ¡ntas sobran.', [q('Â¿QuÃ© resultado produce 17 % 5?', ['2', '3', '3.4'], 0, 'Cinco cabe tres veces en 17 y sobran 2; ese residuo lo devuelve %.')]),
      lesson('lesson-4', '2.4', 'Variables y asignaciÃ³n', 'Usar nombres descriptivos para guardar y actualizar valores.', ['Una variable asocia un nombre con un valor. La asignaciÃ³n = guarda el valor de la expresiÃ³n de la derecha bajo el nombre de la izquierda; no es una igualdad matemÃ¡tica.', 'Los nombres pueden contener letras, nÃºmeros y guion bajo, pero no empezar con un nÃºmero. Python distingue mayÃºsculas y minÃºsculas.'], 'puntos = 10\npuntos = puntos + 5\nprint(puntos)', 'Crea precio y cantidad, calcula total con una nueva variable y muestra el resultado.', [q('Â¿QuÃ© ocurre en puntos = puntos + 5?', ['Se actualiza puntos sumÃ¡ndole cinco', 'Se comprueba si puntos vale cinco', 'Se crea una igualdad permanente'], 0, 'La expresiÃ³n de la derecha se calcula y su resultado se asigna al nombre de la izquierda.')]),
      lesson('lesson-5', '2.5', 'Comentarios y legibilidad', 'AÃ±adir comentarios Ãºtiles sin cambiar el comportamiento del programa.', ['Un comentario empieza con # y continÃºa hasta el final de esa lÃ­nea. Python lo ignora al ejecutar el programa.', 'Los comentarios explican decisiones o intenciones que no son evidentes en el cÃ³digo. Conviene preferir nombres claros y comentarios breves, evitando repetir literalmente lo que ya dice la instrucciÃ³n.'], '# Calcula el precio con impuesto\nprecio = 100\nimpuesto = 0.13\nprint(precio * (1 + impuesto))', 'AÃ±ade un comentario que explique una decisiÃ³n del programa y deja que el cÃ³digo haga el cÃ¡lculo.', [q('Â¿QuÃ© hace Python con el texto despuÃ©s de # en una lÃ­nea?', ['Lo trata como comentario', 'Lo ejecuta como una variable', 'Lo convierte en nÃºmero'], 0, 'El texto que sigue a # en una lÃ­nea es un comentario.')]),
      lesson('lesson-6', '2.6', 'InteracciÃ³n con la persona usuaria', 'Leer texto con input y convertirlo cuando se necesita un nÃºmero.', ['input() muestra una invitaciÃ³n opcional y devuelve siempre una cadena. Para hacer cÃ¡lculos, convierte la respuesta con int() o float() segÃºn corresponda.', 'En el laboratorio puedes proporcionar lÃ­neas de entrada antes de ejecutar el programa. Cada llamada a input() consume una lÃ­nea; si faltan lÃ­neas, Python informa que la entrada terminÃ³.'], 'nombre = input("Nombre: ")\nedad = int(input("Edad: "))\nprint("Hola", nombre)\nprint(edad + 1)', 'En el laboratorio, proporciona un nombre y una edad en la caja de entrada. Modifica el programa para mostrar la edad del prÃ³ximo aÃ±o.', [q('Â¿QuÃ© tipo devuelve input() antes de convertirlo?', ['str', 'int', 'bool'], 0, 'input devuelve texto; int() o float() convierten ese texto para cÃ¡lculos.')]),
      lesson('lesson-7', '2.7', 'EvaluaciÃ³n del mÃ³dulo 2', 'Comprobar el uso de tipos, variables, operadores y entrada/salida.', ['En esta evaluaciÃ³n formativa se combinan literales, asignaciones, precedencia, comentarios y lectura de datos. Necesitas al menos tres respuestas correctas de cuatro para completar el mÃ³dulo.', 'Si fallas una pregunta, el sistema muestra retroalimentaciÃ³n y te permite revisar el tema antes de intentarlo de nuevo.'], 'unidades = int(input("Unidades: "))\nprecio = 12\nprint(unidades * precio)', 'Responde todas las preguntas. DespuÃ©s prueba el ejemplo en el laboratorio con un valor de entrada.', [q('Â¿QuÃ© tipo devuelve input()?', ['str', 'float', 'list'], 0, 'La conversiÃ³n de texto a nÃºmero debe ser explÃ­cita.'), q('Â¿QuÃ© resultado tiene 2 + 3 * 4?', ['14', '20', '24'], 0, 'La multiplicaciÃ³n se evalÃºa antes que la suma.'), q('Â¿QuÃ© operador obtiene el residuo?', ['%', '/', '**'], 0, 'El operador mÃ³dulo % devuelve el residuo de una divisiÃ³n entera.'), q('Â¿QuÃ© instrucciÃ³n asigna el resultado a total?', ['total = precio * unidades', 'total == precio * unidades', 'print = precio * unidades'], 0, 'La asignaciÃ³n usa un solo signo igual y guarda el valor calculado.')] , true),
    ],
  },
  {
    id: 'module-3',
    number: '03',
    title: 'Valores booleanos, control de flujo y listas',
    summary:
      'Toma decisiones, repite instrucciones y organiza colecciones de valores mediante listas.',
    lessons: [
      lesson('lesson-1', '3.1', 'Decisiones con if, elif y else', 'Elegir quÃ© bloque ejecutar segÃºn una condiciÃ³n.', ['Una condiciÃ³n produce True o False. if ejecuta su bloque cuando la condiciÃ³n es verdadera; elif permite probar otra condiciÃ³n y else cubre los casos restantes.', 'La indentaciÃ³n define los bloques en Python. MantÃ©n el mismo nivel de sangrÃ­a dentro de cada bloque.'], 'temperatura = 22\nif temperatura >= 30:\n    print("Calor")\nelif temperatura >= 18:\n    print("Templado")\nelse:\n    print("FrÃ­o")', 'Crea una condiciÃ³n que indique si una nota es aprobatoria cuando vale al menos 70.', [q('Â¿QuÃ© bloque cubre los casos que no cumplieron las condiciones anteriores?', ['else', 'elif obligatorio', 'finally'], 0, 'else se ejecuta cuando ninguna condiciÃ³n anterior fue verdadera.')]),
      lesson('lesson-2', '3.2', 'RepeticiÃ³n con while y for', 'Repetir instrucciones con una condiciÃ³n o una secuencia.', ['while repite un bloque mientras su condiciÃ³n sea verdadera; actualiza el estado para evitar que el ciclo sea infinito. for recorre los elementos de una secuencia.', 'range(inicio, fin) produce valores desde inicio hasta antes de fin. Es comÃºn usarlo cuando se conoce cuÃ¡ntas repeticiones se necesitan.'], 'for numero in range(1, 4):\n    print(numero)\n\ncontador = 3\nwhile contador > 0:\n    contador -= 1', 'Imprime los nÃºmeros del 1 al 5 con for y luego repite el ejercicio con while.', [q('Â¿QuÃ© valores produce range(1, 4)?', ['1, 2 y 3', '1, 2, 3 y 4', '0, 1, 2, 3 y 4'], 0, 'El lÃ­mite final de range no se incluye.')]),
      lesson('lesson-3', '3.3', 'LÃ³gica y operaciones booleanas', 'Combinar condiciones con and, or y not.', ['and requiere que ambas condiciones sean verdaderas; or requiere que al menos una lo sea; not invierte un valor lÃ³gico.', 'Las comparaciones como ==, !=, <, <=, > y >= producen booleanos. Puedes agrupar condiciones con parÃ©ntesis para hacer explÃ­cita la intenciÃ³n.'], 'edad = 20\ntiene_permiso = True\nprint(edad >= 18 and tiene_permiso)', 'Expresa una condiciÃ³n que permita entrar a una actividad si se tiene invitaciÃ³n o se es administrador.', [q('Â¿CuÃ¡ndo es verdadero A and B?', ['Cuando A y B son verdaderos', 'Cuando cualquiera es verdadero', 'Cuando ambos son falsos'], 0, 'and exige que sus dos operandos sean verdaderos.')]),
      lesson('lesson-4', '3.4', 'Crear y recorrer listas', 'Guardar varios valores ordenados en una lista.', ['Una lista se escribe entre corchetes y conserva el orden de sus elementos. Los Ã­ndices empiezan en cero; un Ã­ndice fuera del rango produce IndexError.', 'len(lista) informa cuÃ¡ntos elementos tiene. Puedes recorrerla directamente con for para procesar cada valor.'], 'colores = ["verde", "crema", "gris"]\nprint(colores[0])\nfor color in colores:\n    print(color)', 'Crea una lista con tres temas que te interesen y muestra cada uno en una lÃ­nea.', [q('Â¿QuÃ© Ã­ndice tiene el primer elemento de una lista?', ['0', '1', '-1 siempre'], 0, 'Los Ã­ndices de las listas comienzan en cero.')]),
      lesson('lesson-5', '3.5', 'Ordenamiento burbuja', 'Explicar cÃ³mo comparaciones vecinas pueden ordenar una lista.', ['El ordenamiento burbuja compara pares adyacentes e intercambia los que estÃ¡n en el orden incorrecto. Cada pasada mueve un valor grande hacia el final.', 'Es un algoritmo fÃ¡cil de estudiar, aunque no es adecuado para grandes volÃºmenes. Python ofrece sorted() y list.sort() para programas reales.'], 'datos = [4, 2, 3]\nfor i in range(len(datos) - 1):\n    if datos[i] > datos[i + 1]:\n        datos[i], datos[i + 1] = datos[i + 1], datos[i]\nprint(datos)', 'Traza a mano una pasada del algoritmo con [5, 1, 4]. Â¿QuÃ© lista resulta despuÃ©s de comparar pares vecinos una vez?', [q('Â¿QuÃ© hace una comparaciÃ³n de vecinos en bubble sort?', ['Intercambia el par si estÃ¡ en el orden incorrecto', 'Elimina ambos elementos', 'Convierte la lista en texto'], 0, 'El intercambio local desplaza valores hacia su posiciÃ³n ordenada.')]),
      lesson('lesson-6', '3.6', 'Operaciones con listas', 'AÃ±adir, quitar y consultar elementos de una lista.', ['append(valor) agrega al final, remove(valor) elimina la primera coincidencia y el operador in comprueba pertenencia.', 'Modificar una lista mientras se recorre puede saltarse elementos. Para filtrar, suele ser mÃ¡s claro crear una lista nueva o recorrer una copia.'], 'notas = [80, 65]\nnotas.append(90)\nprint(65 in notas)\nnotas.remove(65)', 'Agrega una cuarta nota, comprueba si una nota aparece y elimina un valor que ya no corresponda.', [q('Â¿QuÃ© mÃ©todo agrega un elemento al final?', ['append()', 'remove()', 'sort()'], 0, 'append aÃ±ade un elemento al final de la lista.')]),
      lesson('lesson-7', '3.7', 'Listas: recorridos y patrones', 'Procesar una lista para calcular un resultado agregado.', ['Una acumulaciÃ³n inicia con un valor neutro y actualiza el resultado en cada iteraciÃ³n. Para una suma, el acumulador comienza en cero.', 'Las expresiones por comprensiÃ³n ofrecen una forma compacta de crear listas; primero domina el recorrido explÃ­cito para comprender cada paso.'], 'valores = [3, 5, 2]\ntotal = 0\nfor valor in valores:\n    total += valor\nprint(total)', 'Calcula el promedio de una lista no vacÃ­a: suma sus valores y divide entre len(lista).', [q('Â¿Con quÃ© valor inicia normalmente un acumulador de suma?', ['0', '1', 'None siempre'], 0, 'Cero es el elemento neutro de la suma.')]),
      lesson('lesson-8', '3.8', 'EvaluaciÃ³n del mÃ³dulo 3', 'Comprobar decisiones, ciclos, lÃ³gica y listas.', ['La evaluaciÃ³n reÃºne conceptos de condiciones, repeticiÃ³n, booleanos y procesamiento de listas. Se aprueba con al menos tres respuestas correctas de cuatro.', 'Revisa la retroalimentaciÃ³n antes de reintentar. Esta prueba original no sustituye la evaluaciÃ³n oficial del curso.'], 'valores = [2, 4, 6]\nif all(valor % 2 == 0 for valor in valores):\n    print("Todos son pares")', 'Responde las cuatro preguntas y luego cambia el ejemplo para incluir un nÃºmero impar.', [q('Â¿QuÃ© tipo de valor produce 5 > 2?', ['bool', 'str', 'list'], 0, 'Una comparaciÃ³n produce True o False.'), q('Â¿QuÃ© ciclo recorre directamente los valores de una lista?', ['for', 'while sin condiciÃ³n', 'if'], 0, 'for puede recorrer cada elemento de una secuencia.'), q('Â¿QuÃ© devuelve len([4, 9])?', ['2', '1', '13'], 0, 'La lista contiene dos elementos.'), q('Â¿QuÃ© operador lÃ³gico exige ambas condiciones verdaderas?', ['and', 'or', 'not'], 0, 'and requiere que las dos condiciones se cumplan.')], true),
    ],
  },
  {
    id: 'module-4',
    number: '04',
    title: 'Funciones, tuplas, diccionarios y excepciones',
    summary:
      'Divide programas en funciones y procesa colecciones y errores de forma controlada.',
    lessons: [
      lesson('lesson-1', '4.1', 'Definir y llamar funciones', 'Agrupar instrucciones reutilizables bajo un nombre.', ['def inicia una funciÃ³n. El bloque indentado contiene su cuerpo; la funciÃ³n solo se ejecuta cuando se la llama.', 'Las funciones pequeÃ±as con nombres claros facilitan probar y mantener un programa.'], 'def saludar():\n    print("Hola")\n\nsaludar()', 'Define una funciÃ³n mostrar_inicio que imprima el tÃ­tulo de tu proyecto y llÃ¡mala.', [q('Â¿QuÃ© palabra inicia una definiciÃ³n de funciÃ³n?', ['def', 'func', 'return'], 0, 'Python usa def para definir una funciÃ³n.')]),
      lesson('lesson-2', '4.2', 'ParÃ¡metros y argumentos', 'Enviar informaciÃ³n a una funciÃ³n mediante parÃ¡metros.', ['Un parÃ¡metro es un nombre incluido en la definiciÃ³n; un argumento es el valor que se entrega al llamar la funciÃ³n.', 'Los argumentos posicionales se asocian por orden. Los argumentos con nombre hacen explÃ­cita la asociaciÃ³n y permiten mejorar la legibilidad.'], 'def saludar(nombre):\n    print("Hola", nombre)\n\nsaludar("Ada")', 'Modifica la funciÃ³n para recibir nombre y ciudad y producir un saludo con ambos datos.', [q('En saludar("Ada"), Â¿quÃ© es "Ada"?', ['Un argumento', 'Un parÃ¡metro', 'El nombre de la funciÃ³n'], 0, 'El valor pasado en la llamada es un argumento.')]),
      lesson('lesson-3', '4.3', 'Devolver resultados', 'Usar return para entregar un valor calculado.', ['return termina la llamada y entrega un valor al punto donde se llamÃ³ la funciÃ³n. print muestra informaciÃ³n, pero no sustituye a return.', 'Un valor devuelto puede guardarse en una variable, combinarse en una expresiÃ³n o enviarse a otra funciÃ³n.'], 'def area_rectangulo(ancho, alto):\n    return ancho * alto\n\narea = area_rectangulo(4, 3)\nprint(area)', 'Escribe una funciÃ³n que reciba dos nÃºmeros y devuelva el menor de ellos.', [q('Â¿QuÃ© hace return?', ['Devuelve un valor y finaliza la funciÃ³n', 'Imprime siempre el valor', 'Repite la funciÃ³n'], 0, 'return entrega el resultado al cÃ³digo que llamÃ³ la funciÃ³n.')]),
      lesson('lesson-4', '4.4', 'Alcance de las variables', 'Distinguir variables locales de valores globales.', ['Una variable creada dentro de una funciÃ³n es local a esa llamada. Los parÃ¡metros tambiÃ©n son locales.', 'Preferir parÃ¡metros y valores devueltos suele ser mÃ¡s claro que modificar variables globales, porque hace visibles las dependencias.'], 'tasa = 0.13\ndef calcular_impuesto(precio):\n    impuesto = precio * tasa\n    return impuesto\n\nprint(calcular_impuesto(100))', 'Refactoriza el ejemplo para pasar la tasa como segundo parÃ¡metro en lugar de leerla desde fuera.', [q('Â¿DÃ³nde existe una variable local creada dentro de una funciÃ³n?', ['Dentro del Ã¡mbito de esa funciÃ³n', 'En todas las funciones automÃ¡ticamente', 'Solo en el archivo del sistema'], 0, 'Una variable local se define y se usa en el Ã¡mbito de la funciÃ³n.')]),
      lesson('lesson-5', '4.5', 'Funciones con varios parÃ¡metros', 'DiseÃ±ar funciones que reciban varios datos relacionados.', ['Una funciÃ³n puede recibir varios parÃ¡metros. El orden de los argumentos posicionales debe corresponder a la definiciÃ³n.', 'Los valores predeterminados permiten omitir argumentos opcionales. Coloca parÃ¡metros obligatorios antes de los parÃ¡metros con valor predeterminado.'], 'def presentar(nombre, curso="Python desde cero"):\n    return f"{nombre} estudia {curso}"\n\nprint(presentar("Sam"))', 'Crea una funciÃ³n convertir_a_minutos que reciba horas y minutos y devuelva el total.', [q('Â¿DÃ³nde se colocan los parÃ¡metros con valor predeterminado?', ['DespuÃ©s de los parÃ¡metros obligatorios', 'Antes de todos los parÃ¡metros', 'Fuera de los parÃ©ntesis'], 0, 'Los parÃ¡metros predeterminados van al final de la lista de parÃ¡metros.')]),
      lesson('lesson-6', '4.6', 'Tuplas y diccionarios', 'Elegir una colecciÃ³n segÃºn cÃ³mo se organiza la informaciÃ³n.', ['Una tupla almacena una secuencia ordenada que normalmente no se modifica; un diccionario asocia claves Ãºnicas con valores.', 'Las tuplas se escriben normalmente con parÃ©ntesis; los diccionarios usan llaves y pares clave: valor. Usa una clave descriptiva para recuperar el dato asociado.'], 'coordenada = (9.9, -84.1)\nestudiante = {"nombre": "Luz", "nivel": 1}\nprint(estudiante["nombre"])', 'Crea un diccionario para un libro con tÃ­tulo y pÃ¡ginas y muestra el tÃ­tulo.', [q('Â¿QuÃ© estructura permite buscar un valor mediante una clave?', ['dict', 'tuple', 'float'], 0, 'Un diccionario asocia claves con valores.')]),
      lesson('lesson-7', '4.7', 'Manejo de excepciones', 'Responder a un error esperado mediante try y except.', ['Una excepciÃ³n representa una condiciÃ³n anormal durante la ejecuciÃ³n. try contiene la operaciÃ³n que podrÃ­a fallar y except describe cÃ³mo recuperarse.', 'Captura el tipo de error que esperas. Evita un except general que silencie problemas que no sabes resolver.'], 'texto = "12"\ntry:\n    numero = int(texto)\nexcept ValueError:\n    print("Escribe un entero vÃ¡lido")', 'Prueba int("doce") y captura ValueError mostrando un mensaje que ayude a corregir la entrada.', [q('Â¿QuÃ© bloque maneja una excepciÃ³n lanzada dentro de try?', ['except', 'else obligatorio', 'import'], 0, 'except ejecuta el tratamiento previsto para una excepciÃ³n.')]),
      lesson('lesson-8', '4.8', 'EvaluaciÃ³n del mÃ³dulo 4', 'Comprobar funciones, alcance, colecciones y excepciones.', ['La evaluaciÃ³n integra funciones y estructuras que permiten organizar un programa. Se aprueba con al menos tres respuestas correctas de cuatro.', 'El contenido es de elaboraciÃ³n propia y sirve como prÃ¡ctica; no es una reproducciÃ³n de la prueba oficial.'], 'def dividir_seguro(total, partes):\n    if partes == 0:\n        return None\n    return total / partes', 'Responde las preguntas y explica por quÃ© la funciÃ³n devuelve None cuando no se puede dividir.', [q('Â¿QuÃ© palabra define una funciÃ³n?', ['def', 'class', 'for'], 0, 'def introduce una definiciÃ³n de funciÃ³n.'), q('Â¿QuÃ© palabra entrega un valor desde una funciÃ³n?', ['return', 'print', 'input'], 0, 'return devuelve un resultado al llamador.'), q('Â¿QuÃ© colecciÃ³n asocia claves con valores?', ['dict', 'tuple', 'bool'], 0, 'Los diccionarios relacionan claves y valores.'), q('Â¿QuÃ© bloque maneja errores previstos?', ['except', 'elif', 'while'], 0, 'except captura las excepciones especificadas.')], true),
    ],
  },
  {
    id: 'module-5',
    number: '05',
    title: 'Cadenas de texto, archivos y mÃ³dulos',
    summary: 'Trabaja con cadenas de caracteres, lectura y escritura de archivos, y la organizaciÃ³n de cÃ³digo en mÃ³dulos reutilizables.',
    lessons: [
      lesson(
        'lesson-1',
        '5.1',
        'Cadenas de texto y mÃ©todos comunes',
        'Manipular cadenas: longitud, recorte, bÃºsqueda y cambio de mayÃºsculas.',
        ['Una cadena es una secuencia de caracteres. len(cadena) devuelve cuÃ¡ntos caracteres tiene.', 'MÃ©todos como .upper(), .lower(), .strip(), .find() y el acceso por Ã­ndice [n] permiten leer y transformar texto.'], 'mensaje = "  Hola Python  "\\nprint(len(mensaje))\\nprint(mensaje.strip().upper())\\nprint(mensaje.find("Python"))', 'Crea una cadena con tu nombre, elimina espacios sobrantes y muestra el resultado en mayÃºsculas.', [q('Â¿QuÃ© devuelve len("hola")?', ['4', '5', '3'], 0, 'La cadena "hola" tiene cuatro caracteres.')]),
      lesson(
        'lesson-2',
        '5.2',
        'Lectura y escritura de archivos',
        'Guardar y recuperar informaciÃ³n usando open().',
        ['open() abre un archivo para leer ("r") o escribir ("w"). Siempre conviene cerrar el archivo o usar with para que se cierre automÃ¡ticamente.', 'Escribir en modo "w" sobrescribe el contenido existente; modo "a" aÃ±ade al final sin borrar.'], 'with open("notas.txt", "w", encoding="utf-8") as archivo:\\n    archivo.write("LecciÃ³n completada\\\\n")\\n\\nwith open("notas.txt", "r", encoding="utf-8") as archivo:\\n    print(archivo.read())', 'Escribe un programa que guarde tu nombre en un archivo y luego lo lea y lo muestre.', [q('Â¿QuÃ© modo de open() sobrescribe el archivo?', ['"w"', '"r"', '"a"'], 0, 'El modo "w" abre para escritura y sobrescribe el contenido previo.')]),
      lesson(
        'lesson-3',
        '5.3',
        'MÃ³dulos y paquetes con import',
        'Organizar el cÃ³digo en archivos reutilizables.',
        ['import matematica carga un mÃ³dulo llamado matematica para usar sus funciones.', 'from nombre_modulo import funcion permite usar una funciÃ³n directamente sin el prefijo del mÃ³dulo.', 'La biblioteca estÃ¡ndar de Python incluye mÃ³dulos como math, random y datetime.'], 'import math\\nprint(math.sqrt(16))\\n\\nfrom random import randint\\nprint(randint(1, 10))', 'Escribe un programa que use math para calcular la raÃ­z cuadrada de un nÃºmero y muestre el resultado.', [q('Â¿QuÃ© hace import math?', ['Carga el mÃ³dulo math para usar sus funciones', 'Crea una carpeta llamada math', 'Ejecuta un programa llamado math'], 0, 'import math carga el mÃ³dulo estÃ¡ndar math para usar funciones como sqrt.')]),
      lesson(
        'lesson-4',
        '5.4',
        'EvaluaciÃ³n del mÃ³dulo 5',
        'Comprobar cadenas, archivos y mÃ³dulos.',
        ['Esta evaluaciÃ³n integra la manipulaciÃ³n de texto, el trabajo con archivos y la organizaciÃ³n en mÃ³dulos. Se aprueba con al menos tres respuestas correctas de cuatro.', 'El contenido es de elaboraciÃ³n propia y sirve como prÃ¡ctica; no es una reproducciÃ³n de la prueba oficial.'], 'nombre = "  Ana  "\\nprint(nombre.strip().lower())', 'Responde las preguntas y explica por quÃ© es importante cerrar los archivos despuÃ©s de usarlos.', [q('Â¿QuÃ© mÃ©todo convierte una cadena a mayÃºsculas?', ['.upper()', '.lower()', '.strip()'], 0, '.upper() devuelve la cadena en mayÃºsculas.')], true),
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
