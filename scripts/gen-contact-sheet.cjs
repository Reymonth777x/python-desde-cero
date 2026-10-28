const fs = require("fs");
const path = "c:/Users/USUARIO/python-pe1-academy/docs/informes/h1-temas/index.html";

const themes = ["original", "dark", "dracula", "cyberpunk", "hacker", "rosa"];
const pages = [
  { name: "Portada", url: "/" },
  { name: "Login", url: "/login" },
  { name: "Academia", url: "/academia" },
  { name: "Lección", url: "/academia/module-1/lesson-1" },
  { name: "Laboratorio", url: "/practica" },
  { name: "404", url: "/404" },
  { name: "500", url: "/500" },
  { name: "Sin conexión", url: "/offline" },
];
const sizes = [
  { label: "Móvil 360", width: 360, height: 800 },
  { label: "Tablet 768", width: 768, height: 1024 },
  { label: "Escritorio 1440", width: 1440, height: 900 },
];

let html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hoja de contactos — Temas H1</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; color: #111; padding: 20px; }
  h1 { font-size: 1.5rem; margin-bottom: 1rem; }
  h2 { font-size: 1.25rem; margin: 2rem 0 1rem; border-bottom: 2px solid #333; padding-bottom: 0.25rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .card { border: 1px solid #ccc; border-radius: 8px; overflow: hidden; background: #fff; }
  .card-header { padding: 0.5rem 0.75rem; font-size: 0.875rem; font-weight: 600; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
  .frame { width: 100%; height: 170px; background: #000; display: flex; align-items: center; justify-content: center; color: #666; font-size: 0.7rem; }
  .theme-badge { font-size: 0.7rem; padding: 0.15rem 0.4rem; border-radius: 4px; background: #333; color: #fff; }
  .legend { margin: 2rem 0 1rem; font-size: 0.875rem; color: #555; }
  .theme-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
  .theme-chip { width: 20px; height: 20px; border-radius: 4px; border: 1px solid #999; flex-shrink: 0; }
</style>
</head>
<body>
<h1>Hoja de contactos — Sistema de temas H1</h1>
<p>Todas las páginas × 6 temas × 3 tamaños de pantalla (móvil 360, tablet 768, escritorio 1440).</p>

<div class="legend">
  <strong>Temas:</strong>
  <div class="theme-row">
    <div class="theme-chip" style="background:#f4f2e9" title="Original"></div> Original
    <div class="theme-chip" style="background:#0f172a" title="Oscuro"></div> Oscuro
    <div class="theme-chip" style="background:#282a36" title="Drácula"></div> Drácula
    <div class="theme-chip" style="background:#050510" title="Cyberpunk"></div> Cyberpunk
    <div class="theme-chip" style="background:#0a0a0a" title="Hacker"></div> Hacker
    <div class="theme-chip" style="background:#fdf2f8" title="Rosa"></div> Rosa
  </div>
</div>

<h2>Resumen de cobertura</h2>
<ul>
  <li><strong>Páginas:</strong> ${pages.length}</li>
  <li><strong>Temas:</strong> ${themes.length}</li>
  <li><strong>Tamaños de pantalla:</strong> ${sizes.length}</li>
  <li><strong>Total de vistas:</strong> ${pages.length * themes.length * sizes.length}</li>
</ul>

<h2>Vistas por página</h2>
<div class="grid">`;

for (const page of pages) {
  for (const theme of themes) {
    for (const size of sizes) {
      html += `
        <div class="card">
          <div class="card-header">
            <span>${page.name}</span>
            <span class="theme-badge">${theme}</span>
          </div>
          <div class="frame">
            [Vista previa: ${page.name} · ${theme} · ${size.label}]
          </div>
          <div style="padding: 0.5rem 0.75rem; font-size: 0.75rem; color: #666; border-top: 1px solid #eee;">
            URL: <code>${page.url}</code> · Tema: ${theme} · Pantalla: ${size.label} (${size.width}×${size.height})
          </div>
        </div>
      `;
    }
  }
}

html += `</div>
</body>
</html>`;

fs.writeFileSync(path, html, "utf8");
console.log("Hoja de contactos generada:", path);
