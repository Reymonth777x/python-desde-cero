type RunnerMessage =
  | { type: 'run'; id: number; code: string; input: string[] }
  | { type: 'init' }
  | { type: 'terminate' };

type RunnerResponse =
  | { status: 'ready' }
  | { status: 'init-error'; error: string }
  | {
      status: 'result';
      id: number;
      resultStatus: 'success' | 'error';
      output?: string;
      error?: string;
      turtle_commands?: unknown;
    }
  | { status: 'error'; id: number; error: string };

let worker: Worker | null = null;
let initError: string | null = null;
let onRunnerMessage: ((data: RunnerResponse) => void) | null = null;

function ensureRunnerWorker(): Worker | null {
  if (typeof window === 'undefined') return null;
  if (worker) return worker;

  try {
    worker = new Worker('/python-worker.js');
    worker.onmessage = (event: MessageEvent<RunnerResponse>) => onRunnerMessage?.(event.data);
    initError = null;
  } catch (error) {
    initError = error instanceof Error ? error.message : 'No se pudo iniciar el ejecutor';
    worker = null;
  }
  return worker;
}

if (typeof window !== 'undefined') ensureRunnerWorker();

export function getRunnerWorker(): { worker: Worker | null; error: string | null } {
  return { worker: ensureRunnerWorker(), error: initError };
}

export function setRunnerMessageHandler(handler: (data: RunnerResponse) => void) {
  onRunnerMessage = handler;
}

export function postToRunner(message: RunnerMessage) {
  ensureRunnerWorker()?.postMessage(message);
}

export function terminateRunnerWorker() {
  worker?.terminate();
  worker = null;
}
