import fs from 'fs';
const path = 'c:/Users/USUARIO/python-pe1-academy/src/app/themes.css';
let content = fs.readFileSync(path, 'utf8');

// Dark theme: darker text on accent for 4.5:1 contrast
content = content.replace(
  /--theme-ink-inverse: #1e293b;/g,
  '--theme-ink-inverse: #0f172a;'
);

// Rosa: darker border for 3:1 contrast on #fdf2f8
content = content.replace(/--theme-border: #e879f9;/g, '--theme-border: #c026d3;');

fs.writeFileSync(path, content, 'utf8');
console.log('Contrast fixes v3 applied');
