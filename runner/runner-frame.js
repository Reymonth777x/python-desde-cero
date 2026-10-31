(() => {
  "use strict";

  const ALLOWED_PARENT_ORIGINS = new Set(["__PYTHON_RUNNER_ALLOWED_PARENT_ORIGINS_PLACEHOLDER__"]);
  const MAX_CODE_LENGTH = 50000;
  const MAX_OUTPUT_LENGTH = 20000;
  const OUTPUT_TRUNCATION_NOTICE = "\n[Salida limitada para proteger el navegador.]";
  const MAX_OUTPUT_WITH_NOTICE_LENGTH = MAX_OUTPUT_LENGTH + OUTPUT_TRUNCATION_NOTICE.length;
  const MAX_INPUT_LINES = 20;
  const MAX_INPUT_LINE_LENGTH = 1000;
  const MAX_WORKER_SOURCE_LENGTH = 1000000;

  let parentPort = null;
  let worker = null;
  let workerPort = null;
  let workerBlobUrl = null;
  let workerReady = false;
  let workerGeneration = 0;
  let pendingStartGeneration = null;
  let workerStartPromise = null;
  let restartAfterStart = false;
  let queuedExecutions = [];

  function sendToParent(message) {
    if (!parentPort) return;
    parentPort.postMessage(message);
  }

  function stopWorker() {
    workerGeneration += 1;
    workerReady = false;
    queuedExecutions = [];

    if (workerPort) {
      workerPort.onmessage = null;
      workerPort.onmessageerror = null;
      workerPort.close();
      workerPort = null;
    }
    if (worker) {
      worker.onerror = null;
      worker.onmessageerror = null;
      worker.terminate();
      worker = null;
    }
    if (workerBlobUrl) {
      URL.revokeObjectURL(workerBlobUrl);
      workerBlobUrl = null;
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
    if (!workerReady || !workerPort) return;
    const queue = queuedExecutions;
    queuedExecutions = [];
    for (const message of queue) {
      workerPort.postMessage({
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
        output: typeof message.output === "string"
          ? message.output.slice(0, MAX_OUTPUT_WITH_NOTICE_LENGTH)
          : "",
        error: typeof message.error === "string" ? message.error.slice(0, 2000) : undefined,
        turtle_commands: Array.isArray(message.turtle_commands) ? message.turtle_commands.slice(0, 5000) : []
      });
    }
  }

  async function initializeWorker(generation) {
    const workerScriptUrl = new URL("/python-worker.js", window.location.href);
    const response = await fetch(workerScriptUrl.toString(), {
      credentials: "omit",
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error("No se pudo cargar el ejecutor Python: HTTP " + response.status);
    }

    const source = await response.text();
    if (source.length > MAX_WORKER_SOURCE_LENGTH) {
      throw new Error("El archivo del ejecutor Python supera el tamaño permitido.");
    }
    if (generation !== workerGeneration) return;

    const pyodideBaseUrl = new URL("/pyodide/0.29.5/full/", window.location.href).toString();
    const turtleCompatUrl = new URL("/turtle_compat.py", window.location.href).toString();
    const bootstrap =
      "self.__PYODIDE_BASE_URL__ = " + JSON.stringify(pyodideBaseUrl) + ";" +
      "self.__TURTLE_COMPAT_URL__ = " + JSON.stringify(turtleCompatUrl) + ";";
    const blob = new Blob([bootstrap, source], { type: "text/javascript" });
    workerBlobUrl = URL.createObjectURL(blob);

    const nextWorker = new Worker(workerBlobUrl, { name: "python-desde-cero-opaque-sandbox" });
    if (generation !== workerGeneration) {
      nextWorker.terminate();
      URL.revokeObjectURL(workerBlobUrl);
      workerBlobUrl = null;
      return;
    }

    const channel = new MessageChannel();
    worker = nextWorker;
    workerPort = channel.port1;
    workerPort.onmessage = handleWorkerMessage;
    workerPort.onmessageerror = () => {
      sendToParent({ status: "runtime-error", error: "Se perdió la comunicación con Python." });
      stopWorker();
    };
    workerPort.start();

    nextWorker.onerror = () => {
      sendToParent({ status: "runtime-error", error: "El ejecutor Python terminó inesperadamente." });
      stopWorker();
    };
    nextWorker.onmessageerror = () => {
      sendToParent({ status: "runtime-error", error: "El ejecutor devolvió un mensaje no válido." });
      stopWorker();
    };

    // This Blob worker inherits the iframe's opaque origin. Its only network
    // access is to the exact public runner origin allowed by the iframe CSP.
    nextWorker.postMessage({ type: "connect" }, [channel.port2]);
  }

  function startWorker() {
    if (worker) {
      if (workerReady) sendToParent({ status: "ready" });
      return;
    }

    if (workerStartPromise) {
      if (pendingStartGeneration !== workerGeneration) restartAfterStart = true;
      return;
    }

    const generation = workerGeneration;
    pendingStartGeneration = generation;
    const startPromise = initializeWorker(generation)
      .catch((error) => {
        if (generation !== workerGeneration) return;
        sendToParent({
          status: "init-error",
          error: error?.message || "No se pudo iniciar el entorno aislado de Python."
        });
        stopWorker();
      })
      .finally(() => {
        if (workerStartPromise === startPromise) {
          workerStartPromise = null;
          pendingStartGeneration = null;
        }
        if (restartAfterStart) {
          restartAfterStart = false;
          if (!worker) startWorker();
        }
      });

    workerStartPromise = startPromise;
  }

  function handleParentMessage(event) {
    const message = event.data;
    if (!message || typeof message !== "object" || typeof message.type !== "string") return;

    if (message.type === "connect") {
      startWorker();
      return;
    }

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
      if (workerReady && workerPort) {
        workerPort.postMessage({
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
  }

  window.addEventListener("message", (event) => {
    // The runner is hosted on a dedicated origin, separate from the academy.
    // Validate the parent source and exact allowed origin before transferring
    // the private MessagePort used for every subsequent message.
    if (parentPort || event.source !== window.parent || !ALLOWED_PARENT_ORIGINS.has(event.origin)) return;
    if (event.data?.type !== "connect" || event.ports?.length !== 1) return;

    parentPort = event.ports[0];
    parentPort.onmessage = handleParentMessage;
    parentPort.onmessageerror = () => {
      stopWorker();
      parentPort?.close();
      parentPort = null;
    };
    parentPort.start();
    startWorker();
  });
})();
