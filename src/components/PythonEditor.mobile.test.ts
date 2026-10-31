import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./PythonEditor.tsx', import.meta.url), 'utf8');

describe('Flujo móvil del laboratorio', () => {
  it('presenta guía, editor, acción y resultado en una sola secuencia', () => {
    expect(source).toContain('Cómo usar este laboratorio');
    expect(source).toContain('data-testid="python-editor-frame"');
    expect(source).toContain('data-testid="python-run"');
    expect(source).toContain('data-testid="python-output"');
    expect(source).not.toContain('role="tablist"');
    expect(source).not.toContain('role="tabpanel"');
    expect(source).not.toContain('practice-tab-turtle');
    expect(source).not.toContain('activeMobilePanel');
    expect(source).not.toContain('editorRequested');
  });

  it('mantiene ayudas táctiles y el campo de entrada de input()', () => {
    expect(source).toContain('Teclas útiles en el móvil');
    expect(source).toContain('grid grid-cols-4 gap-2');
    expect(source).toContain('min-h-12 min-w-0');
    expect(source).toContain("accessible: 'Insertar corchetes'");
    expect(source).toContain("text: '[]'");
    expect(source).toContain('Datos que pide tu programa con input()');
    expect(source).toContain('Comprobar ejercicio');
    expect(source).toContain('Restaurar ejemplo');
  });

  it('no duplica el botón de ejecución y lleva al estudiante al resultado', () => {
    const runButtons = source.match(/data-testid="python-run"/g) ?? [];
    expect(runButtons).toHaveLength(1);
    expect(source).toContain("scrollIntoView({ behavior: 'smooth', block: 'start' })");
  });
});
