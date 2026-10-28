import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EstudiantePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: progress } = await supabase
    .from('progress')
    .select('module_id, lesson_id, is_completed, best_score')
    .eq('user_id', user.id);

  const progressList = progress ?? [];
  const completedCount = progressList.filter(p => p.is_completed).length;
  const totalLessons = progressList.length;
  const avgScore = progressList.length > 0
    ? Math.round(progressList.reduce((sum, p) => sum + Number(p.best_score), 0) / progressList.length)
    : 0;

  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:py-5">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-[var(--theme-accent)] font-serif text-xl text-[var(--theme-ink-inverse)]">
              Py
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">PYTHON</span>
              <span className="block text-xs tracking-[0.16em] text-[var(--theme-muted)]">DESDE CERO</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-[var(--theme-muted)] hover:text-[var(--theme-accent)]">
              Volver al inicio
            </Link>
            <span className="text-xs px-2 py-1 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded text-[var(--theme-muted)]">
              Estudiante
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="max-w-4xl">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl mb-2">
            Tu panel de aprendizaje
          </h1>
          <p className="mt-2 leading-7 text-[var(--theme-muted)]">
            Aquí ves tu progreso, logros y racha. Sigue avanzando lección por lección.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--theme-accent)] uppercase">Lecciones completadas</p>
              <p className="mt-2 text-3xl font-bold text-[var(--theme-ink)]">{completedCount}</p>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">de {totalLessons} totales</p>
            </div>
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--theme-accent)] uppercase">Puntaje promedio</p>
              <p className="mt-2 text-3xl font-bold text-[var(--theme-ink)]">{avgScore}%</p>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">en tus lecciones</p>
            </div>
            <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-6 rounded-lg">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--theme-accent)] uppercase">Logros</p>
              <p className="mt-2 text-3xl font-bold text-[var(--theme-ink)]">0</p>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">desbloqueados</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-2xl leading-tight mb-4">Progreso por módulo</h2>
            <div className="space-y-3">
              {['module-1', 'module-2', 'module-3', 'module-4', 'module-5'].map((moduleId, i) => {
                const moduleProgress = progressList.filter(p => p.module_id === moduleId);
                const moduleCompleted = moduleProgress.filter(p => p.is_completed).length;
                const moduleTotal = moduleProgress.length;
                const pct = moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0;

                return (
                  <div key={moduleId} className="bg-[var(--theme-surface)] border border-[var(--theme-border)] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-[var(--theme-ink)]">Bloque {i + 1}</span>
                      <span className="text-xs font-mono text-[var(--theme-muted)]">{moduleCompleted}/{moduleTotal}</span>
                    </div>
                    <div className="w-full bg-[var(--theme-bg-secondary)] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--theme-accent)]" style={{ width: pct + '%' }}></div>
                    </div>
                    <p className="mt-2 text-xs text-[var(--theme-muted)]">{pct}% completado</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href="/academia" className="flex-1 min-h-12 border border-[var(--theme-accent)] px-5 py-3 text-base font-semibold text-[var(--theme-accent)] text-center transition-colors hover:bg-[var(--theme-bg-secondary)]">
              Continuar aprendiendo
            </Link>
            <Link href="/practica" className="flex-1 min-h-12 border border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-3 text-base font-semibold text-[var(--theme-ink)] text-center transition-colors hover:bg-[var(--theme-bg-secondary)]">
              Laboratorio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
