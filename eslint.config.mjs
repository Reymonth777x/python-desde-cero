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
    // Dependencias estáticas vendored (Pyodide ~8 MB y Monaco Editor ~1 MB): no se lintean.
    'public/pyodide/**',
    'public/monaco/**',
  ]),
  // public/ es un worker estático de navegador (python-worker.js) que corre
  // fuera del bundle de Next.js. Se lintea con los globals de Worker que usa.
  {
    files: ['public/**'],
    languageOptions: {
      globals: {
        self: 'readonly',
        importScripts: 'readonly',
        postMessage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        pyodide: 'readonly',
      },
    },
  },
  // tests/ son pruebas e2e de Playwright, ejecutadas con `npm run test:e2e`
  // (vitest.config.ts ya las excluye de vitest, que incluye solo de src/**).
  // Playwright expone sus propios globals; se lintean con ellos.
  {
    files: ['tests/**'],
    languageOptions: {
      globals: {
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
  // src/lib/runner-worker.ts gestiona el Web Worker (API imperativa del
  // navegador) fuera de los componentes de React.
  {
    files: ['src/lib/runner-worker.ts'],
    languageOptions: {
      globals: {
        Worker: 'readonly',
        MessageEvent: 'readonly',
        window: 'readonly',
      },
    },
  },
]);
