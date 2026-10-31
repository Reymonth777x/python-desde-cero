import type { ChapterId, DatosTramo, PayloadTramo } from '../types';
import { APERTURAS, CONSTRUCTOS_INFO, TRAMOS, TODOS_LOS_TRAMOS, abiertosPara } from '../catalog';
import { c01 } from './c01';
import { c02 } from './c02';
import { c03 } from './c03';
import { c04 } from './c04';
import { c05 } from './c05';
import { c06 } from './c06';
import { c07 } from './c07';
import { c08 } from './c08';
import { c09 } from './c09';
import { c10 } from './c10';
import { c11 } from './c11';
import { c12 } from './c12';
import { reto_brazo } from './reto-brazo';
import { reto_luces } from './reto-luces';
import { abierta } from './abierta';

export const DATOS: Record<ChapterId, DatosTramo> = { c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, 'reto-brazo': reto_brazo, 'reto-luces': reto_luces, abierta };
export function datosDe(id: ChapterId): DatosTramo { return DATOS[id]; }

/** Lo que se manda al motor: el tramo sin textos de interfaz, más lo abierto. */
export function construirPayload(id: ChapterId, notas?: string[]): PayloadTramo {
  const { andamiaje: _a, ayuda: _y, consecuencia: _c, ...tramo } = DATOS[id];
  void _a; void _y; void _c;
  const tramos: PayloadTramo['tramos'] = {};
  for (const t of TODOS_LOS_TRAMOS) tramos[t] = { nombre: TRAMOS[t].nombre, leccion: TRAMOS[t].lessonId, tema: TRAMOS[t].tema };
  return { ...tramo, abiertos: abiertosPara(id), aperturas: APERTURAS, tramos, constructos: CONSTRUCTOS_INFO, notas };
}
