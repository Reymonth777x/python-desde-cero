import Link from 'next/link';
import type { ChapterId } from '@/lib/orilla/types';

export type ItemMapa = { id: ChapterId; orden: number; nombre: string; concepto: string; abierto: boolean; superado: boolean; estrellas: number; pasos: number | null };

const ICONOS: Record<ChapterId, string> = {
  c01: '🛟',
  c02: '📜',
  c03: '🧭',
  c04: '🛶',
  c05: '📻',
  c06: '🌊',
  c07: '🌀',
  c08: '🌱',
  c09: '🐟',
  c10: '🪵',
  c11: '🔬',
  c12: '🏞️',
  'reto-brazo': '🧩',
  'reto-luces': '✨',
  abierta: '♾️',
};

function Estado({ item }: { item: ItemMapa }) {
  if (!item.abierto) return <span className="text-xs font-semibold text-[var(--theme-muted)]">🔒 Bloqueado</span>;
  if (item.superado) return <span className="text-xs font-semibold text-[var(--theme-success)]">✓ Completado</span>;
  return <span className="text-xs font-bold text-[var(--theme-accent)]">En curso · Jugar →</span>;
}

function Nivel({ item }: { item: ItemMapa }) {
  const actual = item.abierto && !item.superado;
  const tarjeta = (
    <div className={[
      'min-w-0 flex-1 rounded-2xl border p-3 shadow-sm transition-transform sm:p-4',
      item.superado
        ? 'border-[#d2b36b] bg-gradient-to-r from-[#fff9e9] to-[var(--theme-surface)] dark:from-[#352d1e] dark:to-[var(--theme-surface)]'
        : actual
          ? 'border-[var(--theme-accent)] bg-[var(--theme-surface)] shadow-[0_8px_24px_-18px_var(--theme-glow)]'
          : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-70',
    ].join(' ')}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[var(--theme-muted)]">
            {item.orden > 0 ? 'TRAMO ' + item.orden + ' · 12' : item.id === 'abierta' ? 'EXPLORACIÓN SIN FIN' : 'DESAFÍO ESPECIAL'}
          </p>
          <h3 className="mt-1 font-serif text-base font-semibold leading-5 text-[var(--theme-ink)] sm:text-lg">{item.nombre}</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--theme-muted)] sm:text-sm">{item.concepto}</p>
        </div>
        {item.superado && item.orden > 0 && <span className="shrink-0 rounded-full bg-[#f4e6bc] px-2 py-1 text-xs font-bold text-[#694b16] dark:bg-[#594624] dark:text-[#f8e5ad]">{'★'.repeat(item.estrellas)}{'☆'.repeat(3 - item.estrellas)}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--theme-border)]/50 pt-2">
        <Estado item={item} />
        {item.superado && item.pasos !== null && <span className="text-[0.68rem] text-[var(--theme-muted)]">{item.pasos} pasos</span>}
      </div>
    </div>
  );

  return (
    <li className="relative flex items-center gap-3">
      <div className={[
        'relative z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border-[3px] text-xl shadow-md sm:h-16 sm:w-16',
        item.superado
          ? 'border-[#f3d58e] bg-gradient-to-br from-[#ffe8a8] to-[#db9f46]'
          : actual
            ? 'border-[#f5d28a] bg-gradient-to-br from-[#1a8b89] to-[#135b73] ring-4 ring-[#78c8b2]/25'
            : 'border-[var(--theme-border)] bg-[var(--theme-surface)] grayscale',
      ].join(' ')}>
        <span aria-hidden="true">{item.abierto && item.superado ? '🏅' : ICONOS[item.id]}</span>
        {item.orden > 0 && <span className="absolute -bottom-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-[var(--theme-surface)] bg-[var(--theme-ink)] px-1 text-[0.62rem] font-black text-[var(--theme-ink-inverse)]">{item.orden}</span>}
        {!item.abierto && <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--theme-surface)] bg-[var(--theme-muted)] text-[0.65rem] text-white">🔒</span>}
      </div>
      {item.abierto ? (
        <Link href={'/orilla/' + item.id} aria-label={item.nombre + '. ' + item.concepto + (item.superado ? '. Completado.' : '. Disponible para jugar.')} aria-current={actual ? 'step' : undefined}
          className="group flex min-w-0 flex-1 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[var(--theme-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] active:scale-[0.99]">
          {tarjeta}
        </Link>
      ) : (
        <div aria-disabled="true" className="flex min-w-0 flex-1">{tarjeta}</div>
      )}
    </li>
  );
}

