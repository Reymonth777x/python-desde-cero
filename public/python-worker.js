importScripts("https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js");

const MAX_CODE_LENGTH = 50000;
const MAX_OUTPUT_LENGTH = 20000;
const MAX_INPUT_LINES = 20;
const MAX_INPUT_LINE_LENGTH = 1000;

let pyodideReadyPromise = loadPyodide();

pyodideReadyPromise
    .then(() => self.postMessage({ status: "ready" }))
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

        if (outputTruncated) {
            output += "\n[Salida limitada para proteger el navegador.]";
        }

        self.postMessage({
            id,
            status: executionError ? "error" : "success",
            output,
            error: executionError || undefined,
        });
    } catch (error) {
        self.postMessage({
            id,
            status: "error",
            error: error?.message || String(error),
        });
    }
};
