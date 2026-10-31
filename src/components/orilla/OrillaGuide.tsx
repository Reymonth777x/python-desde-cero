'use client';

import type { ChapterId } from '@/lib/orilla/types';
import { DOC_VERBOS } from '@/lib/orilla/ayuda-verbos';
import { GUIA_ORILLA, SIMBOLOS_ORILLA } from '@/lib/orilla/guide';

type Props = {
  chapterId: ChapterId;
  ayuda: string[];
  verbos: string[];
  builtins: string[];
  onUseExample?: (code: string) => void;
};

const PASOS_BASE = [
  { numero: '1', titulo: 'Lee la misión', detalle: 'Mira qué debe conseguir Nilo en este tramo.' },
  { numero: '2', titulo: 'Escribe Python', detalle: 'Añade órdenes en el editor. No mueves la lancha con el ratón.' },
  { numero: '3', titulo: 'Pulsa Ejecutar', detalle: 'El motor ejecuta tu programa y reproduce los movimientos.' },
  { numero: '4', titulo: 'Aprende del resultado', detalle: 'Observa dónde se detuvo Nilo, lee el mensaje y vuelve a probar.' },
];

export default function OrillaGuide({ chapterId, ayuda, verbos, builtins, onUseExample }: Props) {
  const guia = GUIA_ORILLA[chapterId];
  const nombres = [...guia.comandos, ...builtins.filter((nombre) => guia.comandos.includes(nombre))]
    .filter((nombre, i, lista) => lista.indexOf(nombre) === i && (verbos.includes(nombre) || builtins.includes(nombre)));
  const resumen = nombres.map((nombre) => ({ nombre, descripcion: DOC_VERBOS[nombre] })).filter((item) => item.descripcion);

  return (
    <section aria-labelledby="orilla-guia-titulo" className="space-y-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 shadow-sm sm:p-5">
      <div className="space-y-1">
        <p className="text-[0.68rem] font-bold tracking-[0.14em] text-[var(--theme-accent)]">GUÍA PARA PRINCIPIANTES</p>
        <h2 id="orilla-guia-titulo" className="font-serif text-xl text-[var(--theme-ink)] sm:text-2xl">Primero: ¿cómo se juega?</h2>
        <p className="text-sm leading-6 text-[var(--theme-muted)]">Orilla se juega escribiendo Python. No arrastras a Nilo ni pulsas casillas del mapa: escribes órdenes y el juego las ejecuta.</p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PASOS_BASE.map((paso) => (
          <li key={paso.numero} className="flex gap-3 rounded-xl bg-[var(--theme-bg-secondary)] p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent)] text-sm font-bold text-[var(--theme-ink-inverse)]">{paso.numero}</span>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--theme-ink)]">{paso.titulo}</p>
              <p className="mt-1 text-sm leading-5 text-[var(--theme-muted)]">{paso.detalle}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,.9fr)]">
        <div className="space-y-3 rounded-xl border border-[var(--theme-border)] p-3 sm:p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)]">Tu misión</p>
            <p className="mt-1 font-semibold leading-6 text-[var(--theme-ink)]">{guia.mision}</p>
          </div>
          <ol className="space-y-3">
            {guia.pasos.map((paso, i) => (
              <li key={paso.titulo} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-ink)]">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--theme-ink)]">{paso.titulo}</p>
                  <p className="text-sm leading-5 text-[var(--theme-muted)]">{paso.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-[var(--theme-bg-secondary)] p-3 sm:p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)]">Lo que estás aprendiendo</p>
            <p className="mt-1 text-sm leading-6 text-[var(--theme-ink)]">{guia.idea}</p>
          </div>
          <div className="rounded-xl border border-[var(--theme-border)] p-3 sm:p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)]">Pista de este tramo</p>
            <p className="mt-1 text-sm leading-6 text-[var(--theme-ink)]">{guia.pista}</p>
          </div>
          {guia.ejemplo && onUseExample && (
            <div className="space-y-2 rounded-xl border border-[var(--theme-border)] p-3">
              <p className="text-sm font-semibold text-[var(--theme-ink)]">Ejemplo para tu primer viaje</p>
              <pre className="overflow-x-auto rounded-lg bg-[#071b2a] p-3 font-mono text-sm leading-6 text-[#b6f0df]">{guia.ejemplo}</pre>
              <button type="button" onClick={() => onUseExample(guia.ejemplo!)} className="min-h-11 w-full rounded-lg bg-[var(--theme-accent)] px-3 py-2 text-sm font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
                Usar este ejemplo en el editor
              </button>
              <p className="text-xs leading-5 text-[var(--theme-muted)]">Al pulsar, reemplazarás el contenido actual del editor por este ejemplo. Puedes editarlo después.</p>
            </div>
          )}
        </div>
      </div>

      {resumen.length > 0 && (
        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--theme-accent)]">Palabras y órdenes que puedes usar ahora</summary>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            {resumen.map(({ nombre, descripcion }) => (
              <div key={nombre} className="rounded-lg bg-[var(--theme-bg-secondary)] p-2">
                <dt className="font-mono text-sm font-bold text-[var(--theme-ink)]">{nombre}()</dt>
                <dd className="mt-1 text-sm leading-5 text-[var(--theme-muted)]">{descripcion}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-[var(--theme-muted)]">No tienes que aprender todos los comandos de golpe. Solo usa los que se han abierto hasta este tramo.</p>
        </details>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--theme-accent)]">¿Qué significan los símbolos del río?</summary>
          <dl className="mt-2 grid grid-cols-1 gap-2">
            {SIMBOLOS_ORILLA.map((item) => (
              <div key={item.simbolo} className="flex items-start gap-3 rounded-lg bg-[var(--theme-bg-secondary)] p-2">
                <dt className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--theme-border-dark)] bg-[var(--theme-surface)] font-mono text-sm font-bold text-[var(--theme-ink)]">{item.simbolo}</dt>
                <dd className="text-sm leading-5 text-[var(--theme-ink)]"><strong>{item.nombre}.</strong> <span className="text-[var(--theme-muted)]">{item.detalle}</span></dd>
              </div>
            ))}
          </dl>
        </details>

        <details className="rounded-xl border border-[var(--theme-border)] p-3">
          <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--theme-accent)]">¿Cómo sé si gané? ¿Qué son las estrellas?</summary>
          <div className="mt-2 space-y-2 text-sm leading-6 text-[var(--theme-ink)]">
            <p><strong>Primero, completa la misión.</strong> Cuando el resultado diga «Tramo superado», se guarda tu avance y se abre el siguiente tramo.</p>
            <p><strong>Una estrella:</strong> el programa cumple los objetivos en todos los mapas de prueba.</p>
            <p><strong>Dos estrellas:</strong> además, lo hace dentro de la cantidad de pasos recomendada.</p>
            <p><strong>Tres estrellas:</strong> también demuestra el concepto de Python que practica este tramo.</p>
            <p className="text-[var(--theme-muted)]">Las estrellas son un reto adicional; no necesitas tres para avanzar.</p>
          </div>
        </details>
      </div>

      <details className="rounded-xl border border-[var(--theme-border)] p-3">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--theme-accent)]">Pistas del tramo y cómo recuperarte de un error</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--theme-ink)]">
          {ayuda.map((linea) => <li key={linea}>{linea}</li>)}
        </ul>
        <p className="mt-3 text-sm leading-6 text-[var(--theme-muted)]">Si algo falla, lee el mensaje de «Resultado»: puede indicar la línea y qué esperaba el río. Corrige tu código y pulsa Ejecutar otra vez. Tu borrador se guarda automáticamente mientras escribes.</p>
      </details>
    </section>
  );
}
