import type { DatosTramo } from '../types';

export const c02: DatosTramo = {
  "id": "c02",
  "variantes": [
    {
      "mapa": [
        "#######",
        "#M...B#",
        "#######"
      ]
    }
  ],
  "objetivos": [
    {
      "t": "estar_en",
      "c": 4,
      "f": 1,
      "fallo": "Nilo debía quedar en la casilla anterior a la boya."
    },
    {
      "t": "bitacora_igual",
      "lineas": [
        "boya"
      ]
    }
  ],
  "pasosTope": 10,
  "maestria": [
    [
      "Call:mirar"
    ]
  ],
  "andamiaje": "# Llega junto a la boya, sin ocuparla.\n# mirar() dice qué hay delante de Nilo.\n# Pista: texto = mirar()\n# Después, decir(...) lo anota en la bitácora.\n\n",
  "ayuda": [
    "`mirar()` devuelve un texto con lo que hay delante de Nilo.",
    "`decir(texto)` escribe una línea en la bitácora."
  ],
  "consecuencia": "El letrero queda anotado.",
  "pasosPar": 5
};
