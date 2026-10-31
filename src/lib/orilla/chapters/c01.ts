import type { DatosTramo } from '../types';

export const c01: DatosTramo = {
  "id": "c01",
  "variantes": [
    {
      "mapa": [
        "######",
        "#M..B#",
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
  "pasosTope": 8,
  "andamiaje": "# La boya está al este del muelle.\n# Verbo de este tramo: avanzar()\n\navanzar()\n",
  "ayuda": [
    "Un programa es una secuencia de pasos: Nilo hace uno después de otro.",
    "La boya está tres casillas al este del muelle."
  ],
  "consecuencia": "La boya queda marcada.",
  "pasosPar": 3
};
