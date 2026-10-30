(() => {
  "use strict";

  const ALLOWED_PARENT_ORIGINS = new Set([
    "https://python-desdecero.com",
    "https://www.python-desdecero.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
  ]);
  const MAX_CODE_LENGTH = 50000;
  const MAX_INPUT_LINES = 20;
  const MAX_INPUT_LINE_LENGTH = 1000;

  let parentOrigin = null;
  let worker = null;
  let outputPort = null;
  let workerReady = false;
  let queuedExecutions = [];

  function sendToParent(message) {
    if (!parentOrigin || window.parent === window) return;
    window.parent.postMessage(message, parentOrigin);
  }

  function stopWorker() {
    workerReady = false;
    queuedExecutions = [];
    if (outputPort) {
      outputPort.onmessage = null;
      outputPort.onmessageerror = null;
      outputPort.close();
      outputPort = null;
    }
    if (worker) {
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
      worker = null;
    }
  }

  function validExecution(message) {
    return message &&
      Number.isSafeInteger(message.id) &&
      typeof message.code === "string" &&
      message.code.length <= MAX_CODE_LENGTH &&
      Array.isArray(message.input) &&
      message.input.length <= MAX_INPUT_LINES &&
      message.input.every((line) => typeof line === "string" && line.length <= MAX_INPUT_LINE_LENGTH);
  }

  function dispatchQueuedExecutions() {
    if (!workerReady || !outputPort) return;
    const queue = queuedExecutions;
    queuedExecutions = [];
    for (const message of queue) {
      outputPort.postMessage({
        type: "execute",
        id: message.id,
        code: message.code,
        input: message.input
      });
    }
  }

  function handleWorkerMessage(event) {
    const message = event.data;
    if (!message || typeof message !== "object") return;

    if (message.status === "ready") {
      workerReady = true;
      sendToParent({ status: "ready" });
      dispatchQueuedExecutions();
      return;
    }

    if (message.status === "init-error") {
      const error = typeof message.error === "string" ? message.error.slice(0, 2000) : "No se pudo iniciar Python.";
      sendToParent({ status: "init-error", error });
      stopWorker();
      return;
    }

    if (message.status === "success" || message.status === "error") {
      if (!Number.isSafeInteger(message.id)) return;
      sendToParent({
        id: message.id,
        status: message.status,
        output: typeof message.output === "string" ? message.output.slice(0, 20000) : "",
        error: typeof message.error === "string" ? message.error.slice(0, 2000) : undefined,
        turtle_commands: Array.isArray(message.turtle_commands) ? message.turtle_commands.slice(0, 5000) : []
      });
    }
  }

  function startWorker() {
    if (worker) {
      if (workerReady) sendToParent({ status: "ready" });
      return;
    }

    try {
      const nextWorker = new Worker("/python-worker.js", { name: "python-desde-cero-sandbox" });
      const channel = new MessageChannel();
      worker = nextWorker;
      outputPort = channel.port1;
      outputPort.onmessage = handleWorkerMessage;
      outputPort.onmessageerror = () => {
        sendToParent({ status: "runtime-error", error: "Se perdió la comunicación con Python." });
        stopWorker();
      };
      outputPort.start();

      nextWorker.onerror = () => {
        sendToParent({ status: "runtime-error", error: "El ejecutor Python terminó inesperadamente." });
        stopWorker();
      };
      nextWorker.onmessageerror = () => {
        sendToParent({ status: "runtime-error", error: "El ejecutor devolvió un mensaje no válido." });
        stopWorker();
      };

      // The worker receives its private response port through a transfer.
      // Its global postMessage channel is deliberately not used for results.
      nextWorker.postMessage({ type: "connect" }, [channel.port2]);
    } catch {
      sendToParent({ status: "init-error", error: "No se pudo crear el entorno aislado de Python." });
      stopWorker();
    }
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || !ALLOWED_PARENT_ORIGINS.has(event.origin)) return;

    const message = event.data;
    if (!message || typeof message !== "object" || typeof message.type !== "string") return;

    if (message.type === "connect") {
      if (parentOrigin && parentOrigin !== event.origin) return;
      parentOrigin = event.origin;
      startWorker();
      return;
    }

    if (!parentOrigin || event.origin !== parentOrigin) return;

    if (message.type === "execute") {
      if (!validExecution(message)) {
        sendToParent({
          id: Number.isSafeInteger(message.id) ? message.id : undefined,
          status: "error",
          output: "",
          error: "La solicitud de ejecución no es válida."
        });
        return;
      }

      if (!worker) startWorker();
      if (workerReady && outputPort) {
        outputPort.postMessage({
          type: "execute",
          id: message.id,
          code: message.code,
          input: message.input
        });
      } else {
        queuedExecutions = [message];
      }
      return;
    }

    if (message.type === "stop") {
      stopWorker();
      sendToParent({ status: "stopped" });
    }
  });
})();
