# Licencias de dependencias de terceros

## Pyodide (versión 0.29.5)

- **Paquete:** `pyodide@0.29.5`
- **Ubicación:** `public/pyodide/0.29.5/full/` (restaurado por `postinstall`)
- **Licencia:** Mozilla Public License 2.0 (MPL-2.0)
- **URL:** https://github.com/pyodide/pyodide
- **Notas:** MPL-2.0 es una licencia débil de copyleft. El código modificado debe
  hacerse disponible bajo MPL-2.0, pero el código que solo *usa* Pyodide no
  necesita abrirse.

## Monaco Editor (versión ^0.57.0)

- **Paquete:** `monaco-editor@^0.57.0`
- **Ubicación:** `public/monaco/vs/` (restaurado por `postinstall`)
- **Licencia:** MIT License
- **URL:** https://github.com/microsoft/monaco-editor
- **Notas:** Licencia permisiva. No impone obligaciones de disclosure sobre el
  código que la utiliza.

## Políticas

- Ningún secreto, clave o valor real de producción se almacena en el repositorio.
- Las claves de Turnstile de prueba (Cloudflare) mencionadas en comentarios y
  `.env.example` son claves públicas de documentación, no secretos del proyecto.
- Las claves reales se configuran únicamente mediante variables de entorno
  (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`).