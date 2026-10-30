import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

type TestResult = { index: number; expected: string; actual: string; passed: boolean; error?: string };
type WorkerMessage = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error';
  output?: string;
  error?: string;
  test_results?: TestResult[];
};

function createWorkerHarness() {
  const posted: WorkerMessage[] = [];
  let stdout: (message: string) => void = () => {};
  let stderr: (message: string) => void = () => {};
  let stdin = () => null as string | null;

  const pyodide = {
    globals: { get: vi.fn(() => undefined) },
    to_js: vi.fn((value: unknown) => value),
    setStdout: vi.fn((handler: { batched: (message: string) => void }) => { stdout = handler.batched; }),
    setStderr: vi.fn((handler: { batched: (message: string) => void }) => { stderr = handler.batched; }),
    setStdin: vi.fn((handler: { stdin: () => string | null }) => { stdin = handler.stdin; }),
    runPythonAsync: vi.fn(async (code: string) => {
      let userCode = code;
      const isolated = code.startsWith('exec(');
      if (isolated) {
        const jsonLiteral = code.slice('exec('.length, code.lastIndexOf(', {})'));
        userCode = JSON.parse(jsonLiteral) as string;
      }

      if (userCode === 'read-input') {
        stdout(`Read: ${stdin()}\n`);
      } else if (isolated && userCode.includes('input()')) {
        stdout(`${stdin()}\n`);
      } else if (userCode === 'raises') {
        stderr('warning before error\n');
        throw new Error('expected failure');
      } else if (userCode === 'large-output') {
        stdout('x'.repeat(25000));
      } else {
        const literal = userCode.match(/print\(["'](.*)["']\)/);
        stdout(`${literal?.[1] ?? 'ok'}\n`);
      }
    }),
  };

  const self = {
    onmessage: null as ((event: { data: Record<string, unknown> }) => Promise<void>) | null,
    postMessage: (message: WorkerMessage) => posted.push(message),
  };
  const workerSource = readFileSync(
    new URL('../../public/python-worker.js', import.meta.url),
    'utf8',
  );

  runInNewContext(workerSource, {
    self,
    console: { warn: vi.fn() },
    importScripts: vi.fn(),
    fetch: vi.fn(async () => ({ ok: true, text: async () => '' })),
    loadPyodide: vi.fn(async () => pyodide),
  });

  return { self, posted, pyodide };
}

async function settleWorkerInitialization() {
  for (let index = 0; index < 6; index += 1) await Promise.resolve();
}

describe('Python Web Worker', () => {
  it('espera a Pyodide y proporciona líneas de entrada a input()', async () => {
    const harness = createWorkerHarness();
    await settleWorkerInitialization();
    expect(harness.posted[0]?.status).toBe('ready');

    await harness.self.onmessage?.({ data: { id: 4, code: 'read-input', input: ['Ada'] } });

    expect(harness.posted.at(-1)).toMatchObject({
      id: 4, status: 'success', output: 'Read: Ada\n',
    });
  });

  it('conserva salida parcial en un error y limita la salida excesiva', async () => {
    const harness = createWorkerHarness();
    await harness.self.onmessage?.({ data: { id: 5, code: 'raises' } });
    expect(harness.posted.find((message) => message.id === 5)).toMatchObject({
      id: 5, status: 'error', output: 'warning before error\n', error: 'expected failure',
    });

    await harness.self.onmessage?.({ data: { id: 6, code: 'large-output' } });
    const cappedOutput = harness.posted.find((message) => message.id === 6)?.output ?? '';
    expect(cappedOutput.length).toBeLessThan(20100);
    expect(cappedOutput).toContain('Salida limitada');
  });

  it('comprueba cada caso de prueba con entradas independientes', async () => {
    const harness = createWorkerHarness();
    await harness.self.onmessage?.({
      data: {
        id: 8,
        code: 'print(input())',
        tests: [
          { input: ['Ada'], expected: 'Ada' },
          { input: ['Lin'], expected: 'Lin' },
        ],
      },
    });

    expect(harness.posted.find((message) => message.id === 8)).toMatchObject({
      id: 8,
      status: 'success',
      output: '2 de 2 pruebas superadas.',
      test_results: [
        { index: 1, expected: 'Ada', passed: true },
        { index: 2, expected: 'Lin', passed: true },
      ],
    });
  });

  it('rechaza programas que superan el límite sin ejecutarlos', async () => {
    const harness = createWorkerHarness();
    await harness.self.onmessage?.({ data: { id: 7, code: 'x'.repeat(50001) } });

    expect(harness.posted.find((message) => message.id === 7)).toMatchObject({
      id: 7, status: 'error',
    });
    expect(harness.pyodide.runPythonAsync).not.toHaveBeenCalled();
  });
});
