#!/usr/bin/env python3
"""Run every catalog exercise solution against its declared input/output cases.

Each test executes in a fresh Python process and temporary working directory so
variables and files from one case cannot make another case pass accidentally.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
COURSE_FILE = ROOT / "src" / "lib" / "course.ts"
EXECUTION_TIMEOUT_SECONDS = 3


def remove_trailing_commas(source: str) -> str:
    """Remove JSON-style trailing commas without touching commas in strings."""
    output: list[str] = []
    in_string = False
    escaped = False
    index = 0

    while index < len(source):
        char = source[index]

        if in_string:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            index += 1
            continue

        if char == '"':
            in_string = True
            output.append(char)
            index += 1
            continue

        if char == ",":
            lookahead = index + 1
            while lookahead < len(source) and source[lookahead].isspace():
                lookahead += 1
            if lookahead < len(source) and source[lookahead] in "}]":
                index += 1
                continue

        output.append(char)
        index += 1

    return "".join(output)


def load_course_modules() -> list[dict[str, Any]]:
    source = COURSE_FILE.read_text(encoding="utf-8")
    export_position = source.find("export const courseModules")
    array_marker = source.find("= [", export_position)
    array_end = source.rfind("];")

    if export_position < 0 or array_marker < 0 or array_end <= array_marker:
        raise RuntimeError("No se pudo localizar el catálogo courseModules.")

    raw_catalog = source[array_marker + 2 : array_end + 1]
    catalog = json.loads(remove_trailing_commas(raw_catalog))

    if not isinstance(catalog, list):
        raise RuntimeError("courseModules no contiene una lista.")

    return catalog


def normalize_output(value: str) -> str:
    """Match the browser editor's CRLF and trailing-newline normalization."""
    return value.replace("\r\n", "\n").rstrip("\n")


def run_case(code: str, input_lines: list[str], expected: str) -> tuple[bool, str]:
    input_text = "".join(f"{line}\n" for line in input_lines)
    child_env = {
        "PATH": os.environ.get("PATH", ""),
        "PYTHONIOENCODING": "utf-8",
        "PYTHONUTF8": "1",
    }
    for variable in ("SYSTEMROOT", "WINDIR", "TEMP", "TMP"):
        if variable in os.environ:
            child_env[variable] = os.environ[variable]

    try:
        with tempfile.TemporaryDirectory(prefix="python-desde-cero-exercise-") as workdir:
            completed = subprocess.run(
                [sys.executable, "-I", "-S", "-c", code],
                input=input_text,
                text=True,
                encoding="utf-8",
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                cwd=workdir,
                env=child_env,
                timeout=EXECUTION_TIMEOUT_SECONDS,
                check=False,
            )
    except subprocess.TimeoutExpired:
        return False, f"la solución superó {EXECUTION_TIMEOUT_SECONDS} segundos"
    except OSError as error:
        return False, f"no se pudo iniciar Python: {error}"

    actual = normalize_output(completed.stdout or "")
    wanted = normalize_output(expected)

    if completed.returncode != 0:
        return False, (
            f"Python terminó con código {completed.returncode}; "
            f"salida combinada: {actual!r}"
        )

    if actual != wanted:
        return False, f"salida distinta; esperada={wanted!r}, obtenida={actual!r}"

    return True, ""


def main() -> int:
    modules = load_course_modules()
    total_cases = 0
    failures: list[str] = []

    for module in modules:
        module_number = module.get("number", module.get("id", "?"))
        for lesson in module.get("lessons", []):
            lesson_id = str(lesson.get("id", "sin-id"))
            title = str(lesson.get("title", lesson_id))
            exercise = lesson.get("exercise") or {}
            solution = exercise.get("solution")
            cases = exercise.get("tests")

            if not isinstance(solution, str) or not solution.strip():
                failures.append(f"{lesson_id} ({title}): no tiene solución de referencia.")
                continue
            if not isinstance(cases, list) or not cases:
                failures.append(f"{lesson_id} ({title}): no tiene casos de prueba.")
                continue

            for case_index, case in enumerate(cases, start=1):
                total_cases += 1
                inputs = case.get("input", [])
                expected = case.get("expected")

                if not isinstance(inputs, list) or not all(isinstance(x, str) for x in inputs):
                    failures.append(
                        f"{lesson_id} ({title}), caso {case_index}: "
                        "input debe ser una lista de cadenas."
                    )
                    continue
                if not isinstance(expected, str):
                    failures.append(
                        f"{lesson_id} ({title}), caso {case_index}: "
                        "expected debe ser una cadena."
                    )
                    continue

                passed, detail = run_case(solution, inputs, expected)
                if not passed:
                    failures.append(
                        f"Módulo {module_number}, {lesson_id} ({title}), "
                        f"caso {case_index}: {detail}"
                    )

    if failures:
        print(
            f"Fallaron {len(failures)} de {total_cases} comprobaciones "
            "de soluciones del curso:",
            file=sys.stderr,
        )
        for failure in failures:
            print(f" - {failure}", file=sys.stderr)
        return 1

    print(
        f"Correcto: {total_cases} casos de {sum(len(m.get('lessons', [])) for m in modules)} "
        "actividades ejecutados en procesos y directorios aislados."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
