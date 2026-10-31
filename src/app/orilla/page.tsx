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

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-[0.68rem] font-bold tracking-[0.14em] text-[var(--theme-accent)]">PRÁCTICA</p>
        <h1 className="font-serif text-3xl text-[var(--theme-ink)]">Orilla</h1>
        <p className="leading-7 text-[var(--theme-muted)]">
          Un río que obedece tu programa. Escribes Python de verdad y Nilo, la lancha, recorre cada tramo con lo que escribiste.
          Cada tramo practica un concepto del curso.
        </p>
        <p className="text-sm text-[var(--theme-ink)]">Llevas {hechos} de 12 tramos superados.</p>
        <p>
          <Link href="/academia" className="inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
            Volver a la academia
          </Link>
        </p>
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
