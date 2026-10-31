import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import OrillaPlay from '@/components/orilla/OrillaPlay';
import { CAMPANA, TRAMOS, esChapterId, estaDesbloqueado, siguienteTramo } from '@/lib/orilla/catalog';
import { construirPayload, datosDe } from '@/lib/orilla/chapters';
import { createClient } from '@/lib/supabase/server';

type Fila = {
  chapter_id: string;
  code: string;
  passed: boolean;
  stars: number;
  best_steps: number | null;
  attempts: number;
  notes: string;
  updated_at: string;
};

export default async function TramoPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  if (!esChapterId(chapterId)) notFound();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect('/login');

  const { data } = await supabase
    .from('orilla_runs')
    .select('chapter_id, code, passed, stars, best_steps, attempts, notes, updated_at')
    .eq('user_id', auth.user.id);
  const filas = (data ?? []) as Fila[];
  const superados = new Set(filas.filter((f) => f.passed).map((f) => f.chapter_id));
  const meta = TRAMOS[chapterId];

  // Un tramo cerrado no recibe ni mapas ni soluciones: solo este aviso.
  if (!estaDesbloqueado(chapterId, superados)) {
    const indice = CAMPANA.indexOf(chapterId);
    const previo = indice > 0 ? TRAMOS[CAMPANA[indice - 1]] : TRAMOS.c12;
    return (
      <main className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl text-[var(--theme-ink)]">{meta.nombre}</h1>
        <p className="leading-7 text-[var(--theme-muted)]">
          Este tramo sigue cerrado. Supera primero «{previo.nombre}» para abrirlo.
        </p>
        <p>
          <Link href={`/orilla/${previo.id}`} className="inline-flex min-h-11 items-center bg-[var(--theme-accent)] px-4 font-semibold text-[var(--theme-ink-inverse)] hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
            Ir a {previo.nombre}
          </Link>
        </p>
        <p>
          <Link href="/orilla" className="inline-flex min-h-11 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-2">
            Volver al mapa del río
          </Link>
        </p>
      </main>
    );
  }

  const datos = datosDe(chapterId);
  const fila = filas.find((f) => f.chapter_id === chapterId);
  const notas = chapterId === 'abierta' && fila ? fila.notes.split('\n').filter((l) => l !== '') : [];
  const siguiente = siguienteTramo(chapterId);

  return (
    <main>
      <OrillaPlay
        tramo={{ id: meta.id, orden: meta.orden, nombre: meta.nombre, concepto: meta.concepto, lessonId: meta.lessonId }}
        ui={{ ayuda: datos.ayuda, andamiaje: datos.andamiaje, consecuencia: datos.consecuencia }}
        payload={construirPayload(chapterId, notas)}
        guardado={{
          code: fila?.code ?? null,
          passed: fila?.passed ?? false,
          stars: fila?.stars ?? 0,
          bestSteps: fila?.best_steps ?? null,
          attempts: fila?.attempts ?? 0,
          updatedAt: fila?.updated_at ?? null,
        }}
        siguienteHref={siguiente ? `/orilla/${siguiente}` : '/orilla'}
        mapaHref="/orilla"
        userId={auth.user.id}
      />
    </main>
  );
}
