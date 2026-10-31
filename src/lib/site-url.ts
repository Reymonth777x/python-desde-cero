export const PRODUCTION_SITE_ORIGIN = "https://python-desdecero.com";

export function resolveSiteUrl(configuredUrl = process.env.NEXT_PUBLIC_SITE_URL) {
  const candidate = typeof configuredUrl === "string" && configuredUrl.trim()
    ? configuredUrl.trim()
    : PRODUCTION_SITE_ORIGIN;

  const url = (() => {
    try {
      return new URL(candidate);
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL debe ser una URL absoluta válida.");
    }
  })();

  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL debe contener solo el origen del sitio.");
  }

  return new URL(url.origin);
}

export function isProductionSite(siteUrl: URL) {
  return siteUrl instanceof URL && siteUrl.origin === PRODUCTION_SITE_ORIGIN;
}
