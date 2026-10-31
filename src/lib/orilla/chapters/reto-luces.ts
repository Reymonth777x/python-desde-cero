import type { DatosTramo } from '../types';

export const reto_luces: DatosTramo = {
  "id": "reto-luces",
  "variantes": [{"mapa": ["######", "#MLLL#", "####.#", "#BLL.#", "######"], "brillo": {"2,1": 1, "3,1": 4, "4,1": 4, "3,3": 7, "2,3": 2}}],
  "objetivos": [{"t": "entregado_igual", "lista": ["7", "4", "4", "2", "1"]}],
  "pasosTope": 120,
  "entregaEn": ["B"],
  "maestria": [["For", "While"]],
  "andamiaje": "# Cinco luces con brillo distinto.\n# brillo() lee la luz de la casilla donde está Nilo.\n# Entrega en la boya los brillos de mayor a menor, como textos.\n\n",
  "ayuda": ["El protocolo pide anotar el brillo de mayor a menor. Hay dos casillas con el mismo brillo."],
  "consecuencia": "Las luces quedan anotadas de mayor a menor.",
  "pasosPar": 15
};
