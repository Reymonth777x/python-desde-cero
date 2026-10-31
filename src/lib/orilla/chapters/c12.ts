import type { DatosTramo } from '../types';

export const c12: DatosTramo = {
  "id": "c12",
  "variantes": [
    {"mapa": ["##########", "#M.R.F.*.#", "#######~~#", "#######~~#", "########B#", "##########"], "tallas": {"5,1": 5}, "muestras": {"7,1": {"especie": "lobina", "talla": 6}}, "objetivos": [{"t": "mapa_igual", "patron": ["??????????", "???.?.?.??", "???????JJ?", "???????JJ?", "??????????", "??????????"], "fallo": "Falta limpiar la rama, recoger el pez, medir la muestra o sembrar el estanque."}, {"t": "registro_igual", "fichas": [{"especie": "lobina", "talla": 6, "columna": 7}]}, {"t": "bitacora_termina_en", "texto": "5"}]},
    {"mapa": ["########", "#MRF.*.#", "#####~~#", "#####~~#", "######B#", "########"], "tallas": {"3,1": 2}, "muestras": {"5,1": {"especie": "bagre", "talla": 3}}, "objetivos": [{"t": "mapa_igual", "patron": ["????????", "??..?.??", "?????JJ?", "?????JJ?", "????????", "????????"], "fallo": "Falta limpiar la rama, recoger el pez, medir la muestra o sembrar el estanque."}, {"t": "registro_igual", "fichas": [{"especie": "bagre", "talla": 3, "columna": 5}]}, {"t": "bitacora_termina_en", "texto": "2"}]}
  ],
  "objetivos": [{"t": "estar_en", "en": "B"}],
  "pasosTope": 120,
  "clavesRegistro": ["especie", "talla", "columna"],
  "maestria": [["FunctionDef", "For", "While"], ["Dict", "Call:dict"]],
  "andamiaje": "# La cuenca: canal, rama, pez, muestra, estanque y boya.\n# Verbos: avanzar, girar_izquierda, girar_derecha, mirar, aqui, columna, fila,\n# posicion, frente_libre, hay_rama, limpiar, recoger, medir, registrar,\n# sembrar, decir. La bitácora debe terminar con la talla del pez.\n\n",
  "ayuda": ["Cada cuenca junta lo que ya sabes: un canal de largo distinto, una rama, un pez, una muestra y un estanque de 2×2.", "El estanque es agua baja: hay que sembrar sus cuatro casillas antes de llegar a la boya.", "La bitácora debe terminar con la talla del pez."],
  "consecuencia": "La cuenca queda anotada. El río sigue, si quieres.",
  "pasosPar": 33
};
