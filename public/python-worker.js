importScripts("/pyodide/0.29.5/full/pyodide.js");

(() => {
    "use strict";

    const MAX_CODE_LENGTH = 50000;
    const MAX_OUTPUT_LENGTH = 20000;
    const MAX_INPUT_LINES = 20;
    const MAX_INPUT_LINE_LENGTH = 1000;
    const MAX_TURTLE_COMMANDS = 5000;

    let responsePort = null;
    let runtimeStatus = "loading";
    let initializationError = "";

    const pyodideReadyPromise = loadPyodide({
        indexURL: "/pyodide/0.29.5/full/",
    });

    let turtleLoaded = false;

    function send(message) {
        if (responsePort) {
            responsePort.postMessage(message);
        } else {
            // Used only by the isolated worker's unit-test harness before a
            // MessagePort is attached. The runner never consumes this channel.
            self.postMessage(message);
        }
    }

    pyodideReadyPromise
        .then(async (pyodide) => {
            try {
                const turtleResponse = await fetch("/turtle_compat.py");
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

    self.onmessage = (event) => {
        const message = event.data ?? {};

        if (message.type === "connect" && event.ports?.[0]) {
            if (responsePort) responsePort.close?.();
            responsePort = event.ports[0];
            responsePort.onmessage = (portEvent) => {
                const request = portEvent.data ?? {};
                if (request.type === "execute") {
                    void handleExecution(request);
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

            if (runtimeStatus === "ready") send({ status: "ready" });
            else if (runtimeStatus === "init-error") send({ status: "init-error", error: initializationError });
        }
    };
})();
