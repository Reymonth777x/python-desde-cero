import type { DatosTramo } from '../types';

export const c10: DatosTramo = {
  "id": "c10",
  "variantes": [{"mapa": ["#######", "#MR..B#", "#.#####", "#.R..B#", "#.#####", "#.R..B#", "#.#####", "#.R..B#", "#######"]}],
  "objetivos": [
    {"t": "mapa_igual", "patron": ["???????", "??.????", "???????", "??.????", "???????", "??.????", "???????", "??.????", "???????"], "fallo": "Quedan ramas sin limpiar."},
    {"t": "estar_en", "c": 5, "f": 7, "fallo": "Nilo debía terminar en la boya de la última cala."}
  ],
  "pasosTope": 120,
  "maestria": [["CalledDef"]],
  "andamiaje": "# Cuatro calas iguales, una debajo de otra.\n# Cada cala empieza con una rama: limpiar() la quita.\n\n",
  "ayuda": ["La tercera estrella pide una función. El tramo se puede cruzar sin ella.", "limpiar() quita la rama que hay delante de Nilo."],
  "consecuencia": "Las cuatro calas quedan limpias.",
  "pasosPar": 52
};
