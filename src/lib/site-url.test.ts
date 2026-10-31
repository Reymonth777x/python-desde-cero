import { describe, expect, it } from "vitest";
import {
  isProductionSite,
  PRODUCTION_SITE_ORIGIN,
  resolveSiteUrl,
} from "./site-url";

describe("origen público de la aplicación", () => {
  it("usa el dominio canonical como fallback", () => {
    expect(resolveSiteUrl(undefined).origin).toBe(PRODUCTION_SITE_ORIGIN);
  });

  it("acepta el origen configurado de una aplicación de auditoría", () => {
    const siteUrl = resolveSiteUrl("https://python-desdecero-audit.example.workers.dev");
    expect(siteUrl.origin).toBe("https://python-desdecero-audit.example.workers.dev");
    expect(isProductionSite(siteUrl)).toBe(false);
  });

  it("identifica únicamente el origen canonical de producción para indexación", () => {
    expect(isProductionSite(resolveSiteUrl("https://python-desdecero.com"))).toBe(true);
    expect(isProductionSite(resolveSiteUrl("http://localhost:3000"))).toBe(false);
    expect(isProductionSite(resolveSiteUrl("https://www.python-desdecero.com"))).toBe(false);
  });

  it("rechaza rutas, credenciales y parámetros en NEXT_PUBLIC_SITE_URL", () => {
    for (const value of [
      "https://python-desdecero.com/path",
      "https://user:secret@python-desdecero.com",
      "https://python-desdecero.com/?next=/admin",
      "not-a-url",
    ]) {
      expect(() => resolveSiteUrl(value)).toThrow();
    }
  });
});
