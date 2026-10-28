import fs from 'fs';
const path = 'c:/Users/USUARIO/python-pe1-academy/src/app/themes.css';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\\n/g, '\n');
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed all \\n sequences');
