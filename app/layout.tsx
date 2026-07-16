import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui";
import { getSiteUrl } from "@/lib/site";

const dunkinDisplay = localFont({
  src: "../public/fonts/dunkin/Dunkin_Sans_Bold.otf",
  variable: "--font-display",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    template: "%s | Dunkin Colombia",
  },
  description:
    "Descubre qué dice tu bebida favorita de Dunkin sobre tu personalidad. Campaña oficial de Dunkin Colombia.",
  keywords: [
    "Dunkin Colombia",
    "campaña Dunkin",
    "personalidad Dunkin",
    "bebida Dunkin",
    "dime qué tomas",
    "Bogotá",
    "café Dunkin",
  ],
  authors: [{ name: "Dunkin Colombia" }],
  creator: "Dunkin Colombia",
  publisher: "Dunkin Colombia",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: ["/favicon.ico"],
    apple: [
      {
        url: "/assets/quiz-intro/logo/dunkin-logo.png",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: `${siteUrl}/quiz`,
    siteName: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    title: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    description:
      "Descubre qué dice tu bebida favorita de Dunkin sobre tu personalidad. Campaña oficial de Dunkin Colombia.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Campaña Dunkin Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dunkin_co",
    creator: "@dunkin_co",
    title: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    description:
      "Descubre qué dice tu bebida favorita de Dunkin sobre tu personalidad. Campaña oficial de Dunkin Colombia.",
    images: ["/og-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
      </head>
      <body className={dunkinDisplay.variable} suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
