import { expect, test } from '@playwright/test';

test('El visitante puede abrir y ejecutar la muestra real antes del registro', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Probar la primera lección/ }).click();

  await expect(page).toHaveURL('http://localhost:3000/muestra');
  await expect(
    page.getByRole('heading', { name: 'Resolver problemas mediante algoritmos' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Tu código Python' })).toBeVisible();
  await expect(page.getByTestId('python-editor-frame')).toBeVisible();
  await expect(
    page.getByText(/Esta muestra no guarda código, respuestas ni progreso/),
  ).toBeVisible();

  await expect(page.getByTestId('python-run')).toBeEnabled();
  await page.getByTestId('python-run').click();
  await expect(page.getByTestId('python-output')).toContainText('1800', { timeout: 90_000 });
  await expect(page.getByText('¿Qué describe mejor un algoritmo?')).toHaveCount(0);
});
