'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import ThemeSelector from '@/components/ThemeSelector';
import PortadaLab from '@/components/PortadaLab';
import { courseCatalog } from '@/lib/course-catalog';

type Example = {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  concepts: string[];
  code: string;
  description: string;
};

const EXAMPLES: Example[] = [
  {
    id: 'arbol-fractal',
    title: 'Árbol fractal',
    subtitle: 'Recursividad y ramas',
    level: 'Intermedio',
    concepts: ['funciones', 'recursividad', 'condicionales'],
    code: `import turtle as t

t.bgcolor("black")
t.speed(0)
t.hideturtle()

def rama(n):
    if n < 10:
        return
    t.pencolor("white" if n > 25 else "lime")
    t.forward(n)
    t.left(25); rama(n * 0.78)
    t.right(50); rama(n * 0.78)
    t.left(25); t.backward(n)

t.left(90); t.backward(150)
rama(110)

t.done()`,
    description: 'Construye un árbol con una función que se llama a sí misma.',
  },
  {
    id: 'espiral-geometrica',
    title: 'Espiral geométrica',
    subtitle: 'Bucles y ángulos',
    level: 'Principiante',
    concepts: ['bucles', 'variables', 'operadores'],
    code: `import turtle as t

t.bgcolor("black")
t.speed(0)
t.hideturtle()
t.pencolor("cyan")

for i in range(200):
    t.forward(i * 2)
    t.left(89)`,
    description: 'Observa cómo un bucle transforma una línea en una espiral.',
  },
  {
    id: 'arte-circulos',
    title: 'Arte con círculos',
    subtitle: 'Iteración y parámetros',
    level: 'Principiante',
    concepts: ['bucles', 'funciones', 'parámetros'],
    code: `import turtle as t

t.bgcolor("black")
t.speed(0)
t.hideturtle()

for i in range(36):
    t.pencolor("magenta" if i % 2 == 0 else "cyan")
    t.circle(100)
    t.left(10)`,
    description: 'Combina repetición y ángulos para crear un patrón.',
  },
  {
    id: 'visualizacion-matematica',
    title: 'Visualización matemática',
    subtitle: 'Funciones y patrones',
    level: 'Intermedio',
    concepts: ['funciones matemáticas', 'bucles', 'trigonometría'],
    code: `import turtle as t
import math

t.bgcolor("black")
t.speed(0)
t.hideturtle()
t.pencolor("lime")

for i in range(360):
    x = i * math.cos(math.radians(i)) * 0.5
    y = i * math.sin(math.radians(i)) * 0.5
    t.penup()
    t.goto(x, y)
    t.pendown()
    t.dot(3)`,
    description: 'Usa seno y coseno para dibujar una espiral matemática.',
  },
  {
    id: 'contador-ascendente',
    title: 'Contador ascendente',
    subtitle: 'Bucles simples',
    level: 'Principiante',
    concepts: ['bucles', 'variables', 'imprimir'],
    code: `for i in range(1, 11):
    print(i)`,
    description: 'Ejecuta tu primer bucle y muestra diez resultados.',
  },
  {
    id: 'calculo-areas',
    title: 'Cálculo de áreas',
    subtitle: 'Funciones y parámetros',
    level: 'Principiante',
    concepts: ['funciones', 'parámetros', 'operadores'],
    code: `def area_circulo(radio):
    import math
    return math.pi * radio ** 2

def area_cuadrado(lado):
    return lado ** 2

print("Área del círculo (radio 5):", area_circulo(5))
print("Área del cuadrado (lado 4):", area_cuadrado(4))`,
    description: 'Resuelve un problema real con dos funciones pequeñas.',
  },
];

