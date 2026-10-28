import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

type WorkerMessage = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error';
  output?: string;
  error?: string;
};

function createWorkerHarness() {
  const posted: WorkerMessage[] = [];
  let stdout: (message: string) => void = () => {};
  let stderr: (message: string) => void = () => {};
  let stdin = () => null as string | null;

  const pyodide = {
    setStdout: vi.fn((handler: { batched: (message: string) => void }) => {
      stdout = handler.batched;
    }),
    setStderr: vi.fn((handler: { batched: (message: string) => void }) => {
      stderr = handler.batched;
    }),
    setStdin: vi.fn((handler: { stdin: () => string | null }) => {
      stdin = handler.stdin;
    }),
    runPythonAsync: vi.fn(async (code: string) => {
      if (code === 'read-input') {
        stdout(`Read: ${stdin()}\n`);
      } else if (code === 'raises') {
        stderr('warning before error\n');
        throw new Error('expected failure');
      } else if (code === 'large-output') {
        stdout('x'.repeat(25000));
      } else {
        stdout('ok\n');
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
    importScripts: vi.fn(),
    loadPyodide: vi.fn(async () => pyodide),
    setTimeout,
    clearTimeout,
  });

  return { self, posted, pyodide };
}

describe('Python Web Worker', () => {
  it('espera a Pyodide y proporciona líneas de entrada a input()', async () => {
    const harness = createWorkerHarness();
    await Promise.resolve();
    expect(harness.posted[0]?.status).toBe('ready');

    await harness.self.onmessage?.({
      data: { id: 4, code: 'read-input', input: ['Ada'] },
    });

    expect(harness.posted.at(-1)).toEqual({
      id: 4,
      status: 'success',
      output: 'Read: Ada\n',
      error: undefined,
    });
  });

  it('conserva salida parcial en un error y limita la salida excesiva', async () => {
    const harness = createWorkerHarness();

    await harness.self.onmessage?.({ data: { id: 5, code: 'raises' } });
    expect(harness.posted.find((message) => message.id === 5)).toMatchObject({
      id: 5,
      status: 'error',
      output: 'warning before error\n',
      error: 'expected failure',
    });

    await harness.self.onmessage?.({ data: { id: 6, code: 'large-output' } });
    const cappedOutput = harness.posted.find((message) => message.id === 6)?.output ?? '';
    expect(cappedOutput.length).toBeLessThan(20100);
    expect(cappedOutput).toContain('Salida limitada');
  });

  it('rechaza programas que superan el límite sin ejecutarlos', async () => {
    const harness = createWorkerHarness();
    await harness.self.onmessage?.({ data: { id: 7, code: 'x'.repeat(50001) } });

    expect(harness.posted.find((message) => message.id === 7)).toMatchObject({
      id: 7,
      status: 'error',
    });
    expect(harness.pyodide.runPythonAsync).not.toHaveBeenCalled();
  });
});
