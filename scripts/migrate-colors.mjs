import fs from 'fs';
import path from 'path';

const srcDir = 'c:/Users/USUARIO/python-pe1-academy/src';

const replacements = [
  [/bg-\[#f4f2e9\]/g, 'bg-[var(--theme-bg)]'],
  [/bg-\[#ebe9df\]/g, 'bg-[var(--theme-bg-secondary)]'],
  [/bg-\[#ffffff\]/g, 'bg-[var(--theme-surface)]'],
  [/bg-\[#e5ecdf\]/g, 'bg-[var(--theme-accent-light)]'],
  [/bg-\[#f7e8df\]/g, 'bg-[var(--theme-warning-light)]'],
  [/bg-white/g, 'bg-[var(--theme-surface)]'],
  [/text-\[#252b25\]/g, 'text-[var(--theme-ink)]'],
  [/text-\[#294936\]/g, 'text-[var(--theme-accent)]'],
  [/text-\[#596259\]/g, 'text-[var(--theme-muted)]'],
  [/text-\[#8a9087\]/g, 'text-[var(--theme-muted)]'],
  [/text-\[#58645b\]/g, 'text-[var(--theme-muted)]'],
  [/text-\[#203d31\]/g, 'text-[var(--theme-accent-dark)]'],
  [/text-white/g, 'text-[var(--theme-ink-inverse)]'],
  [/text-\[#7f3027\]/g, 'text-[var(--theme-error)]'],
  [/text-\[#3f4940\]/g, 'text-[var(--theme-muted)]'],
  [/border-\[#d3d3c7\]/g, 'border-[var(--theme-border)]'],
  [/border-\[#294936\]/g, 'border-[var(--theme-accent)]'],
  [/border-\[#b7a77d\]/g, 'border-[var(--theme-border-dark)]'],
  [/border-\[#a04435\]/g, 'border-[var(--theme-error)]'],
  [/focus-visible:outline-\[#294936\]/g, 'focus-visible:outline-[var(--theme-focus-ring)]'],
  [/hover:bg-\[#203d31\]/g, 'hover:bg-[var(--theme-accent-dark)]'],
  [/hover:bg-\[#ebe9df\]/g, 'hover:bg-[var(--theme-bg-secondary)]'],
  [/hover:bg-\[#f4f2e9\]/g, 'hover:bg-[var(--theme-bg)]'],
  [/divide-\[#d3d3c7\]/g, 'divide-[var(--theme-border)]'],
  [/text-\[#a04435\]/g, 'text-[var(--theme-error)]'],
  [/text-\[#776945\]/g, 'text-[var(--theme-warning)]'],
  [/text-\[#be185d\]/g, 'text-[var(--theme-accent)]'],
  [/text-\[#9d174d\]/g, 'text-[var(--theme-accent-dark)]'],
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