const CORE_MODULES = courseCatalog.filter((courseModule) => !courseModule.optional);
const TOTAL_LESSONS = CORE_MODULES.reduce(
  (total, courseModule) => total + courseModule.lessons.length,
  0,
);

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[580px]">
      <div className="absolute -left-3 top-12 hidden h-28 w-28 border border-[var(--theme-border)]/60 sm:block" aria-hidden="true" />
      <div className="absolute -bottom-4 -right-3 hidden h-24 w-24 rounded-full border border-[var(--theme-accent)]/50 sm:block" aria-hidden="true" />
      <div className="relative overflow-hidden border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[12px_14px_0_var(--theme-shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--theme-error)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--theme-warning)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--theme-success)]" />
            <span className="ml-2 font-mono text-[11px] text-[var(--theme-muted)]">cambio.py</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--theme-accent)]">PRIMERA LECCIÓN</span>
        </div>
        <div className="grid sm:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0 bg-[var(--theme-code-bg)] p-4 sm:p-5">
            <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--theme-muted)]">ENTRADA Y CÁLCULO</p>
            <pre className="mt-4 overflow-x-auto font-mono text-xs leading-[2] text-[var(--theme-ink)] sm:text-sm"><code><span className="text-[var(--theme-muted)]">01 </span>precio = 3200{"\n"}<span className="text-[var(--theme-muted)]">02 </span>pago = 5000{"\n"}<span className="text-[var(--theme-muted)]">03 </span>cambio = pago - precio{"\n"}<span className="text-[var(--theme-muted)]">04 </span><span className="text-[var(--theme-accent)]">print</span>(cambio)</code></pre>
            <div className="mt-5 border-t border-[var(--theme-border)]/60 pt-3">
              <span className="font-mono text-[10px] text-[var(--theme-muted)]">QUÉ ESTÁ PASANDO</span>
              <p className="mt-1 text-xs leading-5 text-[var(--theme-ink)]">Python guarda dos cantidades, resta el precio al pago y muestra el resultado.</p>
            </div>
          </div>
          <div className="flex min-h-[220px] flex-col justify-center border-t border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] p-5 sm:min-h-[300px] sm:border-l sm:border-t-0 sm:p-6">
            <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--theme-muted)]">SALIDA DEL PROGRAMA</span>
            <p className="mt-4 font-serif text-5xl tracking-tight text-[var(--theme-accent)]">1800</p>
            <p className="mt-3 max-w-[15rem] text-sm leading-6 text-[var(--theme-ink)]">Ese es el cambio que debe devolver la tienda.</p>
            <div className="mt-6 border-t border-[var(--theme-border)] pt-3">
              <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--theme-muted)]">ENTRADA · PROCESO · SALIDA</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--theme-border)] px-4 py-3">
          <span className="text-xs text-[var(--theme-muted)]">Un primer programa que resuelve un problema concreto.</span>
          <span className="font-mono text-[10px] text-[var(--theme-accent)]">PYTHON EN EL NAVEGADOR</span>
        </div>
      </div>
    </div>
  );
}
type HomePageClientProps = {
  accountLinks: ReactNode;
  progressSummary: ReactNode;
};

