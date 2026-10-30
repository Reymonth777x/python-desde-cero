#!/usr/bin/env node

import { cpSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = join(root, "runner-public");
const pyodideSource = join(root, "public", "pyodide", "0.29.5", "full");
const requiredFiles = [
  join(pyodideSource, "pyodide.js"),
  join(pyodideSource, "pyodide.asm.wasm"),
  join(root, "public", "python-worker.js"),
  join(root, "public", "turtle_compat.py"),
  join(root, "runner", "index.html"),
  join(root, "runner", "runner-frame.js"),
  join(root, "runner", "_headers"),
];

for (const path of requiredFiles) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error("Falta un asset requerido para el ejecutor aislado: " + path);
  }
}

const configuredOrigin =
  process.env.PYTHON_RUNNER_PUBLIC_ORIGIN ||
  process.env.NEXT_PUBLIC_PYTHON_RUNNER_ORIGIN ||
  "http://127.0.0.1:8788";

let runnerOrigin;
try {
  const url = new URL(configuredOrigin.trim());
  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) {
    throw new Error("La URL debe ser solo un origen.");
  }
  if (localHost) {
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("El origen local debe usar HTTP(S).");
  } else if (url.protocol !== "https:" || !url.hostname.endsWith(".workers.dev")) {
    throw new Error("El runner remoto debe utilizar un origen HTTPS workers.dev.");
  }
  runnerOrigin = url.origin;
} catch (error) {
  throw new Error("PYTHON_RUNNER_PUBLIC_ORIGIN no es válido: " + (error instanceof Error ? error.message : String(error)));
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(pyodideSource, join(destination, "pyodide", "0.29.5", "full"), { recursive: true });
copyFileSync(join(root, "public", "python-worker.js"), join(destination, "python-worker.js"));
copyFileSync(join(root, "public", "turtle_compat.py"), join(destination, "turtle_compat.py"));
copyFileSync(join(root, "runner", "index.html"), join(destination, "index.html"));
copyFileSync(join(root, "runner", "runner-frame.js"), join(destination, "runner-frame.js"));

const headerTemplate = readFileSync(join(root, "runner", "_headers"), "utf8");
if (!headerTemplate.includes("__PYTHON_RUNNER_ORIGIN__")) {
  throw new Error("Falta el marcador de origen en runner/_headers.");
}
writeFileSync(
  join(destination, "_headers"),
  headerTemplate.replaceAll("__PYTHON_RUNNER_ORIGIN__", runnerOrigin),
  "utf8",
);

const wasmPath = join(destination, "pyodide", "0.29.5", "full", "pyodide.asm.wasm");
const wasmSize = statSync(wasmPath).size;
if (wasmSize < 1000000) {
  throw new Error("El archivo WebAssembly de Pyodide parece incompleto.");
}

console.log("Ejecutor Python aislado preparado para " + runnerOrigin + ".");
console.log("Pyodide " + JSON.parse(readFileSync(join(root, "package.json"), "utf8")).dependencies.pyodide +
  "; WASM " + wasmSize + " bytes.");
