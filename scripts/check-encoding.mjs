import { readFileSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Patrón de caracteres mojibake comunes (UTF-8 interpretado como Latin-1)
const MOJIBAKE_PATTERN = /Ã[ƒ±°Â€™œ„â€]|â€\u009d|â€\u009c|\ufffd/;

// Extensiones de archivo a verificar
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.md', '.sql', '.py', '.json'];

// Directorios a excluir
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', '.cloudflare', 'monaco', 'pyodide', '.wrangler', 'supabase/.temp'];

let errors = 0;
let filesChecked = 0;

function checkFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');

    // Verificar BOM (Byte Order Mark)
    if (content.charCodeAt(0) === 0xFEFF) {
      console.error(`BOM detectado en: ${filePath}`);
      errors++;
    }

    // Verificar caracteres mojibake
    const mojibakeMatches = content.match(MOJIBAKE_PATTERN);
    if (mojibakeMatches) {
      console.error(`Mojibake detectado en: ${filePath} (${mojibakeMatches.length} ocurrencias)`);
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (MOJIBAKE_PATTERN.test(line)) {
          console.error(`  Línea ${i + 1}: ${line.trim().substring(0, 80)}`);
        }
      });
      errors++;
    }
  } catch (err) {
    console.error(`Error leyendo ${filePath}: ${err.message}`);
    errors++;
  }
}

function walkDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = entry.name.substring(entry.name.lastIndexOf('.'));
      if (EXTENSIONS.includes(ext)) {
        filesChecked++;
        checkFile(fullPath);
      }
    }
  }
}

walkDir(process.cwd());

console.log(`\nArchivos verificados: ${filesChecked}`);
console.log(`Errores encontrados: ${errors}`);

if (errors > 0) {
  console.error('\n❌ ERROR: Se encontraron problemas de codificación.');
  process.exit(1);
} else {
  console.log('✅ No se encontraron problemas de codificación.');
  process.exit(0);
}
