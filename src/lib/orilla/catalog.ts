import type { Aperturas, ChapterId } from './types';

export type TramoMeta = {
  id: ChapterId;
  /** 1 a 12 en la campaña; 0 en retos y río abierto. */
  orden: number;
  nombre: string;
  concepto: string;
  lessonId: string;
  /** Con qué se nombra la lección en los mensajes de la compuerta. */
  tema: string;
  tipo: 'campana' | 'reto' | 'abierta';
};

export const CAMPANA: ChapterId[] = ['c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12'];
export const EXTRAS: ChapterId[] = ['reto-brazo', 'reto-luces', 'abierta'];
export const TODOS_LOS_TRAMOS: ChapterId[] = [...CAMPANA, ...EXTRAS];

export const TRAMOS: Record<ChapterId, TramoMeta> = {
  c01: { id: 'c01', orden: 1, nombre: 'La boya', concepto: 'Un programa es una secuencia de pasos', lessonId: 'b1-l1', tema: 'secuencias', tipo: 'campana' },
  c02: { id: 'c02', orden: 2, nombre: 'El letrero', concepto: 'Cadenas y salida', lessonId: 'b2-l5', tema: 'cadenas y salida', tipo: 'campana' },
  c03: { id: 'c03', orden: 3, nombre: 'La sonda', concepto: 'Variables y nombres', lessonId: 'b2-l2', tema: 'variables', tipo: 'campana' },
  c04: { id: 'c04', orden: 4, nombre: 'Los remos', concepto: 'Aritmética y prioridad', lessonId: 'b2-l3', tema: 'aritmética', tipo: 'campana' },
  c05: { id: 'c05', orden: 5, nombre: 'La pregunta', concepto: 'Entrada y int()', lessonId: 'b2-l6', tema: 'entrada de datos', tipo: 'campana' },
  c06: { id: 'c06', orden: 6, nombre: 'El vado', concepto: 'if, elif, else', lessonId: 'b3-l3', tema: 'decisiones', tipo: 'campana' },
  c07: { id: 'c07', orden: 7, nombre: 'El canal', concepto: 'while', lessonId: 'b3-l4', tema: 'repetición', tipo: 'campana' },
  c08: { id: 'c08', orden: 8, nombre: 'El carrizal', concepto: 'for y range', lessonId: 'b3-l5', tema: 'recorridos', tipo: 'campana' },
  c09: { id: 'c09', orden: 9, nombre: 'El cardumen', concepto: 'Listas y orden', lessonId: 'b3-l6', tema: 'listas', tipo: 'campana' },
  c10: { id: 'c10', orden: 10, nombre: 'Las cuatro calas', concepto: 'Funciones', lessonId: 'b4-l1', tema: 'funciones', tipo: 'campana' },
  c11: { id: 'c11', orden: 11, nombre: 'Las muestras', concepto: 'Diccionarios y errores', lessonId: 'b4-l6', tema: 'diccionarios', tipo: 'campana' },
  c12: { id: 'c12', orden: 12, nombre: 'La cuenca', concepto: 'Todo junto en un programa', lessonId: 'b4-l9', tema: 'proyectos', tipo: 'campana' },
  'reto-brazo': { id: 'reto-brazo', orden: 0, nombre: 'El brazo ciego', concepto: 'Sensores y while sin mapa', lessonId: 'b3-l4', tema: 'repetición', tipo: 'reto' },
  'reto-luces': { id: 'reto-luces', orden: 0, nombre: 'Las luces del remanso', concepto: 'Ordenar con un bucle', lessonId: 'b3-l7', tema: 'ordenar con bucles', tipo: 'reto' },
  abierta: { id: 'abierta', orden: 0, nombre: 'Río abierto', concepto: 'El mismo motor, mapa grande', lessonId: 'b5-l3', tema: 'guardar texto', tipo: 'abierta' },
};

