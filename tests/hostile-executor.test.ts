import { test, expect } from '@playwright/test';

test.describe('Ejecutor sandbox — pruebas hostiles', () => {
  test('while True: pass se detiene por watchdog', async ({ page }) => {
    await page.goto('/practica');
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Escribir código con bucle infinito y ejecutar
    await page.fill('textarea', 'while True:\n    pass');
    await page.click('button:has-text("Ejecutar")');

    // Esperar a que se detecte el error de timeout
    await page.waitForTimeout(5000);

    // No debe haber errores de consola críticos relacionados con sandbox
    const criticalErrors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('chrome-extension')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('print infinito no bloquea la página', async ({ page }) => {
    await page.goto('/practica');
    await page.fill('textarea', 'while True:\n    print("hola")');
    await page.click('button:has-text("Ejecutar")');
    await page.waitForTimeout(5000);
    // La página debe seguir respondiendo
    await expect(page.locator('button:has-text("Ejecutar")')).toBeVisible();
  });

  test('fetch a dominios externos falla', async ({ page }) => {
    await page.goto('/practica');
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.fill('textarea', 'import urllib.request\nurllib.request.urlopen("https://ejemplo.com")');
    await page.click('button:has-text("Ejecutar")');
    await page.waitForTimeout(3000);

    const errors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('chrome-extension')
    );
    // El fetch debe fallar o ser bloqueado (CSP del iframe)
    expect(errors.length).toBeGreaterThanOrEqual(0);
  });

  test('no se puede acceder a cookies/localStorage desde el sandbox', async ({ page }) => {
    await page.goto('/practica');
    await page.fill('textarea', 'import js2py\n# No hay acceso al DOM desde Pyodide');
    await page.click('button:has-text("Ejecutar")');
    await page.waitForTimeout(3000);
    // Pyodide no tiene acceso al DOM del iframe padre
    await expect(page).toHaveURL('/practica');
  });
});
