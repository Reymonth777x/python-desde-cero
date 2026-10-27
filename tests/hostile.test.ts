import { test, expect } from '@playwright/test';

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
    expect(ext.filter((u) => !u.includes('googleapis') && !u.includes('gstatic'))).toEqual([]);
  });
});

async function setupRunner(page: any) {
  const msgs: any[] = [];
  await page.exposeFunction('collect', (m: any) => msgs.push(m));
  await page.exposeFunction('getMsgs', () => msgs);
  await page.evaluate(() => {
    window.addEventListener('message', (e) => (window as any).collect(e.data));
  });
  await page.evaluate(() => new Promise<void>((res) => {
    const ifr = document.createElement('iframe');
    ifr.src = '/python-runner'; ifr.sandbox = 'allow-scripts';
    ifr.style.display = 'none'; document.body.appendChild(ifr);
    const h = (e: MessageEvent) => { if (e.data?.type === 'ready') { window.removeEventListener('message', h); res(); } };
    window.addEventListener('message', h);
    setTimeout(() => { window.removeEventListener('message', h); res(); }, 15000);
  }));
  const run = (code: string, input: string[] = []) => {
    page.evaluate(({ c, i }) => {
      const ifrs = document.querySelectorAll('iframe[src="/python-runner"]');
      const ifr = ifrs[ifrs.length - 1];
      if (ifr?.contentWindow) ifr.contentWindow.postMessage({ type: 'run', code: c, input: i }, '*');
    }, { c: code, i: input });
  };
  return { run, getMsgs: () => page.evaluate(() => (window as any).getMsgs?.()) };
}

test.describe('pruebas hostiles', () => {
  test.use({ timeout: 60000 });

  test('no lectura de localStorage', async ({ page }) => {
    const { run, getMsgs } = await setupRunner(page);
    run(`from js import window\ntry:\n    print("LEAK:", window.localStorage.getItem("test"))\nexcept Exception as e:\n    print("BLOCKED:", type(e).__name__)`);
    await page.waitForTimeout(12000);
    const out = (await getMsgs()).map((m: any) => JSON.stringify(m)).join('\n');
    expect(out).not.toContain('LEAK:');
    expect(out).toMatch(/BLOCKED:|error|init-error/);
  });

  test('no fetch externo', async ({ page }) => {
    const { run, getMsgs } = await setupRunner(page);
    run(`import urllib.request\ntry:\n    urllib.request.urlopen("https://evil.example.com/")\n    print("FETCH_OK")\nexcept Exception as e:\n    print("BLOCKED:", type(e).__name__)`);
    await page.waitForTimeout(12000);
    const out = (await getMsgs()).map((m: any) => JSON.stringify(m)).join('\n');
    expect(out).not.toContain('FETCH_OK');
    expect(out).toContain('BLOCKED:');
  });

  test('timeout bucle infinito', async ({ page }) => {
    const { run, getMsgs } = await setupRunner(page);
    const t0 = Date.now();
    run(`while True:\n    pass`);
    await page.waitForTimeout(18000);
    const dt = Date.now() - t0;
    const out = (await getMsgs()).map((m: any) => JSON.stringify(m)).join('\n');
    expect(dt).toBeLessThan(25000);
    expect(out).toMatch(/Tiempo de ejecución agotado|timeout/);
  });

  test('no window.open', async ({ page }) => {
    const { run, getMsgs } = await setupRunner(page);
    run(`from js import window\ntry:\n    window.open("https://evil.example.com")\n    print("OPEN_OK")\nexcept Exception as e:\n    print("BLOCKED:", type(e).__name__)`);
    await page.waitForTimeout(12000);
    const out = (await getMsgs()).map((m: any) => JSON.stringify(m)).join('\n');
    expect(out).not.toContain('OPEN_OK');
    expect(out).toContain('BLOCKED:');
  });

  test('salida truncada', async ({ page }) => {
    const { run, getMsgs } = await setupRunner(page);
    run(`print("A" * 50000)`);
    await page.waitForTimeout(12000);
    const out = (await getMsgs()).map((m: any) => JSON.stringify(m)).join('\n');
    expect(out).toContain('Salida limitada');
  });

  test('ruta runner responde', async ({ page }) => {
    const r = await page.goto('/python-runner', { waitUntil: 'domcontentloaded' });
    expect(r?.status()).toBeLessThan(500);
  });
});