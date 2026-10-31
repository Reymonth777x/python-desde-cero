(() => {
    "use strict";

    const PYODIDE_BASE_URL = typeof self.__PYODIDE_BASE_URL__ === "string"
        ? self.__PYODIDE_BASE_URL__
        : "/pyodide/0.29.5/full/";
    const PYODIDE_SCRIPT_URL = PYODIDE_BASE_URL + "pyodide.js";
    const TURTLE_COMPAT_URL = typeof self.__TURTLE_COMPAT_URL__ === "string"
        ? self.__TURTLE_COMPAT_URL__
        : "/turtle_compat.py";

    importScripts(PYODIDE_SCRIPT_URL);

    const MAX_CODE_LENGTH = 50000;
    const MAX_OUTPUT_LENGTH = 20000;
    const MAX_INPUT_LINES = 20;
    const MAX_INPUT_LINE_LENGTH = 1000;
    const MAX_TURTLE_COMMANDS = 5000;
    const ORILLA_MAX_CODE_LENGTH = 20000;

    let responsePort = null;
    const pendingMessages = [];
    const MAX_PENDING_MESSAGES = 8;
    let runtimeStatus = "loading";
    let initializationError = "";
    let orillaEnginePromise = null;

    const pyodideReadyPromise = loadPyodide({
        indexURL: PYODIDE_BASE_URL,
    });

    let turtleLoaded = false;

    function send(message) {
        if (responsePort) {
            responsePort.postMessage(message);
            return;
        }

        // Pyodide may finish loading before the runner transfers its private
        // MessagePort. Queue only bootstrap messages; never send them through
        // WorkerGlobalScope.postMessage, which untrusted Python can also call.
        if (pendingMessages.length < MAX_PENDING_MESSAGES) {
            pendingMessages.push(message);
        }
    }

    pyodideReadyPromise
        .then(async (pyodide) => {
            try {
                const turtleResponse = await fetch(TURTLE_COMPAT_URL, { credentials: "omit" });
                if (!turtleResponse.ok) {
                    throw new Error("No se pudo cargar turtle_compat.py: " + turtleResponse.status);
                }
                const turtleCode = await turtleResponse.text();
                await pyodide.runPythonAsync(turtleCode);
                turtleLoaded = true;
            } catch (error) {
                // Turtle is an optional compatibility layer; basic Python
                // lessons remain available when it cannot be initialized.
                console.warn("No se pudo inicializar Turtle:", error?.message || String(error));
            }

            runtimeStatus = "ready";
            send({ status: "ready" });
        })
        .catch((error) => {
            runtimeStatus = "init-error";
            initializationError = error?.message || "No se pudo cargar Pyodide.";
            send({ status: "init-error", error: initializationError });
        });

    async function handleExecution(data) {
        const id = data?.id;
        const code = data?.code;
        const input = data?.input;

        if (!Number.isSafeInteger(id)) {
            send({ status: "error", error: "El identificador de ejecución no es válido." });
            return;
        }

        if (runtimeStatus === "init-error") {
            send({ id, status: "error", output: "", error: initializationError });
            return;
        }

        if (runtimeStatus !== "ready") {
            send({ id, status: "error", output: "", error: "Python todavía se está preparando." });
            return;
        }

        if (typeof code !== "string") {
            send({ id, status: "error", output: "", error: "El código recibido no es válido." });
            return;
        }

        if (code.length > MAX_CODE_LENGTH) {
            send({
                id,
                status: "error",
                output: "",
                error: "El programa supera el límite de " + MAX_CODE_LENGTH + " caracteres.",
            });
            return;
        }

        if (!Array.isArray(input) || input.length > MAX_INPUT_LINES ||
            !input.every((line) => typeof line === "string")) {
            send({ id, status: "error", output: "", error: "Los datos de entrada no son válidos." });
            return;
        }

        try {
            const pyodide = await pyodideReadyPromise;
            let output = "";
            let outputTruncated = false;

            const appendOutput = (chunk) => {
                const remaining = MAX_OUTPUT_LENGTH - output.length;
                if (remaining <= 0) {
                    outputTruncated = true;
                    return;
                }

                output += String(chunk).slice(0, remaining);
                if (String(chunk).length > remaining) outputTruncated = true;
            };

            const inputLines = input
                .slice(0, MAX_INPUT_LINES)
                .map((line) => line.slice(0, MAX_INPUT_LINE_LENGTH));

            pyodide.setStdout({ batched: appendOutput });
            pyodide.setStderr({ batched: appendOutput });
            pyodide.setStdin({ stdin: () => inputLines.shift() ?? null });

            try {
                pyodide.globals?.get("clear_commands")?.();
            } catch {
                // Ignore a missing Turtle module.
            }

            let executionError = "";
            try {
                // The hard timeout belongs to the parent frame. It terminates
                // this Worker, which also stops synchronous Python loops.
                await pyodide.runPythonAsync(code);
            } catch (error) {
                executionError = error?.message || String(error);
            }

            let turtleCommands = [];
            if (turtleLoaded) {
                let commands = null;
                let pyCommands = null;
                try {
                    commands = pyodide.globals.get("get_commands");
                    if (commands) {
                        pyCommands = commands();
                        turtleCommands = pyCommands.toJs({
                            dict_converter: Object.fromEntries,
                            create_pyproxies: false,
                        });
                    }
                } catch (error) {
                    console.warn("No se pudieron recuperar comandos Turtle:", error?.message || String(error));
                } finally {
                    pyCommands?.destroy?.();
                    commands?.destroy?.();
                }
            }

            if (outputTruncated) {
                output += "\n[Salida limitada para proteger el navegador.]";
            }

            send({
                id,
                status: executionError ? "error" : "success",
                output,
                error: executionError || undefined,
                turtle_commands: Array.isArray(turtleCommands)
                    ? turtleCommands.slice(0, MAX_TURTLE_COMMANDS)
                    : [],
            });
        } catch (error) {
            send({
                id,
                status: "error",
                output: "",
                error: error?.message || String(error),
                turtle_commands: [],
            });
        }
    }


    async function loadOrillaEngine(pyodide) {
        if (!orillaEnginePromise) {
            orillaEnginePromise = (async () => {
                const response = await fetch("/orilla-engine.py", { credentials: "omit", cache: "no-cache" });
                if (!response.ok) {
                    throw new Error("No se pudo cargar el motor de Orilla: " + response.status);
                }
                const source = await response.text();
                if (source.length < 1000 || source.length > 100000) {
                    throw new Error("El motor de Orilla no tiene un tamaño válido.");
                }
                pyodide.FS.writeFile("/home/pyodide/orilla_engine.py", source);
                return pyodide.pyimport("orilla_engine");
            })().catch((error) => {
                orillaEnginePromise = null;
                throw error;
            });
        }
        return orillaEnginePromise;
    }

    async function handleOrillaExecution(data) {
        const id = data?.id;
        if (!Number.isSafeInteger(id)) {
            send({ type: "orilla:error", id, error: "El identificador de Orilla no es válido." });
            return;
        }
        if (runtimeStatus === "init-error") {
            send({ type: "orilla:error", id, error: initializationError });
            return;
        }
        if (runtimeStatus !== "ready") {
            send({ type: "orilla:error", id, error: "Python todavía se está preparando." });
            return;
        }
        if (typeof data.code !== "string" || data.code.length > ORILLA_MAX_CODE_LENGTH) {
            send({ type: "orilla:error", id, error: "El programa de Orilla supera el límite permitido." });
            return;
        }
        if (!data.tramo || typeof data.tramo !== "object" || Array.isArray(data.tramo)) {
            send({ type: "orilla:error", id, error: "Los datos del tramo no son válidos." });
            return;
        }

        try {
            const pyodide = await pyodideReadyPromise;
            const motor = await loadOrillaEngine(pyodide);
            const resultado = motor.run_json(data.code, JSON.stringify(data.tramo));
            send({ type: "orilla:result", id, result: JSON.parse(resultado) });
        } catch (error) {
            send({
                type: "orilla:error",
                id,
                error: error?.message || "El motor de Orilla no pudo ejecutar el programa.",
            });
        }
    }

    self.onmessage = (event) => {
        const message = event.data ?? {};

        if (message.type === "connect" && event.ports?.[0]) {
            if (responsePort) responsePort.close?.();
            responsePort = event.ports[0];
            responsePort.onmessage = (portEvent) => {
                const request = portEvent.data ?? {};
                if (request.type === "execute") {
                    void handleExecution(request);
                } else if (request.type === "orilla:run") {
                    void handleOrillaExecution(request);
                } else if (request.type === "stop") {
                    // Termination is performed by the owning frame; this
                    // message exists only to make the protocol explicit.
                    send({ status: "stopped" });
                }
            };
            responsePort.onmessageerror = () => {
                responsePort.close?.();
                responsePort = null;
            };
            responsePort.start?.();

            while (pendingMessages.length > 0) {
                responsePort.postMessage(pendingMessages.shift());
            }
        }
    };
})();
