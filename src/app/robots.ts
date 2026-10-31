import type { MetadataRoute } from "next";
import { isProductionSite, resolveSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();
  if (!isProductionSite(siteUrl)) {
    return {
      rules: [{ userAgent: "*", disallow: ["/"] }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/muestra", "/login", "/login/forgot-password", "/login/reset-password"],
        disallow: ["/academia", "/estudiante", "/practica", "/admin", "/api", "/auth", "/python-runner"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
