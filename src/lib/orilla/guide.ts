import type { ChapterId } from './types';

export type PasoGuia = { titulo: string; detalle: string };
export type GuiaTramo = {
  mision: string;
  pasos: PasoGuia[];
  idea: string;
  pista: string;
  comandos: string[];
  ejemplo?: string;
};

export const GUIA_ORILLA: Record<ChapterId, GuiaTramo> = {
  c01: {
    mision: 'Lleva a Nilo desde el muelle (M) hasta la boya (B). Está tres casillas hacia delante.',
    pasos: [
      { titulo: 'Un movimiento', detalle: 'avanzar() mueve la lancha una sola casilla en la dirección en la que mira.' },
      { titulo: 'Repite la orden', detalle: 'Para recorrer tres casillas, escribe la instrucción tres veces, una debajo de otra.' },
      { titulo: 'Comprueba el destino', detalle: 'Pulsa Ejecutar y mira si Nilo termina encima de la boya.' },
    ],
    idea: 'Un programa es una lista de instrucciones. Python las ejecuta de arriba hacia abajo.',
    pista: 'No necesitas girar en este tramo: Nilo ya mira hacia la boya.',
    comandos: ['avanzar'],
    ejemplo: 'avanzar()\navanzar()\navanzar()',
  },
  c02: {
    mision: 'Acerca a Nilo hasta la casilla anterior a la boya y deja escrita la palabra «boya» en la bitácora.',
    pasos: [
      { titulo: 'Llega al lugar correcto', detalle: 'Avanza hasta quedar justo antes de la boya. No tienes que subirte encima.' },
      { titulo: 'Mira sin moverte', detalle: 'mirar() devuelve como texto qué objeto está en la casilla de delante.' },
      { titulo: 'Guarda lo que viste', detalle: 'Guarda ese texto en una variable y pásalo a decir() para que aparezca en la bitácora.' },
    ],
    idea: 'Las funciones pueden devolver información. Una variable permite guardarla y usarla después.',
    pista: 'mirar() no mueve a Nilo. Si está justo delante de la boya, devuelve el texto «boya».',
    comandos: ['avanzar', 'mirar', 'decir'],
  },
  c03: {
    mision: 'Llega a la boya y registra en la bitácora el número de columna donde está Nilo: 6.',
    pasos: [
      { titulo: 'Recorre el canal', detalle: 'Avanza desde el muelle hasta llegar a la boya.' },
      { titulo: 'Consulta la posición', detalle: 'columna() devuelve la columna actual de Nilo. La primera columna del mapa es la 0.' },
      { titulo: 'Guarda y muestra el dato', detalle: 'Asigna el resultado a una variable y usa decir() para escribirlo en la bitácora.' },
    ],
    idea: 'Una variable guarda un dato con un nombre para que puedas reutilizarlo.',
    pista: 'Consulta columna() cuando Nilo ya esté en la boya; antes de llegar, el número será distinto.',
    comandos: ['avanzar', 'columna', 'decir'],
  },
  c04: {
    mision: 'Llega a la boya y escribe 4 en la bitácora: es el número de remos que hacen falta para el trayecto.',
    pasos: [
      { titulo: 'Calcula el trayecto', detalle: 'Usa la posición de Nilo para saber cuántas columnas recorre desde el muelle.' },
      { titulo: 'Cuenta grupos de dos', detalle: 'Se necesita un remo por cada dos columnas. La división entera // cuenta grupos completos y descarta la parte decimal.' },
      { titulo: 'Anota el resultado', detalle: 'Cuando tengas el cálculo, muéstralo con decir(). El valor esperado en este tramo es 4.' },
    ],
    idea: 'Los operadores aritméticos hacen cálculos. // es división entera: 9 // 2 da 4.',
    pista: 'No uses / si necesitas un número entero. La misión está practicando específicamente //.',
    comandos: ['avanzar', 'columna', 'decir', 'int'],
  },
  c05: {
    mision: 'Responde la pregunta de profundidad de la boya. El valor que te da es 4; la bitácora debe terminar en 8 porque piden el doble.',
    pasos: [
      { titulo: 'Haz la pregunta', detalle: 'pedir("pregunta") escribe la pregunta en la bitácora y devuelve la respuesta como texto.' },
      { titulo: 'Convierte el texto', detalle: 'int(valor) convierte una cadena como "4" en el número 4 para poder calcular.' },
      { titulo: 'Calcula y responde', detalle: 'Multiplica el número por 2 y muestra el resultado con decir().' },
    ],
    idea: 'Lo que llega como texto no se comporta automáticamente como un número. Primero conviértelo con int().',
    pista: 'La respuesta de pedir() no es un número todavía: guárdala y conviértela antes de multiplicar.',
    comandos: ['pedir', 'int', 'decir'],
  },
  c06: {
    mision: 'Cruza el vado y llega a la boya en las dos versiones del río. El camino cambia, pero tu programa debe funcionar en ambas.',
    pasos: [
      { titulo: 'Avanza hasta el vado', detalle: 'Nilo debe entrar en el agua antes de comprobar el tipo de casilla.' },
      { titulo: 'Haz una pregunta', detalle: 'agua_baja() devuelve True si Nilo está parado sobre agua baja (~). No revisa la casilla de delante.' },
      { titulo: 'Elige un camino', detalle: 'Usa if y else: una ruta cuando agua_baja() sea True y otra cuando sea False.' },
    ],
    idea: 'if/else permite que el programa tome decisiones según lo que encuentra.',
    pista: 'El código se prueba en dos mapas distintos. Evita escribir una ruta que solo sirva para el primer dibujo.',
    comandos: ['avanzar', 'agua_baja', 'girar_izquierda', 'girar_derecha'],
  },
  c07: {
    mision: 'Cruza el canal aunque su longitud cambie. Hay cuatro mapas y un mismo programa debe llegar a la boya en todos.',
    pasos: [
      { titulo: 'Comprueba el frente', detalle: 'frente_libre() devuelve True si Nilo puede entrar en la casilla que tiene delante.' },
      { titulo: 'Repite mientras sea seguro', detalle: 'while repite las instrucciones de su bloque mientras la condición siga siendo True.' },
      { titulo: 'Deja que el bucle pare', detalle: 'Cuando haya una pared o el borde delante, frente_libre() será False y el bucle terminará.' },
    ],
    idea: 'Un bucle while repite una acción sin que tengas que contar de antemano cuántas veces.',
    pista: 'La longitud del canal cambia entre pruebas. Un número fijo de avanzar() no sirve para todas.',
    comandos: ['frente_libre', 'avanzar'],
  },
  c08: {
    mision: 'Siembra las nueve casillas de agua baja (~) del carrizal. Cada casilla debe convertirse en junco (J).',
    pasos: [
      { titulo: 'Entiende el área', detalle: 'El carrizal es un rectángulo de tres filas por tres columnas: en total hay nueve casillas.' },
      { titulo: 'Siembra donde estás', detalle: 'sembrar() planta un junco en la casilla donde está Nilo; no planta delante de la lancha.' },
      { titulo: 'Repite por filas', detalle: 'Usa for y range() para repetir el trabajo por columnas y luego pasar a la fila siguiente.' },
    ],
    idea: 'for recorre una secuencia de valores. range(3) genera tres repeticiones, con valores 0, 1 y 2.',
    pista: 'Al terminar una fila debes girar y moverte a la siguiente. Nilo no necesita volver al muelle.',
    comandos: ['avanzar', 'sembrar', 'girar_derecha', 'girar_izquierda', 'range'],
  },
  c09: {
    mision: 'Recoge los tres peces, ordena sus tallas de menor a mayor y entrega la lista en la boya. Las tallas cambian entre los dos mapas.',
    pasos: [
      { titulo: 'Recoge y guarda', detalle: 'recoger() funciona cuando Nilo está sobre un pez (F) y devuelve su talla como texto. Guarda cada talla en una lista.' },
      { titulo: 'Ordena la lista', detalle: 'Compara los valores vecinos y cambia su posición cuando estén al revés. Repite hasta que queden de menor a mayor.' },
      { titulo: 'Entrega al final', detalle: 'Ve hasta la boya (B) y llama entregar(lista). La entrega solo funciona en la boya.' },
    ],
    idea: 'Las listas agrupan varios valores. Un bucle for puede recorrerlas y comparar elementos.',
    pista: 'No escribas las tallas a mano: el segundo mapa tiene valores distintos. Recoge los datos reales de cada pez.',
    comandos: ['avanzar', 'recoger', 'entregar', 'len', 'range', 'list', 'min', 'max', 'enumerate'],
  },
  c10: {
    mision: 'Limpia las ramas de las cuatro calas y termina en la boya de la última cala.',
    pasos: [
      { titulo: 'Localiza la rama', detalle: 'R representa una rama. limpiar() la quita cuando está justo delante de Nilo.' },
      { titulo: 'Cruza una cala', detalle: 'Después de limpiar, avanza por el canal, da la vuelta donde corresponda y sigue a la siguiente cala.' },
      { titulo: 'Reutiliza el recorrido', detalle: 'Las cuatro calas repiten un patrón. Puedes crear una función para agrupar las instrucciones y llamarla varias veces.' },
    ],
    idea: 'Una función creada con def guarda una serie de instrucciones que puedes reutilizar con su nombre.',
    pista: 'Puedes superar el objetivo sin una función; usar una función que realmente llames es lo que demuestra el concepto para la tercera estrella.',
    comandos: ['limpiar', 'hay_rama', 'avanzar', 'girar_izquierda', 'girar_derecha', 'range'],
  },
  c11: {
    mision: 'Mide las dos muestras (*) y registra sus fichas en el cuaderno. Debes pasar por el terreno seco (S) sin intentar medirlo.',
    pasos: [
      { titulo: 'Lee cada muestra', detalle: 'medir() solo funciona cuando Nilo está encima de una muestra. Devuelve un diccionario con especie y talla.' },
      { titulo: 'Registra la posición', detalle: 'La ficha debe tener exactamente tres claves: especie, talla y columna. columna() indica dónde encontraste la muestra.' },
      { titulo: 'Protege el recorrido', detalle: 'En el terreno seco medir() produce OrillaError. Usa try/except OrillaError para continuar sin detener todo el programa.' },
    ],
    idea: 'Un diccionario guarda datos con claves. try/except permite manejar un error esperado y seguir ejecutando.',
    pista: 'El cuaderno se ordena de oeste a este: registra la primera muestra antes de la segunda.',
    comandos: ['avanzar', 'frente_libre', 'medir', 'registrar', 'posicion', 'columna', 'dict'],
  },
  c12: {
    mision: 'Completa la cuenca: limpia la rama, recoge el pez, mide y registra la muestra, siembra las cuatro casillas del estanque y llega a la boya. La última línea de la bitácora debe ser la talla del pez.',
    pasos: [
      { titulo: 'Recorre el canal', detalle: 'Avanza por el pasillo. Si hay una rama delante, límpiala antes de avanzar.' },
      { titulo: 'Guarda la información', detalle: 'Cuando encuentres el pez, recoge su talla. Cuando encuentres la muestra, mídela y registra especie, talla y columna.' },
      { titulo: 'Siembra el estanque', detalle: 'El estanque tiene cuatro casillas de agua baja (~). Planta en cada una y luego sigue hasta la boya.' },
      { titulo: 'Cierra la bitácora', detalle: 'La última línea que escribas con decir() debe ser la talla del pez. Hay dos mapas con posiciones y datos distintos.' },
    ],
    idea: 'Este tramo mezcla secuencias, decisiones, bucles, funciones y diccionarios que ya practicaste.',
    pista: 'No programes solo para el dibujo que ves: el mismo código se ejecuta en dos cuencas con datos diferentes.',
    comandos: ['avanzar', 'frente_libre', 'hay_rama', 'limpiar', 'recoger', 'medir', 'registrar', 'sembrar', 'decir', 'columna'],
  },
  'reto-brazo': {
    mision: 'Encuentra la boya por un pasillo que no puedes ver completo. Nilo solo puede reconocer las casillas cercanas.',
    pasos: [
      { titulo: 'Pregunta dónde estás', detalle: 'aqui() dice qué hay en la casilla actual; mirar() dice qué hay delante.' },
      { titulo: 'Comprueba el paso', detalle: 'frente_libre() informa si puedes avanzar sin chocar con la orilla.' },
      { titulo: 'Busca hasta la boya', detalle: 'Usa las respuestas de esos sensores para avanzar o girar hasta que aqui() indique «boya».' },
    ],
    idea: 'Un programa puede tomar decisiones usando sensores en vez de consultar un mapa completo.',
    pista: 'El mapa se puede mostrar después de cinco intentos fallidos. No es obligatorio usarlo: el reto practica orientarse sin verlo.',
    comandos: ['aqui', 'mirar', 'frente_libre', 'avanzar', 'girar_derecha', 'girar_izquierda'],
  },
  'reto-luces': {
    mision: 'Lee las cinco luces, ordena sus brillos de mayor a menor y entrega esa lista en la boya. Hay dos luces con el mismo brillo.',
    pasos: [
      { titulo: 'Visita las luces', detalle: 'L representa una luz. brillo() devuelve su número cuando Nilo está parado sobre ella.' },
      { titulo: 'Guarda los valores', detalle: 'Añade cada brillo a una lista. Las luces están en dos partes del mapa.' },
      { titulo: 'Ordena y entrega', detalle: 'Ordena de mayor a menor, convierte cada número a texto con str() y entrega la lista en la boya.' },
    ],
    idea: 'Los bucles sirven para recopilar datos y ordenarlos sin escribir una regla distinta para cada luz.',
    pista: 'El brillo 4 aparece dos veces. No elimines uno: debes entregar los cinco valores.',
    comandos: ['avanzar', 'brillo', 'entregar', 'range', 'len', 'list', 'str'],
  },
  abierta: {
    mision: 'Explora el río y completa cuatro encargos: llega a la boya del sureste, siembra al menos ocho juncos, limpia las tres ramas y guarda una nota que contenga la palabra «listo».',
    pasos: [
      { titulo: 'Elige tu ruta', detalle: 'No hay un camino único. Puedes explorar y decidir en qué orden resolver los encargos.' },
      { titulo: 'Cuida el río', detalle: 'Siembra en ocho o más casillas de agua baja (~) y elimina las tres ramas (R) usando limpiar().' },
      { titulo: 'Deja constancia', detalle: 'Llega a la boya y usa anotar("listo") o una frase que contenga esa palabra.' },
    ],
    idea: 'Aquí combinas lo aprendido y diseñas tu propia estrategia. No hay una única solución.',
    pista: 'anotar() guarda en la bitácora de la cuenca. leer_notas() devuelve las notas que ya guardaste.',
    comandos: ['avanzar', 'girar_derecha', 'girar_izquierda', 'limpiar', 'sembrar', 'anotar', 'leer_notas'],
  },
};

