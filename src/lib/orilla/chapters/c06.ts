import type { DatosTramo } from '../types';

export const c06: DatosTramo = {
  "id": "c06",
  "variantes": [
    {
      "mapa": [
        "######",
        "#M~~B#",
        "######"
      ]
    },
    {
      "mapa": [
        "######",
        "#M.#B#",
        "#~~~~#",
        "######"
      ]
    }
  ],
  "objetivos": [
    {
      "t": "estar_en",
      "en": "B"
    }
  ],
  "pasosTope": 16,
  "maestria": [
    [
      "If"
    ]
  ],
  "andamiaje": "# Dos vados distintos, un solo programa.\n# agua_baja() dice si Nilo está sobre agua baja.\n\n",
  "ayuda": [
    "Un mismo programa tiene que cruzar los dos vados.",
    "agua_baja() mira la casilla donde está Nilo, no la de delante."
  ],
  "consecuencia": "Nilo cruza el vado sin encallar.",
  "pasosPar": 10
};
