import type { DatosTramo } from '../types';

export const c09: DatosTramo = {
  "id": "c09",
  "variantes": [
    {"mapa": ["#######", "#MFFFB#", "#######"], "tallas": {"2,1": 2, "3,1": 5, "4,1": 1}, "objetivos": [{"t": "entregado_igual", "lista": ["1", "2", "5"]}]},
    {"mapa": ["#######", "#MFFFB#", "#######"], "tallas": {"2,1": 4, "3,1": 4, "4,1": 3}, "objetivos": [{"t": "entregado_igual", "lista": ["3", "4", "4"]}]}
  ],
  "objetivos": [],
  "pasosTope": 80,
  "entregaEn": ["B"],
  "maestria": [["For", "While"]],
  "andamiaje": "# Recoge los tres peces y entrega las tallas en la boya.\n# recoger() devuelve la talla, un texto.\n# entregar(lista) solo funciona en la boya.\n\n",
  "ayuda": ["`recoger()` devuelve la talla, un texto. Guárdalas en una lista.", "La escala solo abre de menor a mayor."],
  "consecuencia": "El cardumen llega ordenado a la boya.",
  "pasosPar": 12
};
