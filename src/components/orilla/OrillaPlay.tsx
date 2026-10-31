'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Editor, { type Monaco } from '@monaco-editor/react';
import type { editor, IDisposable } from 'monaco-editor';
import { useTheme } from '@/app/theme-provider';
import { guardarOrilla, vaciarNotasOrilla } from '@/app/orilla/actions';
import { DOC_VERBOS, VERBOS_SIN_ARGUMENTOS } from '@/lib/orilla/ayuda-verbos';
import { hrefLeccion } from '@/lib/orilla/enlaces';
import {
  aplicarEvento,
  describirRio,
  estadoFinal,
  estadoInicial,
  type EstadoRio,
} from '@/lib/orilla/replay';
import type { EventoOrilla, PayloadTramo, ResultadoOrilla } from '@/lib/orilla/types';
import { useOrillaWorker } from '@/lib/orilla/use-orilla-worker';
import RiverView from './RiverView';

if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
  window.MonacoEnvironment = { baseUrl: '/monaco/vs/' };
}

type Velocidad = 'lenta' | 'normal' | 'rapida' | 'instante';
const VELOCIDADES: Velocidad[] = ['lenta', 'normal', 'rapida', 'instante'];
const ETIQUETA_VELOCIDAD: Record<Velocidad, string> = {
  lenta: 'Lenta',
  normal: 'Normal',
  rapida: 'Rápida',
  instante: 'Al instante',
};
const MS_POR_EVENTO: Record<Velocidad, number> = { lenta: 600, normal: 250, rapida: 80, instante: 0 };
const FALLOS_PARA_MAPA = 5;

type Guardado = {
  code: string | null;
  passed: boolean;
  stars: number;
  bestSteps: number | null;
  attempts: number;
  updatedAt: string | null;
};

export type OrillaPlayProps = {
  tramo: { id: string; orden: number; nombre: string; concepto: string; lessonId: string };
  ui: { ayuda: string[]; andamiaje: string; consecuencia: string };
  payload: PayloadTramo;
  guardado: Guardado;
  siguienteHref: string | null;
  mapaHref: string;
  userId: string;
};

type Repeticion = { eventos: EventoOrilla[]; k: number; estado: EstadoRio };

