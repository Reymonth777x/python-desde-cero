# Archivo de Temas Visuales

Los siguientes temas fueron parte de la aplicación pero han sido archivados
para reducir la superficie de mantenimiento y enfocarse en los dos temas
principales: claro (`original`) y oscuro (`dark`).

## Tema Hacker

```css
[data-theme="hacker"] {
  color-scheme: dark;
  --theme-bg: #0a0a0a;
  --theme-bg-secondary: #141414;
  --theme-surface: #141414;
  --theme-ink: #00ff41;
  --theme-forest: #00ff41;
  --theme-forest-dark: #00cc33;
  --theme-accent: #00ff41;
  --theme-accent-dark: #00cc33;
  --theme-accent-light: #1a331a;
  --theme-muted: #666666;
  --theme-border: #333333;
  --theme-border-dark: #4d4d4d;
  --theme-text-secondary: #888888;
  --theme-success: #00ff41;
  --theme-error: #ff0044;
  --theme-warning: #ffaa00;
  --theme-paper: #141414;
  --theme-font-serif: 'Courier New', monospace;
  --theme-font-mono: 'Courier New', monospace;
}
```

## Tema Dracula

```css
[data-theme="dracula"] {
  color-scheme: dark;
  --theme-bg: #282a36;
  --theme-bg-secondary: #34354a;
  --theme-surface: #34354a;
  --theme-ink: #f8f8f2;
  --theme-forest: #bd93f9;
  --theme-forest-dark: #7a5af0;
  --theme-accent: #bd93f9;
  --theme-accent-dark: #7a5af0;
  --theme-accent-light: #44475a;
  --theme-muted: #6272a4;
  --theme-border: #6272a4;
  --theme-border-dark: #8be9fd;
  --theme-text-secondary: #6272a4;
  --theme-success: #50fa7b;
  --theme-error: #ff5555;
  --theme-warning: #f1fa8c;
  --theme-paper: #34354a;
  --theme-font-serif: 'Fira Code', Consolas, monospace;
  --theme-font-mono: 'Fira Code', Consolas, monospace;
}
```

## Tema Cyberpunk

```css
[data-theme="cyberpunk"] {
  color-scheme: dark;
  --theme-bg: #050510;
  --theme-bg-secondary: #0a0a1a;
  --theme-surface: #0a0a1a;
  --theme-ink: #00ffff;
  --theme-forest: #00ffff;
  --theme-forest-dark: #00b3b3;
  --theme-accent: #00ffff;
  --theme-accent-dark: #00b3b3;
  --theme-accent-light: #1a1a33;
  --theme-muted: #66ccff;
  --theme-border: #00ffff;
  --theme-border-dark: #008b8b;
  --theme-text-secondary: #99ffff;
  --theme-success: #00ffff;
  --theme-error: #ff00ff;
  --theme-warning: #ffff00;
  --theme-paper: #0a0a1a;
  --theme-font-serif: 'Share Tech Mono', monospace;
  --theme-font-mono: 'Share Tech Mono', monospace;
}
```

## Motivo del archivo

- Reducir la superficie de mantenimiento del CSS y del código de selección de temas.
- Enfocarse en los dos temas principales (claro y oscuro) que cubren las necesidades de accesibilidad y preferencia de la mayoría de los usuarios.
- Los temas archivados pueden restaurarse en el futuro si hay demanda.