export default function HomePageClient({ accountLinks, progressSummary }: HomePageClientProps) {
  const beginnerFirstExamples = [...EXAMPLES].sort(
    (left, right) => Number(left.level !== 'Principiante') - Number(right.level !== 'Principiante'),
  );
  const [selectedExample, setSelectedExample] = useState<Example>(
    () => EXAMPLES.find((example) => example.id === 'contador-ascendente') ?? EXAMPLES[0],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-ink)]">
      <header className="border-b border-[var(--theme-border)]">
        <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3">
          <Link href="/" className="group flex min-h-11 items-center gap-3" aria-label="Python desde cero, inicio">
            <span className="flex h-10 w-10 items-center justify-center border border-[var(--theme-accent)] bg-[var(--theme-accent)] font-mono text-lg font-bold text-[var(--theme-ink-inverse)] transition-transform group-hover:-rotate-3">
              Py
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-[0.12em]">PYTHON</span>
              <span className="mt-1 block text-[10px] tracking-[0.25em] text-[var(--theme-muted)]">DESDE CERO</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 sm:gap-5">
            <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:gap-x-6 sm:text-sm">
              <a href="#ruta" className="inline-flex min-h-10 items-center text-[var(--theme-muted)] underline-offset-4 hover:text-[var(--theme-ink)] hover:underline">La ruta</a>
              <a href="#ejemplo" className="inline-flex min-h-10 items-center text-[var(--theme-muted)] underline-offset-4 hover:text-[var(--theme-ink)] hover:underline">Laboratorio</a>
              <Link href="/academia" className="inline-flex min-h-10 items-center font-semibold text-[var(--theme-accent)] underline underline-offset-4">Academia</Link>
              {accountLinks}
            </nav>
            <ThemeSelector />
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden border-b border-[var(--theme-border)]" style={{ backgroundImage: 'radial-gradient(circle at 82% 18%, var(--theme-accent-light) 0, transparent 34%)' }}>
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:py-20 lg:min-h-[650px] lg:grid-cols-[0.94fr_1.06fr] lg:gap-12 lg:py-24">
          <div className="relative z-10">
            <p className="flex items-center gap-3 text-[10px] font-bold tracking-[0.22em] text-[var(--theme-accent)] sm:text-xs">
              <span className="h-px w-8 bg-[var(--theme-accent)]" />
              FORMACIÓN PRÁCTICA EN PYTHON
            </p>
            <h1 className="mt-7 max-w-2xl text-[clamp(3.1rem,6.2vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
              Aprende a programar.{" "}
              <span className="mt-2 block font-normal text-[var(--theme-accent)]">Entiende lo que haces.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[var(--theme-muted)] sm:text-lg">
              Una ruta guiada para pasar de tus primeras instrucciones a resolver problemas con Python. Lee, modifica el código y ejecútalo en tu propio navegador.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/muestra" className="inline-flex min-h-12 items-center justify-center gap-3 bg-[var(--theme-accent)] px-5 py-3 text-sm font-semibold text-[var(--theme-ink-inverse)] transition-colors hover:bg-[var(--theme-accent-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
                Probar la primera lección <span aria-hidden="true">↗</span>
              </Link>
              <a href="#ruta" className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-[var(--theme-muted)] underline underline-offset-4 transition-colors hover:text-[var(--theme-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-focus-ring)]">
                Consultar el temario
              </a>
            </div>
            {progressSummary}

            <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-[var(--theme-border)] pt-5">
              <div className="pr-3">
                <p className="font-mono text-2xl font-semibold tracking-tight text-[var(--theme-ink)]">{CORE_MODULES.length.toString().padStart(2, "0")}</p>
                <p className="mt-1 text-[10px] leading-4 text-[var(--theme-muted)] sm:text-xs">módulos principales</p>
              </div>
              <div className="border-l border-[var(--theme-border)] px-3 sm:px-5">
                <p className="font-mono text-2xl font-semibold tracking-tight text-[var(--theme-ink)]">{TOTAL_LESSONS.toString().padStart(2, '0')}</p>
                <p className="mt-1 text-[10px] leading-4 text-[var(--theme-muted)] sm:text-xs">unidades obligatorias</p>
              </div>
              <div className="border-l border-[var(--theme-border)] pl-3 sm:pl-5">
                <p className="font-mono text-2xl font-semibold tracking-tight text-[var(--theme-ink)]">100%</p>
                <p className="mt-1 text-[10px] leading-4 text-[var(--theme-muted)] sm:text-xs">Python en navegador</p>
              </div>
            </div>
          </div>

          <HeroIllustration />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full border border-[var(--theme-border)]/40" />
      </section>

      <section id="ruta" className="scroll-mt-8 border-b border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--theme-accent)] sm:text-xs">01 / EL RECORRIDO</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Cuatro módulos principales. Un proyecto para consolidar.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
              El recorrido base integra los cuatro módulos principales de Python Essentials 1, un proyecto final obligatorio y un examen global. Después puedes continuar con la extensión práctica opcional de archivos y persistencia.
            </p>
          </div>

          <div className="mt-10 grid border-y border-[var(--theme-border)] sm:grid-cols-2 xl:grid-cols-5">
            {courseCatalog.map((courseModule, index) => (
              <article
                key={courseModule.id}
                className="group flex min-h-[220px] flex-col border-b border-[var(--theme-border)] p-5 last:border-b-0 sm:odd:border-r sm:even:border-r-0 xl:border-b-0 xl:border-r xl:last:border-r-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[var(--theme-accent)]">`0${index + 1}`</span>
                  {courseModule.optional && (
                    <span className="border border-[var(--theme-accent)]/40 px-2 py-1 text-[9px] font-bold tracking-[0.14em] text-[var(--theme-accent)]">OPCIONAL</span>
                  )}
                  <span className="h-2 w-2 rounded-full border border-[var(--theme-border-dark)] transition-colors group-hover:bg-[var(--theme-accent)]" />
                </div>
                <h3 className="mt-8 text-lg font-semibold leading-snug tracking-tight">{courseModule.title}</h3>
                <p className="mt-3 text-xs leading-6 text-[var(--theme-muted)]">{courseModule.summary}</p>
                <p className="mt-auto border-t border-[var(--theme-border)]/60 pt-3 font-mono text-[10px] tracking-[0.12em] text-[var(--theme-muted)]">
                  {courseModule.lessons.length.toString().padStart(2, '0')} {courseModule.optional ? 'ACTIVIDADES' : 'LECCIONES DEL NÚCLEO'}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[var(--theme-muted)]">Contenido organizado para aprender con práctica, no de memoria.</p>
            <Link href="/academia" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--theme-accent)] underline underline-offset-4 hover:text-[var(--theme-accent-dark)]">
              Ver la academia <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="ejemplo" className="scroll-mt-8 mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <aside>
            <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--theme-accent)] sm:text-xs">02 / APRENDER HACIENDO</p>
            <h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              No solo leas código. Hazlo funcionar.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--theme-muted)] sm:text-base">
              Elige un ejemplo, cambia una instrucción y ejecútalo. Python corre en este dispositivo; no necesitas instalar un entorno de programación.
            </p>

            <div className="mt-8 border-t border-[var(--theme-border)]">
              <div className="flex items-center justify-between py-3">
                <span className="text-[10px] font-bold tracking-[0.18em] text-[var(--theme-muted)]">EJEMPLOS PARA PROBAR</span>
                <span className="font-mono text-[10px] text-[var(--theme-muted)]">06 / 06</span>
              </div>
              <div className="divide-y divide-[var(--theme-border)]">
                {beginnerFirstExamples.map((example, index) => (
                  <button
                    key={example.id}
                    type="button"
                    aria-pressed={selectedExample.id === example.id}
                    onClick={() => setSelectedExample(example)}
                    className={`group flex min-h-[76px] w-full items-start gap-4 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--theme-focus-ring)] ${selectedExample.id === example.id ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-ink)] hover:text-[var(--theme-accent)]'}`}
                  >
                    <span className="pt-0.5 font-mono text-[10px] text-[var(--theme-muted)]">0{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span className="font-semibold">{example.title}</span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--theme-muted)]">{example.level}</span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[var(--theme-muted)]">{example.description}</span>
                      <span className="mt-2 flex flex-wrap gap-1.5">
                        {example.concepts.map((concept) => (
                          <span key={concept} className="border border-[var(--theme-border)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--theme-muted)]">
                            {concept}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span aria-hidden="true" className="pt-0.5 text-sm opacity-0 transition-opacity group-hover:opacity-100 group-aria-pressed:opacity-100">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <PortadaLab key={selectedExample.id} defaultCode={selectedExample.code} />
            <p className="mt-3 text-right text-[10px] leading-5 text-[var(--theme-muted)]">
              Entorno educativo local en el navegador · Pyodide + Web Worker
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--theme-accent)] font-mono text-sm font-bold text-[var(--theme-ink-inverse)]">Py</span>
            <div>
              <p className="text-sm font-semibold">Python desde cero</p>
              <p className="mt-0.5 text-[10px] text-[var(--theme-muted)]">Material educativo propio e independiente.</p>
            </div>
          </div>
          <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--theme-muted)]">
            <Link href="/practica" className="inline-flex min-h-10 items-center underline underline-offset-4 hover:text-[var(--theme-ink)]">Laboratorio completo</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
