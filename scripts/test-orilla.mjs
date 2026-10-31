// Prueba el motor de Orilla con Pyodide real: las soluciones de referencia de
// los 15 tramos y los casos adversariales de tests/orilla/cases.json.
// Uso: npm run test:orilla (corre con tsx para poder leer los datos en TypeScript).
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';
import { TODOS_LOS_TRAMOS } from '../src/lib/orilla/catalog.ts';
import { construirPayload } from '../src/lib/orilla/chapters/index.ts';
import { MICROLECCIONES_ORILLA } from '../src/lib/orilla/lesson-content.ts';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leer = (...partes) => readFileSync(path.join(raiz, ...partes), 'utf8');

const pyodide = await loadPyodide();
// Mismo camino que public/python-worker.js: el módulo se escribe en el directorio de trabajo.
pyodide.FS.writeFile('/home/pyodide/orilla_engine.py', leer('public', 'orilla-engine.py'));
const motor = pyodide.pyimport('orilla_engine');

function ejecutar(id, codigo, notas) {
  const payload = construirPayload(id, notas);
  return JSON.parse(motor.run_json(codigo, JSON.stringify(payload)));
}

const fallos = [];
let total = 0;
const comprobar = (nombre, condicion, detalle = '') => {
  total += 1;
  if (!condicion) fallos.push(`${nombre}${detalle ? `: ${detalle}` : ''}`);
};

for (const id of TODOS_LOS_TRAMOS) {
  const leccion = MICROLECCIONES_ORILLA[id];
  const ejemplo = ejecutar(id, leccion.ejemplo);
  comprobar(`${id}: el ejemplo educativo pasa la compuerta Python`, ejemplo.gate.ok, JSON.stringify(ejemplo.gate));

  const r = ejecutar(id, leer('tests', 'orilla', 'solutions', `${id}.py`));
  comprobar(`${id}: la solución pasa la compuerta`, r.gate.ok, JSON.stringify(r.gate));
  if (!r.gate.ok) continue;
  const detalle = JSON.stringify(r.variants.map((v) => v.fail ?? v.error?.mensaje));
  comprobar(`${id}: la solución supera todas las variantes`, r.passed, detalle);
  if (id !== 'abierta') comprobar(`${id}: la solución saca 3 estrellas`, r.stars === 3, `estrellas ${r.stars}`);
}

const largo = ejecutar('c01', 'avanzar()\n'.repeat(3000));
comprobar('un programa de más de 20000 caracteres se rechaza', !largo.gate.ok);

const casos = JSON.parse(leer('tests', 'orilla', 'cases.json'));
for (const caso of casos) {
  const e = caso.expect;
  const r = ejecutar(caso.chapter, caso.code, e.notas);
  const nombre = `caso «${caso.name}»`;
  if ('gate' in e) comprobar(nombre, r.gate.ok === e.gate, JSON.stringify(r.gate));
  if (!r.gate.ok) {
    if (e.gateContains) comprobar(nombre, r.gate.mensaje.includes(e.gateContains), r.gate.mensaje);
    if (e.leccion) comprobar(nombre, r.gate.leccion === e.leccion, String(r.gate.leccion));
    continue;
  }
  if ('passed' in e) comprobar(nombre, r.passed === e.passed, `passed ${r.passed}`);
  if ('stars' in e) comprobar(nombre, r.stars === e.stars, `estrellas ${r.stars}`);
  if (e.errorTipo) comprobar(nombre, r.error?.tipo === e.errorTipo, JSON.stringify(r.error));
  if (e.errorContains) comprobar(nombre, r.error?.mensaje.includes(e.errorContains), r.error?.mensaje);
  if (e.failContains) {
    comprobar(nombre, r.variants.some((v) => (v.fail ?? '').includes(e.failContains)), JSON.stringify(r.variants.map((v) => v.fail)));
  }
}

if (fallos.length > 0) {
  console.error(`Orilla: ${fallos.length} de ${total} comprobaciones fallaron:`);
  for (const f of fallos) console.error(` - ${f}`);
  process.exit(1);
}
console.log(`Orilla: ${total} comprobaciones correctas.`);
