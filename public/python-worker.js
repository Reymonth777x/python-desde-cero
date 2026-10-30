importScripts("/pyodide/0.29.5/full/pyodide.js");

const MAX_CODE_LENGTH = 50000;
const MAX_OUTPUT_LENGTH = 20000;
const MAX_INPUT_LINES = 20;
const MAX_INPUT_LINE_LENGTH = 1000;
const MAX_TEST_CASES = 10;

let turtleLoaded = false;
let pyodideReadyPromise = loadPyodide({ indexURL: "/pyodide/0.29.5/full/" })
  .then(async (pyodide) => {
    try {
      const response = await fetch("/turtle_compat.py");
      if (!response.ok) throw new Error(`No se pudo cargar turtle_compat.py: ${response.status}`);
      await pyodide.runPythonAsync(await response.text());
      turtleLoaded = true;
    } catch (error) {
      console.warn("No se pudo cargar el módulo Turtle:", error);
    }
    self.postMessage({ status: "ready" });
    return pyodide;
  });

pyodideReadyPromise.catch((error) => {
  self.postMessage({
    status: "init-error",
    error: error?.message || "No se pudo cargar Pyodide.",
  });
});

function normalized(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trimEnd();
}

function normalizedInput(value) {
  return Array.isArray(value)
    ? value.slice(0, MAX_INPUT_LINES).map((line) => String(line).slice(0, MAX_INPUT_LINE_LENGTH))
    : [];
}

async function runOnce(pyodide, code, input, isolate) {
  let output = "";
  let truncated = false;
  const appendOutput = (chunk) => {
    const remaining = MAX_OUTPUT_LENGTH - output.length;
    if (remaining <= 0) {
      truncated = true;
      return;
    }
    output += chunk.slice(0, remaining);
    if (chunk.length > remaining) truncated = true;
  };

  pyodide.setStdout({ batched: appendOutput });
  pyodide.setStderr({ batched: appendOutput });
  const inputLines = normalizedInput(input);
  pyodide.setStdin({ stdin: () => inputLines.shift() ?? null });

  try {
    try { pyodide.globals?.get("clear_commands")?.(); } catch { /* Turtle is optional. */ }
    // A fresh globals dictionary prevents one test case from leaking variables
    // into another. Normal Run keeps the interactive Pyodide globals.
    const executable = isolate ? `exec(${JSON.stringify(code)}, {})` : code;
    await pyodide.runPythonAsync(executable);
    return { output, error: null, truncated };
  } catch (error) {
    return { output, error: error?.message || String(error), truncated };
  }
}

async function readTurtleCommands(pyodide) {
  if (!turtleLoaded) return null;
  try {
    const getCommands = pyodide.globals.get("get_commands");
    if (!getCommands) return null;
    return pyodide.to_js(getCommands());
  } catch {
    return null;
  }
}

self.onmessage = async (event) => {
  const request = event.data ?? {};
  const legacyRunnerRequest = request.type === "run";

  // The isolated /python-runner iframe uses { type: "init" | "run" }.
  // The Academy editor uses the direct { code, input, tests } protocol.
  if (request.type === "init") {
    try {
      await pyodideReadyPromise;
      self.postMessage({ status: "ready" });
    } catch (error) {
      self.postMessage({ status: "init-error", error: error?.message || "No se pudo cargar Pyodide." });
    }
    return;
  }

  const { id, code, input, tests } = request;
  const sendRequestError = (message) => {
    if (legacyRunnerRequest) self.postMessage({ status: "error", id, error: message });
    else self.postMessage({ id, status: "error", error: message });
  };

  if (typeof code !== "string") {
    sendRequestError("El código recibido no es válido.");
    return;
  }
  if (code.length > MAX_CODE_LENGTH) {
    sendRequestError(`El programa supera el límite de ${MAX_CODE_LENGTH} caracteres.`);
    return;
  }

  try {
    const pyodide = await pyodideReadyPromise;
    if (Array.isArray(tests)) {
      if (tests.length < 1 || tests.length > MAX_TEST_CASES) {
        self.postMessage({ id, status: "error", error: `El ejercicio debe tener entre 1 y ${MAX_TEST_CASES} pruebas.` });
        return;
      }

      const results = [];
      let turtleCommands = null;
      for (let index = 0; index < tests.length; index++) {
        const test = tests[index] ?? {};
        const expected = typeof test.expected === "string" ? test.expected : "";
        const result = await runOnce(pyodide, code, test.input, true);
        const passed = !result.error && normalized(result.output) === normalized(expected);
        results.push({
          index: index + 1,
          expected,
          actual: result.output,
          passed,
          ...(result.error ? { error: result.error } : {}),
        });
        if (result.truncated) {
          results[results.length - 1].error = "La salida superó el límite de seguridad.";
        }
        turtleCommands = await readTurtleCommands(pyodide);
      }

      const passedCount = results.filter((result) => result.passed).length;
      self.postMessage({
        id,
        status: "success",
        output: `${passedCount} de ${results.length} pruebas superadas.`,
        test_results: results,
        turtle_commands: turtleCommands,
      });
      return;
    }

    const result = await runOnce(pyodide, code, input, false);
    const turtleCommands = await readTurtleCommands(pyodide);
    let output = result.output;
    if (result.truncated) output += "\n[Salida limitada para proteger el navegador.]";

    if (legacyRunnerRequest) {
      self.postMessage({
        status: "result",
        id,
        resultStatus: result.error ? "error" : "success",
        output,
        ...(result.error ? { error: result.error } : {}),
        turtle_commands: turtleCommands,
      });
    } else {
      self.postMessage({
        id,
        status: result.error ? "error" : "success",
        output,
        error: result.error || undefined,
        turtle_commands: turtleCommands,
      });
    }
  } catch (error) {
    const message = error?.message || String(error);
    if (legacyRunnerRequest) self.postMessage({ status: "error", id, error: message });
    else self.postMessage({ id, status: "error", error: message });
  }
};
