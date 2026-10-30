import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

type WorkerMessage = {
  id?: number;
  status: 'ready' | 'init-error' | 'success' | 'error' | 'stopped';
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
    }) => {
      options.dict_converter([['type', 'line']]);
      return [
        { type: 'line', x1: 0, y1: 0, x2: 25, y2: 40, color: 'lime' },
      ];
    }),
    destroy: vi.fn(),
  };
  const getCommands = vi.fn(() => turtleCommandProxy);
  const clearCommands = vi.fn();
  const globals = {
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
        stdout('Read: ' + stdin() + '\n');
      } else if (code === 'raises') {
        stderr('warning before error\n');
        throw new Error('expected failure');
      } else if (code === 'large-output') {
        stdout('x'.repeat(25000));
      } else if (code === 'draw-turtle') {
        stdout('drawing\n');
      } else {
        stdout('ok\n');
      }
    }),
  };

  const workerPort = {
    onmessage: null as ((event: { data: Record<string, unknown> }) => void) | null,
    onmessageerror: null as (() => void) | null,
    postMessage: (message: WorkerMessage) => posted.push(message),
    start: vi.fn(),
    close: vi.fn(),
  };
  const self = {
    onmessage: null as ((event: { data: Record<string, unknown>; ports?: unknown[] }) => void) | null,
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
      : vi.fn(async () => ({ ok: false, status: 404, text: async () => '' })),
    loadPyodide: vi.fn(async () => pyodide),
    console: { warn: vi.fn() },
    Object,
    String,
    Array,
    Number,
    Promise,
    Error,
  });

  async function connect() {
    self.onmessage?.({ data: { type: 'connect' }, ports: [workerPort] });
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  async function execute(message: Record<string, unknown>) {
    workerPort.onmessage?.({ data: { type: 'execute', ...message } });
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return { self, posted, pyodide, turtleCommandProxy, getCommands, workerPort, connect, execute };
}

describe('Python Web Worker aislado', () => {
  it('conecta un MessagePort privado y entrega líneas a input()', async () => {
    const harness = createWorkerHarness();
    await harness.connect();
    expect(harness.posted[0]?.status).toBe('ready');
    expect(harness.workerPort.start).toHaveBeenCalledOnce();

    await harness.execute({ id: 4, code: 'read-input', input: ['Ada'] });

    expect(harness.posted.at(-1)).toMatchObject({
      id: 4,
      status: 'success',
      output: 'Read: Ada\n',
    });
  });

  it('conserva salida parcial cuando hay error y limita salida excesiva', async () => {
    const harness = createWorkerHarness();
    await harness.connect();

    await harness.execute({ id: 5, code: 'raises', input: [] });
    expect(harness.posted.find((message) => message.id === 5)).toMatchObject({
      id: 5,
      status: 'error',
      output: 'warning before error\n',
      error: 'expected failure',
    });

    await harness.execute({ id: 6, code: 'large-output', input: [] });
    const cappedOutput = harness.posted.find((message) => message.id === 6)?.output ?? '';
    expect(cappedOutput.length).toBeLessThan(20100);
    expect(cappedOutput).toContain('Salida limitada');
  });

  it('convierte y libera comandos Turtle antes de enviarlos al canal privado', async () => {
    const harness = createWorkerHarness({ withTurtle: true });
    await harness.connect();
    expect(harness.posted.some((message) => message.status === 'ready')).toBe(true);

    await harness.execute({ id: 8, code: 'draw-turtle', input: [] });

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

  it('rechaza programas demasiado grandes antes de invocar Pyodide', async () => {
    const harness = createWorkerHarness();
    await harness.connect();
    await harness.execute({ id: 7, code: 'x'.repeat(50001), input: [] });

    expect(harness.posted.find((message) => message.id === 7)).toMatchObject({
      id: 7,
      status: 'error',
    });
    expect(harness.pyodide.runPythonAsync).not.toHaveBeenCalled();
  });
});
