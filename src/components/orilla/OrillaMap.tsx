import type { ChapterId } from '@/lib/orilla/types';

export type ItemMapa = { id: ChapterId; orden: number; nombre: string; concepto: string; abierto: boolean; superado: boolean; estrellas: number; pasos: number | null };
const ALTO_ITEM = 88;
const MARGEN = 44;
const SEPARACION_EXTRAS = 56;
function equis(i: number): number { return 56 + 14 * Math.sin(i * 0.9); }
function etiqueta(item: ItemMapa): string {
  const prefijo = item.orden > 0 ? `Tramo ${item.orden}: ` : '';
  const estado = !item.abierto ? 'Cerrado.' : item.superado ? item.id === 'abierta' ? `Superado${item.pasos !== null ? `, marca de ${item.pasos} pasos` : ''}.` : `Superado, ${item.estrellas} de 3 estrellas.` : 'Abierto.';
  return `${prefijo}${item.nombre}. ${item.concepto}. ${estado}`;
}
export default function OrillaMap({ items }: { items: ItemMapa[] }) {
  const campana = items.filter((i) => i.orden > 0);
  const extras = items.filter((i) => i.orden === 0);
  const posiciones = items.map((item, i) => ({ item, x: equis(i), y: MARGEN + i * ALTO_ITEM + (item.orden === 0 ? SEPARACION_EXTRAS : 0) }));
  const alto = MARGEN * 2 + items.length * ALTO_ITEM + (extras.length > 0 ? SEPARACION_EXTRAS : 0);
  const trazo = posiciones.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const yExtras = campana.length * ALTO_ITEM + MARGEN + SEPARACION_EXTRAS / 2;
  return (
    <svg viewBox={`0 0 520 ${alto}`} role="group" aria-label="Mapa del río de Orilla" className="mx-auto block h-auto w-full max-w-xl">
      <path d={trazo} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={22} className="stroke-[var(--theme-accent-light)]" />
      <path d={trazo} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} strokeDasharray="2 8" className="stroke-[var(--theme-accent)]" />
      {extras.length > 0 && <text x={110} y={yExtras} className="fill-[var(--theme-muted)] text-[12px] font-bold tracking-[0.14em]">MÁS ALLÁ DE LA CUENCA</text>}
      {posiciones.map(({ item, x, y }) => {
        const contenido = (
          <>
            <rect x={x + 24} y={y - 30} width={380} height={60} className="fill-transparent group-focus-visible:stroke-[var(--theme-focus-ring)]" strokeWidth={3} />
            <rect x={x - 14} y={y - 14} width={28} height={28} strokeWidth={3} className={`${item.superado ? 'fill-[var(--theme-accent)]' : 'fill-[var(--theme-surface)]'} stroke-[var(--theme-accent)]`} />
            <text x={x} y={y + 5} textAnchor="middle" aria-hidden="true" className={`${item.superado ? 'fill-[var(--theme-ink-inverse)]' : 'fill-[var(--theme-ink)]'} text-[13px] font-bold`}>{item.orden > 0 ? item.orden : item.id === 'abierta' ? '∞' : '?'}</text>
            <text x={x + 34} y={y - 6} aria-hidden="true" className="fill-[var(--theme-ink)] text-[16px] font-semibold">{item.nombre}</text>
            <text x={x + 34} y={y + 12} aria-hidden="true" className="fill-[var(--theme-muted)] text-[12px]">{item.abierto ? item.concepto : 'Cerrado: supera el tramo anterior'}</text>
            {item.abierto && item.id !== 'abierta' && <text x={x + 34} y={y + 28} aria-hidden="true" className="fill-[var(--theme-accent)] text-[13px]">{'★'.repeat(item.estrellas) + '☆'.repeat(3 - item.estrellas)}</text>}
          </>
        );
        return item.abierto ? (
          <a key={item.id} href={`/orilla/${item.id}`} aria-label={etiqueta(item)} className="group outline-none">{contenido}</a>
        ) : (
          <g key={item.id} role="img" aria-label={etiqueta(item)} opacity={0.6}>{contenido}</g>
        );
      })}
    </svg>
  );
}
