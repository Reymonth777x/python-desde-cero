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
    await page.waitForTimeout(250); // Let the CSS transition settle before reading computed colors.
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
    await page.waitForTimeout(250); // Let the CSS transition settle before reading computed colors.
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


test("La paleta de temas cabe completa en una pantalla móvil", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Seleccionar tema visual" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  const panel = page.getByRole("region", { name: "Tema visual" });
  await expect(panel).toBeVisible();
  await expect(panel.locator('button[aria-pressed]')).toHaveCount(7);

  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(360);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(640);

  const layout = await panel.evaluate((element) => {
    const firstOption = element.querySelector("button");
    const textContainer = firstOption?.querySelectorAll(":scope > span")[1];
    const label = textContainer?.querySelectorAll(":scope > span")[0];
    const description = textContainer?.querySelectorAll(":scope > span")[1];
    return {
      panelScrollWidth: element.scrollWidth,
      panelClientWidth: element.clientWidth,
      labelDisplay: label ? getComputedStyle(label).display : "",
      descriptionDisplay: description ? getComputedStyle(description).display : "",
      bodyScrollWidth: document.body.scrollWidth,
    };
  });

  expect(layout.panelScrollWidth).toBeLessThanOrEqual(layout.panelClientWidth);
  expect(layout.bodyScrollWidth).toBeLessThanOrEqual(360);
  expect(layout.labelDisplay).toBe("block");
  expect(layout.descriptionDisplay).toBe("block");

  await panel.getByRole("button", { name: /Hacker/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "hacker");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
