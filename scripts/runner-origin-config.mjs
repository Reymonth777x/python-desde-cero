export const DEFAULT_LOCAL_PARENT_ORIGINS = Object.freeze([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);

export function resolveRunnerParentOrigins({
  environment = "development",
  configuredOrigins,
} = {}) {
  if (!["development", "preview", "production"].includes(environment)) {
    throw new Error("PYTHON_RUNNER_ENV debe ser development, preview o production.");
  }

  const configured = typeof configuredOrigins === "string"
    ? configuredOrigins.trim()
    : "";
  if (!configured && environment !== "development") {
    throw new Error(
      "PYTHON_RUNNER_ALLOWED_PARENT_ORIGINS es obligatorio fuera de desarrollo.",
    );
  }

  const candidates = configured
    ? configured.split(",").map((origin) => origin.trim())
    : [...DEFAULT_LOCAL_PARENT_ORIGINS];

  if (
    candidates.length === 0 ||
    candidates.length > 10 ||
    candidates.some((origin) => !origin)
  ) {
    throw new Error("La lista de orígenes permitidos está vacía o no es válida.");
  }

  const origins = [];
  const seen = new Set();

  for (const candidate of candidates) {
    let url;
    try {
      url = new URL(candidate);
    } catch {
      throw new Error("Origen padre no válido: " + candidate);
    }

    const normalizedCandidate = candidate.endsWith("/")
      ? candidate.slice(0, -1)
      : candidate;
    if (
      normalizedCandidate !== url.origin ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    ) {
      throw new Error("Se requiere un origen exacto, sin ruta ni credenciales: " + candidate);
    }

    const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    const isDevelopmentHttp = environment === "development" && isLoopback && url.protocol === "http:";

    if (environment !== "development" && isLoopback) {
      throw new Error("Los entornos preview y production no pueden permitir loopback.");
    }
    if (url.protocol !== "https:" && !isDevelopmentHttp) {
      throw new Error("Los orígenes remotos deben usar HTTPS: " + candidate);
    }

    if (seen.has(url.origin)) {
      throw new Error("La lista contiene un origen duplicado: " + url.origin);
    }
    seen.add(url.origin);
    origins.push(url.origin);
  }

  return origins;
}

export function createRunnerOriginConfig(origins) {
  if (!Array.isArray(origins) || origins.length === 0) {
    throw new Error("No se puede generar una política de runner sin orígenes.");
  }
  return {
    javascript: JSON.stringify(origins),
    contentSecurityPolicy: origins.join(" "),
  };
}

export function replacePlaceholderExactlyOnce(source, placeholder, replacement) {
  const occurrences = source.split(placeholder).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `Se esperaba exactamente una aparición de ${placeholder}; se encontraron ${occurrences}.`,
    );
  }
  return source.replace(placeholder, replacement);
}
