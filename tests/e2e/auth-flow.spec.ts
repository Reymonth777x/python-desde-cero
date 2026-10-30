import { test, expect } from '@playwright/test';

test.describe('Autenticacion y flujo de usuario', () => {
  test.use({ baseURL: 'http://localhost:3000' });

  test('Pagina principal carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('La primera lección real puede probarse sin iniciar sesión', async ({ page }) => {
    await page.goto('/muestra');

    await expect(page).toHaveURL(new RegExp('/muestra$'));
    await expect(page.getByRole('heading', { name: 'Resolver problemas mediante algoritmos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tu código Python' })).toBeVisible();
    await expect(page.getByTestId('python-editor-frame')).toBeVisible();
    await expect(page.getByText(/Esta muestra no guarda código, respuestas ni progreso/)).toBeVisible();
    await expect(page.getByText('¿Qué describe mejor un algoritmo?')).toHaveCount(0);
  });

  test('Pagina de login carga con ambos formularios', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /Bienvenido de vuelta/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
  });

  test('Los campos de registro e inicio permanecen separados al cambiar de formulario', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Correo electrónico').fill('login@example.test');
    await page.getByLabel('Contraseña').fill('LoginPass123');

    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click();
    await expect(page.getByLabel('Correo electrónico')).toHaveValue('');
    await expect(page.getByLabel('Contraseña')).toHaveValue('');

    await page.getByLabel('Nombre completo').fill('Estudiante de prueba');
    await page.getByLabel('Correo electrónico').fill('signup@example.test');
    await page.getByLabel('Contraseña').fill('SignupPass123');

    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page.getByLabel('Correo electrónico')).toHaveValue('');
    await expect(page.getByLabel('Contraseña')).toHaveValue('');
  });

  test('Visitante anonimo es redirigido al acceder a rutas protegidas', async ({ page }) => {
    await page.goto('/academia');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Mensaje de error se muestra tras inicio de sesion fallido', async ({ page }) => {
    await page.goto('/login?error=login');
    await page.waitForLoadState('domcontentloaded');
    const alert = page.getByRole('alert').filter({ hasText: /No se pudo iniciar ses./ });
    await expect(alert).toBeVisible();
  });

  test('Mensaje de exito se muestra tras registro', async ({ page }) => {
    await page.goto('/login?message=check-email');
    await page.waitForLoadState('domcontentloaded');
    const status = page.getByRole('status').filter({ hasText: /Cuenta creada\. Revisa tu correo/ });
    await expect(status).toBeVisible();
  });

  test('Mensaje de exito se muestra tras recuperacion de contrasena', async ({ page }) => {
    await page.goto('/login/forgot-password?message=sent');
    await page.waitForLoadState('domcontentloaded');
    const status = page.getByRole('status').filter({ hasText: /Si la cuenta existe/ });
    await expect(status).toBeVisible();
  });
});

test.describe('Flujos de autenticacion completos', () => {
  test.use({ baseURL: 'http://localhost:3000' });

  test('Ruta protegida sin sesion redirige a login', async ({ page }) => {
    await page.goto('/academia');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.url()).toContain('/login');
  });

  test('Pagina de administracion sin sesion redirige a login', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.url()).toContain('/login');
  });

  test('Panel de estudiante sin sesion redirige a login', async ({ page }) => {
    await page.goto('/estudiante');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.url()).toContain('/login');
  });
});

test.describe('Responsividad', () => {
  test.use({ baseURL: 'http://localhost:3000' });

  test('Login en movil (360px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /Bienvenido de vuelta/ })).toBeVisible();
  });

  test('Login en tableta (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /Bienvenido de vuelta/ })).toBeVisible();
  });

  test('Login en escritorio (1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /Bienvenido de vuelta/ })).toBeVisible();
  });
});