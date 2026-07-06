import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dunkin-colombia-campaign.com"),
  title: {
    default: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    template: "%s | Dunkin Colombia",
  },
  description: "Descubre qué dice tu bebida favorita de Dunkin sobre tu personalidad. Campaña oficial de Dunkin Colombia.",
  keywords: ["Dunkin Colombia", "campaña Dunkin", "personalidad Dunkin", "bebida Dunkin", "dime qué tomas", "Bogotá", "café Dunkin"],
  authors: [{ name: "Dunkin Colombia" }],
  creator: "Dunkin Colombia",
  publisher: "Dunkin Colombia",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://dunkin-colombia-campaign.com",
    siteName: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    title: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    description: "Descubre qué dice tu bebida favorita de Dunkin sobre tu personalidad. Campaña oficial de Dunkin Colombia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Campaña Dunkin Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DunkinColombia",
    creator: "@DunkinColombia",
    title: "Dime qué tomas y te diré quién eres | Dunkin Colombia",
    description: "Descubre qué dice tu bebida favorita de Dunkin sobre tu personalidad. Campaña oficial de Dunkin Colombia.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
