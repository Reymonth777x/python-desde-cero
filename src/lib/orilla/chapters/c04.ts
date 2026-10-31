import type { DatosTramo } from '../types';

export const c04: DatosTramo = {
  "id": "c04",
  "variantes": [
    {
      "mapa": [
        "##########",
        "#M......B#",
        "##########"
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
        "4"
      ]
    }
  ],
  "pasosTope": 20,
  "maestria": [
    [
      "FloorDiv"
    ]
  ],
  "techoSinMaestria": 1,
  "andamiaje": "# Cada dos columnas hace falta un remo.\n# Cuenta los remos que hacen falta hasta la boya.\n\n",
  "ayuda": [
    "Cada dos columnas hace falta un remo. La división entera es `//`. No uses solo `/`."
  ],
  "consecuencia": "Los remos quedan contados.",
  "pasosPar": 8
};
