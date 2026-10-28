import fs from 'fs';
const path = 'c:/Users/USUARIO/python-pe1-academy/src/app/themes.css';
let content = fs.readFileSync(path, 'utf8');

// Fix border colors for contrast (need >= 3:1 with bg)
// Original: darker border
content = content.replace(/--theme-border: #b7a77d;/g, '--theme-border: #9c865e;');
// Dark: lighter border
content = content.replace(/--theme-border: #475569;/g, '--theme-border: #64748b;');
// Hacker: lighter border
content = content.replace(/--theme-border: #4d4d4d;/g, '--theme-border: #666666;');
// Rosa: darker border
content = content.replace(/--theme-border: #f0abfc;/g, '--theme-border: #e879f9;');

// Fix dark theme: revert accent to visible blue, but use dark text on accent buttons
content = content.replace(/--theme-accent: #1e3a8a;/g, '--theme-accent: #3b82f6;');
content = content.replace(/--theme-accent-dark: #1e3a8a;/g, '--theme-accent-dark: #2563eb;');
// Dark theme ink-inverse should be dark text for readable buttons
content = content.replace(
  /\[data-theme="dark"\]\s*\{[\s\S]*?--theme-ink-inverse: #ffffff;/g,
  match => match.replace('--theme-ink-inverse: #ffffff', '--theme-ink-inverse: #1e293b')
);

fs.writeFileSync(path, content, 'utf8');
console.log('Contrast fixes v2 applied');
