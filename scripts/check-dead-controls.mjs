#!/usr/bin/env node
// Script de detección de controles muertos (botones/enlaces sin función).
// Recorre componentes React y reporta elementos interactivos sin onClick/action.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXTENSIONS = ['.tsx', '.ts'];
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];

// Patrones que indican un control "vivo" (tiene manejador de evento)
const LIVE_PATTERNS = [
  /onClick\s*=/,
  /onSubmit\s*=/,
  /onChange\s*=/,
  /onKeyDown\s*=/,
  /action\s*=/,
  /href\s*=/,
  /formAction\s*=/,
];

let filesChecked = 0;
let potentialDeadControls = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Buscar botones y enlaces
  const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const buttonTag = match[0];
    const buttonText = match[1].trim();

    // Verificar si tiene onClick o formAction
    if (!LIVE_PATTERNS.some(p => p.test(buttonTag))) {
      // Excluir botones de submit dentro de forms (se manejan por el form)
      if (!buttonTag.includes('type="submit"') && !buttonTag.includes('type=\'submit\'')) {
        issues.push(`  <button>${buttonText.substring(0, 60)}</button> sin onClick`);
        potentialDeadControls++;
      }
    }
  }

  // Buscar enlaces <a> sin href
  const linkRegex = /<a[^>]*>([\s\S]*?)<\/a>/g;
  while ((match = linkRegex.exec(content)) !== null) {
    const linkTag = match[0];
    if (!/href\s*=/i.test(linkTag)) {
      issues.push(`  <a>${match[1].trim().substring(0, 60)}</a> sin href`);
      potentialDeadControls++;
    }
  }

  if (issues.length > 0) {
    console.log(`\n⚠️  ${filePath}`);
    issues.forEach(i => console.log(i));
  }

  filesChecked++;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        checkFile(fullPath);
      }
    }
  }
}

console.log('🔍 Verificando controles muertos (botones/enlaces sin función)...\n');
walkDir(path.join(ROOT, 'src'));

console.log(`\n📊 Resumen: ${filesChecked} archivos revisados, ${potentialDeadControls} control${potentialDeadControls !== 1 ? 'es' : ''} potencialmente sin función`);
console.log('ℹ️  Revisar manualmente: algunos controles pueden tener lógica externa no detectable estáticamente.');