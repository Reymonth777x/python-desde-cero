#!/usr/bin/env node

import { cpSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
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

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(pyodideSource, join(destination, "pyodide", "0.29.5", "full"), { recursive: true });
copyFileSync(join(root, "public", "python-worker.js"), join(destination, "python-worker.js"));
copyFileSync(join(root, "public", "turtle_compat.py"), join(destination, "turtle_compat.py"));
copyFileSync(join(root, "runner", "index.html"), join(destination, "index.html"));
copyFileSync(join(root, "runner", "runner-frame.js"), join(destination, "runner-frame.js"));

copyFileSync(join(root, "runner", "_headers"), join(destination, "_headers"));

const wasmPath = join(destination, "pyodide", "0.29.5", "full", "pyodide.asm.wasm");
const wasmSize = statSync(wasmPath).size;
if (wasmSize < 1000000) {
  throw new Error("El archivo WebAssembly de Pyodide parece incompleto.");
}

console.log("Assets del ejecutor Python aislado preparados.");
console.log("Pyodide " + JSON.parse(readFileSync(join(root, "package.json"), "utf8")).dependencies.pyodide +
  "; WASM " + wasmSize + " bytes.");
