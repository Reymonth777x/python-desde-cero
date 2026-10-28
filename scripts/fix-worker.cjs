const fs = require("fs");
const path = "c:/Users/USUARIO/python-pe1-academy/public/python-worker.js";
let content = fs.readFileSync(path, "utf8");

// Clear commands at start of each execution (after setting up stdout/stderr/stdin)
content = content.replace(
  "pyodide.setStdin({ stdin: () => inputLines.shift() ?? null });",
  "pyodide.setStdin({ stdin: () => inputLines.shift() ?? null });\n        // Limpiar comandos de turtle entre ejecuciones\n        try { pyodide.runPythonAsync(\"clear_commands()\"); } catch {}"
);

// Convert turtle commands to JSON before postMessage
content = content.replace(
  "const commands = pyodide.globals.get(\"get_commands\");\n                if (commands) {\n                    turtleCommands = commands();\n                }",
  "const commands = pyodide.globals.get(\"get_commands\");\n                if (commands) {\n                    const pyCommands = commands();\n                    turtleCommands = pyodide.to_js(pyCommands);\n                }"
);

fs.writeFileSync(path, content, "utf8");
console.log("python-worker.js updated");