function estrellasTexto(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

export default function OrillaPlay({ tramo, ui, payload, guardado, siguienteHref, mapaHref, userId }: OrillaPlayProps) {
  const esAbierta = tramo.id === 'abierta';
  const inicial = guardado.code && guardado.code.trim() !== '' ? guardado.code : ui.andamiaje;
  const claveLocal = `orilla:${userId}:${tramo.id}`;
  const leccionHref = hrefLeccion(tramo.lessonId);

  const { resolvedTheme } = useTheme();
  const { estado: estadoWorker, ejecutar, reiniciar, sandboxFrameRef, handleSandboxFrameLoad, handleSandboxFrameError } = useOrillaWorker();

  const [code, setCode] = useState(inicial);
  const [persistido, setPersistido] = useState(inicial);
  const [confirmaAndamiaje, setConfirmaAndamiaje] = useState(false);
  const [confirmaNotas, setConfirmaNotas] = useState(false);
  const [ejecutando, setEjecutando] = useState(false);
  const [gate, setGate] = useState<{ mensaje: string; linea: number; leccion: string | null } | null>(null);
  const [errorMotor, setErrorMotor] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoOrilla | null>(null);
  const [varIdx, setVarIdx] = useState(0);
  const [rep, setRep] = useState<Repeticion | null>(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [velocidad, setVelocidad] = useState<Velocidad>('normal');
  const [mejor, setMejor] = useState({ stars: guardado.stars, pasos: guardado.bestSteps, superado: guardado.passed });
  const [fallos, setFallos] = useState(guardado.passed ? 0 : guardado.attempts);
  const [mapaVisible, setMapaVisible] = useState(!payload.ocultarMapa);
  const [guardadoEstado, setGuardadoEstado] = useState<'' | 'guardando' | 'guardado' | 'error'>('');
  const [aviso, setAviso] = useState<string | null>(null);
  const [notas, setNotas] = useState<string[]>(payload.notas ?? []);

  const temporizador = useRef<number | null>(null);
  const completado = useRef<IDisposable | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  useEffect(() => () => {
    if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    completado.current?.dispose();
    completado.current = null;
  }, []);

  const ocultar = Boolean(payload.ocultarMapa) && !mapaVisible;
  const variante = payload.variantes[Math.min(varIdx, payload.variantes.length - 1)];
  const estadoMostrado = rep?.estado ?? estadoInicial(variante.mapa, variante.rumbo);
  const descripcion = describirRio(estadoMostrado, ocultar);
  const varianteResultado = resultado?.gate.ok ? resultado.variants[varIdx] : undefined;

  useEffect(() => {
    if (!reproduciendo || !rep) return;
    if (rep.k >= rep.eventos.length) {
      const fin = window.setTimeout(() => setReproduciendo(false), 0);
      return () => window.clearTimeout(fin);
    }
    const tick = window.setTimeout(() => {
      setRep((actual) => actual && actual.k < actual.eventos.length
        ? { ...actual, k: actual.k + 1, estado: aplicarEvento(actual.estado, actual.eventos[actual.k]) }
        : actual);
    }, MS_POR_EVENTO[velocidad] || 1);
    return () => window.clearTimeout(tick);
  }, [reproduciendo, rep, velocidad]);

  const aplicarTemaEditor = useCallback((monaco: Monaco) => {
    const estilos = getComputedStyle(document.documentElement);
    const leer = (nombre: string, respaldo: string) => estilos.getPropertyValue(nombre).trim() || respaldo;
    const oscuro = resolvedTheme === 'dark';
    monaco.editor.defineTheme('python-desde-cero', {
      base: oscuro ? 'vs-dark' : 'vs', inherit: true,
      rules: [
        { token: 'comment', foreground: '72816F', fontStyle: 'italic' },
        { token: 'keyword', foreground: oscuro ? '8AB4F8' : '294936', fontStyle: 'bold' },
        { token: 'string', foreground: oscuro ? 'A5D6A7' : '8A4B27' },
        { token: 'number', foreground: oscuro ? 'D7A8F7' : '8054A1' },
      ],
      colors: {
        'editor.background': leer('--theme-code-bg', '#ebe9df'),
        'editor.foreground': leer('--theme-ink', '#252b25'),
        'editorLineNumber.foreground': leer('--theme-muted', '#596259'),
        'editorCursor.foreground': leer('--theme-accent', '#294936'),
        'editor.selectionBackground': leer('--theme-accent-light', '#dce5d8'),
        'editor.lineHighlightBackground': leer('--theme-bg-secondary', '#ebe9df'),
        'editorGutter.background': leer('--theme-code-bg', '#ebe9df'),
        'editorSuggestWidget.background': leer('--theme-surface', '#ffffff'),
        'editorSuggestWidget.foreground': leer('--theme-ink', '#252b25'),
      },
    });
    monaco.editor.setTheme('python-desde-cero');
  }, [resolvedTheme]);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    const cuadro = window.requestAnimationFrame(() => aplicarTemaEditor(monaco));
    return () => window.cancelAnimationFrame(cuadro);
  }, [aplicarTemaEditor]);

  const alMontar = (instancia: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monacoRef.current = monaco;
    aplicarTemaEditor(monaco);
    completado.current?.dispose();
    const nombres = [...payload.abiertos.verbos, ...payload.abiertos.builtins];
    completado.current = monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (modelo: editor.ITextModel, posicion: { lineNumber: number; column: number }) => {
        const palabra = modelo.getWordUntilPosition(posicion);
        const rango = { startLineNumber: posicion.lineNumber, endLineNumber: posicion.lineNumber, startColumn: palabra.startColumn, endColumn: palabra.endColumn };
        return { suggestions: nombres.map((nombre) => ({
          label: nombre, kind: monaco.languages.CompletionItemKind.Function,
          insertText: VERBOS_SIN_ARGUMENTOS.has(nombre) ? `${nombre}()` : `${nombre}($0)`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: DOC_VERBOS[nombre], range: rango,
        })) };
      },
    });
    try {
      const crudo = window.localStorage.getItem(claveLocal);
      if (crudo) {
        const borrador = JSON.parse(crudo) as { code?: unknown; at?: unknown };
        const guardadoEn = guardado.updatedAt ? Date.parse(guardado.updatedAt) : 0;
        if (typeof borrador.code === 'string' && typeof borrador.at === 'number' && borrador.at > guardadoEn && borrador.code !== inicial) {
          setCode(borrador.code);
          setAviso('Recuperé un borrador de este navegador que todavía no estaba guardado.');
        }
      }
    } catch { /* sin almacenamiento local: se sigue con lo guardado */ }
    instancia.focus();
  };

  const persistir = useCallback(
    async (texto: string) => {
      setGuardadoEstado('guardando');
      const r = await guardarOrilla({ chapterId: tramo.id, code: texto, passed: false, stars: 0, steps: null, notas: null, esIntento: false });
      if (r.ok) { setGuardadoEstado('guardado'); setPersistido(texto); }
      else setGuardadoEstado('error');
    },
    [tramo.id],
  );

  const alCambiar = (valor: string | undefined) => {
    const nuevo = valor ?? '';
    setCode(nuevo);
    setConfirmaAndamiaje(false);
    try { window.localStorage.setItem(claveLocal, JSON.stringify({ code: nuevo, at: Date.now() })); } catch { /* ignorado */ }
    if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => { void persistir(nuevo); }, 800);
  };

  const mostrarVariante = (indice: number, res: ResultadoOrilla, instante: boolean) => {
    const v = res.variants[indice];
    setVarIdx(indice);
    if (!v) return;
    setRep(instante
      ? { eventos: v.events, k: v.events.length, estado: estadoFinal(v) }
      : { eventos: v.events, k: 0, estado: estadoInicial(payload.variantes[indice].mapa, payload.variantes[indice].rumbo) });
    setReproduciendo(!instante);
  };

  const alEjecutar = async () => {
    if (ejecutando) return;
    setEjecutando(true); setReproduciendo(false); setGate(null); setErrorMotor(null); setResultado(null); setConfirmaNotas(false);
    try {
      const res = await ejecutar(code, { ...payload, notas });
      if (!res.gate.ok) { setGate({ mensaje: res.gate.mensaje, linea: res.gate.linea, leccion: res.gate.leccion }); return; }
      setResultado(res);
      const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mostrarVariante(res.show ?? 0, res, velocidad === 'instante' || reducido);
      if (esAbierta) setNotas(res.notas ?? []);
      if (!res.passed) setFallos((n) => n + 1);
      const r = await guardarOrilla({ chapterId: tramo.id, code, passed: res.passed, stars: res.stars, steps: res.passed ? (res.steps ?? null) : null, notas: esAbierta ? (res.notas ?? []) : null, esIntento: true });
      if (r.ok) { setGuardadoEstado('guardado'); setPersistido(code); setMejor({ stars: r.stars, pasos: r.bestSteps, superado: r.passed }); }
      else setGuardadoEstado('error');
    } catch (error) { setErrorMotor(error instanceof Error ? error.message : 'No se pudo ejecutar el programa.'); }
    finally { setEjecutando(false); }
  };

  const alReiniciarRio = () => { setReproduciendo(false); setRep(null); setVarIdx(0); setResultado(null); setGate(null); };
  const alVolverAlAndamiaje = () => {
    if (code !== persistido && !confirmaAndamiaje) { setConfirmaAndamiaje(true); return; }
    alCambiar(ui.andamiaje); setConfirmaAndamiaje(false);
  };
  const alVaciarNotas = async () => {
    if (!confirmaNotas) { setConfirmaNotas(true); return; }
    const r = await vaciarNotasOrilla(); setConfirmaNotas(false);
    if (r.ok) setNotas([]); else setErrorMotor(r.error);
  };
  const alTeclearRio = (tecla: string) => {
    const i = VELOCIDADES.indexOf(velocidad);
    if (tecla === 'ArrowRight' || tecla === 'ArrowUp') setVelocidad(VELOCIDADES[Math.min(i + 1, 3)]);
    if (tecla === 'ArrowLeft' || tecla === 'ArrowDown') setVelocidad(VELOCIDADES[Math.max(i - 1, 0)]);
  };
  const par = payload.pasosPar;
  const pistaEstrellas = mejor.stars >= 3 || esAbierta ? null : mejor.stars === 2
    ? `La tercera estrella pide usar bien el concepto del tramo: ${tramo.concepto.toLowerCase()}.`
    : par !== undefined ? `La segunda estrella pide ${par} pasos o menos en cada tramo del río.` : null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <iframe
        ref={sandboxFrameRef}
        onLoad={handleSandboxFrameLoad}
        onError={handleSandboxFrameError}
        title="Entorno aislado de Orilla"
        aria-hidden="true"
        tabIndex={-1}
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        loading="eager"
        className="pointer-events-none absolute -left-[10000px] top-0 h-px w-px overflow-hidden border-0 opacity-0"
      />
      <header className="space-y-2">
        <p className="text-[0.68rem] font-bold tracking-[0.14em] text-[var(--theme-accent)]">{tramo.orden > 0 ? `ORILLA · TRAMO ${tramo.orden} DE 12` : 'ORILLA · MÁS ALLÁ DE LA CUENCA'}</p>
        <h1 className="font-serif text-3xl text-[var(--theme-ink)]">{tramo.nombre}</h1>
        <p className="text-[var(--theme-muted)]">{tramo.concepto}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--theme-muted)]">
          <Link href={mapaHref} className="min-h-11 py-2 font-semibold text-[var(--theme-accent)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">Mapa del río</Link>
          {leccionHref && <Link href={leccionHref} className="min-h-11 py-2 font-semibold text-[var(--theme-accent)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">Ver la lección de este tramo</Link>}
          {!esAbierta && <span aria-label={`Mejor resultado: ${mejor.stars} de 3 estrellas`}>{estrellasTexto(mejor.stars)}</span>}
          {mejor.pasos !== null && <span>Mejor marca: {mejor.pasos} pasos</span>}
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--theme-ink)]">{ui.ayuda.map((linea) => <li key={linea}>{linea}</li>)}</ul>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="orilla-editor" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="orilla-editor" className="font-serif text-xl text-[var(--theme-ink)]">Tu programa</h2>
            <span role="status" className="text-xs text-[var(--theme-muted)]">{guardadoEstado === 'guardando' && 'Guardando…'}{guardadoEstado === 'guardado' && 'Guardado en tu cuenta'}{guardadoEstado === 'error' && 'No se pudo guardar. Tu borrador sigue en este navegador.'}</span>
          </div>
          {aviso && <p role="status" className="border-l-2 border-[var(--theme-accent)] bg-[var(--theme-bg-secondary)] p-3 text-sm text-[var(--theme-ink)]">{aviso}</p>}
          <div className="h-[min(52svh,440px)] min-h-[280px] w-full overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-code-bg)]">
            <Editor height="100%" defaultLanguage="python" theme="python-desde-cero" value={code} onChange={alCambiar} onMount={alMontar} options={{ minimap: { enabled: false }, fontSize: 16, lineHeight: 24, automaticLayout: true, tabSize: 4, scrollBeyondLastLine: false, wordWrap: 'on' }} />
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={alEjecutar} disabled={ejecutando} data-testid="orilla-ejecutar" className="flex min-h-12 w-full items-center justify-center bg-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{ejecutando ? estadoWorker === 'cargando' ? 'Preparando Python…' : 'Ejecutando…' : 'Ejecutar'}</button>
            <button type="button" onClick={alReiniciarRio} className="flex min-h-12 w-full items-center justify-center border border-[var(--theme-border-dark)] px-5 py-3 text-base font-semibold text-[var(--theme-ink)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:w-auto">Reiniciar el río</button>
            <button type="button" onClick={alVolverAlAndamiaje} className="flex min-h-12 w-full items-center justify-center border border-[var(--theme-border-dark)] px-5 py-3 text-base font-semibold text-[var(--theme-ink)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:w-auto">{confirmaAndamiaje ? 'Confirmar: se pierde tu código' : 'Volver al andamiaje'}</button>
            {estadoWorker === 'error' && <button type="button" onClick={reiniciar} className="flex min-h-12 w-full items-center justify-center border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] sm:w-auto">Reintentar carga de Python</button>}
          </div>
          <details className="border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[var(--theme-accent)]">Lo que Nilo entiende en este tramo</summary><dl className="mt-2 space-y-1 text-sm">{[...payload.abiertos.verbos, ...payload.abiertos.builtins].map((nombre) => <div key={nombre} className="flex flex-wrap gap-x-2"><dt className="font-mono font-bold text-[var(--theme-ink)]">{nombre}</dt><dd className="text-[var(--theme-muted)]">{DOC_VERBOS[nombre]}</dd></div>)}</dl></details>
        </section>
        <section aria-labelledby="orilla-rio" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="orilla-rio" className="font-serif text-xl text-[var(--theme-ink)]">El río</h2>{payload.variantes.length > 1 && <span className="text-sm text-[var(--theme-muted)]">Tramo {varIdx + 1} de {payload.variantes.length}</span>}</div>
          <div tabIndex={0} role="group" aria-label="Vista del río. Las flechas cambian la velocidad de la reproducción." onKeyDown={(e) => alTeclearRio(e.key)} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"><RiverView estado={estadoMostrado} ocultarMapa={ocultar} descripcion={descripcion} /></div>
          <p role="status" aria-live="polite" className="text-sm text-[var(--theme-muted)]">{descripcion}</p>
          <div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-sm font-semibold text-[var(--theme-ink)]">Velocidad<select value={velocidad} onChange={(e) => setVelocidad(e.target.value as Velocidad)} className="min-h-11 border border-[var(--theme-border)] bg-[var(--theme-surface)] px-2 text-sm text-[var(--theme-ink)]">{VELOCIDADES.map((v) => <option key={v} value={v}>{ETIQUETA_VELOCIDAD[v]}</option>)}</select></label>
            {payload.ocultarMapa && !mapaVisible && <button type="button" disabled={fallos < FALLOS_PARA_MAPA} onClick={() => setMapaVisible(true)} className="min-h-11 border border-[var(--theme-border-dark)] px-3 text-sm font-semibold text-[var(--theme-ink)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50">{fallos >= FALLOS_PARA_MAPA ? 'Mostrar mapa' : `Mostrar mapa (tras ${FALLOS_PARA_MAPA} intentos fallidos: ${Math.min(fallos, FALLOS_PARA_MAPA)})`}</button>}
          </div>
          {resultado?.gate.ok && resultado.variants.length > 1 && <div className="flex flex-wrap gap-2" role="group" aria-label="Ver cada tramo del río">{resultado.variants.map((v, i) => <button key={v.indice} type="button" aria-pressed={i === varIdx} onClick={() => mostrarVariante(i, resultado, true)} className="min-h-11 border border-[var(--theme-border-dark)] px-3 text-sm font-semibold text-[var(--theme-ink)] hover:bg-[var(--theme-bg-secondary)] aria-pressed:bg-[var(--theme-accent)] aria-pressed:text-[var(--theme-ink-inverse)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">Tramo {i + 1}{v.passed ? ' ✓' : ' ✗'}</button>)}</div>}
          <div className="border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3"><h3 className="text-sm font-semibold text-[var(--theme-ink)]">Bitácora</h3><ol className="mt-1 min-h-8 space-y-0.5 font-mono text-sm text-[var(--theme-ink)]">{estadoMostrado.bitacora.length === 0 ? <li className="text-[var(--theme-muted)]">Todavía no hay líneas.</li> : estadoMostrado.bitacora.map((linea, i) => <li key={`${i}-${linea}`}>{linea}</li>)}</ol></div>
          {esAbierta && <div className="space-y-2 border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3"><h3 className="text-sm font-semibold text-[var(--theme-ink)]">Bitácora de la cuenca</h3><ol className="font-mono text-sm text-[var(--theme-ink)]">{notas.length === 0 ? <li className="text-[var(--theme-muted)]">Sin notas guardadas.</li> : notas.map((n, i) => <li key={`${i}-${n}`}>{n}</li>)}</ol><button type="button" onClick={alVaciarNotas} className="min-h-11 border border-[var(--theme-border-dark)] px-3 text-sm font-semibold text-[var(--theme-ink)] hover:bg-[var(--theme-bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">{confirmaNotas ? 'Confirmar: borrar las notas' : 'Vaciar notas'}</button></div>}
        </section>
      </div>
      <section aria-labelledby="orilla-resultado" className="space-y-3 border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 sm:p-5">
        <h2 id="orilla-resultado" className="font-serif text-xl text-[var(--theme-ink)]">Resultado</h2>
        {gate && <div role="alert" className="space-y-2 text-sm text-[var(--theme-ink)]"><p><strong>Línea {gate.linea}.</strong> {gate.mensaje}</p>{gate.leccion && hrefLeccion(gate.leccion) && <p><Link href={hrefLeccion(gate.leccion) as string} className="font-semibold text-[var(--theme-accent)] underline underline-offset-2">Ver la lección</Link></p>}</div>}
        {errorMotor && <p role="alert" className="text-sm text-[var(--theme-ink)]">{errorMotor}</p>}
        {!gate && !errorMotor && !resultado && <p className="text-sm text-[var(--theme-muted)]">Pulsa «Ejecutar» para ver cómo Nilo recorre el río con tu programa.</p>}
        {resultado?.gate.ok && !reproduciendo && varianteResultado && <div role="status" aria-live="polite" className="space-y-2 text-sm text-[var(--theme-ink)]">{resultado.passed ? <><p className="font-semibold">{esAbierta ? 'Objetivo cumplido.' : `Tramo superado: ${estrellasTexto(resultado.stars)} (${resultado.stars} de 3).`}{' '}{resultado.steps} pasos.</p><p>{ui.consecuencia}</p>{pistaEstrellas && <p className="text-[var(--theme-muted)]">{pistaEstrellas}</p>}{siguienteHref && <p><Link href={siguienteHref} className="inline-flex min-h-11 items-center bg-[var(--theme-accent)] px-4 font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">Seguir río abajo</Link></p>}</> : <><p className="font-semibold">{varianteResultado.error ? `Nilo se detuvo${varianteResultado.error.linea ? ` en la línea ${varianteResultado.error.linea}` : ''}.` : 'El programa terminó, pero el río no quedó como pedía el tramo.'}</p><p>{varianteResultado.fail}</p>{varianteResultado.error?.traceback && <details><summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--theme-accent)]">Ver el detalle técnico</summary><pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words bg-[var(--theme-bg-secondary)] p-3 font-mono text-xs">{varianteResultado.error.traceback}</pre></details>}</>}{varianteResultado.truncated && <p className="text-[var(--theme-muted)]">La reproducción se acortó porque el programa hizo muchísimos pasos; el resultado final sí es completo.</p>}</div>}
      </section>
    </div>
  );
}
