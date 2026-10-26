import PythonEditor from '@/components/PythonEditor';
import LessonProgress from '@/components/LessonProgress';
import { logout } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function PracticaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
    : { data: null };

  return (
    <main className="min-h-screen bg-[#f4f2e9] text-[#252b25]">
      <header className="border-b border-[#d3d3c7]">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#294936] underline underline-offset-4">
            Python desde cero
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/academia" className="inline-flex min-h-11 items-center font-semibold text-[#294936] underline underline-offset-4">Academia</Link>
            {profile?.is_admin === true && (
              <Link href="/admin/invitaciones" className="inline-flex min-h-11 items-center text-[#596259] underline underline-offset-4">Invitaciones</Link>
            )}
            <form action={logout}>
              <button type="submit" className="inline-flex min-h-11 items-center text-[#596259] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#294936]">Cerrar sesión</button>
            </form>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
        <p className="text-xs font-bold tracking-[0.17em] text-[#294936]">
          PYTHON DESDE CERO / LABORATORIO
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Laboratorio de Python
        </h1>
        <p className="mb-8 mt-4 max-w-2xl text-sm leading-7 text-[#596259]">
          Escribe código, ejecuta tus pruebas y guarda el progreso de tus lecciones.
        </p>

        <PythonEditor
          defaultCode={'precio = 1200\ncantidad = 3\ntotal = precio * cantidad\nprint(total)'}
          instructions="Edita el programa, pulsa Ejecutar y consulta la salida. Para probar input(), escribe una respuesta por línea en el campo de entrada antes de ejecutar. La ejecución tiene un límite de tiempo; si lo supera, el Worker se reinicia."
        />
        <LessonProgress />
      </div>
    </main>
  );
}