export const SIMBOLOS_ORILLA = [
  { simbolo: 'M', nombre: 'Muelle', detalle: 'Lugar donde empieza Nilo.' },
  { simbolo: 'B', nombre: 'Boya', detalle: 'Destino o punto donde se entregan datos.' },
  { simbolo: '.', nombre: 'Agua', detalle: 'Nilo puede navegar por aquí.' },
  { simbolo: '~', nombre: 'Agua baja', detalle: 'Puedes navegar; algunos tramos piden sembrar aquí.' },
  { simbolo: '#', nombre: 'Orilla', detalle: 'Tierra: Nilo no puede atravesarla.' },
  { simbolo: 'R', nombre: 'Rama', detalle: 'Bloquea el paso; limpiar() la quita si está delante.' },
  { simbolo: 'J', nombre: 'Junco', detalle: 'Planta que aparece cuando usas sembrar().' },
  { simbolo: 'F', nombre: 'Pez', detalle: 'Puedes recogerlo estando sobre su casilla.' },
  { simbolo: '*', nombre: 'Muestra', detalle: 'Puedes medirla estando sobre su casilla.' },
  { simbolo: 'S', nombre: 'Terreno seco', detalle: 'No se puede medir.' },
  { simbolo: 'L', nombre: 'Luz', detalle: 'Puedes leer su brillo estando sobre ella.' },
] as const;
