import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./themes.css";
import { ThemeProvider } from "./theme-provider";
import { headers } from "next/headers";
import { isProductionSite, resolveSiteUrl } from "@/lib/site-url";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = resolveSiteUrl();
const isCanonicalProductionSite = isProductionSite(siteUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  robots: {
    index: isCanonicalProductionSite,
    follow: isCanonicalProductionSite,
  },
  title: {
    template: "%s | Python desde cero",
    default: "Python desde cero",
  },
  description:
    "Python desde cero es una plataforma educativa para aprender programación paso a paso, practicar código y desarrollar habilidades desde una computadora, tableta o teléfono.",
  openGraph: {
    type: "website",
    locale: "es_CR",
    siteName: "Python desde cero",
    title: "Python desde cero",
    description:
      "Aprende Python paso a paso, practica código y avanza desde tu computadora, tableta o teléfono.",
    images: [
      {
        url: "/academy-icon.svg",
        width: 512,
        height: 512,
        alt: "Python desde cero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Python desde cero",
    description:
      "Aprende Python paso a paso y practica código desde tu teléfono o computadora.",
    images: ["/academy-icon.svg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading request headers makes nonce-bearing pages render per request.
  await headers();

  return (
    <html lang="es" data-theme="original" data-color-scheme="original">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
