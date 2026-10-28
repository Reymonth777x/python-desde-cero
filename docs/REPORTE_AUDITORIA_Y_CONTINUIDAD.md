// Configuración de Cloudflare para vinext
// Este archivo se usa para tipo de proyecto en Cloudflare Workers
// El despliegue real se gestiona mediante wrangler.jsonc y vinext

export default {
  name: "python-desdecero",
  compatibility_date: "2026-10-26",
  compatibility_flags: ["nodejs_compat"],
  main: "vinext/server/fetch-handler",
  assets: {
    directory: "dist/client",
    html_handling: "none",
    not_found_handling: "none",
    run_worker_first: [
      "/*",
      "!/_next/static/*",
      "!/*/_next/static/*"
    ]
  },
  images: { binding: "IMAGES" },
  observability: { enabled: true }
};
