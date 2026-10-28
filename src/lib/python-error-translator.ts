'use strict';

/**
 * Traductor de errores de Python a español con mensajes pedagógicos.
 * Convierte tracebacks de Pyodide en mensajes claros en español
 * con número de lÃ­nea y pista sugerida.
 */

type PythonErrorInfo = {
  type: string;
  message: string;
  line?: number;
  column?: number;
  spanish: string;
  hint?: string;
};

// Mapeo de tipos de error de Python a mensajes en español
const ERROR_MESSAGES: Record<string, { base: string; hint?: string }> = {
  SyntaxError: {
    base: "Error de sintaxis en el código Python.",
    hint: "Revisa paréntesis, comillas, dos puntos y sangrÃ­a.",
  },
  IndentationError: {
    base: "Error de sangrÃ­a (indentation).",
    hint: "En Python, los bloques de código deben tener la misma sangrÃ­a. Usa 4 espacios consistentes.",
  },
  TabError: {
    base: "Mezcla de tabuladores y espacios en la sangrÃ­a.",
    hint: "Usa solo espacios (4 por nivel) o solo tabuladores, no ambos.",
  },
  NameError: {
    base: "Variable o nombre no definido.",
    hint: "Asegúrate de haber definido la variable antes de usarla.",
  },
  TypeError: {
    base: "Error de tipo: operación no válida para este tipo de dato.",
    hint: "Revisa que los tipos de los valores sean compatibles (por ejemplo, no sumes texto con número sin convertir).",
  },
  ZeroDivisionError: {
    base: "División entre cero no permitida.",
    hint: "No puedes dividir un número entre cero. Añade una comprobación antes de dividir.",
  },
  ValueError: {
    base: "Valor no válido para la operación.",
    hint: "Revisa que el valor pasado a la función sea del tipo y rango esperados.",
  },
  IndexError: {
    base: "Ãndice de lista fuera de rango.",
    hint: "Estás intentando acceder a una posición que no existe en la lista.",
  },
  KeyError: {
    base: "Clave no encontrada en el diccionario.",
    hint: "La clave que buscas no existe en el diccionario. Usa .get(clave, valor_predeterminado).",
  },
  AttributeError: {
    base: "Atributo o método no encontrado en el objeto.",
    hint: "Revisa que el objeto tenga ese atributo o método. Verifica la ortografÃ­a.",
  },
  ImportError: {
    base: "No se pudo importar el módulo.",
    hint: "Verifica que el nombre del módulo sea correcto y esté disponible.",
  },
  ModuleNotFoundError: {
    base: "Módulo no encontrado.",
    hint: "El módulo que intentas importar no está instalado en este entorno.",
  },
  TimeoutError: {
    base: "El programa tardó demasiado en ejecutarse.",
    hint: "Â¿Tienes un bucle infinito? Revisa while True o bucles sin condición de salida.",
  },
};

// Patrones para extraer número de lÃ­nea de mensajes de error de Python
const LINE_PATTERNS = [
  /line\s+(\d+)/i,
  /lÃ­nea\s+(\d+)/i,
  /file\s+".*?",\s+line\s+(\d+)/i,
];

export function translatePythonError(
  error: string | Error | unknown,
): PythonErrorInfo {
  const message = error instanceof Error ? error.message : String(error ?? "Error desconocido");
  const typeMatch = message.match(/^(\w+Error):/);
  const errorType = typeMatch ? typeMatch[1] : "Error";

  let line: number | undefined;
  for (const pattern of LINE_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      line = parseInt(match[1], 10);
      break;
    }
  }

  const known = ERROR_MESSAGES[errorType] || ERROR_MESSAGES["Error"];
  const spanishBase = known?.base || "Error inesperado al ejecutar el código.";
  const spanishHint = known?.hint;

  let spanish = `${spanishBase}`;
  if (line !== undefined) {
    spanish += ` (lÃ­nea ${line})`;
  }

  return {
    type: errorType,
    message,
    line,
    spanish,
    hint: spanishHint,
  };
}

export function formatPythonError(error: string | Error | unknown): string {
  const info = translatePythonError(error);
  let result = info.spanish;
  if (info.hint) {
    result += '\nPista: ' + info.hint;
  }
  return result;
}

