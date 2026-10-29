import { test, expect } from '@playwright/test';

test.describe('Seguridad y ejecución real', () => {
  test('CSP usa nonce por respuesta y no habilita eval general', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    const policy = response?.headers()['content-security-policy'] ?? '';
    expect(policy).toContain("default-src 'self'");

    const scriptPolicy = policy.split(';').find((part) => part.trim().startsWith('script-src')) ?? '';
    expect(scriptPolicy).toContain("'nonce-");
    expect(scriptPolicy.split(/\s+/)).not.toContain("'unsafe-inline'");
    expect(scriptPolicy.split(/\s+/)).not.toContain("'unsafe-eval'");
    await expect(page.locator('script[nonce]').first()).toHaveAttribute('nonce', /.+/);
  });

  test('la aplicación no solicita recursos externos no autorizados', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      const allowed =
        url.startsWith('http://localhost') ||
        url.includes('supabase.co') ||
        url.includes('supabase.fr') ||
        url.includes('challenges.cloudflare.com');
      if (!allowed) external.push(url);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    expect(external).toEqual([]);
  });

  test('la portada ejecuta Python en el Web Worker real', async ({ page }) => {
    await page.goto('/');
    const example = page.locator('#ejemplo');
    await example.scrollIntoViewIfNeeded();
    await example.locator('textarea').fill('print("WORKER_OK")');
    await example.getByRole('button', { name: 'Ejecutar' }).click();
    await expect(example.locator('pre')).toContainText('WORKER_OK', { timeout: 60000 });
  });

  test('el Worker limita la salida visible de programas grandes', async ({ page }) => {
    await page.goto('/');
    const example = page.locator('#ejemplo');
    await example.scrollIntoViewIfNeeded();
    await example.locator('textarea').fill('print("A" * 50000)');
    await example.getByRole('button', { name: 'Ejecutar' }).click();
    await expect(example.locator('pre')).toContainText('Salida limitada', { timeout: 60000 });
  });
});
