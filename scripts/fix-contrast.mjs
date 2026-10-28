import fs from 'fs';
const path = 'c:/Users/USUARIO/python-pe1-academy/src/app/themes.css';
let content = fs.readFileSync(path, 'utf8');

// Fix border colors for contrast (need >= 3:1 with bg)
content = content.replace(/--theme-border: #d3d3c7;/g, '--theme-border: #b7a77d;');
content = content.replace(/--theme-border: #334155;/g, '--theme-border: #475569;');
content = content.replace(/--theme-border: #333333;/g, '--theme-border: #4d4d4d;');
content = content.replace(/--theme-border: #fbcfe8;/g, '--theme-border: #f0abfc;');

// Fix dark theme accent for white text contrast (need >= 4.5:1)
content = content.replace(/--theme-accent: #3b82f6;/g, '--theme-accent: #1e3a8a;');
content = content.replace(/--theme-accent-dark: #2563eb;/g, '--theme-accent-dark: #1e3a8a;');

// Fix dracula muted text contrast (need >= 4.5:1)
content = content.replace(/--theme-muted: #6272a4;/g, '--theme-muted: #a6adc8;');

// Fix hacker muted text contrast (need >= 4.5:1)
content = content.replace(/--theme-muted: #666666;/g, '--theme-muted: #888888;');

// Fix rosa warning contrast (need >= 3:1)
content = content.replace(/--theme-warning: #d97706;/g, '--theme-warning: #b45309;');

fs.writeFileSync(path, content, 'utf8');
console.log('Contrast fixes applied');
