import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    '.cloudflare/**',
    '.vinext/**',
    '.wrangler/**',
    'dist/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.codex-vinext-preview-check.cjs',
    // Resultados de pruebas y reportes: no son código fuente.
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
    // tests/ son pruebas e2e de Playwright, ejecutadas con `npm run test:e2e`,
    // no código fuente de la aplicación. Playwright usa `any` extensivamente en
    // sus tipos, lo que genera ruido de no-explicit-any con next/typescript.
    // vitest.config.ts ya las excluye de vitest (include solo de src/**).
    'tests/**',
    // public/ es un worker estático de navegador (python-worker.js) que usa
    // globals de browser (self, importScripts, fetch, setTimeout, console) y
    // no forma parte del bundle de Next.js; lintarlo genera ruido de no-undef.
    'public/**',
  ]),
]);
