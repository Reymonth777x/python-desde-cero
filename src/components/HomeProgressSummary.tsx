import Link from 'next/link';
import { courseModules } from '@/lib/course';
import { createClient } from '@/lib/supabase/server';

const CORE_MODULES = courseModules.filter((courseModule) => !courseModule.optional);
const EXTENSION_MODULES = courseModules.filter((courseModule) => courseModule.optional);
const TOTAL_LESSONS = CORE_MODULES.reduce((sum, courseModule) => sum + courseModule.lessons.length, 0);
const TOTAL_EXTENSION_LESSONS = EXTENSION_MODULES.reduce((sum, courseModule) => sum + courseModule.lessons.length, 0);

export default async function HomeProgressSummary() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data, error } = await supabase
    .from('progress')
    .select('module_id, is_completed')
    .eq('user_id', user.id);

  if (error) {
    return (
      <div id="progreso" className="mt-6 max-w-xl border-l-2 border-[var(--theme-border)] px-4 py-3 text-sm text-[var(--theme-muted)]">
        Tu sesión está iniciada, pero no se pudo consultar el avance ahora.
        <Link href="/academia" className="ml-2 font-semibold text-[var(--theme-accent)] underline underline-offset-4">
          Abrir mi ruta
        </Link>
      </div>
    );
  }

  const completedRows = (data ?? []).filter((row) => row.is_completed === true);
  const coreIds = new Set(CORE_MODULES.map((courseModule) => courseModule.id));
  const extensionIds = new Set(EXTENSION_MODULES.map((courseModule) => courseModule.id));
  const completed = completedRows.filter((row) => coreIds.has(row.module_id)).length;
  const extensionCompleted = completedRows.filter((row) => extensionIds.has(row.module_id)).length;
  const percent = TOTAL_LESSONS > 0 ? Math.round((completed / TOTAL_LESSONS) * 100) : 0;

  return (
    <section id="progreso" aria-label="Tu progreso de aprendizaje" className="mt-6 max-w-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-[0.14em] text-[var(--theme-accent)]">TU PROGRESO</p>
        <p className="font-mono text-sm text-[var(--theme-ink)]">
          {completed}/{TOTAL_LESSONS} lecciones · {percent}%
        </p>
      </div>
      <div className="mt-3 h-2 w-full bg-[var(--theme-bg-secondary)]" role="progressbar" aria-label="Progreso del curso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full bg-[var(--theme-accent)] transition-[width]" style={{ width: percent + '%' }} />
      </div>
      {TOTAL_EXTENSION_LESSONS > 0 && (
        <p className="mt-3 text-xs text-[var(--theme-muted)]">
          Extensión práctica opcional: {extensionCompleted}/{TOTAL_EXTENSION_LESSONS} actividades
        </p>
      )}
      <Link href="/academia" className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4">
        Continuar aprendiendo
      </Link>
    </section>
  );
}
