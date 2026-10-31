import type { DatosTramo } from '../types';

export const c05: DatosTramo = {
  "id": "c05",
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
      "t": "bitacora_termina_en",
      "texto": "8"
    },
    {
      "t": "usa_llamada",
      "nombre": "pedir",
      "fallo": "El programa debía preguntar con pedir()."
    }
  ],
  "pasosTope": 15,
  "respuestas": [
    "4"
  ],
  "maestria": [
    [
      "Call:int"
    ],
    [
      "Call:pedir"
    ]
  ],
  "andamiaje": "# La boya pregunta la profundidad.\n# pedir(pregunta) devuelve la respuesta como texto.\n# Responde con el doble de ese número.\n\n",
  "ayuda": [
    "La boya pregunta la profundidad. Responde con el número que te da.",
    "`pedir()` devuelve texto: conviértelo con `int()` antes de calcular."
  ],
  "consecuencia": "La boya recibe tu respuesta.",
  "pasosPar": 6
};
