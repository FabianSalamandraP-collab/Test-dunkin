import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Panel administrativo de la campaña de Dunkin' Colombia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
