import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const PROHIBITED_TERMS = [
  'Cisco',
  'Networking Academy',
  'PE1',
  'PCEP',
  'Python Essentials',
  'python-pe1-academy',
];

// Solo se escanean archivos de código fuente y configuración
const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.css', '.html', '.json', '.toml', '.mjs'];
const SKIP_DIRS = ['node_modules', '.next', '.git', '.cloudflare', '.wrangler', 'test-results', 'playwright-report', 'docs', 'scripts'];
const SKIP_FILES = ['package-lock.json'];

let found = false;

function scanDir(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) {
        scanDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf('.'));
      if (!INCLUDE_EXTENSIONS.includes(ext)) continue;
      if (SKIP_FILES.includes(entry.name)) continue;
      try {
        const content = readFileSync(fullPath, 'utf8');
        for (const term of PROHIBITED_TERMS) {
          if (content.includes(term)) {
            console.error(`❌ Término prohibido "${term}" encontrado en: ${fullPath}`);
            found = true;
          }
        }
      } catch {
        // Ignorar archivos no legibles
      }
    }
  }
}

scanDir(process.cwd());

if (found) {
  console.error('\n❌ Se encontraron términos prohibidos en archivos de origen. Elimínalos antes de continuar.');
  process.exit(1);
} else {
  console.log('✅ No se encontraron términos prohibidos en archivos de origen. Originalidad verificada.');
  process.exit(0);
}
