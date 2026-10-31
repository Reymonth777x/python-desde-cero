'use client';

import type { ChapterId } from '@/lib/orilla/types';
import { DOC_VERBOS } from '@/lib/orilla/ayuda-verbos';
import { GUIA_ORILLA, SIMBOLOS_ORILLA } from '@/lib/orilla/guide';
import { MICROLECCIONES_ORILLA } from '@/lib/orilla/lesson-content';

type Props = {
  chapterId: ChapterId;
  ayuda: string[];
  verbos: string[];
  builtins: string[];
  onUseExample?: (code: string) => void;
};

const PASOS_BASE = [
  { numero: '1', titulo: 'Lee la misión', detalle: 'Descubre qué necesita el río.' },
  { numero: '2', titulo: 'Escribe Python', detalle: 'Dale instrucciones a Nilo.' },
  { numero: '3', titulo: 'Ejecuta', detalle: 'Mira cómo responde el río.' },
  { numero: '4', titulo: 'Mejora', detalle: 'Aprende del resultado y vuelve a probar.' },
];

export default function OrillaGuide({ chapterId, ayuda, verbos, builtins, onUseExample }: Props) {
  const guia = GUIA_ORILLA[chapterId];
  const leccion = MICROLECCIONES_ORILLA[chapterId];
  const nombres = [...new Set(guia.comandos)].filter((nombre) => verbos.includes(nombre) || builtins.includes(nombre));
  const resumen = nombres.map((nombre) => ({ nombre, descripcion: DOC_VERBOS[nombre] })).filter((item) => item.descripcion);

  return (
    <section aria-labelledby="orilla-guia-titulo" className="space-y-4 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 shadow-sm sm:space-y-5 sm:p-5">
      <header className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3044] via-[#105166] to-[#187c79] p-4 text-white shadow-[0_14px_36px_-22px_rgba(4,36,49,.9)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#a7e7d6]">DIARIO DE AVENTURA · NIVEL {chapterId === 'abierta' ? '∞' : chapterId.startsWith('reto') ? 'EXTRA' : chapterId.slice(1)}</p>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold text-[#e5fff4]">Python real · aprende jugando</span>
        </div>
        <h2 id="orilla-guia-titulo" className="mt-2 font-serif text-2xl font-semibold leading-tight sm:text-3xl">Tu misión en el río</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#e0f4ef]">{leccion.historia}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PASOS_BASE.map((paso) => (
            <div key={paso.numero} className="flex items-start gap-2 rounded-xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0cf83] text-xs font-black text-[#17394a]">{paso.numero}</span>
              <span className="min-w-0"><span className="block text-xs font-bold text-white">{paso.titulo}</span><span className="mt-0.5 block text-[0.68rem] leading-4 text-[#c9e9e2]">{paso.detalle}</span></span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-[#c9e9e2]">No manejas la lancha con el dedo: programas las órdenes de Nilo. El motor ejecuta tu código Python en un entorno aislado.</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,.92fr)]">
        <section className="space-y-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--theme-accent-light)] text-lg" aria-hidden="true">🧭</span>
            <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--theme-accent)]">Objetivo del nivel</p><h3 className="font-serif text-lg font-semibold text-[var(--theme-ink)]">Tu misión</h3></div>
          </div>
          <p className="text-sm font-medium leading-6 text-[var(--theme-ink)]">{guia.mision}</p>
          <ol className="space-y-3">
            {guia.pasos.map((paso, i) => (
              <li key={paso.titulo} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--theme-border-dark)] bg-[var(--theme-surface)] text-xs font-bold text-[var(--theme-ink)]">{i + 1}</span>
                <div><p className="text-sm font-semibold text-[var(--theme-ink)]">{paso.titulo}</p><p className="text-sm leading-5 text-[var(--theme-muted)]">{paso.detalle}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-3 rounded-2xl border border-[var(--theme-border)] bg-gradient-to-br from-[var(--theme-accent-light)] to-[var(--theme-surface)] p-3 text-[var(--theme-ink)] sm:p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--theme-surface)] text-lg" aria-hidden="true">💡</span>
            <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--theme-accent)]">Aprende en este nivel</p><h3 className="font-serif text-lg font-semibold">Una idea de Python</h3></div>
          </div>
          <p className="text-sm leading-6">{leccion.explicacion}</p>
          <div className="overflow-hidden rounded-xl border border-white/20 bg-[#071b2a]">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2"><span className="text-[0.63rem] font-bold tracking-[0.15em] text-[#84cbb8]">EJEMPLO PEQUEÑO</span><span className="text-[0.62rem] text-[#83a9b2]">PYTHON</span></div>
            <pre className="overflow-x-auto p-3 font-mono text-[0.78rem] leading-6 text-[#d8f7e9]"><code>{leccion.ejemplo}</code></pre>
          </div>
          <details className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-3">
            <summary className="min-h-10 cursor-pointer py-2 text-sm font-semibold">🧠 Comprueba lo que aprendiste</summary>
            <p className="mt-2 text-sm font-semibold">{leccion.pregunta}</p>
            <details className="mt-2 rounded-lg bg-[var(--theme-surface)] p-2">
              <summary className="min-h-9 cursor-pointer py-2 text-xs font-bold">Mostrar explicación</summary>
              <p className="pb-1 text-sm leading-5">{leccion.respuesta}</p>
            </details>
          </details>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--theme-border)] p-3 sm:p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--theme-accent)]">Una pista para avanzar</p>
          <p className="mt-1 text-sm leading-6 text-[var(--theme-ink)]">{guia.pista}</p>
        </div>
        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-warning-light)] p-3 text-[var(--theme-ink)] sm:p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--theme-warning)]">✨ Desafío de curiosidad</p>
          <p className="mt-1 text-sm leading-6">{leccion.reto}</p>
          <p className="mt-1 text-xs opacity-75">Es opcional: sirve para practicar un poco más, sin bloquear tu avance.</p>
        </div>
      </div>

      {guia.ejemplo && onUseExample && (
        <div className="space-y-2 rounded-2xl border border-[var(--theme-accent)]/40 bg-[var(--theme-bg-secondary)] p-3 sm:p-4">
          <p className="text-sm font-semibold text-[var(--theme-ink)]">🚣 Ejemplo para tu primer viaje</p>
          <pre className="overflow-x-auto rounded-xl bg-[#071b2a] p-3 font-mono text-sm leading-6 text-[#b6f0df]">{guia.ejemplo}</pre>
          <button type="button" onClick={() => onUseExample(guia.ejemplo!)} className="min-h-11 w-full rounded-xl bg-[var(--theme-accent)] px-3 py-2 text-sm font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
            Usar este ejemplo en el editor
          </button>
          <p className="text-xs leading-5 text-[var(--theme-muted)]">Al pulsar, reemplazarás el contenido actual del editor por este ejemplo. Puedes editarlo después.</p>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[var(--theme-accent)]">🗺️ ¿Qué significan los símbolos del río?</summary>
          <dl className="mt-2 grid gap-2">
            {SIMBOLOS_ORILLA.map((item) => (
              <div key={item.simbolo} className="flex items-start gap-3 rounded-lg bg-[var(--theme-bg-secondary)] p-2">
                <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--theme-border-dark)] bg-[var(--theme-surface)] font-mono text-sm font-bold text-[var(--theme-ink)]">{item.simbolo}</dt>
                <dd className="text-sm leading-5 text-[var(--theme-ink)]"><strong>{item.nombre}.</strong> <span className="text-[var(--theme-muted)]">{item.detalle}</span></dd>
              </div>
            ))}
          </dl>
        </details>
        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[var(--theme-accent)]">⭐ ¿Cómo gano estrellas?</summary>
          <div className="mt-2 space-y-2 text-sm leading-6 text-[var(--theme-ink)]">
            <p><strong>Primero, completa la misión.</strong> Cuando el resultado diga «Tramo superado», se guarda tu avance y se abre el siguiente tramo.</p>
            <p><strong>1 estrella:</strong> cumples los objetivos en todos los mapas de prueba.</p>
            <p><strong>2 estrellas:</strong> cuando el tramo tiene ese objetivo, también completas la misión dentro de los pasos recomendados.</p>
            <p><strong>3 estrellas:</strong> en los niveles que lo piden, demuestras el concepto de Python que estás practicando. Algunos tramos tienen reglas de puntuación propias.</p>
            <p className="text-[var(--theme-muted)]">Las estrellas adicionales son un reto opcional; con superar la misión puedes seguir río abajo.</p>
          </div>
        </details>
        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[var(--theme-accent)]">📚 Órdenes disponibles en este nivel</summary>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            {resumen.map(({ nombre, descripcion }) => (
              <div key={nombre} className="rounded-lg bg-[var(--theme-bg-secondary)] p-2">
                <dt className="font-mono text-sm font-bold text-[var(--theme-ink)]">{nombre}()</dt>
                <dd className="mt-1 text-sm leading-5 text-[var(--theme-muted)]">{descripcion}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-[var(--theme-muted)]">No tienes que memorizar todo. Puedes tocar las órdenes en el editor móvil para insertarlas.</p>
        </details>
        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[var(--theme-accent)]">🛟 Me equivoqué, ¿qué hago?</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--theme-ink)]">
            {ayuda.map((linea) => <li key={linea}>{linea}</li>)}
          </ul>
          <p className="mt-2 text-sm leading-6 text-[var(--theme-muted)]">Lee el resultado, corrige una cosa a la vez y ejecuta de nuevo. Tu borrador se guarda automáticamente.</p>
        </details>
      </div>
      <p className="text-xs leading-5 text-[var(--theme-muted)]">Las líneas que empiezan con # son comentarios: sirven para dejar notas y Python no las ejecuta. Las órdenes reales se escriben sin # y llevan paréntesis, por ejemplo avanzar().</p>
    </section>
  );
}
