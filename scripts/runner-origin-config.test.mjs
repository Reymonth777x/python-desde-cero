import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import {
  createRunnerOriginConfig,
  DEFAULT_LOCAL_PARENT_ORIGINS,
  replacePlaceholderExactlyOnce,
  resolveRunnerParentOrigins,
} from "./runner-origin-config.mjs";

describe("política de orígenes del runner", () => {
  it("limita el desarrollo local a los cuatro orígenes loopback previstos", () => {
    expect(resolveRunnerParentOrigins()).toEqual([...DEFAULT_LOCAL_PARENT_ORIGINS]);
  });

  it("exige una lista explícita para production y preview", () => {
    expect(() => resolveRunnerParentOrigins({ environment: "production" }))
      .toThrow(/obligatorio fuera de desarrollo/);
    expect(() => resolveRunnerParentOrigins({ environment: "preview" }))
      .toThrow(/obligatorio fuera de desarrollo/);
  });

  it("genera la misma allowlist exacta para el protocolo JS y frame-ancestors", () => {
    const origins = resolveRunnerParentOrigins({
      environment: "production",
      configuredOrigins: "https://python-desdecero.com,https://www.python-desdecero.com",
    });

    expect(createRunnerOriginConfig(origins)).toEqual({
      javascript: '["https://python-desdecero.com","https://www.python-desdecero.com"]',
      contentSecurityPolicy: "https://python-desdecero.com https://www.python-desdecero.com",
    });
  });

  it("rechaza localhost y HTTP remoto en preview y production", () => {
    for (const environment of ["preview", "production"]) {
      expect(() => resolveRunnerParentOrigins({
        environment,
        configuredOrigins: "https://python-desdecero.com,http://localhost:3000",
      })).toThrow(/loopback/);
      expect(() => resolveRunnerParentOrigins({
        environment,
        configuredOrigins: "http://attacker.example",
      })).toThrow(/HTTPS/);
    }
  });

  it("rechaza comodines, rutas, credenciales y parámetros", () => {
    const invalid = [
      "https://*.example.com",
      "https://example.com/path",
      "https://user:secret@example.com",
      "https://example.com/?next=attacker",
    ];

    for (const configuredOrigins of invalid) {
      expect(() => resolveRunnerParentOrigins({
        environment: "preview",
        configuredOrigins,
      })).toThrow();
    }
  });

  it("rechaza orígenes duplicados y listas vacías", () => {
    expect(() => resolveRunnerParentOrigins({
      environment: "production",
      configuredOrigins: "https://python-desdecero.com,https://python-desdecero.com",
    })).toThrow(/duplicado/);
    expect(() => resolveRunnerParentOrigins({
      environment: "production",
      configuredOrigins: ",",
    })).toThrow(/vacía o no es válida/);
  });

  it("genera un Set plano de orígenes, no un array anidado", () => {
    const origins = resolveRunnerParentOrigins({
      environment: "production",
      configuredOrigins: "https://python-desdecero.com,https://www.python-desdecero.com",
    });
    const originConfig = createRunnerOriginConfig(origins);
    const template = readFileSync(new URL("../runner/runner-frame.js", import.meta.url), "utf8");
    const generated = replacePlaceholderExactlyOnce(
      template,
      "__PYTHON_RUNNER_ALLOWED_PARENT_ORIGINS_JSON__",
      originConfig.javascript,
    );
    const statement = generated.match(/const ALLOWED_PARENT_ORIGINS = new Set\((\[[^\n]+\])\);/);

    expect(statement?.[1]).toBe(originConfig.javascript);
    expect(JSON.parse(statement?.[1] ?? "[]")).toEqual(origins);
  });

  it("solo reemplaza placeholders presentes una vez", () => {
    expect(replacePlaceholderExactlyOnce("x __TOKEN__ y", "__TOKEN__", "ok"))
      .toBe("x ok y");
    expect(() => replacePlaceholderExactlyOnce("__TOKEN__ __TOKEN__", "__TOKEN__", "ok"))
      .toThrow(/exactamente una aparición/);
    expect(() => replacePlaceholderExactlyOnce("sin token", "__TOKEN__", "ok"))
      .toThrow(/exactamente una aparición/);
  });
});