export default function OrillaMap({ items }: { items: ItemMapa[] }) {
  const campana = items.filter((item) => item.orden > 0).sort((a, b) => a.orden - b.orden);
  const extras = items.filter((item) => item.orden === 0);
  const completados = campana.filter((item) => item.superado).length;
  const porcentaje = Math.round((completados / Math.max(campana.length, 1)) * 100);

  return (
    <div className="space-y-7">
      <section aria-labelledby="orilla-campana" className="relative overflow-hidden rounded-[1.75rem] border border-[#8eaa94] bg-gradient-to-b from-[#e4f0df] via-[#eaf1df] to-[#dcebef] p-3 shadow-[0_22px_55px_-35px_rgba(20,63,67,.7)] dark:border-[#345d59] dark:from-[#173b3a] dark:via-[#183b3c] dark:to-[#123344] sm:p-5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 top-10 text-7xl opacity-20">🌿</div>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-5 right-8 text-6xl opacity-20">🐠</div>
        <header className="relative z-10 mb-5 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#39715f] dark:text-[#a0d4b8]">TU MAPA DE AVENTURA</p>
            <h2 id="orilla-campana" className="mt-1 font-serif text-2xl font-semibold text-[#173d3d] dark:text-[#e6f3e9]">La travesía de Nilo</h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-[#42645b] dark:text-[#bdd7cc]">Cada parada te enseña una herramienta nueva de Python. Completa la misión, reúne estrellas y descubre el siguiente rincón del río.</p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/75 px-3 py-2 text-right shadow-sm dark:border-white/10 dark:bg-[#0a2532]/70">
            <p className="text-[0.62rem] font-bold tracking-[0.12em] text-[#5b7569] dark:text-[#b2d1c3]">AVANCE</p>
            <p className="font-serif text-xl font-bold text-[#174c45] dark:text-[#d8f3e2]">{completados}<span className="text-sm font-medium opacity-65"> / {campana.length}</span></p>
          </div>
        </header>
        <div className="relative z-10 mb-5 px-1">
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#42645b] dark:text-[#bdd7cc]"><span>Tu recorrido</span><span>{porcentaje}%</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/75 shadow-inner dark:bg-[#092a36]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#2a8e80] to-[#d9ad59] transition-[width] duration-500" style={{ width: porcentaje + '%' }} />
          </div>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute bottom-8 left-[1.65rem] top-8 w-5 rounded-full bg-gradient-to-b from-[#8bc7b2] via-[#5aa9a9] to-[#27657d] opacity-70 shadow-inner" />
          <div aria-hidden="true" className="absolute bottom-8 left-[2.23rem] top-8 w-px border-l-2 border-dashed border-white/75" />
          <ol className="relative space-y-3" aria-label="Niveles de la campaña principal">
            {campana.map((item) => <Nivel key={item.id} item={item} />)}
          </ol>
        </div>
        <p className="relative z-10 mt-5 rounded-xl border border-white/70 bg-white/55 p-3 text-xs leading-5 text-[#42645b] dark:border-white/10 dark:bg-[#092a36]/45 dark:text-[#bdd7cc]">Consejo de Nilo: no necesitas conseguir las tres estrellas para continuar. Primero aprende, luego vuelve por tu mejor puntuación.</p>
      </section>

      <section aria-labelledby="orilla-extras" className="space-y-3">
        <header className="px-1">
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[var(--theme-accent)]">CUANDO QUIERAS UN RETO MÁS</p>
          <h2 id="orilla-extras" className="mt-1 font-serif text-xl font-semibold text-[var(--theme-ink)]">Secretos y río abierto</h2>
          <p className="mt-1 text-sm leading-5 text-[var(--theme-muted)]">Desafíos adicionales para combinar lo aprendido y explorar sin una única ruta.</p>
        </header>
        <ol className="space-y-3" aria-label="Desafíos adicionales">
          {extras.map((item) => <Nivel key={item.id} item={item} />)}
        </ol>
      </section>
    </div>
  );
}
