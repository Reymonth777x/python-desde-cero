export type QuizQuestion = { prompt: string; options: string[]; answer: number; explanation: string; };
export type CourseExercise = { id: string; title: string; statement: string; starterCode: string; solution: string; tests: Array<{ input: string[]; expected: string }>; hints: string[]; difficulty: 'facil' | 'medio' | 'dificil'; xp: number; length: number; };
export type CourseLesson = { id: string; section: string; title: string; objectives: string[]; explanation: string[]; example: string; exercise: CourseExercise; questions: QuizQuestion[]; assessment?: boolean; };
export type CourseModule = { id: string; number: string; title: string; summary: string; lessons: CourseLesson[]; };
const q = (p: string, o: string[], a: number, e: string): QuizQuestion => ({ prompt: p, options: o, answer: a, explanation: e });
const exercise = (id: string, t: string, s: string, sc: string, sol: string, ts: Array<{ input: string[]; expected: string }>, h: string[], d: 'facil' | 'medio' | 'dificil', x: number, len: number = 1): CourseExercise => ({ id, title: t, statement: s, starterCode: sc, solution: sol, tests: ts, hints: h, difficulty: d, xp: x, length: len });
const lesson = (id: string, sec: string, t: string, obj: string[], exp: string[], ex: string, exer: CourseExercise, qs: QuizQuestion[], as = false): CourseLesson => ({ id, section: sec, title: t, objectives: obj, explanation: exp, example: ex, exercise: exer, questions: qs, assessment: as });
const b1e1 = exercise('b1-e1', 'Hola, cocina', 'Imprime: "Hola, cocina".', '', 'print("Hola, cocina")', [{ input: [], expected: 'Hola, cocina' }], ['Usa print() con comillas.'], 'facil', 10);
const b1e2 = exercise('b1-e2', 'Variables', 'Crea plato = "Paella" e imprímela.', 'plato = ', 'plato = "Paella"\nprint(plato)', [{ input: [], expected: 'Paella' }], ['Usa = para asignar.'], 'facil', 10);
const b1e3 = exercise('b1-e3', 'Operadores', 'Dadas a=8 y b=12, imprime a+b.', 'a = 8\nb = 12\n', 'a = 8\nb = 12\nprint(a + b)', [{ input: [], expected: '20' }], ['Usa + para sumar.'], 'facil', 15);
const b1e4 = exercise('b1-e4', 'Entrada y salida', 'Pide el nombre con input() e imprímelo.', '', 'nombre = input()\nprint(nombre)', [{ input: ['Ana'], expected: 'Ana' }], ['Usa input() para leer.'], 'facil', 15);
const b1q1 = q('¿Qué imprime print(3 + 2 * 2)?', ['10', '7', '5', '12'], 1, 'Multiplicación primero: 2*2=4, luego 3+4=7.');
const b1q2 = q('¿Cómo se llama a una función?', ['llamar(func)', 'func()', 'ejecutar func', 'run func'], 1, 'Escribe el nombre con paréntesis: func().');
const b1q3 = q('¿Qué tipo es "25"?', ['int', 'float', 'str', 'bool'], 2, 'Texto entre comillas es str.');
const b1q4 = q('¿Qué hace int("10")?', ['Convierte "10" al número 10', 'Devuelve 10 como texto', 'Da error', 'Devuelve 1.0'], 0, 'int() convierte texto en número.');

