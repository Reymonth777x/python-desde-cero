importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");

const MAX_CODE_LENGTH = 50000;
const MAX_OUTPUT_LENGTH = 20000;
const MAX_INPUT_LINES = 20;
const MAX_INPUT_LINE_LENGTH = 1000;

let pyodideReadyPromise = loadPyodide();
let turtleLoaded = false;

pyodideReadyPromise
    .then(async () => {
        try {
            const turtleResponse = await fetch("/turtle_compat.py");
            if (!turtleResponse.ok) {
                throw new Error(`No se pudo cargar turtle_compat.py: ${turtleResponse.status}`);
            }
            const turtleCode = await turtleResponse.text();
            await pyodideReadyPromise;
            await pyodideReadyPromise.then((pyodide) => pyodide.runPythonAsync(turtleCode));
            turtleLoaded = true;
        } catch (error) {
            console.warn("No se pudo cargar el modulo Turtle:", error);
        }
        self.postMessage({ status: "ready" });
    })
    .catch((error) => {
        self.postMessage({
            status: "init-error",
            error: error?.message || "No se pudo cargar Pyodide.",
        });
    });

self.onmessage = async (event) => {
    const { id, code, input } = event.data ?? {};

    if (typeof code !== "string") {
        self.postMessage({ id, status: "error", error: "El código recibido no es válido." });
        return;
    }

    if (code.length > MAX_CODE_LENGTH) {
        self.postMessage({
            id,
            status: "error",
            error: `El programa supera el límite de ${MAX_CODE_LENGTH} caracteres.`,
        });
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

            output += chunk.slice(0, remaining);
            if (chunk.length > remaining) outputTruncated = true;
        };

        const inputLines = Array.isArray(input)
            ? input
                .slice(0, MAX_INPUT_LINES)
                .map((line) => String(line).slice(0, MAX_INPUT_LINE_LENGTH))
            : [];
        pyodide.setStdout({ batched: appendOutput });
        pyodide.setStderr({ batched: appendOutput });
        pyodide.setStdin({ stdin: () => inputLines.shift() ?? null });

        let executionError = "";
        try {
            await pyodide.runPythonAsync(code);
        } catch (error) {
            executionError = error?.message || String(error);
        }

        let turtleCommands = null;
        if (turtleLoaded) {
            try {
                const commands = pyodide.globals.get("get_commands");
                if (commands) {
                    turtleCommands = commands();
                }
            } catch (e) {
                // Ignorar errores al leer comandos de Turtle
            }
        }

        if (outputTruncated) {
            output += "\n[Salida limitada para proteger el navegador.]";
        }

        const response = {
            id,
            status: executionError ? "error" : "success",
            output,
            error: executionError || undefined,
        };
        if (turtleCommands && turtleCommands.length > 0) {
            response.turtle_commands = turtleCommands;
        }
        self.postMessage(response);
    } catch (error) {
        self.postMessage({
            id,
            status: "error",
            error: error?.message || String(error),
        });
    }
};
