import Link from 'next/link';
import { redirect } from 'next/navigation';
import OrillaMap, { type ItemMapa } from '@/components/orilla/OrillaMap';
import { CAMPANA, TODOS_LOS_TRAMOS, TRAMOS, estaDesbloqueado } from '@/lib/orilla/catalog';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Orilla' };

type Fila = { chapter_id: string; passed: boolean; stars: number; best_steps: number | null };

export default async function OrillaPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect('/login');

  const { data, error } = await supabase
    .from('orilla_runs')
    .select('chapter_id, passed, stars, best_steps')
    .eq('user_id', auth.user.id);
  const filas = (error ? [] : (data ?? [])) as Fila[];
  const porTramo = new Map(filas.map((f) => [f.chapter_id, f]));
  const superados = new Set(filas.filter((f) => f.passed).map((f) => f.chapter_id));

  const items: ItemMapa[] = TODOS_LOS_TRAMOS.map((id) => {
    const meta = TRAMOS[id];
    const fila = porTramo.get(id);
    return {
      id,
      orden: meta.orden,
      nombre: meta.nombre,
      concepto: meta.concepto,
      abierto: estaDesbloqueado(id, superados),
      superado: fila?.passed === true,
      estrellas: fila?.stars ?? 0,
      pasos: fila?.best_steps ?? null,
    };
  });
  const hechos = CAMPANA.filter((id) => superados.has(id)).length;
  const estrellas = CAMPANA.reduce((total, id) => total + (porTramo.get(id)?.stars ?? 0), 0);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <header className="overflow-hidden rounded-3xl border border-[#315c66] bg-gradient-to-br from-[#092e43] via-[#11566a] to-[#1a8179] p-4 text-white shadow-[0_22px_55px_-32px_rgba(3,36,51,.9)] sm:p-6">
        <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#a8e3d0]">PRÁCTICA · AVENTURA INTERACTIVA</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Orilla</h1>
            <p className="mt-2 text-sm leading-6 text-[#e0f5ef] sm:text-base">Nilo necesita una mente curiosa al timón. Aprende Python con misiones cortas, explora un río vivo y descubre cómo tus instrucciones cambian lo que sucede.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white">🛶 {hechos} / 12 niveles</span>
            <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white">⭐ {estrellas} / 36 estrellas</span>
            <span className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white">15 escenarios</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-3">
          <details className="min-w-0 flex-1">
            <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-[#d5f3e8]">¿Cómo se juega por primera vez?</summary>
            <ol className="list-decimal space-y-1 pb-2 pl-5 text-sm leading-6 text-[#e0f5ef]">
              <li>Abre el primer punto del mapa: <strong>La boya</strong>.</li>
              <li>Lee la historia, la misión y la mini-lección de Python.</li>
              <li>Escribe las órdenes para Nilo y pulsa <strong>Ejecutar</strong>.</li>
              <li>Observa el río, lee el resultado y mejora tu programa. Puedes probar tantas veces como necesites.</li>
            </ol>
          </details>
          <Link href="/academia" className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Volver a la academia
          </Link>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#bfe5d8]">El código se ejecuta como Python real en un entorno aislado. No necesitas conocimientos previos: cada parada te enseña una idea nueva.</p>
      </header>
      {error && (
        <p role="alert" className="border-l-2 border-[var(--theme-border-dark)] bg-[var(--theme-bg-secondary)] p-3 text-sm text-[var(--theme-ink)]">
          No se pudo cargar tu avance. Puedes empezar por el primer tramo.
        </p>
      )}
      <OrillaMap items={items} />
    </main>
  );
}
