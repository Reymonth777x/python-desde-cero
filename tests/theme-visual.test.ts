import { test, expect } from "@playwright/test";

const themes = ["original", "dark", "dracula", "cyberpunk", "hacker", "rosa"];
const routes = ["/", "/login", "/academia", "/practica", "/404", "/500", "/offline"];

test.describe("Temas visuales — cada página × cada tema", () => {
  for (const theme of themes) {
    for (const route of routes) {
      test(`${route} en tema ${theme}`, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem("python-desde-cero-theme", selectedTheme);
        }, theme);
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        // Esperar a que se apliquen los estilos
        await page.waitForTimeout(300);

        // No debe haber errores de consola
        const errors: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") errors.push(msg.text());
        });

        // Verificar colores calculados del body
        const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        const bodyColor = await page.evaluate(() => getComputedStyle(document.body).color);

        // Verificar que no haya scroll horizontal
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = page.viewportSize()!.width;
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);

        // Verificar que no haya errores de consola críticos
        expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);

        // Tomar captura
        await page.screenshot({
          path: `tests/screenshots/theme-${theme}-${route.replace(/\//g, "-")}.png`,
          fullPage: true,
        });
      });
    }
  }
});

test("Cada tema produce colores de fondo distintos", async ({ page }) => {
  const backgrounds: Record<string, string> = {};
  for (const theme of themes) {
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem("python-desde-cero-theme", selectedTheme);
    }, theme);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    backgrounds[theme] = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  }

  const uniqueBg = new Set(Object.values(backgrounds));
  expect(uniqueBg.size).toBeGreaterThan(1);
});

test("Cada tema produce colores de texto distintos", async ({ page }) => {
  const colors: Record<string, string> = {};
  for (const theme of themes) {
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem("python-desde-cero-theme", selectedTheme);
    }, theme);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    colors[theme] = await page.evaluate(() => getComputedStyle(document.body).color);
  }

  const uniqueColors = new Set(Object.values(colors));
  expect(uniqueColors.size).toBeGreaterThan(1);
});

test("Respetar prefers-reduced-motion", async ({ page }) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);

  const animations = await page.evaluate(() => {
    const seconds = (raw: string) => raw.split(",").map((part) => {
      const value = part.trim();
      const numeric = Number.parseFloat(value);
      if (!Number.isFinite(numeric)) return 0;
      return value.endsWith("ms") ? numeric / 1000 : numeric;
    });
    const all = document.querySelectorAll("*");
    let violations = 0;
    all.forEach((el) => {
      const cs = getComputedStyle(el);
      const durations = [
        ...seconds(cs.animationDuration),
        ...seconds(cs.transitionDuration),
      ];
      if (durations.some((duration) => duration > 0.001)) violations++;
    });
    return violations;
  });

  expect(animations).toBe(0);
});
