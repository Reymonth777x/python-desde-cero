import Link from 'next/link';

export const metadata = {
  title: 'Página no encontrada · Python desde cero',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-ink)] flex flex-col items-center justify-center py-20 px-6 sm:px-10">
      <div className="text-center max-w-xl">
        <div className="inline-flex min-h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-accent)] mb-6">
          <span className="text-[var(--theme-ink-inverse)] font-serif text-2xl">404</span>
        </div>
        <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-4">Esta página no existe</h1>
        <p className="text-lg text-[var(--theme-muted)] mb-8 sm:text-xl">
          La dirección que buscas no está en nuestra ruta. Pero el aprendizaje continúa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="min-h-12 px-6 py-3 bg-[var(--theme-accent)] text-[var(--theme-ink-inverse)] font-semibold rounded-lg hover:bg-[var(--theme-accent-dark)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
          >
            Volver al inicio
          </Link>
          <Link
            href="/academia"
            className="min-h-12 px-6 py-3 border border-[var(--theme-border)] text-[var(--theme-ink)] font-semibold rounded-lg hover:bg-[var(--theme-bg-secondary)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]"
          >
            Ir a la academia
          </Link>
        </div>
      </div>
    </main>
  );
}
