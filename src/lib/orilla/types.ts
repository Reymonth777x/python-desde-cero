export type ChapterId = 'c01' | 'c02' | 'c03' | 'c04' | 'c05' | 'c06' | 'c07' | 'c08' | 'c09' | 'c10' | 'c11' | 'c12' | 'reto-brazo' | 'reto-luces' | 'abierta';
export type Rumbo = 'norte' | 'este' | 'sur' | 'oeste';
export type Objetivo =
  | { t: 'estar_en'; en?: 'B'; c?: number; f?: number; fallo?: string }
  | { t: 'rumbo'; valor: Rumbo; fallo?: string }
  | { t: 'bitacora_igual'; lineas: string[]; fallo?: string }
  | { t: 'bitacora_contiene'; texto: string; fallo?: string }
  | { t: 'bitacora_termina_en'; texto: string; fallo?: string }
  | { t: 'mapa_igual'; patron: string[]; fallo?: string }
  | { t: 'celdas'; simbolo: string; min?: number; max?: number; fallo?: string }
  | { t: 'entregado_igual'; lista: string[]; fallo?: string }
  | { t: 'registro_igual'; fichas: Array<Record<string, string | number>>; fallo?: string }
  | { t: 'notas_contienen'; texto: string; fallo?: string }
  | { t: 'pasos_max'; n: number; fallo?: string }
  | { t: 'usa_llamada'; nombre: string; fallo?: string };
export type Variante = { mapa: string[]; rumbo?: Rumbo; tallas?: Record<string, number>; brillo?: Record<string, number>; muestras?: Record<string, { especie: string; talla: number }>; respuestas?: string[]; objetivos?: Objetivo[] };
export type DatosTramo = { id: ChapterId; variantes: Variante[]; objetivos: Objetivo[]; pasosTope: number; pasosPar?: number; maestria?: string[][]; techoSinMaestria?: number; respuestas?: string[]; clavesRegistro?: string[]; entregaEn?: string[]; ocultarMapa?: boolean; andamiaje: string; ayuda: string[]; consecuencia: string };
export type Aperturas = { verbos: Record<string, string>; builtins: Record<string, string>; constructos: Record<string, string> };
export type PayloadTramo = Omit<DatosTramo, 'andamiaje' | 'ayuda' | 'consecuencia'> & { abiertos: { verbos: string[]; builtins: string[]; constructos: string[] }; aperturas: Aperturas; tramos: Record<string, { nombre: string; leccion: string; tema: string }>; constructos: Record<string, { kw: string; etiqueta: string; sugerencia: string }>; notas?: string[] };
export type EventoOrilla =
  | { t: 'move'; c: number; f: number; rumbo: Rumbo; step: number }
  | { t: 'turn'; rumbo: Rumbo; step: number }
  | { t: 'cell'; c: number; f: number; kind: string; step: number }
  | { t: 'say'; text: string; step: number }
  | { t: 'give'; items: string[]; step: number }
  | { t: 'record'; ficha: Record<string, string | number | null>; step: number }
  | { t: 'note'; text: string; step: number }
  | { t: 'error'; message: string; line: number | null; step: number }
  | { t: 'done'; step: number };
export type ErrorOrilla = { tipo: 'orilla' | 'python' | 'pasos' | 'opcodes' | 'motor'; mensaje: string; linea: number | null; traceback: string };
export type ResultadoVariante = { indice: number; passed: boolean; steps: number; events: EventoOrilla[]; log: string[]; fail: string | null; error: ErrorOrilla | null; truncated: boolean; final: { mapa: string[]; nilo: { c: number; f: number; rumbo: Rumbo } }; registro: Array<Record<string, string | number | null>>; entregado: string[] | null; notas: string[] };
export type ResultadoOrilla = { gate: { ok: true } | { ok: false; mensaje: string; linea: number; leccion: string | null }; variants: ResultadoVariante[]; show?: number; stars: number; passed: boolean; steps?: number; error: ErrorOrilla | null; notas?: string[] };
