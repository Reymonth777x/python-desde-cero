import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/USUARIO/python-pe1-academy/src';

const replacements = [
  [/bg-\[#294936\]/g, 'bg-[var(--theme-accent)]'],
  [/focus:ring-\[#294936\]/g, 'focus:ring-[var(--theme-focus-ring)]'],
  [/focus-visible:outline-\[#b7a77d\]/g, 'focus-visible:outline-[var(--theme-border-dark)]'],
  [/text-\[#657267\]/g, 'text-[var(--theme-muted)]'],
  [/bg-\[#dce5d8\]/g, 'bg-[var(--theme-accent-light)]'],
  [/bg-\[#f4a261\]/g, 'bg-[var(--theme-warning)]'],
  [/bg-\[#e76f51\]/g, 'bg-[var(--theme-error)]'],
  [/bg-\[#fdf3f3\]/g, 'bg-[var(--theme-error-light)]'],
  [/bg-\[#294936\]\/20/g, 'bg-[var(--theme-accent)]/20'],
  [/border-\[#f4f2e9\]/g, 'border-[var(--theme-bg)]'],
];

const extensions = ['.tsx', '.ts', '.css'];
let fileCount = 0;
let replacementCount = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (extensions.includes(path.extname(entry.name))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      for (const [pattern, replacement] of replacements) {
        const matches = content.match(pattern);
        if (matches) {
          replacementCount += matches.length;
        }
        content = content.replace(pattern, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        fileCount++;
        console.log('Updated:', fullPath);
      }
    }
  }
}

walk(srcDir);
console.log('\n=== Summary ===');
console.log('Files updated:', fileCount);
console.log('Total replacements:', replacementCount);
