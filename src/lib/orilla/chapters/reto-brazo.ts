import type { DatosTramo } from '../types';

export const reto_brazo: DatosTramo = {
  "id": "reto-brazo",
  "variantes": [{"mapa": ["########", "#M.....#", "######.#", "##.....#", "##.#####", "##.....#", "######B#", "########"]}],
  "objetivos": [{"t": "estar_en", "en": "B"}],
  "pasosTope": 200,
  "maestria": [["While"]],
  "ocultarMapa": true,
  "andamiaje": "# Un afluente que no ves entero.\n# Solo conoces lo que Nilo mira: mirar() y frente_libre().\n\n",
  "ayuda": ["El camino es único, sin lazos. Sigue el pasillo con los sensores.", "Después de 5 intentos fallidos puedes mostrar el mapa."],
  "consecuencia": "Nilo encontró la boya sin ver el río.",
  "pasosPar": 31
};
