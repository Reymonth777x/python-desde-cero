import { test, expect } from '@playwright/test';

test.describe('Temas visuales', () => {
  test('muestra el selector y aplica los temas Original y Oscuro', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    const selector = page.getByRole('button', { name: 'Seleccionar tema visual' });
    const html = page.locator('html');

    await expect(selector).toBeVisible();
    await expect(html).toHaveAttribute('data-theme', 'original');

    await selector.click();
    await page.getByRole('button', { name: /^Original/ }).click();
    await expect(html).toHaveAttribute('data-theme', 'original');

    await selector.click();
    await page.getByRole('button', { name: /^Oscuro/ }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('python-desde-cero-theme'))).toBe('dark');
  });

  test('el tema elegido persiste tras recargar la página', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.getByRole('button', { name: 'Seleccionar tema visual' }).click();
    await page.getByRole('button', { name: /^Oscuro/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('python-desde-cero-theme'))).toBe('dark');
  });
});

test.describe('Ejemplos de portada', () => {
  const examples = [
    { title: 'Árbol fractal', marker: 'def rama(n):' },
    { title: 'Espiral geométrica', marker: 'range(200)' },
    { title: 'Arte con círculos', marker: 'range(36)' },
    { title: 'Visualización matemática', marker: 'math.radians(i)' },
    { title: 'Contador ascendente', marker: 'range(1, 11)' },
    { title: 'Cálculo de áreas', marker: 'def area_circulo(radio):' },
  ];

  test('los seis ejemplos reales son seleccionables y cargan su código', async ({ page }) => {
    await page.goto('/');
    const lab = page.locator('#ejemplo');
    const editor = lab.locator('textarea');

    await expect(lab).toBeVisible();
    for (const example of examples) {
      const button = lab.getByRole('button').filter({ hasText: example.title });
      await expect(button, `No se encontró el ejemplo "${example.title}"`).toBeVisible();
      await button.click();
      await expect.poll(() => editor.inputValue()).toContain(example.marker);
    }
  });
});

  test('acepta el ejemplo Turtle con Screen, shape y done', async ({ page }) => {
    await page.goto('/');

    const lab = page.locator('#ejemplo');
    const editor = lab.getByRole('textbox', { name: 'Código Python' });
    await editor.fill([
      'import turtle',
      'ventana = turtle.Screen()',
      'ventana.title("Ejemplo con Turtle - Python")',
      'ventana.bgcolor("white")',
      't = turtle.Turtle()',
      't.shape("turtle")',
      't.color("blue")',
      't.pensize(3)',
      'for _ in range(4):',
      '    t.forward(100)',
      '    t.right(90)',
      'turtle.done()',
    ].join('\n'));

    const ejecutar = lab.getByRole('button', { name: 'Ejecutar', exact: true });
    await ejecutar.click();

    const canvas = lab.getByRole('img', { name: 'Resultado gráfico de Turtle' });
    await expect(canvas).toBeVisible({ timeout: 90_000 });
    await expect(canvas.locator('line')).toHaveCount(4);
    await expect(canvas.locator('g[data-turtle-cursor="true"]')).toHaveCount(1);
    await expect(ejecutar).toBeEnabled({ timeout: 90_000 });

    await ejecutar.click();
    await expect(canvas.locator('line')).toHaveCount(4);
    await expect(canvas.locator('g[data-turtle-cursor="true"]')).toHaveCount(1);
    await expect(ejecutar).toBeEnabled({ timeout: 90_000 });
  });

test.describe('Turtle y fondo', () => {
  test('el ejemplo Árbol fractal ejecuta Python y dibuja el SVG', async ({ page }) => {
    await page.goto('/');

    const lab = page.locator('#ejemplo');
    await lab.getByRole('button').filter({ hasText: 'Árbol fractal' }).click();

    const ejecutar = lab.getByRole('button', { name: 'Ejecutar', exact: true });
    await expect(ejecutar).toBeVisible();
    await ejecutar.click();

    const canvas = lab.locator('svg');
    await expect(canvas).toBeVisible({ timeout: 90_000 });
    await expect(canvas.locator('rect[fill="black"]')).toBeVisible();
    await expect(canvas.locator('line[stroke="white"], line[stroke="lime"]')).not.toHaveCount(0, { timeout: 90_000 });
    await expect(ejecutar).toBeEnabled({ timeout: 90_000 });
  });
});

test.describe('Interfaz móvil y escritorio', () => {
  test('diseño móvil sin desbordamiento horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(395);
  });

  test('diseño escritorio renderiza componentes principales', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#ejemplo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Seleccionar tema visual' })).toBeVisible();
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
