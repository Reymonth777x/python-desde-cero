import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "python-desdecero",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-26",
    compatibilityFlags: ["nodejs_compat"],
    previewUrls: true,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: [
        "/*",
        "!/_next/static/*",
        "!/*/_next/static/*",
      ],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
    },
    observability: { enabled: true },
  }),
});
