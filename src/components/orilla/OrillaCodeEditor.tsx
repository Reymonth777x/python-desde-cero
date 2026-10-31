'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import type { Monaco } from '@monaco-editor/react';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-[340px] items-center justify-center text-sm text-[var(--theme-muted)]">Preparando el editor Python…</div>,
});
import type { editor } from 'monaco-editor';
import { DOC_VERBOS, VERBOS_SIN_ARGUMENTOS } from '@/lib/orilla/ayuda-verbos';

type Props = {
  value: string;
  onChange: (value: string) => void;
  verbos: string[];
  builtins: string[];
  constructos: string[];
  onMount: (instance: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
};

type Plantilla = { nombre: string; codigo: string; cursor: number };

const BLOQUES: Record<string, Plantilla> = {
  if: { nombre: 'if', codigo: 'if condicion:\n    ', cursor: 3 },
  while: { nombre: 'while', codigo: 'while condicion:\n    ', cursor: 6 },
  for: { nombre: 'for', codigo: 'for elemento in range(3):\n    ', cursor: 4 },
  def: { nombre: 'def', codigo: 'def mi_funcion():\n    ', cursor: 4 },
  try: { nombre: 'try', codigo: 'try:\n    \nexcept OrillaError:\n    ', cursor: 9 },
};

function usePantallaPequena() {
  const [pequena, setPequena] = useState<boolean | null>(null);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-width: 900px)');
    const actualizar = () => setPequena(media.matches);
    actualizar();
    media.addEventListener('change', actualizar);
    return () => media.removeEventListener('change', actualizar);
  }, []);
  return pequena;
}

