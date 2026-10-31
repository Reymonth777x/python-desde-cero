import type { ChapterId } from './types';

export type MicroleccionOrilla = {
  historia: string;
  explicacion: string;
  ejemplo: string;
  pregunta: string;
  respuesta: string;
  reto: string;
};

/** Microlecciones cortas, narrativas y prácticas: una idea de Python por tramo. */
export const MICROLECCIONES_ORILLA: Record<ChapterId, MicroleccionOrilla> = {
  c01: {
    historia: "Amanece en el río. Nilo espera en el muelle y una boya roja marca el primer destino. Tu trabajo es darle instrucciones claras, una por una.",
    explicacion: "Python lee el programa de arriba hacia abajo. Cada línea es una instrucción. Una llamada como avanzar() ejecuta una acción; los paréntesis indican que estás llamando a una función.",
    ejemplo: "avanzar()\navanzar()",
    pregunta: "¿Qué sucede si escribes avanzar() cuatro veces cuando la boya está a tres casillas?",
    respuesta: "Nilo llega a la boya después de tres movimientos. En el cuarto intenta entrar en la orilla y el motor muestra un error: avanzar() no puede atravesar una pared.",
    reto: "¿Puedes predecir dónde terminará Nilo antes de pulsar Ejecutar?"
  },
  c02: {
    historia: "La boya tiene un letrero medio cubierto por la bruma. Nilo debe acercarse, leerlo y dejar constancia de lo que encontró.",
    explicacion: "Una función puede devolver un dato. mirar() observa sin mover la lancha. Puedes guardar lo que devuelve en una variable y reutilizarlo después. decir() escribe el resultado en la bitácora.",
    ejemplo: "avanzar()\navanzar()\navanzar()\nobjeto = mirar()\ndecir(objeto)",
    pregunta: "¿mirar() mueve a Nilo?",
    respuesta: "No. Solo devuelve información sobre la casilla que tiene delante.",
    reto: "Prueba a guardar lo que devuelve mirar() en una variable con un nombre que tenga sentido."
  },
  c03: {
    historia: "Una sonda científica cayó al canal. El equipo necesita saber la posición exacta de Nilo para localizarla en el mapa.",
    explicacion: "Una variable es una etiqueta para guardar un valor. Por ejemplo, columna_actual = columna() guarda el número de columna. Python empieza a contar desde cero: la primera columna es 0.",
    ejemplo: "avanzar()\navanzar()\navanzar()\navanzar()\navanzar()\ncolumna_actual = columna()\ndecir(columna_actual)",
    pregunta: "Si Nilo está en la primera columna, ¿qué número devuelve columna()?",
    respuesta: "Devuelve 0, porque las posiciones empiezan a contarse desde cero.",
    reto: "Guarda también la fila en otra variable y compara ambos datos."
  },
  c04: {
    historia: "El puente de madera necesita remos. La encargada no quiere una aproximación: necesita calcular cuántos hacen falta para completar el trayecto.",
    explicacion: "Python puede hacer operaciones. El operador // divide y devuelve solo los grupos completos: 9 // 2 da 4. No es lo mismo que /, que devuelve un resultado decimal.",
    ejemplo: "avanzar()\navanzar()\navanzar()\navanzar()\navanzar()\navanzar()\navanzar()\nremos = columna() // 2\ndecir(remos)",
    pregunta: "¿Cuánto vale 9 // 2?",
    respuesta: "4. La división entera descarta la parte decimal.",
    reto: "Cambia los números de una operación de prueba y predice el resultado antes de ejecutarla."
  },
  c05: {
    historia: "Una guardaparques pregunta la profundidad del canal por radio. Nilo recibe la respuesta como texto y debe calcular el doble antes de contestar.",
    explicacion: "pedir() devuelve texto, aunque la persona escriba números. Para sumar o multiplicar ese valor, primero conviértelo con int(). Después puedes realizar operaciones normales.",
    ejemplo: "respuesta = pedir(\"¿Qué profundidad tiene?\")\nprofundidad = int(respuesta)\ndecir(profundidad * 2)",
    pregunta: "¿Por qué no conviene multiplicar directamente el texto \"4\" por 2?",
    respuesta: "Porque \"4\" es texto. int(\"4\") lo convierte en el número 4.",
    reto: "Prueba int(\"12\") y luego compara el resultado con el texto original."
  },
  c06: {
    historia: "El río se divide en dos caminos. Uno tiene agua baja y el otro es más profundo. Nilo debe observar y elegir qué hacer según lo que encuentre.",
    explicacion: "if y else permiten tomar decisiones. Python comprueba una condición: si es verdadera ejecuta el bloque de if; si es falsa, ejecuta el bloque de else. Los dos puntos y la indentación son parte de la sintaxis.",
    ejemplo: "if agua_baja():\n    avanzar()\nelse:\n    girar_derecha()",
    pregunta: "¿Qué bloque se ejecuta cuando agua_baja() devuelve False?",
    respuesta: "Se ejecuta el bloque de else.",
    reto: "Piensa en una tercera condición de la vida diaria: ¿qué harías si llueve y qué harías si no llueve?"
  },
  c07: {
    historia: "La corriente cambia la longitud del canal cada vez que se abre la esclusa. Un programa con una cantidad fija de movimientos no servirá siempre.",
    explicacion: "while repite un bloque mientras su condición sea verdadera. Así puedes continuar avanzando mientras el frente esté libre, sin saber de antemano cuántas casillas tendrá el canal.",
    ejemplo: "while frente_libre():\n    avanzar()",
    pregunta: "¿Cuándo deja de repetirse un bucle while?",
    respuesta: "Cuando su condición se vuelve False, o cuando el programa sale del bucle por otra instrucción.",
    reto: "Busca en el mapa una situación en la que repetir una orden sea mejor que copiarla diez veces."
  },
  c08: {
    historia: "Un carrizal joven necesita nueve juncos nuevos. Plantar uno por uno sería lento; Nilo puede repetir una tarea organizada por filas.",
    explicacion: "for recorre una secuencia. range(3) produce tres vueltas: 0, 1 y 2. Dentro de cada vuelta puedes comprobar una condición, hacer una tarea y avanzar. En el carrizal repetirás este patrón para cubrir las filas.",
    ejemplo: "for vuelta in range(3):\n    if frente_libre():\n        avanzar()\n    if agua_baja():\n        sembrar()",
    pregunta: "¿Cuántas vueltas realiza for vuelta in range(3)?",
    respuesta: "Tres vueltas. Los valores generados son 0, 1 y 2.",
    reto: "¿Qué cambiarías para que el bucle tenga cinco vueltas?"
  },
  c09: {
    historia: "Un cardumen se refugió entre las piedras. Las tallas cambian según la corriente, así que necesitas recoger los datos reales, guardarlos y ordenarlos.",
    explicacion: "Una lista almacena varios valores en un solo lugar. append() añade un elemento al final. Después puedes recorrer la lista, comparar elementos y ordenarlos sin escribir una variable distinta para cada pez.",
    ejemplo: "tallas = []\nwhile frente_libre():\n    avanzar()\n    if aqui() == \"pez\":\n        tallas.append(recoger())",
    pregunta: "¿Qué hace tallas.append(7)?",
    respuesta: "Añade el valor 7 al final de la lista tallas.",
    reto: "Imagina una lista de tres números. ¿Cómo comprobarías cuál es el menor?"
  },
  c10: {
    historia: "Cuatro calas quedaron bloqueadas por ramas. El equipo quiere que Nilo aprenda una rutina que pueda reutilizar en cada cala.",
    explicacion: "Una función se crea con def. Dentro colocas instrucciones relacionadas y luego llamas la función por su nombre. Definirla no la ejecuta: también tienes que llamarla.",
    ejemplo: "def quitar_rama():\n    if hay_rama():\n        limpiar()\n\nquitar_rama()",
    pregunta: "¿Qué diferencia hay entre definir una función y llamarla?",
    respuesta: "Definirla guarda las instrucciones. Llamarla hace que Python las ejecute.",
    reto: "Ponle a tu función un nombre que describa exactamente la tarea que realiza."
  },
  c11: {
    historia: "Dos muestras esperan ser estudiadas. El cuaderno científico exige fichas ordenadas y el terreno seco puede provocar un error si intentas medirlo.",
    explicacion: "Un diccionario guarda datos en pares clave: valor. Una clave permite recuperar un dato por su nombre. try/except permite manejar un error previsto y continuar el programa sin que se detenga por completo.",
    ejemplo: "while mirar() != \"muestra\":\n    avanzar()\navanzar()\ntry:\n    muestra = medir()\n    ficha = {\"especie\": muestra[\"especie\"], \"talla\": muestra[\"talla\"], \"columna\": columna()}\n    registrar(ficha)\nexcept OrillaError:\n    decir(\"Esta casilla no tiene una muestra que se pueda medir\")",
    pregunta: "En muestra[\"talla\"], ¿qué representa \"talla\"?",
    respuesta: "Es la clave del diccionario que identifica el valor de la talla.",
    reto: "¿Qué harías para que un error esperado no interrumpa todo el recorrido?"
  },
  c12: {
    historia: "La cuenca necesita una restauración completa. Hay que limpiar, observar, medir, sembrar y entregar un informe. Esta vez el río combina todo lo que aprendiste.",
    explicacion: "Los programas reales combinan conceptos. Puedes usar variables para recordar datos, if para decidir, bucles para repetir y funciones para organizar tareas. Divide la misión en partes pequeñas y comprueba cada una.",
    ejemplo: "def limpiar_si_hay_rama():\n    if hay_rama():\n        limpiar()\n\n# Llama la función cuando Nilo esté junto a una rama",
    pregunta: "¿Por qué conviene dividir una misión grande en tareas pequeñas?",
    respuesta: "Porque puedes probar cada parte, encontrar errores con más facilidad y reutilizar instrucciones.",
    reto: "Antes de programar, escribe en palabras el orden de las cinco tareas que resolverás."
  },
  'reto-brazo': {
    historia: "Una curva del río quedó oculta por la niebla. Nilo no dispone del mapa completo: solo puede confiar en lo que detectan sus sensores.",
    explicacion: "Los sensores devuelven información del entorno. Puedes comparar ese resultado y tomar decisiones con if. Un algoritmo de búsqueda usa observaciones repetidas para encontrar el destino.",
    ejemplo: "objeto_actual = aqui()\nobjeto_delante = mirar()\n\nif frente_libre():\n    avanzar()",
    pregunta: "¿Qué ventaja tiene mirar el entorno en vez de escribir una ruta fija?",
    respuesta: "El programa puede adaptarse a caminos que cambian o que no conocía por adelantado.",
    reto: "Diseña una regla para decidir si avanzar o girar cuando encuentres un obstáculo."
  },
  'reto-luces': {
    historia: "Al caer la tarde, cinco luces se encienden a lo largo del remanso. Debes recoger todos sus brillos, incluso cuando dos tengan el mismo valor.",
    explicacion: "En Python normal existen métodos para ordenar listas, pero este reto está diseñado para que aprendas a construir el ordenamiento con bucles. Compara dos valores vecinos: si están en el orden contrario, intercámbialos. Repite el recorrido hasta que el mayor quede primero. No elimines repetidos: dos datos iguales siguen siendo dos observaciones.",
    ejemplo: "def ordenar_mayor_a_menor(brillos):\n    for vuelta in range(len(brillos)):\n        for indice in range(len(brillos) - 1 - vuelta):\n            if brillos[indice] < brillos[indice + 1]:\n                temporal = brillos[indice]\n                brillos[indice] = brillos[indice + 1]\n                brillos[indice + 1] = temporal\n    return brillos\n\n# Usa la función con los brillos que recogiste",
    pregunta: "¿Cuántos valores hay en [2, 5, 4, 4, 1]?",
    respuesta: "Cinco. Los dos valores 4 cuentan por separado.",
    reto: "Prueba a ordenar una lista que tenga números repetidos y observa que ninguno desaparece."
  },
  abierta: {
    historia: "Llegaste al río abierto: ya no hay una ruta marcada ni una sola manera correcta de explorar. El ecosistema necesita que tomes decisiones y dejes registro de tu trabajo.",
    explicacion: "Un proyecto abierto combina instrucciones conocidas para resolver objetivos simultáneos. Puedes diseñar tu ruta, probar una estrategia, leer las notas guardadas y mejorar tu solución.",
    ejemplo: "anotar(\"trabajo listo: cuenca cuidada\")\nmis_notas = leer_notas()\nif len(mis_notas) > 0:\n    decir(mis_notas[0])",
    pregunta: "¿Tiene que existir una sola solución para esta misión?",
    respuesta: "No. Puedes llegar al objetivo con distintas rutas y estrategias mientras cumplas todos los encargos.",
    reto: "Crea una estrategia propia y explica en una nota por qué elegiste ese recorrido."
  }
};
