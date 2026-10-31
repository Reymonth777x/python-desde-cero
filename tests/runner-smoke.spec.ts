import { expect, test } from '@playwright/test';

test('diagnóstico rápido: el runner Python inicia y ejecuta código', async ({ page, request }) => {
  const diagnostics: {
    console: string[];
    pageErrors: string[];
    requestFailures: string[];
    runnerResponses: Array<{ url: string; status: number; contentType: string; csp: string }>;
  } = {
    console: [],
    pageErrors: [],
    requestFailures: [],
    runnerResponses: [],
  };

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      diagnostics.console.push(message.type() + ': ' + message.text());
    }
  });
  page.on('pageerror', (error) => diagnostics.pageErrors.push(error.stack ?? error.message));
  page.on('requestfailed', (requestEvent) => {
    diagnostics.requestFailures.push(
      requestEvent.method() + ' ' + requestEvent.url() + ' :: ' + (requestEvent.failure()?.errorText ?? 'unknown'),
    );
  });
  await page.addInitScript(() => {
    const target = window as Window & {
      __runnerSmokeMessages?: Array<{
        origin: string;
        sourceIsParent: boolean;
        type: string | null;
        ports: number;
      }>;
    };
    target.__runnerSmokeMessages = [];
    window.addEventListener('message', (event) => {
      const item = {
        origin: event.origin,
        sourceIsParent: event.source === window.parent,
        type: typeof event.data?.type === 'string' ? event.data.type : null,
        ports: event.ports?.length ?? 0,
      };
      target.__runnerSmokeMessages?.push(item);
    });
  });

  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:8788/')) {
      const headers = response.headers();
      diagnostics.runnerResponses.push({
        url: response.url(),
        status: response.status(),
        contentType: headers['content-type'] ?? '',
        csp: headers['content-security-policy'] ?? '',
      });
    }
  });

  await page.goto('/');
  const example = page.locator('#ejemplo');
  const editor = example.getByRole('textbox', { name: 'Código Python' });
  await editor.fill('print("RUNNER_SMOKE_OK")');
  await example.getByRole('button', { name: 'Ejecutar', exact: true }).click();

  try {
    await expect(example.locator('pre')).toContainText('RUNNER_SMOKE_OK', { timeout: 30000 });
  } catch (error) {
    const assetPaths = [
      '/',
      '/runner-frame.js',
      '/python-worker.js',
      '/turtle_compat.py',
      '/pyodide/0.29.5/full/pyodide.js',
      '/pyodide/0.29.5/full/pyodide.asm.wasm',
      '/pyodide/0.29.5/full/pyodide-lock.json',
    ];
    const assets = await Promise.all(assetPaths.map(async (path) => {
      try {
        const response = await request.get('http://127.0.0.1:8788' + path, { timeout: 10000 });
        const headers = response.headers();
        const body = await response.body();
        return {
          path,
          status: response.status(),
          contentType: headers['content-type'] ?? '',
          csp: headers['content-security-policy'] ?? '',
          bytes: body.byteLength,
        };
      } catch (assetError) {
        return { path, error: assetError instanceof Error ? assetError.message : String(assetError) };
      }
    }));

    const frames = await Promise.all(page.frames().map(async (frame) => {
      const url = frame.url();
      const messages = await frame.evaluate(() => {
        const target = window as Window & {
          __runnerSmokeMessages?: Array<{
            origin: string;
            sourceIsParent: boolean;
            type: string | null;
            ports: number;
          }>;
        };
        return target.__runnerSmokeMessages ?? [];
      }).catch((frameError) => ({ error: frameError instanceof Error ? frameError.message : String(frameError) }));
      return { url, messages };
    }));
    const iframe = example.locator('iframe[title="Entorno de ejecución Python aislado"]');
    const iframeSrc = await iframe.getAttribute('src').catch(() => null);
    const output = await example.locator('pre').innerText().catch(() => '(sin salida)');
    const manualHandshake = await page.evaluate(async () => {
      const frame = document.querySelector<HTMLIFrameElement>(
        '#ejemplo iframe[title="Entorno de ejecución Python aislado"]',
      );
      if (!frame?.contentWindow || !frame.src) return { error: 'iframe sin contentWindow/src' };

      const targetOrigin = new URL(frame.src).origin;
      const channel = new MessageChannel();
      const result = await new Promise((resolve) => {
        const timer = window.setTimeout(() => resolve({ timedOut: true }), 12000);
        channel.port1.onmessage = (event) => {
          window.clearTimeout(timer);
          resolve({ timedOut: false, message: event.data });
        };
        channel.port1.onmessageerror = () => {
          window.clearTimeout(timer);
          resolve({ timedOut: false, messageError: true });
        };
        channel.port1.start();
        try {
          frame.contentWindow?.postMessage({ type: 'connect' }, targetOrigin, [channel.port2]);
        } catch (error) {
          window.clearTimeout(timer);
          resolve({ timedOut: false, error: error instanceof Error ? error.message : String(error) });
        }
      });
      channel.port1.close();
      return { targetOrigin, frameOrigin: new URL(frame.src).origin, result };
    });
    const frameOrigins = await Promise.all(page.frames().map(async (frame) => ({
      url: frame.url(),
      origin: await frame.evaluate(() => location.origin).catch(() => '(inaccesible)'),
    })));

    throw new Error([
      'El runner Python no ejecutó el smoke test.',
      'iframe src: ' + (iframeSrc ?? '(sin src)'),
      'frames: ' + JSON.stringify(frames),
      'salida: ' + output,
      'manual handshake: ' + JSON.stringify(manualHandshake, null, 2),
      'frame origins: ' + JSON.stringify(frameOrigins, null, 2),
      'assets: ' + JSON.stringify(assets, null, 2),
      'respuestas del runner vistas por el navegador: ' + JSON.stringify(diagnostics.runnerResponses, null, 2),
      'solicitudes fallidas: ' + JSON.stringify(diagnostics.requestFailures, null, 2),
      'console: ' + JSON.stringify(diagnostics.console, null, 2),
      'page errors: ' + JSON.stringify(diagnostics.pageErrors, null, 2),
      'expect original: ' + (error instanceof Error ? error.message : String(error)),
    ].join('\n'));
  }
});
