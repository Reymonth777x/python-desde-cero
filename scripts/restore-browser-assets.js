import { mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function copyRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    if (statSync(s).isDirectory()) {
      copyRecursive(s, d);
    } else {
      copyFileSync(s, d);
    }
  }
}

const root = process.cwd();

// Pyodide desde node_modules/pyodide (versión fija en package.json)
const pyodideSrc = join(root, 'node_modules', 'pyodide', 'full');
const pyodideDest = join(root, 'public', 'pyodide', '0.29.5', 'full');
try {
  copyRecursive(pyodideSrc, pyodideDest);
  console.log('[postinstall] Pyodide copiado a public/pyodide/0.29.5/full/');
} catch (err) {
  console.warn('[postinstall] No se pudo copiar Pyodide:', err.message);
}

// Monaco Editor desde node_modules/monaco-editor (versión en package.json)
const monacoSrc = join(root, 'node_modules', 'monaco-editor', 'min', 'vs');
const monacoDest = join(root, 'public', 'monaco', 'vs');
try {
  copyRecursive(monacoSrc, monacoDest);
  console.log('[postinstall] Monaco Editor copiado a public/monaco/vs/');
} catch (err) {
  console.warn('[postinstall] No se pudo copiar Monaco Editor:', err.message);
}

console.log('[postinstall] Restauración de assets del navegador completada.');