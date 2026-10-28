import type { Metadata } from "next";
import localFont from "next/font/local";
import { connection } from "next/server";
import "./globals.css";
import "./themes.css";
import { ThemeProvider } from "./theme-provider";

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

export const metadata: Metadata = {
  title: "Python desde cero",
  description:
    "Python desde cero es una plataforma educativa para aprender programación paso a paso, practicar código y desarrollar habilidades desde una computadora, tableta o teléfono.",
  openGraph: {
    type: "website",
    locale: "es_CR",
    siteName: "Python desde cero",
    title: "Python desde cero",
    description:
      "Aprende Python paso a paso, practica código y avanza desde tu computadora, tableta o teléfono.",
  },
  twitter: {
    card: "summary",
    title: "Python desde cero",
    description:
      "Aprende Python paso a paso y practica código desde tu teléfono o computadora.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce-based CSP requires a per-request render so Next.js can attach the nonce to inline scripts.
  await connection();
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
