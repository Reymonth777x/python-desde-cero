import type { DatosTramo } from '../types';

export const c11: DatosTramo = {
  "id": "c11",
  "variantes": [
    {"mapa": ["######", "#M*S*#", "######"], "muestras": {"2,1": {"especie": "trucha", "talla": 4}, "4,1": {"especie": "carpa", "talla": 7}}, "objetivos": [{"t": "registro_igual", "fichas": [{"especie": "trucha", "talla": 4, "columna": 2}, {"especie": "carpa", "talla": 7, "columna": 4}]}]},
    {"mapa": ["########", "#M.*S.*#", "########"], "muestras": {"3,1": {"especie": "tilapia", "talla": 3}, "6,1": {"especie": "bagre", "talla": 9}}, "objetivos": [{"t": "registro_igual", "fichas": [{"especie": "tilapia", "talla": 3, "columna": 3}, {"especie": "bagre", "talla": 9, "columna": 6}]}]}
  ],
  "objetivos": [],
  "pasosTope": 60,
  "clavesRegistro": ["especie", "talla", "columna"],
  "maestria": [["Try"], ["Dict"]],
  "andamiaje": "# Hay dos muestras (*) y un tramo seco (S) entre ellas.\n# medir() devuelve un diccionario; en el seco lanza OrillaError.\n# Registra cada muestra con registrar({...}).\n\n",
  "ayuda": ["El cuaderno se lee de oeste a este: la primera muestra que encuentra Nilo es la primera ficha.", "Cada ficha lleva exactamente: especie, talla y columna.", "posicion()[0] da la columna; columna() también."],
  "consecuencia": "El cuaderno tiene las dos muestras y el seco no lo rompe.",
  "pasosPar": 14
};
