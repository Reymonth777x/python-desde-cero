import type { DatosTramo } from '../types';

export const c08: DatosTramo = {
  "id": "c08",
  "variantes": [{"mapa": ["######", "#M~~~#", "##~~~#", "##~~~#", "######"]}],
  "objetivos": [{"t": "mapa_igual", "patron": ["??????", "??JJJ?", "??JJJ?", "??JJJ?", "??????"], "fallo": "Quedan casillas de agua baja sin sembrar."}],
  "pasosTope": 80,
  "pasosPar": 40,
  "maestria": [["For"]],
  "andamiaje": "# Siembra junco en las nueve casillas de agua baja.\n# sembrar() planta en la casilla donde está Nilo.\n# girar_derecha() y girar_izquierda() existen.\n\n",
  "ayuda": ["El carrizal es un rectángulo. `for` y `range` evitan escribir un avanzar por casilla.", "Nilo no tiene por qué volver al muelle."],
  "consecuencia": "El carrizal queda sembrado."
};
