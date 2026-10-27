'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/app/theme-provider';
import ThemeSelector from '@/components/ThemeSelector';
import PortadaLab from '@/components/PortadaLab';

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
    description: 'Dibuja un árbol fractal recursivo con ramas principales y ramas más pequeñas en blanco y verde lima.',
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
    description: 'Dibuja una espiral que crece progresivamente usando un bucle y un ángulo cercano a 90°.',
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
    description: 'Dibuja 36 círculos rotados progresivamente para crear un patrón floral.',
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
    description: 'Dibuja una espiral matemática usando funciones seno y coseno.',
  },
  {
    id: 'texto-interactivo',
    title: 'Saludo interactivo',
    subtitle: 'Entrada y cadenas',
    level: 'Principiante',
    concepts: ['input()', 'cadenas', 'variables'],
    code: `nombre = input("¿Cómo te llamas? ")
print("Hola, " + nombre + "!")
print("Bienvenido a Python desde cero.")`,
    description: 'Programa que pide tu nombre por entrada y te saluda personalmente.',
  },
  {
    id: 'reto-logica',
    title: 'Reto de lógica',
    subtitle: 'Condiciones y comparaciones',
    level: 'Intermedio',
    concepts: ['condicionales', 'operadores de comparación'],
    code: `edad = int(input("¿Cuántos años tienes? "))

if edad >= 18:
    print("Eres mayor de edad.")
elif edad >= 13:
    print("Eres adolescente.")
else:
    print("Eres un niño.")`,
    description: 'Programa que clasifica la edad de una persona usando condiciones.',
  },
];

