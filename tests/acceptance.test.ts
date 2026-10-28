import { test, expect } from '@playwright/test';

test.describe('Temas visuales', () => {
  test('muestra el selector de temas y aplica los 2 temas', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('[aria-label="Seleccionar tema visual"]');
    await expect(selector).toBeVisible();

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'original');

    const nombres = ['Original', 'Oscuro'];
    const valores = ['original', 'dark'];

    for (let i = 0; i < nombres.length; i++) {
      await selector.click();
      const opcion = page.locator('div[class*="absolute right-0"]').locator(`button:has-text("${nombres[i]}")`);
      await expect(opcion.first()).toBeVisible();
      await opcion.first().click();
      await expect(html).toHaveAttribute('data-theme', valores[i]);
    }
  });

  test('el tema persiste tras recargar la página', async ({ page }) => {
    await page.goto('/');

    const selector = page.locator('[aria-label="Seleccionar tema visual"]');
    await selector.click();
    await page.locator('div[class*="absolute right-0"]').locator('button:has-text("Oscuro")').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('Ejemplos de portada', () => {
  test('los 6 ejemplos son seleccionables', async ({ page }) => {
    await page.goto('/');

    const nombres = [
      'Árbol fractal',
      'Espiral geométrica',
      'Arte con círculos',
      'Visualización matemática',
      'Saludo interactivo',
      'Reto de lógica',
    ];

    for (const nombre of nombres) {
      const btn = page.locator(`button:has-text("${nombre}")`);
      await expect(btn).toBeVisible();
    }
  });
});

test.describe('Turtle y fondo', () => {
  test('SVG se renderiza tras ejecutar Árbol fractal', async ({ page }) => {
    await page.goto('/');

    await page.locator('button:has-text("Árbol fractal")').click();

    const ejecutar = page.locator('button:has-text("Ejecutar")');
    await expect(ejecutar).toBeVisible();
    await ejecutar.click();

    await page.waitForTimeout(10000);

    const svg = page.locator('svg');
    await expect(svg).toBeVisible();

    const rectNegro = page.locator('rect[fill="black"]');
    await expect(rectNegro.first()).toBeVisible();

    const lineasBlancas = page.locator('line[stroke="white"]');
    const lineasVerdes = page.locator('line[stroke="lime"]');

    const totalLineas = await lineasBlancas.count() + await lineasVerdes.count();
    expect(totalLineas).toBeGreaterThan(0);

    const limpiar = page.locator('button:has-text("Limpiar gráfico")');
    if (await limpiar.isVisible()) {
      await limpiar.click();
      await page.waitForTimeout(1000);
      const lineasDespues = await page.locator('line').count();
      expect(lineasDespues).toBe(0);
    }

    await ejecutar.click();
    await page.waitForTimeout(10000);
    const svgDespues = page.locator('svg');
    await expect(svgDespues).toBeVisible();
  });
});

test.describe('Interfaz móvil y escritorio', () => {
  test('diseño móvil sin desbordamiento horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(ancho).toBeLessThanOrEqual(395);
  });

  test('diseño escritorio renderiza componentes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#ejemplo')).toBeVisible();
    await expect(page.locator('[aria-label="Seleccionar tema visual"]')).toBeVisible();
  });
});

test.describe('Rutas de autenticación', () => {
  test('carga login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('carga forgot-password', async ({ page }) => {
    await page.goto('/login/forgot-password');
    await expect(page.locator('h1')).toContainText('Recuperar contraseña');
  });

  test('carga reset-password', async ({ page }) => {
    await page.goto('/login/reset-password');
  });

  test('/practica redirige a login sin sesión', async ({ page }) => {
    await page.goto('/practica');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/academia redirige a login sin sesión', async ({ page }) => {
    await page.goto('/academia');
    await expect(page).toHaveURL(/\/login/);
  });

  test('carga auth/callback', async ({ page }) => {
    await page.goto('/auth/callback');
  });
});
