import type { DatosTramo } from '../types';

export const c07: DatosTramo = {
  "id": "c07",
  "variantes": [
    {"mapa": ["#####", "#M.B#", "#####"]},
    {"mapa": ["######", "#M..B#", "######"]},
    {"mapa": ["########", "#M....B#", "########"]},
    {"mapa": ["##########", "#M......B#", "##########"]}
  ],
  "objetivos": [{"t": "estar_en", "en": "B"}],
  "pasosTope": 30,
  "pasosPar": 7,
  "maestria": [["While"]],
  "andamiaje": "# El canal cambia de largo en cada tramo (1 a 4).\n# frente_libre() dice si Nilo puede avanzar.\n\n",
  "ayuda": ["El canal cambia de largo: hay cuatro tramos del mismo programa.", "frente_libre() es True mientras Nilo pueda avanzar."],
  "consecuencia": "El canal se cruza, largo o corto."
};
