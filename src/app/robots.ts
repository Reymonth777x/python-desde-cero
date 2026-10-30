import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/muestra", "/login", "/login/forgot-password", "/login/reset-password"],
        disallow: ["/academia", "/estudiante", "/practica", "/admin", "/api", "/auth", "/python-runner"],
      },
    ],
    sitemap: "https://python-desdecero.com/sitemap.xml",
  };
}
