import fs from 'fs';

const themesFile = 'c:/Users/USUARIO/python-pe1-academy/src/app/themes.css';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getLuminance(r, g, b) {
  const sRgb = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRgb[0] + 0.7152 * sRgb[1] + 0.0722 * sRgb[2];
}

function contrastRatio(color1, color2) {
  const l1 = getLuminance(color1.r, color1.g, color1.b);
  const l2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseThemeColors(css, themeName) {
  const themeBlockRegex = new RegExp(`\\[data-theme="${themeName}"\\]\\s*\\{([^}]+)\\}`);
  const match = css.match(themeBlockRegex);
  if (!match) return null;

  const declarations = match[1];
  const colors = {};
  for (const decl of declarations.split(';')) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const name = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    if (value.startsWith('#')) {
      colors[name] = value;
    }
  }
  return colors;
}

function main() {
  const css = fs.readFileSync(themesFile, 'utf8');
  const themes = ['original', 'dark', 'dracula', 'cyberpunk', 'hacker', 'rosa'];

  const pairs = [
    { name: 'texto principal sobre fondo', fg: '--theme-ink', bg: '--theme-bg', minRatio: 4.5 },
    { name: 'texto atenuado sobre fondo', fg: '--theme-muted', bg: '--theme-bg', minRatio: 4.5 },
    { name: 'borde sobre fondo', fg: '--theme-border', bg: '--theme-bg', minRatio: 3.0 },
    { name: 'accent sobre fondo (botón)', fg: '--theme-accent', bg: '--theme-bg', minRatio: 3.0 },
    { name: 'texto inverso sobre accent', fg: '--theme-ink-inverse', bg: '--theme-accent', minRatio: 4.5 },
    { name: 'éxito sobre fondo', fg: '--theme-success', bg: '--theme-bg', minRatio: 3.0 },
    { name: 'error sobre fondo', fg: '--theme-error', bg: '--theme-bg', minRatio: 3.0 },
    { name: 'advertencia sobre fondo', fg: '--theme-warning', bg: '--theme-bg', minRatio: 3.0 },
  ];

  let failureCount = 0;

  for (const theme of themes) {
    const colors = parseThemeColors(css, theme);
    if (!colors) {
      console.error(`❌ Tema "${theme}" no encontrado en themes.css`);
      failureCount++;
      continue;
    }

    for (const pair of pairs) {
      const fg = colors[pair.fg];
      const bg = colors[pair.bg];
      if (!fg || !bg) continue;

      const fgRgb = hexToRgb(fg);
      const bgRgb = hexToRgb(bg);
      if (!fgRgb || !bgRgb) continue;

      const ratio = contrastRatio(fgRgb, bgRgb);
      const status = ratio >= pair.minRatio ? '✅' : '❌';

      if (ratio < pair.minRatio) {
        failureCount++;
        console.error(
          `${status} [${theme}] ${pair.name}: ${fg} sobre ${bg} = ${ratio.toFixed(2)}:1 (mínimo ${pair.minRatio}:1)`,
        );
      } else {
        console.log(
          `${status} [${theme}] ${pair.name}: ${fg} sobre ${bg} = ${ratio.toFixed(2)}:1`,
        );
      }
    }
  }

  console.log(`\n${failureCount === 0 ? '✅' : '❌'} check:contrast ${failureCount === 0 ? 'pasó' : 'falló'} — ${failureCount} par(es) por debajo del umbral WCAG`);
  process.exit(failureCount === 0 ? 0 : 1);
}

main();
