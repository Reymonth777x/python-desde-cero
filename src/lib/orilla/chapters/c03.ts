import type { DatosTramo } from '../types';

export const c03: DatosTramo = {
  "id": "c03",
  "variantes": [
    {
      "mapa": [
        "#######",
        "#M....B",
        "#######"
      ]
    }
  ],
  "objetivos": [
    {
      "t": "estar_en",
      "en": "B"
    },
    {
      "t": "bitacora_igual",
      "lineas": [
        "6"
      ]
    }
  ],
  "pasosTope": 12,
  "maestria": [
    [
      "AssignNoConst"
    ]
  ],
  "andamiaje": "# En este tramo la sonda es la columna de la boya.\n# columna() dice en qué columna está Nilo.\n\n",
  "ayuda": [
    "Un nombre guarda el valor para usarlo después.",
    "En este tramo la sonda es la columna de la boya."
  ],
  "consecuencia": "La sonda marca la profundidad.",
  "pasosPar": 6
};
