import { expect, test } from '@playwright/test';

const mobileWidths = [320, 360, 390];

async function expectTouchTarget(button: import('@playwright/test').Locator, width: number) {
  await expect(button).toBeVisible();
  const bounds = await button.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.height).toBeGreaterThanOrEqual(48);
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
}

test('Los laboratorios mantienen controles cómodos y visibles en móviles', async ({ page }) => {
  for (const width of mobileWidths) {
    await page.setViewportSize({ width, height: 740 });

    await page.goto('/');
    const portada = page.locator('#ejemplo');
    await portada.scrollIntoViewIfNeeded();

    await expect(portada.getByRole('heading', { name: 'Laboratorio de Python' })).toBeVisible();
    await expectTouchTarget(
      portada.getByRole('button', { name: 'Ejecutar', exact: true }),
      width,
    );
    await expectTouchTarget(
      portada.getByRole('button', { name: 'Restaurar ejemplo', exact: true }),
      width,
    );

    const homeWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(homeWidth, `La portada desborda a ${width}px`).toBeLessThanOrEqual(width);

    await page.goto('/muestra');
    await expect(page.getByTestId('python-editor-frame')).toBeVisible();

    await expectTouchTarget(page.getByTestId('python-run'), width);
    await expectTouchTarget(
      page.getByRole('button', { name: 'Restaurar ejemplo', exact: true }),
      width,
    );

    const sampleWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sampleWidth, `La muestra desborda a ${width}px`).toBeLessThanOrEqual(width);
  }
});
