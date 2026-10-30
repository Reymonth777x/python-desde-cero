import { describe, expect, it } from 'vitest';
import { resolvePythonRunnerOrigin, sanitizeTurtleCommands } from './python-runner-protocol';

describe('origen del ejecutor Python', () => {
  it('acepta un origen workers.dev HTTPS independiente', () => {
    expect(
      resolvePythonRunnerOrigin(
        'https://python-desdecero-runner.account.workers.dev',
        'https://python-desdecero.com',
      ),
    ).toBe('https://python-desdecero-runner.account.workers.dev');
  });

  it('acepta loopback HTTP para pruebas locales', () => {
    expect(
      resolvePythonRunnerOrigin('http://127.0.0.1:8788', 'http://localhost:3000'),
    ).toBe('http://127.0.0.1:8788');
  });

  it('rechaza mismo origen, HTTP remoto, paths y URL malformada', () => {
    expect(
      resolvePythonRunnerOrigin('https://python-desdecero.com', 'https://python-desdecero.com'),
    ).toBeNull();
    expect(
      resolvePythonRunnerOrigin('http://runner.example.com', 'https://python-desdecero.com'),
    ).toBeNull();
    expect(
      resolvePythonRunnerOrigin('https://runner.example.com/path', 'https://python-desdecero.com'),
    ).toBeNull();
    expect(resolvePythonRunnerOrigin('not a url', 'https://python-desdecero.com')).toBeNull();
  });
});

describe('sanitización de resultados Turtle del ejecutor remoto', () => {
  it('conserva comandos gráficos permitidos y elimina colores con URL', () => {
    const result = sanitizeTurtleCommands([
      { type: 'line', x1: 0, y1: 1, x2: 2, y2: 3, color: 'lime', size: 2 },
      { type: 'dot', x: 4, y: 5, color: 'url(https://evil.example/x)' },
      { type: 'script', text: '<script>alert(1)</script>' },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ type: 'line', color: 'lime', size: 2 });
    expect(result[1]).toMatchObject({ type: 'dot', color: 'black' });
  });

  it('limita coordenadas, texto y el número de comandos', () => {
    const result = sanitizeTurtleCommands([
      { type: 'write', x: 9_999_999, y: 2, text: 'x'.repeat(1500), color: '#fff' },
      ...Array.from({ length: 5001 }, () => ({ type: 'dot', x: 1, y: 2 })),
    ]);

    expect(result).toHaveLength(5000);
    expect(result[0].x).toBeUndefined();
    expect(result[0].text).toHaveLength(1000);
  });
});
