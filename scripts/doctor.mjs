#!/usr/bin/env node
// scripts/doctor.mjs — Verificación de entorno de primera instalación
// Ejecutar con: npm run doctor

import { existsSync, statSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
let errores = 0;
let advertencias = 0;

function ok(msg) {
  console.log(`  ✅ ${msg}`);
}

function warn(msg) {
  advertencias++;
  console.log(`  ⚠️  ${msg}`);
}

function fail(msg) {
  errores++;
  console.log(`  ❌ ${msg}`);
}

function checkNodeVersion() {
  console.log('\n📦 Versión de Node.js:');
  const version = process.version;
  console.log(`    detectada: ${version}`);
  const major = parseInt(version.slice(1).split('.')[0], 10);
  if (major >= 20) {
    ok(`Node.js ${version} (requiere >= 20.9)`);
  } else {
    fail(`Node.js ${version} es demasiado antigua (requiere >= 20.9)`);
  }
}

function checkEnvLocal() {
  console.log('\n🔐 Archivo .env.local:');
  const envLocal = join(root, '.env.local');
  if (existsSync(envLocal)) {
    ok('.env.local existe');
  } else {
    fail('.env.local no existe. Copia .env.example y completa los valores.');
  }
}

function checkPorts() {
  console.log('\n🔌 Puertos 3000 y 3001:');
  for (const port of [3000, 3001]) {
    try {
      // Intento de conexión para ver si algo está escuchando
      execSync(`netstat -ano | findstr :${port}`, {
        stdio: 'pipe',
        windowsHide: true,
      });
      warn(`Puerto ${port}: parece estar en uso (proceso detectado por netstat)`);
    } catch {
      ok(`Puerto ${port}: libre`);
    }
  }
}

function checkDocker() {
  console.log('\n🐳 Docker:');
  try {
    execSync('docker --version', { stdio: 'pipe', windowsHide: true });
    ok('Docker está disponible');
  } catch {
    warn('Docker no está disponible. Supabase local no se puede levantar.');
  }
}

function checkSupabaseCLI() {
  console.log('\n🧰 Supabase CLI:');
  const supabaseBin = join(root, 'node_modules', '.bin', 'supabase.cmd');
  const supabaseJs = join(root, 'node_modules', '.bin', 'supabase');
  if (existsSync(supabaseBin) || existsSync(supabaseJs)) {
    ok('Supabase CLI está disponible (binario local)');
  } else {
    warn('Supabase CLI no está disponible. No se puede ejecutar `npx supabase start`.');
  }
}

function checkPyodideAssets() {
  console.log('\n🐍 Assets de Pyodide:');
  const pyodideDir = join(root, 'public', 'pyodide', '0.29.5', 'full');
  const pyodideJs = join(pyodideDir, 'pyodide.js');
  if (existsSync(pyodideJs)) {
    ok(`Pyodide presente en ${pyodideJs}`);
  } else {
    fail(`Pyodide FALTA en ${pyodideJs}. Ejecuta: npm install`);
  }
}

function checkMonacoAssets() {
  console.log('\n📝 Assets de Monaco Editor:');
  const monacoDir = join(root, 'public', 'monaco', 'vs');
  const monacoEditor = join(monacoDir, 'editor', 'editor.main.js');
  if (existsSync(monacoEditor)) {
    ok(`Monaco Editor presente en ${monacoEditor}`);
  } else {
    fail(`Monaco Editor FALTA en ${monacoEditor}. Ejecuta: npm install`);
  }
}

function checkNodeModules() {
  console.log('\n📦 node_modules:');
  const nm = join(root, 'node_modules');
  if (existsSync(nm)) {
    ok('node_modules presente');
  } else {
    fail('node_modules FALTA. Ejecuta: npm install');
  }
}

function checkNext() {
  console.log('\n⚡ Next.js:');
  const nextBin = join(root, 'node_modules', '.bin', 'next.cmd');
  const nextJs = join(root, 'node_modules', '.bin', 'next');
  if (existsSync(nextBin) || existsSync(nextJs)) {
    // Leer versión desde package.json de next
    const nextPkg = JSON.parse(
      readFileSync(join(root, 'node_modules', 'next', 'package.json'), 'utf8'),
    );
    ok(`Next.js ${nextPkg.version} (binario presente)`);
  } else {
    fail('Next.js no está instalado en node_modules.');
  }
}

function resumen() {
  console.log('\n' + '='.repeat(50));
  if (errores === 0 && advertencias === 0) {
    console.log('✅ Entorno listo. Ejecuta: npm run dev');
  } else {
    console.log(`❌ ${errores} error(es), ⚠️  ${advertencias} advertencia(es).`);
    console.log('   Corrige los errores antes de ejecutar npm run dev.');
  }
  console.log('='.repeat(50) + '\n');

  process.exit(errores > 0 ? 1 : 0);
}

console.log('🩺 Doctor — Verificación de entorno Python desde cero\n');
console.log('='.repeat(50));

checkNodeVersion();
checkNodeModules();
checkEnvLocal();
checkPorts();
checkDocker();
checkSupabaseCLI();
checkPyodideAssets();
checkMonacoAssets();
checkNext();

resumen();