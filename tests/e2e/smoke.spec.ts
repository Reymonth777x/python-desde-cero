import { expect, test } from '@playwright/test';

test('homepage renders course entry points', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();

  await expect(
    page.getByRole('heading', { level: 1, name: 'Aprende Python, una idea clara a la vez.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Entrar a la academia' })).toBeVisible();
});

test('login page exposes usable credential fields and recovery link', async ({ page }) => {
  const response = await page.goto('/login');
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole('heading', { level: 1, name: 'Bienvenido de vuelta' })).toBeVisible();
  await expect(page.getByLabel('Correo electrónico')).toHaveAttribute('type', 'email');
  await expect(page.getByLabel('Contraseña')).toHaveAttribute('type', 'password');
  await expect(page.getByRole('link', { name: 'Solicita restablecimiento' })).toHaveAttribute(
    'href',
    '/login/forgot-password',
  );
});

test('visual theme menu can be opened and a theme selected', async ({ page }) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Seleccionar tema visual' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');

  await page.getByRole('button', { name: /Drácula/ }).click();

  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dracula');
});

test('homepage has no horizontal page overflow at the active viewport', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport + 1);
});