const modulo1 = {
  id: 'module-1',
  number: '1',
  title: 'Preparar la cocina',
  summary: 'Print, variables, tipos, operadores, input.',
  lessons: [
    lesson('b1-l1', 'Bloque 1', 'Tu primera línea con print', ['Usar print()'], ['print() muestra texto en pantalla.'], 'print("Hola")', b1e1, [b1q1, b1q2]),
    lesson('b1-l2', 'Bloque 1', 'Variables: guarda ingredientes', ['Crear variables'], ['Una variable guarda un valor.'], 'plato = "Paella"', b1e2, [b1q3]),
    lesson('b1-l3', 'Bloque 1', 'Operadores matemáticos', ['Usar + - * /'], ['Son los operadores básicos.'], 'total = 8 + 12', b1e3, [b1q1]),
    lesson('b1-l4', 'Bloque 1', 'Entrada con input()', ['Leer del usuario'], ['input() lee lo que escribe el usuario.'], 'nombre = input()', b1e4, [b1q4]),
  ],
};
const b2e1 = exercise('b2-e1', 'Igualdad', 'Comprueba si 5 es igual a 5 e imprime el resultado.', '', 'print(5 == 5)', [{ input: [], expected: 'True' }], ['Usa == para comparar.'], 'facil', 10);
const b2e2 = exercise('b2-e2', 'Mayor que', 'Comprueba si 10 es mayor que 3 e imprime el resultado.', '', 'print(10 > 3)', [{ input: [], expected: 'True' }], ['Usa > para mayor que.'], 'facil', 10);
const b2e3 = exercise('b2-e3', 'If simple', 'Si precio es mayor a 20, imprime "Caro".', 'precio = 25\n', 'precio = 25\nif precio > 20:\n    print("Caro")', [{ input: [], expected: 'Caro' }], ['Usa if con dos puntos y sangría.'], 'facil', 15);
const b2e4 = exercise('b2-e4', 'If-else', 'Si edad >= 18 imprime "Adulto", si no "Menor".', 'edad = 16\n', 'edad = 16\nif edad >= 18:\n    print("Adulto")\nelse:\n    print("Menor")', [{ input: [], expected: 'Menor' }], ['Usa else para el caso contrario.'], 'facil', 15);
const b2e5 = exercise('b2-e5', 'Elif', 'Califica: 90+ "A", 80+ "B", si no "C".', 'nota = 85\n', 'nota = 85\nif nota >= 90:\n    print("A")\nelif nota >= 80:\n    print("B")\nelse:\n    print("C")', [{ input: [], expected: 'B' }], ['Usa elif para condiciones intermedias.'], 'medio', 20);
const b2e6 = exercise('b2-e6', 'While contador', 'Imprime los números del 1 al 5 usando while.', '', 'i = 1\nwhile i <= 5:\n    print(i)\n    i = i + 1', [{ input: [], expected: '1\n2\n3\n4\n5' }], ['while se repite mientras la condición sea verdadera.'], 'medio', 20);
const b2e7 = exercise('b2-e7', 'For con range', 'Imprime los números del 0 al 4 usando for y range.', '', 'for i in range(5):\n    print(i)', [{ input: [], expected: '0\n1\n2\n3\n4' }], ['range(5) genera 0,1,2,3,4.'], 'medio', 20);
const b2e8 = exercise('b2-e8', 'Break en bucle', 'Imprime números hasta encontrar 3, luego detente con break.', '', 'for i in range(10):\n    if i == 3:\n        break\n    print(i)', [{ input: [], expected: '0\n1\n2' }], ['break detiene el bucle inmediatamente.'], 'medio', 20);
const b2e9 = exercise('b2-e9', 'Continue en bucle', 'Imprime del 1 al 5, saltando el 3 con continue.', '', 'for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)', [{ input: [], expected: '1\n2\n4\n5' }], ['continue salta a la siguiente iteración.'], 'medio', 20);
const b2e10 = exercise('b2-e10', 'Contador de platos', 'Cuenta cuántos platos hay en la lista usando un bucle.', 'platos = ["sopa", "arroz", "carne"]\n', 'platos = ["sopa", "arroz", "carne"]\ncontador = 0\nfor _ in platos:\n    contador = contador + 1\nprint(contador)', [{ input: [], expected: '3' }], ['Itera sobre la lista e incrementa un contador.'], 'medio', 20);
const b2e11 = exercise('b2-e11', 'Validar edad', 'Pide la edad al usuario y dice si es mayor de edad.', '', 'edad = int(input())\nif edad >= 18:\n    print("Mayor de edad")\nelse:\n    print("Menor de edad")', [{ input: ['20'], expected: 'Mayor de edad' }], ['Convierte la entrada a int antes de comparar.'], 'medio', 20);
const b2e12 = exercise('b2-e12', 'Tabla del 3', 'Imprime la tabla de multiplicar del 3 del 1 al 10.', '', 'for i in range(1, 11):\n    print(3 * i)', [{ input: [], expected: '3\n6\n9\n12\n15\n18\n21\n24\n27\n30' }], ['Usa range(1, 11) para ir del 1 al 10.'], 'medio', 20);
const b2e13 = exercise('b2-e13', 'Suma de números', 'Suma todos los números del 1 al 100 usando un bucle.', '', 'total = 0\nfor i in range(1, 101):\n    total = total + i\nprint(total)', [{ input: [], expected: '5050' }], ['Acumula en una variable dentro del bucle.'], 'dificil', 25);
const b2e14 = exercise('b2-e14', 'Factorial', 'Calcula el factorial de 5 usando un bucle.', '', 'n = 5\nresultado = 1\nfor i in range(1, n + 1):\n    resultado = resultado * i\nprint(resultado)', [{ input: [], expected: '120' }], ['El factorial de 5 es 5*4*3*2*1 = 120.'], 'dificil', 25);
const b2e15 = exercise('b2-e15', 'Adivina el número', 'El número secreto es 7. Pide al usuario que adivine y dale pistas.', '', 'secreto = 7\nintento = int(input())\nif intento == secreto:\n    print("Correcto")\nelif intento < secreto:\n    print("Más alto")\nelse:\n    print("Más bajo")', [{ input: ['7'], expected: 'Correcto' }], ['Compara el intento con el secreto.'], 'dificil', 25);
const b2e16 = exercise('b2-e16', 'Contador descendente', 'Imprime del 10 al 1 usando while.', '', 'i = 10\nwhile i >= 1:\n    print(i)\n    i = i - 1', [{ input: [], expected: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1' }], ['while con condición i >= 1 y decremento.'], 'dificil', 25);
const b2e17 = exercise('b2-e17', 'Pares del 1 al 20', 'Imprime solo los números pares del 1 al 20.', '', 'for i in range(1, 21):\n    if i % 2 == 0:\n        print(i)', [{ input: [], expected: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20' }], ['Usa % 2 == 0 para detectar pares.'], 'dificil', 25);
const b2e18 = exercise('b2-e18', 'Suma de pares', 'Suma todos los números pares del 1 al 20.', '', 'total = 0\nfor i in range(1, 21):\n    if i % 2 == 0:\n        total = total + i\nprint(total)', [{ input: [], expected: '110' }], ['Acumula solo los pares.'], 'dificil', 25);
const b2e19 = exercise('b2-e19', 'Validar contraseña', 'Pide una contraseña y verifica que tenga al menos 8 caracteres.', '', 'password = input()\nif len(password) >= 8:\n    print("Válida")\nelse:\n    print("Demasiado corta")', [{ input: ['mipass123'], expected: 'Válida' }], ['Usa len() para contar caracteres.'], 'dificil', 25);
const b2e20 = exercise('b2-e20', 'Menú de opciones', 'Muestra un menú y ejecuta según la opción elegida.', '', 'opcion = input()\nif opcion == "1":\n    print("Opción 1")\nelif opcion == "2":\n    print("Opción 2")\nelse:\n    print("Opción inválida")', [{ input: ['2'], expected: 'Opción 2' }], ['Compara la entrada con las opciones válidas.'], 'dificil', 25);
const b2e21 = exercise('b2-e21', 'Contador de vocales', 'Cuenta cuántas vocales tiene la palabra "programacion".', '', 'palabra = "programacion"\ncontador = 0\nfor letra in palabra:\n    if letra in "aeiou":\n        contador = contador + 1\nprint(contador)', [{ input: [], expected: '5' }], ['Itera sobre cada letra y verifica si es vocal.'], 'dificil', 25);
const b2e22 = exercise('b2-e22', 'Proyecto: Máquina de pedidos', 'Sistema de pedidos por consola con menú, precios y total.', '', 'total = 0\nwhile True:\n    opcion = input()\n    if opcion == "0":\n        break\n    elif opcion == "1":\n        total = total + 10\n    elif opcion == "2":\n        total = total + 15\nprint("Total:", total)', [{ input: ['1', '2', '0'], expected: 'Total: 25' }], ['Usa while True para repetir hasta que el usuario elija salir.'], 'dificil', 30);

const b2q1 = q('¿Qué imprime 5 > 3?', ['True', 'False', '1', '0'], 0, '5 es mayor que 3, así que el resultado es True.');
const b2q2 = q('¿Qué hace elif?', ['Condición alternativa', 'Bucle infinito', 'Fin del programa', 'Ignora errores'], 0, 'elif evalúa otra condición si el if anterior fue falso.');
const b2q3 = q('¿Qué imprime range(3)?', ['0,1,2', '1,2,3', '0,1,2,3', '1,2'], 0, 'range(3) genera 0, 1, 2.');
const b2q4 = q('¿Qué hace break?', ['Detiene el bucle', 'Salta a la siguiente', 'Reinicia el bucle', 'Nada'], 0, 'break detiene el bucle inmediatamente.');
const b2q5 = q('¿Qué imprime bool(0)?', ['False', 'True', '0', '1'], 0, 'bool(0) es False porque cero es "falsy".');

const modulo2 = {
  id: 'module-2',
  number: '2',
  title: 'Decidir y repetir',
  summary: 'Booleanos, if/elif/else, while, for, range, control de bucles.',
  lessons: [
    lesson('b2-l1', 'Bloque 2', 'Booleanos y comparaciones', ['Usar ==, !=, >, <'], ['Compara valores y obtén True o False.'], 'print(5 == 5)', b2e1, [b1q1]),
    lesson('b2-l2', 'Bloque 2', 'If y else', ['Tomar decisiones'], ['if ejecuta si es verdadero, else si no.'], 'if x > 0:\n    print("positivo")', b2e4, [b2q1]),
    lesson('b2-l3', 'Bloque 2', 'Elif para múltiples casos', ['Usar elif'], ['elif maneja condiciones intermedias.'], 'if x > 0:\n    print("positivo")\nelif x < 0:\n    print("negativo")', b2e5, [b2q2]),
    lesson('b2-l4', 'Bloque 2', 'Bucle while', ['Repetir con while'], ['while se repite mientras sea verdadero.'], 'i = 0\nwhile i < 3:\n    print(i)\n    i = i + 1', b2e6, [b2q3]),
    lesson('b2-l5', 'Bloque 2', 'Bucle for con range', ['Usar for y range'], ['range genera una secuencia de números.'], 'for i in range(3):\n    print(i)', b2e7, [b2q4]),
    lesson('b2-l6', 'Bloque 2', 'Break y continue', ['Controlar el flujo del bucle'], ['break detiene, continue salta a la siguiente.'], 'for i in range(5):\n    if i == 2:\n        break\n    print(i)', b2e8, [b2q5]),
    lesson('b2-l7', 'Bloque 2', 'Examen del bloque 2', ['Repasar todo el bloque'], ['Examen de 5 preguntas sobre booleanos y bucles.'], 'if True: print("ok")', b2e22, [b2q1, b2q2, b2q3, b2q4, b2q5], true),
  ],
};
const b3e1 = exercise('b3-e1', 'Crear lista', 'Crea una lista con 3 frutas e imprímela.', '', 'frutas = ["manzana", "banana", "naranja"]\nprint(frutas)', [{ input: [], expected: "['manzana', 'banana', 'naranja']" }], ['Usa corchetes [] para crear listas.'], 'facil', 10);
const b3e2 = exercise('b3-e2', 'Acceder a elemento', 'Dada lista = [10, 20, 30], imprime el segundo elemento (índice 1).', 'lista = [10, 20, 30]\n', 'lista = [10, 20, 30]\nprint(lista[1])', [{ input: [], expected: '20' }], ['Los índices empiezan en 0.'], 'facil', 10);
const b3e3 = exercise('b3-e3', 'Agregar a lista', 'Agrega "pera" a la lista de frutas e imprímela.', 'frutas = ["manzana", "banana"]\n', 'frutas = ["manzana", "banana"]\nfrutas.append("pera")\nprint(frutas)', [{ input: [], expected: "['manzana', 'banana', 'pera']" }], ['Usa .append() para agregar al final.'], 'facil', 15);
const b3e4 = exercise('b3-e4', 'Longitud de lista', 'Dada una lista de 5 elementos, imprime su longitud.', 'pedidos = [1, 2, 3, 4, 5]\n', 'pedidos = [1, 2, 3, 4, 5]\nprint(len(pedidos))', [{ input: [], expected: '5' }], ['Usa len() para contar elementos.'], 'facil', 10);
const b3e5 = exercise('b3-e5', 'Diccionario simple', 'Crea un diccionario con clave "plato" y valor "Paella".', '', 'pedido = {"plato": "Paella"}\nprint(pedido)', [{ input: [], expected: "{'plato': 'Paella'}" }], ['Usa llaves {} para diccionarios.'], 'facil', 15);
const b3e6 = exercise('b3-e6', 'Acceder a diccionario', 'Dado pedido = {"plato": "Paella", "precio": 15}, imprime el precio.', 'pedido = {"plato": "Paella", "precio": 15}\n', 'pedido = {"plato": "Paella", "precio": 15}\nprint(pedido["precio"])', [{ input: [], expected: '15' }], ['Usa corchetes con la clave para acceder.'], 'facil', 15);
const b3e7 = exercise('b3-e7', 'Agregar clave a diccionario', 'Agrega "mesa": 5 al diccionario de pedido.', 'pedido = {"plato": "Paella"}\n', 'pedido = {"plato": "Paella"}\npedido["mesa"] = 5\nprint(pedido)', [{ input: [], expected: "{'plato': 'Paella', 'mesa': 5}" }], ['Asigna un valor a una nueva clave.'], 'facil', 15);
const b3e8 = exercise('b3-e8', 'Recorrer lista con for', 'Imprime cada plato de la lista.', 'platos = ["sopa", "arroz", "carne"]\n', 'platos = ["sopa", "arroz", "carne"]\nfor plato in platos:\n    print(plato)', [{ input: [], expected: 'sopa\narroz\ncarne' }], ['for itera sobre cada elemento de la lista.'], 'facil', 15);
const b3e9 = exercise('b3-e9', 'Contar elementos con for', 'Cuenta cuántos platos hay en la lista usando for.', 'platos = ["sopa", "arroz", "carne", "postre"]\n', 'platos = ["sopa", "arroz", "carne", "postre"]\ncontador = 0\nfor _ in platos:\n    contador = contador + 1\nprint(contador)', [{ input: [], expected: '4' }], ['Incrementa contador en cada iteración.'], 'medio', 20);
const b3e10 = exercise('b3-e10', 'Lista de precios', 'Suma todos los precios de una lista.', 'precios = [10, 20, 30, 40]\n', 'precios = [10, 20, 30, 40]\ntotal = 0\nfor p in precios:\n    total = total + p\nprint(total)', [{ input: [], expected: '100' }], ['Acumula cada precio en total.'], 'medio', 20);
const b3e11 = exercise('b3-e11', 'Tupla inmutable', 'Crea una tupla con coordenadas (x, y) e imprímela.', '', 'coordenadas = (10, 20)\nprint(coordenadas)', [{ input: [], expected: '(10, 20)' }], ['Usa paréntesis () para tuplas.'], 'facil', 10);
const b3e12 = exercise('b3-e12', 'Conjunto para eliminar duplicados', 'Dada una lista con duplicados, conviértela a conjunto e imprímela.', 'numeros = [1, 2, 2, 3, 3, 4]\n', 'numeros = [1, 2, 2, 3, 3, 4]\nunicos = set(numeros)\nprint(unicos)', [{ input: [], expected: "{1, 2, 3, 4}" }], ['set() elimina duplicados.'], 'medio', 20);
const b3e13 = exercise('b3-e13', 'Métodos de cadena', 'Dada texto = "Hola Mundo", imprime en minúsculas.', 'texto = "Hola Mundo"\n', 'texto = "Hola Mundo"\nprint(texto.lower())', [{ input: [], expected: 'hola mundo' }], ['Usa .lower() para minúsculas.'], 'facil', 10);
const b3e14 = exercise('b3-e14', 'Dividir cadena', 'Dada texto = "paella,arroz,marisco", divídela por comas.', 'texto = "paella,arroz,marisco"\n', 'texto = "paella,arroz,marisco"\npartes = texto.split(",")\nprint(partes)', [{ input: [], expected: "['paella', 'arroz', 'marisco']" }], ['Usa .split(",") para dividir por comas.'], 'medio', 20);
const b3e15 = exercise('b3-e15', 'Unir lista de cadenas', 'Dada palabras = ["Hola", "mundo"], únelas con un espacio.', 'palabras = ["Hola", "mundo"]\n', 'palabras = ["Hola", "mundo"]\nresultado = " ".join(palabras)\nprint(resultado)', [{ input: [], expected: 'Hola mundo' }], ['Usa " ".join() para unir con espacio.'], 'medio', 15);
const b3e16 = exercise('b3-e16', 'Buscar en lista', 'Dada platos = ["sopa", "arroz", "carne"], verifica si "arroz" está en la lista.', 'platos = ["sopa", "arroz", "carne"]\n', 'platos = ["sopa", "arroz", "carne"]\nprint("arroz" in platos)', [{ input: [], expected: 'True' }], ['Usa in para verificar membresía.'], 'facil', 10);
const b3e17 = exercise('b3-e17', 'Proyecto: Gestor de inventario', 'Sistema para agregar, listar y buscar ingredientes.', '', 'inventario = []\nwhile True:\n    opcion = input()\n    if opcion == "0":\n        break\n    elif opcion == "1":\n        ingrediente = input()\n        inventario.append(ingrediente)\n    elif opcion == "2":\n        for item in inventario:\n            print(item)\nprint("Inventario final:", inventario)', [{ input: ['1', 'sal', '1', 'azúcar', '2', '0'], expected: 'sal\nazúcar\nInventario final: [\'sal\', \'azúcar\']' }], ['Usa while para el menú principal.'], 'dificil', 30);
const b3e18 = exercise('b3-e18', 'Diccionario de recetas', 'Crea un diccionario con recetas y sus ingredientes.', '', 'recetas = {"tortilla": ["huevos", "patatas"], "ensalada": ["lechuga", "tomate"]}\nprint(recetas["tortilla"])', [{ input: [], expected: "['huevos', 'patatas']" }], ['Los diccionarios pueden tener listas como valores.'], 'medio', 20);
const b3e19 = exercise('b3-e19', 'Iterar sobre diccionario', 'Imprime cada clave y valor de un diccionario.', 'menu = {"plato": 15, "bebida": 5, "postre": 8}\n', 'menu = {"plato": 15, "bebida": 5, "postre": 8}\nfor clave, valor in menu.items():\n    print(clave, valor)', [{ input: [], expected: 'plato 15\nbebida 5\npostre 8' }], ['Usa .items() para obtener clave y valor.'], 'medio', 20);
const b3e20 = exercise('b3-e20', 'Contar palabras', 'Cuenta cuántas veces aparece cada palabra en una frase.', 'frase = "sol sol luna sol luna"\n', 'frase = "sol sol luna sol luna"\npalabras = frase.split()\nconteo = {}\nfor p in palabras:\n    if p in conteo:\n        conteo[p] = conteo[p] + 1\n    else:\n        conteo[p] = 1\nprint(conteo)', [{ input: [], expected: "{'sol': 3, 'luna': 2}" }], ['Usa un diccionario para contar ocurrencias.'], 'dificil', 25);
const b3e21 = exercise('b3-e21', 'Lista de tuplas', 'Crea una lista de tuplas con (nombre, precio) de platos.', '', 'platos = [("Paella", 15), ("Tortilla", 10), ("Gazpacho", 8)]\nprint(platos)', [{ input: [], expected: "[('Paella', 15), ('Tortilla', 10), ('Gazpacho', 8)]" }], ['Las listas pueden contener tuplas.'], 'facil', 15);
const b3e22 = exercise('b3-e22', 'Filtrar lista', 'Crea una nueva lista solo con números mayores a 10.', 'numeros = [5, 12, 8, 20, 3, 15]\n', 'numeros = [5, 12, 8, 20, 3, 15]\nmayores = []\nfor n in numeros:\n    if n > 10:\n        mayores.append(n)\nprint(mayores)', [{ input: [], expected: '[12, 20, 15]' }], ['Usa if dentro del bucle para filtrar.'], 'medio', 20);

const b3q1 = q('¿Qué imprime len([1, 2, 3])?', ['2', '3', '4', '1'], 1, 'len() cuenta los elementos: 3.');
const b3q2 = q('¿Qué es un diccionario?', ['Pares clave-valor', 'Solo números', 'Solo texto', 'Sin orden'], 0, 'Los diccionarios almacenan pares clave-valor.');
const b3q3 = q('¿Qué hace .append()?', ['Agrega al final de una lista', 'Elimina el último', 'Ordena la lista', 'Copia la lista'], 0, '.append() agrega un elemento al final.');

const modulo3 = {
  id: 'module-3',
  number: '3',
  title: 'La despensa y la comanda',
  summary: 'Listas, tuplas, diccionarios, conjuntos, cadenas y métodos.',
  lessons: [
    lesson('b3-l1', 'Bloque 3', 'Listas: crear y acceder', ['Crear listas, acceder por índice'], ['Las listas guardan colecciones ordenadas.'], 'frutas = ["manzana", "banana"]', b3e1, [b3q1]),
    lesson('b3-l2', 'Bloque 3', 'Modificar listas', ['append, modificar elementos'], ['Puedes agregar y cambiar elementos.'], 'frutas.append("pera")', b3e3, [b3q3]),
    lesson('b3-l3', 'Bloque 3', 'Diccionarios', ['Crear y acceder a diccionarios'], ['Clave-valor para buscar rápido.'], 'pedido = {"plato": "Paella"}', b3e5, [b3q2]),
    lesson('b3-l4', 'Bloque 3', 'Recorrer colecciones', ['for sobre listas y diccionarios'], ['Itera sobre cada elemento.'], 'for item in lista:\n    print(item)', b3e8, [b3q1]),
    lesson('b3-l5', 'Bloque 3', 'Tuplas y conjuntos', ['Tuplas inmutables, conjuntos sin duplicados'], ['tuple() y set() para casos especiales.'], 'coordenadas = (10, 20)', b3e11, [b3q3]),
    lesson('b3-l6', 'Bloque 3', 'Métodos de cadenas', ['upper, lower, split, join'], ['Transforma y divide texto fácilmente.'], 'texto = "Hola Mundo"', b3e13, [b3q3]),
    lesson('b3-l7', 'Bloque 3', 'Proyecto: Gestor de inventario', ['Aplicar todo el bloque'], ['Sistema completo de inventario.'], 'Ejemplo de código Python', b3e17, [b3q3]),
    lesson('b3-l8', 'Bloque 3', 'Examen del bloque 3', ['Repasar todo el bloque'], ['Examen de 3 preguntas sobre colecciones.'], 'lista = [1, 2]\nprint(len(lista))', b3e22, [b3q1, b3q2, b3q3], true),
  ],
};
const b4e1 = exercise('b4-e1', 'Primera función', 'Crea una función saludar() que imprima "Hola".', '', 'def saludar():\n    print("Hola")\n\nsaludar()', [{ input: [], expected: 'Hola' }], ['Usa def para definir funciones.'], 'facil', 10);
const b4e2 = exercise('b4-e2', 'Función con parámetro', 'Crea una función que reciba un nombre y lo imprima.', '', 'def decir(nombre):\n    print(nombre)\n\ndecir("Ana")', [{ input: [], expected: 'Ana' }], ['Los parámetros van entre paréntesis.'], 'facil', 10);
const b4e3 = exercise('b4-e3', 'Función con return', 'Crea una función que sume dos números y retorne el resultado.', '', 'def sumar(a, b):\n    return a + b\n\nresultado = sumar(3, 4)\nprint(resultado)', [{ input: [], expected: '7' }], ['Usa return para devolver un valor.'], 'medio', 15);
const b4e4 = exercise('b4-e4', 'Cálculo de propina', 'Crea una función que calcule el 10% de una cuenta.', '', 'def propina(cuenta):\n    return cuenta * 0.10\n\nprint(propina(50))', [{ input: [], expected: '5.0' }], ['Multiplica por 0.10 para el 10%.'], 'medio', 15);
const b4e5 = exercise('b4-e5', 'Alcance local', 'Define una variable dentro de una función e intenta acceder desde fuera.', '', 'def mi_funcion():\n    interna = 42\n    return interna\n\nprint(mi_funcion())', [{ input: [], expected: '42' }], ['Las variables dentro de una función son locales.'], 'medio', 15);
const b4e6 = exercise('b4-e6', 'Excepción ZeroDivision', 'Divide dos números manejando la excepción de división entre cero.', '', 'try:\n    resultado = 10 / 0\nexcept ZeroDivisionError:\n    print("No se puede dividir entre cero")', [{ input: [], expected: 'No se puede dividir entre cero' }], ['Usa try/except para capturar errores.'], 'medio', 20);
const b4e7 = exercise('b4-e7', 'Excepción ValueError', 'Convierte texto a número manejando ValueError.', '', 'try:\n    numero = int("no es numero")\nexcept ValueError:\n    print("No es un número válido")', [{ input: [], expected: 'No es un número válido' }], ['ValueError ocurre al convertir texto inválido.'], 'medio', 20);
const b4e8 = exercise('b4-e8', 'Importar módulo', 'Importa math e impira math.pi.', '', 'import math\nprint(math.pi)', [{ input: [], expected: '3.141592653589793' }], ['Usa import para cargar módulos.'], 'facil', 10);
const b4e9 = exercise('b4-e9', 'Función con múltiples parámetros', 'Crea una función que reciba precio e impuesto y retorne el total.', '', 'def total_con_impuesto(precio, impuesto):\n    return precio + (precio * impuesto)\n\nprint(total_con_impuesto(100, 0.21))', [{ input: [], expected: '121.0' }], ['Múltiples parámetros separados por coma.'], 'medio', 20);
const b4e10 = exercise('b4-e10', 'Valor por defecto', 'Crea una función con un parámetro que tenga valor por defecto.', '', 'def saludar(nombre = "invitado"):\n    print("Hola, " + nombre)\n\nsaludar()\nsaludar("Ana")', [{ input: [], expected: 'Hola, invitado\nHola, Ana' }], ['Asigna un valor en la definición del parámetro.'], 'medio', 20);
const b4e11 = exercise('b4-e11', 'Retornar múltiples valores', 'Crea una función que retorne el doble y el triple de un número.', '', 'def doble_y_triple(n):\n    return n * 2, n * 3\n\nd, t = doble_y_triple(5)\nprint(d, t)', [{ input: [], expected: '10 15' }], ['Python puede retornar múltiples valores como tupla.'], 'medio', 20);
const b4e12 = exercise('b4-e12', 'Validar entrada con while y excepción', 'Pide un número al usuario hasta que sea válido.', '', 'while True:\n    try:\n        numero = int(input())\n        break\n    except ValueError:\n        print("Intenta de nuevo")\nprint("Número válido:", numero)', [{ input: ['abc', '5'], expected: 'Intenta de nuevo\nNúmero válido: 5' }], ['Combina while con try/except.'], 'dificil', 25);
const b4e13 = exercise('b4-e13', 'Función recursiva', 'Calcula el factorial de un número usando recursión.', '', 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))', [{ input: [], expected: '120' }], ['La función se llama a sí misma.'], 'dificil', 25);
const b4e14 = exercise('b4-e14', 'Módulo propio', 'Crea una función en un módulo y úsala desde otro archivo.', '', '# modulo.py\ndef decir_hola():\n    return "Hola desde el módulo"\n\n# main.py\nimport modulo\nprint(modulo.decir_hola())', [{ input: [], expected: 'Hola desde el módulo' }], ['Usa import para cargar tu propio módulo.'], 'medio', 20);
const b4e15 = exercise('b4-e15', 'Proyecto: Sistema de comandas', 'Sistema de comandas con funciones para agregar, calcular total y mostrar.', '', 'comanda = []\ndef agregar(plato, precio):\n    comanda.append((plato, precio))\ndef total():\n    return sum(p for _, p in comanda)\n\nagregar("Paella", 15)\nagregar("Tortilla", 10)\nprint("Total:", total())', [{ input: [], expected: 'Total: 25' }], ['Usa funciones para organizar el código.'], 'dificil', 30);
const b4e16 = exercise('b4-e16', 'Manejo de archivos', 'Lee el contenido de un archivo e imprímelo.', '', 'with open("archivo.txt", "r") as f:\n    contenido = f.read()\nprint(contenido)', [{ input: [], expected: 'Contenido del archivo' }], ['Usa with open() para leer archivos.'], 'medio', 20);
const b4e17 = exercise('b4-e17', 'Escribir archivo', 'Escribe un texto en un archivo.', '', 'with open("archivo.txt", "w") as f:\n    f.write("Hola desde Python")\nprint("Guardado")', [{ input: [], expected: 'Guardado' }], ['Usa "w" para escribir en un archivo.'], 'medio', 20);
const b4e18 = exercise('b4-e18', 'Excepción FileNotFound', 'Intenta leer un archivo que no existe y maneja el error.', '', 'try:\n    with open("no_existe.txt", "r") as f:\n        contenido = f.read()\nexcept FileNotFoundError:\n    print("Archivo no encontrado")', [{ input: [], expected: 'Archivo no encontrado' }], ['FileNotFoundError cuando el archivo no existe.'], 'dificil', 25);
const b4e19 = exercise('b4-e19', 'Función anónima lambda', 'Crea una función lambda que sume dos números.', '', 'sumar = lambda a, b: a + b\nprint(sumar(3, 4))', [{ input: [], expected: '7' }], ['lambda crea funciones pequeñas en una línea.'], 'dificil', 25);
const b4e20 = exercise('b4-e20', 'Decorador simple', 'Crea un decorador que imprima antes y después de una función.', '', 'def mi_decorador(func):\n    def envoltura():\n        print("Antes")\n        func()\n        print("Después")\n    return envoltura\n\n@mi_decorador\ndef decir_hola():\n    print("Hola")\n\ndecir_hola()', [{ input: [], expected: 'Antes\nHola\nDespués' }], ['Los decoradores envuelven funciones.'], 'dificil', 25);

const b4q1 = q('¿Qué hace return?', ['Devuelve un valor', 'Imprime en pantalla', 'Termina el programa', 'Define una variable'], 0, 'return devuelve el resultado de la función.');
const b4q2 = q('¿Qué hace try/except?', ['Captura errores', 'Define funciones', 'Crea bucles', 'Importa módulos'], 0, 'try/except captura y maneja excepciones.');
const b4q3 = q('¿Qué es un módulo?', ['Archivo con código Python', 'Una función', 'Una variable', 'Un tipo de dato'], 0, 'Un módulo es un archivo .py con código reutilizable.');

const modulo4 = {
  id: 'module-4',
  number: '4',
  title: 'Recetas reutilizables',
  summary: 'Funciones, parámetros, return, alcance, excepciones, módulos.',
  lessons: [
    lesson('b4-l1', 'Bloque 4', 'Definir funciones', ['Usar def'], ['def crea una función reutilizable.'], 'def hola():\n    print("Hola")', b4e1, [b4q1]),
    lesson('b4-l2', 'Bloque 4', 'Parámetros y argumentos', ['Pasar datos a funciones'], ['Los parámetros personalizan el comportamiento.'], 'def decir(nombre):\n    print(nombre)', b4e2, [b4q1]),
    lesson('b4-l3', 'Bloque 4', 'Return: devolver resultados', ['Usar return'], ['return envía el resultado de vuelta.'], 'def sumar(a, b):\n    return a + b', b4e3, [b4q1]),
    lesson('b4-l4', 'Bloque 4', 'Alcance de variables', ['Variables locales y globales'], ['Las variables dentro de funciones son locales.'], 'def f():\n    x = 10\n    return x', b4e5, [b4q2]),
    lesson('b4-l5', 'Bloque 4', 'Excepciones try/except', ['Capturar y manejar errores'], ['try intenta, except maneja el error.'], 'try:\n    x = 1 / 0\nexcept:\n    print("Error")', b4e6, [b4q2]),
    lesson('b4-l6', 'Bloque 4', 'Módulos e import', ['import y from'], ['Los módulos organizan el código en archivos.'], 'import math', b4e8, [b4q3]),
    lesson('b4-l7', 'Bloque 4', 'Proyecto: Sistema de comandas', ['Aplicar funciones y excepciones'], ['Sistema completo de comandas.'], 'Ejemplo de código Python', b4e15, [b4q3]),
    lesson('b4-l8', 'Bloque 4', 'Examen del bloque 4', ['Repasar todo el bloque'], ['Examen de 3 preguntas sobre funciones.'], 'def f():\n    return 1', b4e20, [b4q1, b4q2, b4q3], true),
  ],
};
const b5e1 = exercise('b5-e1', 'Leer archivo', 'Lee un archivo e imprime su contenido línea por línea.', '', 'with open("archivo.txt", "r") as f:\n    for linea in f:\n        print(linea.strip())', [{ input: [], expected: 'Línea 1\nLínea 2' }], ['Usa with open() para leer archivos.'], 'medio', 20);
const b5e2 = exercise('b5-e2', 'Escribir archivo', 'Escribe una lista de compras en un archivo.', '', 'compras = ["pan", "leche", "huevos"]\nwith open("compras.txt", "w") as f:\n    for item in compras:\n        f.write(item + "\n")\nprint("Guardado")', [{ input: [], expected: 'Guardado' }], ['Usa "w" para escribir.'], 'medio', 20);
const b5e3 = exercise('b5-e3', 'Clase simple', 'Crea una clase Plato con nombre y precio.', '', 'class Plato:\n    def __init__(self, nombre, precio):\n        self.nombre = nombre\n        self.precio = precio\n\np = Plato("Paella", 15)\nprint(p.nombre, p.precio)', [{ input: [], expected: 'Paella 15' }], ['class define una plantilla para objetos.'], 'medio', 20);
const b5e4 = exercise('b5-e4', 'Método en clase', 'Agrega un método describir() a la clase Plato.', '', 'class Plato:\n    def __init__(self, nombre, precio):\n        self.nombre = nombre\n        self.precio = precio\n    def describir(self):\n        return self.nombre + " cuesta " + str(self.precio)\n\np = Plato("Tortilla", 10)\nprint(p.describir())', [{ input: [], expected: 'Tortilla cuesta 10' }], ['self se refiere a la instancia del objeto.'], 'medio', 20);
const b5e5 = exercise('b5-e5', 'Herencia', 'Crea una clase Postre que herede de Plato.', '', 'class Plato:\n    def __init__(self, nombre, precio):\n        self.nombre = nombre\n        self.precio = precio\n\nclass Postre(Plato):\n    pass\n\np = Postre("Flan", 5)\nprint(p.nombre, p.precio)', [{ input: [], expected: 'Flan 5' }], ['La herencia permite reutilizar código.'], 'dificil', 25);
const b5e6 = exercise('b5-e6', 'Escribir y leer archivo', 'Escribe un texto en un archivo y luego léelo.', '', 'with open("prueba.txt", "w") as f:\n    f.write("Hola archivo")\nwith open("prueba.txt", "r") as f:\n    contenido = f.read()\nprint(contenido)', [{ input: [], expected: 'Hola archivo' }], ['Usa "w" para escribir y "r" para leer.'], 'medio', 20);
const b5e7 = exercise('b5-e7', 'Manejo de errores en archivos', 'Intenta leer un archivo inexistente y muestra mensaje amigable.', '', 'try:\n    with open("no_existe.txt", "r") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("El archivo no existe")', [{ input: [], expected: 'El archivo no existe' }], ['Usa try/except con FileNotFoundError.'], 'dificil', 25);
const b5e8 = exercise('b5-e8', 'Proyecto: Restaurante completo', 'Sistema completo con clases, archivos y funciones.', '', 'class Plato:\n    def __init__(self, nombre, precio):\n        self.nombre = nombre\n        self.precio = precio\n\nclass Restaurante:\n    def __init__(self):\n        self.menu = []\n    def agregar(self, plato):\n        self.menu.append(plato)\n    def total(self):\n        return sum(p.precio for p in self.menu)\n\nr = Restaurante()\nr.agregar(Plato("Paella", 15))\nr.agregar(Plato("Tortilla", 10))\nprint("Total:", r.total())', [{ input: [], expected: 'Total: 25' }], ['Conecta clases, métodos y colecciones.'], 'dificil', 30);

const b5q1 = q('¿Qué es una clase?', ['Plantilla para objetos', 'Una función', 'Una variable', 'Un módulo'], 0, 'Una clase define la estructura de los objetos.');
const b5q2 = q('¿Qué hace __init__?', ['Inicializa el objeto', 'Elimina el objeto', 'Copia el objeto', 'Imprime el objeto'], 0, '__init__ se ejecuta al crear el objeto.');
const b5q3 = q('¿Qué es self?', ['Se refiere a la instancia', 'Es una palabra reservada', 'Es una función', 'Es una clase'], 0, 'self accede a los atributos del objeto actual.');

const modulo5 = {
  id: 'module-5',
  number: '5',
  title: 'Cocina profesional',
  summary: 'Archivos, módulos propios, clases, pruebas, buenas prácticas.',
  lessons: [
    lesson('b5-l1', 'Bloque 5', 'Leer y escribir archivos', ['with open()'], ['Lee y guarda datos en archivos.'], 'with open("f.txt", "r") as f:\n    print(f.read())', b5e1, [b5q1]),
    lesson('b5-l2', 'Bloque 5', 'Clases y objetos', ['class, __init__, self'], ['Las clases definen objetos con datos y comportamiento.'], 'class Plato:\n    pass', b5e3, [b5q2, b5q3]),
    lesson('b5-l3', 'Bloque 5', 'Herencia', ['Heredar de otras clases'], ['Reutiliza código con herencia.'], 'class Hijo(Padre):\n    pass', b5e5, [b5q1]),
    lesson('b5-l4', 'Bloque 5', 'Proyecto: Restaurante completo', ['Aplicar todo el curso'], ['El nivel final: restaurante completo.'], 'Ejemplo de código Python', b5e8, [b5q2]),
  ],
};

export const courseModules: CourseModule[] = [modulo1, modulo2, modulo3, modulo4, modulo5];


export function findCourseModule(moduleId: string): CourseModule | undefined {
  return courseModules.find((m) => m.id === moduleId);
}

export function findCourseLesson(moduleId: string, lessonId: string): CourseLesson | undefined {
  const foundModule = findCourseModule(moduleId);
  return foundModule?.lessons.find((lesson) => lesson.id === lessonId);
}

export function gradeQuiz(questions: QuizQuestion[], answers: number[]): { score: number; passed: boolean; correct: number; total: number } {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) {
      correct++;
    }
  }
  const total = questions.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = score >= 75;
  return { score, passed, correct, total };
}


