# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: acceptance.test.ts >> Turtle y fondo >> SVG se renderiza tras ejecutar Ãrbol fractal
- Location: tests\acceptance.test.ts:62:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

```

# Test source

```ts
  1   | ﻿import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Temas visuales', () => {
  4   |   test('muestra el selector de temas y aplica los 5 temas', async ({ page }) => {
  5   |     await page.goto('/');
  6   | 
  7   |     // El selector de temas es un botÃ³n toggle con aria-label
  8   |     const selector = page.locator('[aria-label="Seleccionar tema visual"]');
  9   |     await expect(selector).toBeVisible();
  10  | 
  11  |     const html = page.locator('html');
  12  |     await expect(html).toHaveAttribute('data-theme', 'original');
  13  | 
  14  |     const nombres = ['Original', 'Oscuro', 'Hacker', 'Dracula', 'Cyberpunk'];
  15  |     const valores = ['original', 'dark', 'hacker', 'dracula', 'cyberpunk'];
  16  | 
  17  |     for (let i = 0; i < nombres.length; i++) {
  18  |       // Abrir el menÃº desplegable del selector
  19  |       await selector.click();
  20  |       // Hacer clic en la opciÃ³n del menÃº (dentro del contenedor desplegado)
  21  |       const opcion = page.locator('div[class*="absolute right-0"]').locator(`button:has-text("${nombres[i]}")`);
  22  |       await expect(opcion.first()).toBeVisible();
  23  |       await opcion.first().click();
  24  |       await expect(html).toHaveAttribute('data-theme', valores[i]);
  25  |     }
  26  |   });
  27  | 
  28  |   test('el tema persiste tras recargar la pÃ¡gina', async ({ page }) => {
  29  |     await page.goto('/');
  30  | 
  31  |     const selector = page.locator('[aria-label="Seleccionar tema visual"]');
  32  |     await selector.click();
  33  |     await page.locator('div[class*="absolute right-0"]').locator('button:has-text("Hacker")').first().click();
  34  |     await expect(page.locator('html')).toHaveAttribute('data-theme', 'hacker');
  35  | 
  36  |     await page.reload();
  37  |     await expect(page.locator('html')).toHaveAttribute('data-theme', 'hacker');
  38  |   });
  39  | });
  40  | 
  41  | test.describe('Ejemplos de portada', () => {
  42  |   test('los 6 ejemplos son seleccionables', async ({ page }) => {
  43  |     await page.goto('/');
  44  | 
  45  |     const nombres = [
  46  |       'Ãrbol fractal',
  47  |       'Espiral geomÃ©trica',
  48  |       'Arte con cÃ­rculos',
  49  |       'VisualizaciÃ³n matemÃ¡tica',
  50  |       'Saludo interactivo',
  51  |       'Reto de lÃ³gica',
  52  |     ];
  53  | 
  54  |     for (const nombre of nombres) {
  55  |       const btn = page.locator(`button:has-text("${nombre}")`);
  56  |       await expect(btn).toBeVisible();
  57  |     }
  58  |   });
  59  | });
  60  | 
  61  | test.describe('Turtle y fondo', () => {
  62  |   test('SVG se renderiza tras ejecutar Ãrbol fractal', async ({ page }) => {
> 63  |     await page.goto('/');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3001/
  64  | 
  65  |     await page.locator('button:has-text("Ãrbol fractal")').click();
  66  | 
  67  |     const ejecutar = page.locator('button:has-text("Ejecutar")');
  68  |     await expect(ejecutar).toBeVisible();
  69  |     await ejecutar.click();
  70  | 
  71  |     // Esperar a que Pyodide procese y genere el SVG
  72  |     await page.waitForTimeout(10000);
  73  | 
  74  |     const svg = page.locator('svg');
  75  |     await expect(svg).toBeVisible();
  76  | 
  77  |     // Verificar fondo negro
  78  |     const rectNegro = page.locator('rect[fill="black"]');
  79  |     await expect(rectNegro.first()).toBeVisible();
  80  | 
  81  |     // Verificar lÃ­neas blancas y verdes
  82  |     const lineasBlancas = page.locator('line[stroke="white"]');
  83  |     const lineasVerdes = page.locator('line[stroke="lime"]');
  84  | 
  85  |     const totalLineas = await lineasBlancas.count() + await lineasVerdes.count();
  86  |     expect(totalLineas).toBeGreaterThan(0);
  87  | 
  88  |     // Limpiar grÃ¡fico
  89  |     const limpiar = page.locator('button:has-text("Limpiar grÃ¡fico")');
  90  |     if (await limpiar.isVisible()) {
  91  |       await limpiar.click();
  92  |       await page.waitForTimeout(1000);
  93  |       const lineasDespues = await page.locator('line').count();
  94  |       expect(lineasDespues).toBe(0);
  95  |     }
  96  | 
  97  |     // Reejecutar
  98  |     await ejecutar.click();
  99  |     await page.waitForTimeout(10000);
  100 |     const svgDespues = page.locator('svg');
  101 |     await expect(svgDespues).toBeVisible();
  102 |   });
  103 | });
  104 | 
  105 | test.describe('Interfaz mÃ³vil y escritorio', () => {
  106 |   test('diseÃ±o mÃ³vil sin desbordamiento horizontal', async ({ page }) => {
  107 |     await page.setViewportSize({ width: 375, height: 667 });
  108 |     await page.goto('/');
  109 | 
  110 |     const ancho = await page.evaluate(() => document.documentElement.scrollWidth);
  111 |     expect(ancho).toBeLessThanOrEqual(395);
  112 |   });
  113 | 
  114 |   test('diseÃ±o escritorio renderiza componentes', async ({ page }) => {
  115 |     await page.setViewportSize({ width: 1280, height: 800 });
  116 |     await page.goto('/');
  117 | 
  118 |     await expect(page.locator('h1')).toBeVisible();
  119 |     await expect(page.locator('#ejemplo')).toBeVisible();
  120 |     await expect(page.locator('[aria-label="Seleccionar tema visual"]')).toBeVisible();
  121 |   });
  122 | });
  123 | 
  124 | test.describe('Rutas de autenticaciÃ³n', () => {
  125 |   test('carga login', async ({ page }) => {
  126 |     await page.goto('/login');
  127 |     await expect(page.locator('h1')).toBeVisible();
  128 |   });
  129 | 
  130 |   test('carga forgot-password', async ({ page }) => {
  131 |     await page.goto('/login/forgot-password');
  132 |     await expect(page.locator('h1')).toContainText('Recuperar contraseÃ±a');
  133 |   });
  134 | 
  135 |   test('carga reset-password', async ({ page }) => {
  136 |     await page.goto('/login/reset-password');
  137 |   });
  138 | 
  139 |   test('/practica redirige a login sin sesiÃ³n', async ({ page }) => {
  140 |     await page.goto('/practica');
  141 |     await expect(page).toHaveURL(/\/login/);
  142 |   });
  143 | 
  144 |   test('/academia redirige a login sin sesiÃ³n', async ({ page }) => {
  145 |     await page.goto('/academia');
  146 |     await expect(page).toHaveURL(/\/login/);
  147 |   });
  148 | 
  149 |   test('carga auth/callback', async ({ page }) => {
  150 |     await page.goto('/auth/callback');
  151 |   });
  152 | });
  153 | 
```