export default function Home() {
  const [selectedExample, setSelectedExample] = useState(EXAMPLES[0]);
  useTheme();

  return (
    <main className="min-h-screen bg-[#f4f2e9] text-[#252b25]">
      <header className="border-b border-[#d3d3c7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="Python desde cero, inicio">
            <span className="flex h-10 w-10 items-center justify-center bg-[#294936] font-serif text-xl text-white">
              Py
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">PYTHON</span>
              <span className="block text-xs tracking-[0.16em] text-[#657267]">DESDE CERO</span>
            </span>
          </Link>

          <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#596259]">
            <a href="#ruta" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">Ruta formativa</a>
            <a href="#ejemplo" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">Ejemplo de Python</a>
            <Link href="/academia" className="inline-flex min-h-11 items-center font-semibold text-[#294936] underline underline-offset-4">Academia</Link>
            <Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-[#294936] underline underline-offset-4">Iniciar sesión</Link>
          </nav>

          <ThemeSelector />
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#294936]">PYTHON DESDE CERO / RUTA DE APRENDIZAJE</p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Aprende Python, una idea clara a la vez.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#58645b] sm:text-lg">
            Una ruta pr&aacute;ctica para comprender los fundamentos, escribir tus primeros programas y avanzar con confianza.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#ruta" className="inline-flex min-h-12 items-center justify-center bg-[#294936] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#203d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294936]">
              Explorar la ruta
            </a>
            <Link href="/academia" className="inline-flex min-h-12 items-center justify-center border border-[#294936] px-6 py-3 text-sm font-semibold text-[#294936] transition-colors hover:bg-[#ebe9df]">
              Entrar a la academia
            </Link>
          </div>
        </div>

        <aside className="border-l-2 border-[#b7a77d] bg-white/70 p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-[#776945]">APRENDER / PRACTICAR / AVANZAR</p>
          <p className="mt-5 font-serif text-2xl leading-snug text-[#252b25]">
            De los primeros valores al pensamiento algor&iacute;tmico.
          </p>
          <p className="mt-4 text-sm leading-7 text-[#596259]">
            Cada m&oacute;dulo suma una herramienta. El editor ejecutable y el guardado de avance est&aacute;n en el laboratorio.
          </p>
          <a href="#ejemplo" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#294936] underline underline-offset-4">
            Ver un ejemplo ilustrativo
          </a>
        </aside>
      </section>

      <section id="ruta" className="border-y border-[#d3d3c7] bg-[#ebe9df]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.18em] text-[#294936]">RUTA FORMATIVA / M&Oacute;DULOS 01 Y 02</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Una base s&oacute;lida, paso a paso.</h2>
            <p className="mt-4 leading-7 text-[#596259]">
              Empieza con datos y operaciones; despu&eacute;s, usa la l&oacute;gica para decidir y repetir acciones.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <article className="border-t-2 border-[#294936] bg-[#f4f2e9] p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.16em] text-[#294936]">M&Oacute;DULO 01 / FUNDAMENTOS</p>
              <h3 className="mt-4 font-serif text-2xl">Variables y operadores</h3>
              <p className="mt-3 text-sm leading-7 text-[#596259]">
                Da nombre a los datos, guarda valores y combina operaciones para resolver problemas sencillos.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#252b25]">
                <li>Variables, asignaci&oacute;n y tipos de datos</li>
                <li>Operadores aritm&eacute;ticos y orden de operaciones</li>
                <li>Mostrar resultados con <code className="font-mono text-[#294936]">print()</code></li>
              </ul>
            </article>

            <article className="border-t-2 border-[#b7a77d] bg-[#f4f2e9] p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.16em] text-[#776945]">M&Oacute;DULO 02 / CONTROL DE FLUJO</p>
              <h3 className="mt-4 font-serif text-2xl">Decisiones y ciclos</h3>
              <p className="mt-3 text-sm leading-7 text-[#596259]">
                Construye programas que responden a condiciones y repiten tareas de forma organizada.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#252b25]">
                <li>Condiciones con <code className="font-mono text-[#294936]">if</code>, <code className="font-mono text-[#294936]">elif</code> y <code className="font-mono text-[#294936]">else</code></li>
                <li>Repetici&oacute;n con ciclos <code className="font-mono text-[#294936]">for</code> y <code className="font-mono text-[#294936]">while</code></li>
                <li>Dividir un problema en instrucciones peque&ntilde;as</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="ejemplo" className="mx-auto max-w-7xl px-5 py-14 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 flex-shrink-0">
            <p className="text-xs font-bold tracking-[0.18em] text-[#294936]">
              LABORATORIO INTERACTIVO
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Ejecuta código Python ahora
            </h2>
            <p className="mt-4 leading-7 text-[#596259]">
              Cambia de ejemplo, edita el código y pulsa Ejecutar para ver el
              resultado en tiempo real.
            </p>
            <div className="mt-6 space-y-3">
              {EXAMPLES.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => setSelectedExample(example)}
                  className={`flex w-full items-start gap-3 px-4 py-3 rounded-lg border transition-colors text-left ${
                    selectedExample.id === example.id
                      ? 'border-[#294936] bg-[#ebe9df] shadow-sm'
                      : 'border-transparent hover:border-[#d3d3c7] hover:bg-[#f4f2e9]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[#252b25]">
                        {example.title}
                      </span>
                      <span className="text-[10px] font-bold text-[#294936] uppercase tracking-[0.2em]">
                        {example.level}
                      </span>
                    </div>
                    <p className="text-xs text-[#596259] mt-1">
                      {example.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {example.concepts.map((c) => (
                        <span key={c} className="text-[10px] px-1.5 py-0.5 bg-[#dce5d8] text-[#294936] rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:w-2/3">
            <PortadaLab defaultCode={selectedExample.code} />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d3d3c7]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-[#596259] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>Python desde cero</p>
            <p className="mt-1 max-w-xl text-xs leading-5">
              Material educativo propio e independiente; no es oficial ni está afiliado a Cisco Networking Academy o Cisco.
            </p>
          </div>
          <div className="flex gap-5">
            <Link href="/login" className="inline-flex min-h-11 items-center underline underline-offset-4">Acceso de estudiantes</Link>
            <Link href="/practica" className="inline-flex min-h-11 items-center underline underline-offset-4">Laboratorio</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
