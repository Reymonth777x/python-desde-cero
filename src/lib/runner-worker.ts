type RunnerMessage =
  | { type: 'run'; id: number; code: string; input: string[] }
  | { type: 'init' }
  | { type: 'terminate' };

// Shape returned by public/python-worker.js.
type RunnerResponse =
  | { status: 'ready' }
  | { status: 'init-error'; error: string }
  | {
      status: 'success' | 'error';
      id?: number;
      output?: string;
      error?: string;
      turtle_commands?: unknown;
    };

// El Web Worker solo existe en el navegador. Se crea al importar el módulo
// (API imperativa del navegador, fuera del ciclo de render de React) para que
// el componente de React no tenga que mutar valores del render ni llamar a
// setState dentro del cuerpo de un efecto.
let worker: Worker | null = null;
let initError: string | null = null;
let onRunnerMessage: ((data: RunnerResponse) => void) | null = null;

if (typeof window !== 'undefined') {
  try {
    worker = new Worker('/python-worker.js');
    worker.onmessage = (event: MessageEvent<RunnerResponse>) => {
      onRunnerMessage?.(event.data);
    };
  } catch (err) {
    initError = err instanceof Error ? err.message : 'No se pudo iniciar el ejecutor';
  }
}

export function getRunnerWorker(): { worker: Worker | null; error: string | null } {
  return { worker, error: initError };
}

export function setRunnerMessageHandler(handler: (data: RunnerResponse) => void) {
  onRunnerMessage = handler;
}

export function postToRunner(msg: RunnerMessage) {
  worker?.postMessage(msg);
}

export function terminateRunnerWorker() {
  worker?.terminate();
  worker = null;
}