export const APERTURAS: Aperturas = {
  verbos: {
    avanzar: 'c01', mirar: 'c02', decir: 'c02', aqui: 'c03', columna: 'c03', fila: 'c03',
    pedir: 'c05', agua_baja: 'c06', girar_izquierda: 'c06', girar_derecha: 'c06', frente_libre: 'c07',
    sembrar: 'c08', recoger: 'c09', entregar: 'c09', limpiar: 'c10', hay_rama: 'c10', posicion: 'c11',
    medir: 'c11', registrar: 'c11', anotar: 'abierta', leer_notas: 'abierta', brillo: 'reto-luces',
  },
  builtins: { int: 'c04', str: 'c04', float: 'c05', bool: 'c06', range: 'c08', len: 'c08', list: 'c09', min: 'c09', max: 'c09', sum: 'c09', abs: 'c09', enumerate: 'c09', dict: 'c11', tuple: 'c11' },
  constructos: { fstring: 'c02', aritmetica: 'c04', comparaciones: 'c06', if: 'c06', while: 'c07', for: 'c08', lista: 'c09', def: 'c10', dict: 'c11', tuple: 'c11', try: 'c11' },
};

export const CONSTRUCTOS_INFO: Record<string, { kw: string; etiqueta: string; sugerencia: string }> = {
  fstring: { kw: 'f"..."', etiqueta: 'cadenas con valores', sugerencia: 'Puedes escribir cada texto por separado.' },
  aritmetica: { kw: '+ - * / // %', etiqueta: 'operaciones aritméticas', sugerencia: 'Puedes resolverlo con lo que ya conoces.' },
  comparaciones: { kw: '== != < > and or not', etiqueta: 'comparaciones', sugerencia: 'Puedes escribir el camino paso a paso.' },
  if: { kw: 'if', etiqueta: 'decisiones', sugerencia: 'Puedes escribir el camino paso a paso.' },
  while: { kw: 'while', etiqueta: 'bucles', sugerencia: 'Puedes escribir el camino paso a paso.' },
  for: { kw: 'for', etiqueta: 'bucles', sugerencia: 'Puedes escribir el camino paso a paso.' },
  lista: { kw: '[ ]', etiqueta: 'listas', sugerencia: 'Puedes resolverlo con lo que ya conoces.' },
  def: { kw: 'def', etiqueta: 'funciones', sugerencia: 'Puedes escribir cada paso a mano.' },
  dict: { kw: '{ }', etiqueta: 'diccionarios', sugerencia: 'Puedes resolverlo con lo que ya conoces.' },
  tuple: { kw: '( , )', etiqueta: 'tuplas', sugerencia: 'Puedes resolverlo con lo que ya conoces.' },
  try: { kw: 'try', etiqueta: 'manejo de errores', sugerencia: 'Puedes resolverlo con lo que ya conoces.' },
};

export function esChapterId(valor: unknown): valor is ChapterId {
  return typeof valor === 'string' && (TODOS_LOS_TRAMOS as string[]).includes(valor);
}
export function tramoMeta(id: ChapterId): TramoMeta { return TRAMOS[id]; }
export function tramoDeLeccion(lessonId: string): ChapterId | null { return CAMPANA.find((id) => TRAMOS[id].lessonId === lessonId) ?? null; }
export function siguienteTramo(id: ChapterId): ChapterId | null {
  const i = CAMPANA.indexOf(id);
  return i >= 0 && i < CAMPANA.length - 1 ? CAMPANA[i + 1] : null;
}
export function estaDesbloqueado(id: ChapterId, superados: ReadonlySet<string>): boolean {
  const i = CAMPANA.indexOf(id);
  if (i === 0) return true;
  if (i > 0) return superados.has(CAMPANA[i - 1]);
  return superados.has('c12');
}
function ordinal(tramo: string): number {
  const i = (CAMPANA as string[]).indexOf(tramo);
  return i < 0 ? Number.POSITIVE_INFINITY : i + 1;
}
export function abiertosPara(id: ChapterId): { verbos: string[]; builtins: string[]; constructos: string[] } {
  const tope = CAMPANA.includes(id) ? ordinal(id) : 12;
  const abre = (donde: string) => ordinal(donde) === Number.POSITIVE_INFINITY ? donde === id : ordinal(donde) <= tope;
  const filtrar = (tabla: Record<string, string>) => Object.keys(tabla).filter((k) => abre(tabla[k]));
  let verbos = filtrar(APERTURAS.verbos);
  if (id === 'reto-luces') verbos = verbos.filter((v) => v !== 'registrar');
  return { verbos, builtins: filtrar(APERTURAS.builtins), constructos: filtrar(APERTURAS.constructos) };
}
