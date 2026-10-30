import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

type WorkerMessage = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error';
  output?: string;
  error?: string;
  turtle_commands?: Array<{ type: string; color?: string; x1?: number; y1?: number; x2?: number; y2?: number }>;
};

function createWorkerHarness({ withTurtle = false }: { withTurtle?: boolean } = {}) {
  const posted: WorkerMessage[] = [];
  let stdout: (message: string) => void = () => {};
  let stderr: (message: string) => void = () => {};
  let stdin = () => null as string | null;

  const turtleCommandProxy = {
    toJs: vi.fn((options: {
      dict_converter: (entries: Iterable<[string, unknown]>) => unknown;
      create_pyproxies: boolean;
    }) => [
      { type: 'line', x1: 0, y1: 0, x2: 25, y2: 40, color: 'lime' },
    ]),
    destroy: vi.fn(),
  };
  const getCommands = vi.fn(() => turtleCommandProxy);
  const clearCommands = vi.fn();
  const globals = {
    set: vi.fn(),
    get: vi.fn((name: string) => {
      if (name === 'get_commands') return getCommands;
      if (name === 'clear_commands') return clearCommands;
      return undefined;
    }),
  };

  const pyodide = {
    globals,
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
    fetch: withTurtle
      ? vi.fn(async () => ({
          ok: true,
          status: 200,
          text: async () => '# turtle compatibility test fixture',
        }))
      : undefined,
    loadPyodide: vi.fn(async () => pyodide),
    setTimeout,
    clearTimeout,
  });

  return { self, posted, pyodide, turtleCommandProxy, getCommands };
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

  it('convierte y libera los comandos Turtle antes de enviarlos a React', async () => {
    const harness = createWorkerHarness({ withTurtle: true });

    // La inicialización de Pyodide y la carga del módulo Turtle son asíncronas.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(harness.posted.some((message) => message.status === 'ready')).toBe(true);

    await harness.self.onmessage?.({
      data: { id: 8, code: 'draw-turtle', input: [] },
    });

    expect(harness.getCommands).toHaveBeenCalledOnce();
    const conversionOptions = harness.turtleCommandProxy.toJs.mock.calls[0]?.[0];
    expect(conversionOptions?.create_pyproxies).toBe(false);
    expect(typeof conversionOptions?.dict_converter).toBe('function');
    expect(
      (conversionOptions?.dict_converter([['type', 'line']]) as { type: string }).type,
    ).toBe('line');
    expect(harness.turtleCommandProxy.destroy).toHaveBeenCalledOnce();
    expect(harness.posted.find((message) => message.id === 8)?.turtle_commands).toEqual([
      { type: 'line', x1: 0, y1: 0, x2: 25, y2: 40, color: 'lime' },
    ]);
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
