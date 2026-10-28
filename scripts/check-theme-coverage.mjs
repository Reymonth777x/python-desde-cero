import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/USUARIO/python-pe1-academy/src';
const themesFile = 'c:/Users/USUARIO/python-pe1-academy/src/app/themes.css';

// Patrón para detectar colores hardcoded en clases de Tailwind arbitrarias
// o valores CSS directos
const hardcodedColorPatterns = [
  /bg-\[#[0-9a-fA-F]{3,6}\]/g,
  /text-\[#[0-9a-fA-F]{3,6}\]/g,
  /border-\[#[0-9a-fA-F]{3,6}\]/g,
  /focus:ring-\[#[0-9a-fA-F]{3,6}\]/g,
  /focus-visible:outline-\[#[0-9a-fA-F]{3,6}\]/g,
  /hover:bg-\[#[0-9a-fA-F]{3,6}\]/g,
  /hover:text-\[#[0-9a-fA-F]{3,6}\]/g,
  /divide-\[#[0-9a-fA-F]{3,6}\]/g,
  /border-\[rgba?\([^)]+\)\]/g,
  /bg-\[rgba?\([^)]+\)\]/g,
  /text-\[rgba?\([^)]+\)\]/g,
  /fill-\[#[0-9a-fA-F]{3,6}\]/g,
  /stroke-\[#[0-9a-fA-F]{3,6}\]/g,
];

// Patrones de colores CSS en style="" o style={{}}
const inlineStylePatterns = [
  /color:\s*#[0-9a-fA-F]{3,6}/g,
  /background:\s*#[0-9a-fA-F]{3,6}/g,
  /background-color:\s*#[0-9a-fA-F]{3,6}/g,
  /border-color:\s*#[0-9a-fA-F]{3,6}/g,
  /fill:\s*#[0-9a-fA-F]{3,6}/g,
  /stroke:\s*#[0-9a-fA-F]{3,6}/g,
];

// Clases de paleta Tailwind prohibidas (colores fijos con nombres)
const forbiddenTailwindClasses = [
  'bg-white',
  'bg-black',
  'bg-slate-',
  'bg-gray-',
  'bg-zinc-',
  'bg-neutral-',
  'bg-red-',
  'bg-orange-',
  'bg-amber-',
  'bg-yellow-',
  'bg-lime-',
  'bg-green-',
  'bg-emerald-',
  'bg-teal-',
  'bg-cyan-',
  'bg-sky-',
  'bg-blue-',
  'bg-indigo-',
  'bg-violet-',
  'bg-purple-',
  'bg-fuchsia-',
  'bg-pink-',
  'bg-rose-',
  'text-slate-',
  'text-gray-',
  'text-zinc-',
  'text-neutral-',
  'text-red-',
  'text-orange-',
  'text-amber-',
  'text-yellow-',
  'text-lime-',
  'text-green-',
  'text-emerald-',
  'text-teal-',
  'text-cyan-',
  'text-sky-',
  'text-blue-',
  'text-indigo-',
  'text-violet-',
  'text-purple-',
  'text-fuchsia-',
  'text-pink-',
  'text-rose-',
  'border-slate-',
  'border-gray-',
  'border-zinc-',
  'border-neutral-',
  'border-red-',
  'border-orange-',
  'border-amber-',
  'border-yellow-',
  'border-lime-',
  'border-green-',
  'border-emerald-',
  'border-teal-',
  'border-cyan-',
  'border-sky-',
  'border-blue-',
  'border-indigo-',
  'border-violet-',
  'border-purple-',
  'border-fuchsia-',
  'border-pink-',
  'border-rose-',
];

let violationCount = 0;
let fileCount = 0;
const violations = [];

function checkFile(filePath) {
  const relativePath = path.relative(srcDir, filePath);
  // Permitir themes.css (es el archivo de definición de tokens)
  if (relativePath === 'app/themes.css') return;

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  // Verificar patrones de colores hardcoded en clases Tailwind
  for (const pattern of hardcodedColorPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        violations.push(`${relativePath}: color fijo encontrado: ${match}`);
        violationCount++;
      }
    }
  }

  // Verificar estilos en línea con colores hex
  for (const pattern of inlineStylePatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        violations.push(`${relativePath}: estilo en línea con color fijo: ${match}`);
        violationCount++;
      }
    }
  }

  // Verificar clases de paleta Tailwind prohibidas
  for (const className of forbiddenTailwindClasses) {
    const regex = new RegExp(className, 'g');
    const matches = content.match(regex);
    if (matches) {
      for (const match of matches) {
        violations.push(`${relativePath}: clase Tailwind prohibida: ${match}`);
        violationCount++;
      }
    }
  }

  if (violations.length > 0 && fileCount === 0) {
    fileCount = 1;
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (['.tsx', '.ts', '.css'].includes(path.extname(entry.name))) {
      checkFile(fullPath);
    }
  }
}

walk(srcDir);

if (violationCount > 0) {
  console.error(`\n❌ check:theme-coverage falló — ${violationCount} color(es) fijo(s) encontrado(s):\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  console.error('\nReemplaza todos los colores fijos por var(--theme-*) en src/ (excepto themes.css).');
  process.exit(1);
} else {
  console.log('✅ check:theme-coverage pasó — sin colores fijos en src/ (excepto themes.css)');
  process.exit(0);
}