export default function OrillaCodeEditor({ value, onChange, verbos, builtins, constructos, onMount }: Props) {
  const movil = usePantallaPequena();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const lineas = useMemo(() => value.split('\n').length, [value]);
  const comandos = useMemo(
    () => [...verbos, ...builtins].filter((nombre, indice, lista) => lista.indexOf(nombre) === indice),
    [verbos, builtins],
  );
  const estructuras = useMemo(
    () => constructos.filter((nombre) => BLOQUES[nombre]),
    [constructos],
  );

  const insertar = (fragmento: string, posicionCursor: number) => {
    const campo = textarea.current;
    const inicio = campo?.selectionStart ?? value.length;
    const fin = campo?.selectionEnd ?? inicio;
    const antes = value.slice(0, inicio);
    const despues = value.slice(fin);
    const salto = antes.length > 0 && !antes.endsWith('\n') ? '\n' : '';
    const codigoNuevo = antes + salto + fragmento + despues;
    const posicionNueva = inicio + salto.length + posicionCursor;
    onChange(codigoNuevo);
    window.requestAnimationFrame(() => {
      const actual = textarea.current;
      if (!actual) return;
      actual.focus();
      actual.setSelectionRange(posicionNueva, posicionNueva);
    });
  };

  const insertarComando = (nombre: string) => {
    const codigo = nombre + '()';
    const requiereDato = !VERBOS_SIN_ARGUMENTOS.has(nombre);
    insertar(codigo, requiereDato ? nombre.length + 1 : codigo.length);
  };

  const insertarBloque = (nombre: string) => {
    const bloque = BLOQUES[nombre];
    if (bloque) insertar(bloque.codigo, bloque.cursor);
  };

  const manejarTeclas = (evento: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (evento.key !== 'Tab' && evento.key !== 'Enter') return;
    evento.preventDefault();
    const campo = evento.currentTarget;
    const inicio = campo.selectionStart;
    const fin = campo.selectionEnd;
    let fragmento = '    ';
    let posicion = inicio + fragmento.length;
    if (evento.key === 'Enter') {
      const lineaActual = value.slice(0, inicio).split('\n').pop() ?? '';
      const sangria = lineaActual.match(/^\s*/)?.[0] ?? '';
      fragmento = '\n' + sangria + (lineaActual.trimEnd().endsWith(':') ? '    ' : '');
      posicion = inicio + fragmento.length;
    }
    const nuevo = value.slice(0, inicio) + fragmento + value.slice(fin);
    onChange(nuevo);
    window.requestAnimationFrame(() => {
      campo.focus();
      campo.setSelectionRange(posicion, posicion);
    });
  };

  if (movil === null) {
    return <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] text-sm text-[var(--theme-muted)]" aria-busy="true">Preparando tu espacio de código…</div>;
  }

  if (movil) {
    const visibles = mostrarTodas ? comandos : comandos.slice(0, 6);
    return (
      <div className="space-y-3" data-testid="orilla-editor-mobile">
        <div className="overflow-hidden rounded-2xl border border-[#254c60] bg-[#071b2a] shadow-[0_12px_32px_-18px_rgba(3,24,38,.9)]">
          <div className="flex min-h-12 items-center justify-between gap-2 border-b border-white/10 bg-[#0c2b3d] px-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f08c70]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#e8c46a]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#77c99d]" />
              <span className="ml-1 text-[0.68rem] font-bold tracking-[0.14em] text-[#d8eee8]">PYTHON · NILO</span>
            </div>
            <span className="rounded-full border border-[#5c8e99]/50 px-2 py-1 text-[0.62rem] font-semibold text-[#a8d2c9]">Editor sencillo</span>
          </div>
          <div className="flex items-stretch">
            <div aria-hidden="true" className="min-w-9 select-none border-r border-white/10 bg-[#0b2535] px-2 pt-4 text-right font-mono text-xs leading-7 text-[#6b96a5]">
              {Array.from({ length: Math.max(8, Math.min(16, lineas + 2)) }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              ref={textarea}
              aria-label="Escribe tu programa Python para controlar a Nilo"
              data-testid="orilla-codigo-mobile"
              value={value}
              onChange={(evento) => onChange(evento.target.value)}
              onKeyDown={manejarTeclas}
              wrap="off"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              rows={Math.max(8, Math.min(16, lineas + 2))}
              className="min-h-[260px] w-full resize-y overflow-x-auto whitespace-pre bg-[#071b2a] px-3 py-3 font-mono text-base leading-7 text-[#e3f6ef] caret-[#f4d27c] outline-none placeholder:text-[#7899a6] focus:ring-2 focus:ring-inset focus:ring-[#6bc9b2]"
              placeholder="# Escribe aquí las instrucciones de Nilo"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0c2b3d] px-3 py-2 text-[0.68rem] text-[#9fc4c8]">
            <span>Python real · pulsa una orden para insertarla</span>
            <span>{lineas} {lineas === 1 ? 'línea' : 'líneas'}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)]">Añade una orden</p>
              <p className="mt-0.5 text-xs text-[var(--theme-muted)]">Toca una palabra y aparecerá en tu código.</p>
            </div>
            <button type="button" onClick={() => setMostrarTodas((actual) => !actual)} className="min-h-10 rounded-lg px-2 text-xs font-semibold text-[var(--theme-accent)] underline underline-offset-2">
              {mostrarTodas ? 'Ver menos' : 'Ver todas'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {visibles.map((nombre) => (
              <button key={nombre} type="button" title={DOC_VERBOS[nombre]} onClick={() => insertarComando(nombre)}
                className="min-h-10 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] px-3 font-mono text-xs font-semibold text-[var(--theme-ink)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
                {nombre}()
              </button>
            ))}
          </div>
          {estructuras.length > 0 && (
            <div className="border-t border-[var(--theme-border)] pt-2">
              <p className="mb-2 text-xs font-semibold text-[var(--theme-muted)]">Bloques de Python</p>
              <div className="flex flex-wrap gap-2">
                {estructuras.map((nombre) => (
                  <button key={nombre} type="button" onClick={() => insertarBloque(nombre)}
                    className="min-h-10 rounded-xl border border-[var(--theme-accent)]/50 px-3 font-mono text-xs font-semibold text-[var(--theme-accent)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
                    {nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs leading-5 text-[var(--theme-muted)]">También puedes escribir normalmente. La tecla Tab añade cuatro espacios y Enter conserva la sangría de Python.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-code-bg)] shadow-inner" data-testid="orilla-editor-desktop">
      <div className="flex min-h-11 items-center justify-between gap-2 border-b border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] px-3">
        <span className="font-mono text-xs font-bold tracking-[0.12em] text-[var(--theme-ink)]">PYTHON / ORILLA.PY</span>
        <span className="text-xs text-[var(--theme-muted)]">{lineas} {lineas === 1 ? 'línea' : 'líneas'}</span>
      </div>
      <div className="h-[min(62svh,560px)] min-h-[340px] w-full">
        <Editor height="100%" defaultLanguage="python" theme="python-desde-cero" value={value} onChange={(nuevo) => onChange(nuevo ?? '')} onMount={onMount}
          options={{ minimap: { enabled: false }, fontSize: 16, lineHeight: 25, automaticLayout: true, tabSize: 4, scrollBeyondLastLine: false, wordWrap: 'on', padding: { top: 16, bottom: 18 }, lineNumbersMinChars: 3, roundedSelection: true, renderLineHighlight: 'gutter', quickSuggestions: true }} />
      </div>
    </div>
  );
}
