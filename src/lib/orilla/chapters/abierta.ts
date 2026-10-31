import type { DatosTramo } from '../types';

export const abierta: DatosTramo = {
  "id": "abierta",
  "variantes": [
    {
      "mapa": [
        "################",
        "#M.............#",
        "#.~~~..........#",
        "#.~~~..........#",
        "#.~~~..........#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#..............#",
        "#.....R..R..R.B#",
        "################"
      ]
    }
  ],
  "objetivos": [
    {
      "t": "estar_en",
      "en": "B"
    },
    {
      "t": "celdas",
      "simbolo": "J",
      "min": 8,
      "fallo": "Hay que sembrar al menos 8 juncos."
    },
    {
      "t": "celdas",
      "simbolo": "R",
      "max": 0,
      "fallo": "Quedan ramas sin limpiar."
    },
    {
      "t": "notas_contienen",
      "texto": "listo"
    }
  ],
  "pasosTope": 600,
  "andamiaje": "# Río abierto: puedes recorrerlo como quieras.\n# Para guardar tu marca: llega a la boya del sureste, siembra 8 juncos,\n# limpia las 3 ramas y anota una línea con la palabra listo.\n\n",
  "ayuda": [
    "Puedes recorrerlo como quieras.",
    "anotar(linea) guarda texto en la bitácora de la cuenca; leer_notas() lo devuelve."
  ],
  "consecuencia": "Río abierto: la marca queda guardada."
};
