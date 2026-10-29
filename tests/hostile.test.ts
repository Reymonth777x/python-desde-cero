import { type Page, test, expect } from '@playwright/test';

test.describe('CSP y aislamiento', () => {
  test('CSP cabecera presente', async ({ page }) => {
    const hs: string[] = [];
    page.on('response', (r) => {
      const c = r.headers()['content-security-policy'];
      const cr = r.headers()['content-security-policy-report-only'];
      if (c) hs.push(c); if (cr) hs.push(cr);
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(hs.some((h) => h.includes("default-src 'self'"))).toBe(true);
  });

  test('no recursos externos salvo Supabase/Turnstile', async ({ page }) => {
    const ext: string[] = [];
    page.on('request', (r) => {
      const u = r.url();
      const ok = u.includes('localhost') || u.includes('supabase.co') ||
        u.includes('supabase.fr') || u.includes('turnstile') ||
        u.includes('cloudflarestorage.com');
      if (!ok) ext.push(u);
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    expect(ext).toEqual([]);
  });
});

interface RunnerHarness {
  run: (code: string, input?: string[]) => void;
  getMsgs: () => Promise<unknown[]>;
  waitForOutput: (timeoutMs?: number) => Promise<void>;
}

async function setupRunner(page: Page): Promise<RunnerHarness> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const msgs: unknown[] = [];
  await page.exposeFunction('collect', (m: unknown) => msgs.push(m));
  await page.exposeFunction('getMsgs', () => msgs);
  await page.evaluate(() => {
    window.addEventListener('message', (e) => {
      (window as unknown as { collect: (m: unknown) => void }).collect(e.data);
    });
  });
  await page.evaluate(() => new Promise<void>((res) => {
    const h = (e: MessageEvent) => {
      if (e.source !== document.querySelector('iframe[src="/python-runner"]')?.contentWindow) return;
      if (e.data?.status === 'ready' || e.data?.type === 'ready') {
        window.removeEventListener('message', h);
        res();
      }
    };
    window.addEventListener('message', h);

    const ifr = document.createElement('iframe');
    ifr.src = '/python-runner';
    ifr.setAttribute('sandbox', 'allow-scripts');
    ifr.style.display = 'none';
    ifr.addEventListener('load', () => {
      // Sandbox without allow-same-origin has an opaque origin; wildcard is
      // required for delivery. The runner validates event.source and event.origin.
      ifr.contentWindow?.postMessage({ type: 'init' }, '*');
    }, { once: true });
    document.body.appendChild(ifr);

    setTimeout(() => {
      window.removeEventListener('message', h);
      res();
    }, 20000);
  }));
  const run = (code: string, input: string[] = []) => {
    page.evaluate(
      ({ c, i }: { c: string; i: string[] }) => {
        const ifrs = document.querySelectorAll('iframe[src="/python-runner"]');
        const ifr = ifrs[ifrs.length - 1] as HTMLIFrameElement | null;
        if (ifr?.contentWindow) {
          ifr.contentWindow.postMessage({ type: 'run', code: c, input: i }, '*');
        }
      },
      { c: code, i: input },
    );
  };
  const waitForOutput = (timeoutMs = 15000) =>
    page.waitForFunction(
      () => (window as unknown as { getMsgs: () => unknown[] }).getMsgs().length > 0,
      { timeout: timeoutMs },
    ).then(() => {});
  const getMsgs = () => page.evaluate(() => (window as unknown as { getMsgs: () => unknown[] }).getMsgs?.());
  return { run, getMsgs, waitForOutput };
}

test.describe('pruebas hostiles', () => {
  test('no lectura de localStorage', async ({ page }) => {
    const { run, getMsgs, waitForOutput } = await setupRunner(page);
    run(`from js import window\ntry:\n    print("LEAK:", window.localStorage.getItem("test"))\nexcept Exception as e:\n    print("BLOCKED:", type(e).__name__)`);
    await waitForOutput().catch(() => {});
    const out = (await getMsgs()).map((m) => JSON.stringify(m)).join('\n');
    expect(out).not.toContain('LEAK:');
    expect(out).toMatch(/BLOCKED:|error|init-error/);
  });

  test('no fetch externo', async ({ page }) => {
    const { run, getMsgs, waitForOutput } = await setupRunner(page);
    run(`import urllib.request\ntry:\n    urllib.request.urlopen("https://evil.example.com/")\n    print("FETCH_OK")\nexcept Exception as e:\n    print("BLOCKED:", type(e).__name__)`);
    await waitForOutput().catch(() => {});
    const out = (await getMsgs()).map((m) => JSON.stringify(m)).join('\n');
    expect(out).not.toContain('FETCH_OK');
    expect(out).toContain('BLOCKED:');
  });

  test('timeout bucle infinito', async ({ page }) => {
    const { run, getMsgs, waitForOutput } = await setupRunner(page);
    const t0 = Date.now();
    run(`while True:\n    pass`);
    await waitForOutput(20000).catch(() => {});
    const dt = Date.now() - t0;
    const out = (await getMsgs()).map((m) => JSON.stringify(m)).join('\n');
    expect(dt).toBeLessThan(25000);
    expect(out).toMatch(/Tiempo de ejecución agotado|timeout/);
  });

  test('no window.open', async ({ page }) => {
    const { run, getMsgs, waitForOutput } = await setupRunner(page);
    run(`from js import window\ntry:\n    window.open("https://evil.example.com")\n    print("OPEN_OK")\nexcept Exception as e:\n    print("BLOCKED:", type(e).__name__)`);
    await waitForOutput().catch(() => {});
    const out = (await getMsgs()).map((m) => JSON.stringify(m)).join('\n');
    expect(out).not.toContain('OPEN_OK');
    expect(out).toContain('BLOCKED:');
  });

  test('salida truncada', async ({ page }) => {
    const { run, getMsgs, waitForOutput } = await setupRunner(page);
    run(`print("A" * 50000)`);
    await waitForOutput().catch(() => {});
    const out = (await getMsgs()).map((m) => JSON.stringify(m)).join('\n');
    expect(out).toContain('Salida limitada');
  });

  test('ruta runner responde', async ({ page }) => {
    const r = await page.goto('/python-runner', { waitUntil: 'domcontentloaded' });
    expect(r?.status()).toBeLessThan(500);
  });
});