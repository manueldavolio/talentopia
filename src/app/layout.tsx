import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

const APP_ICON = "/icon-512.png";

export const metadata: Metadata = {
  title: "Talentopia — Gioco educativo",
  description:
    "Talentopia: quiz, corsi e minigiochi per ragazzi 10-13 anni. Guadagna XP, monete e badge!",
  applicationName: "Talentopia",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Talentopia",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: APP_ICON, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: APP_ICON, sizes: "512x512", type: "image/png" },
    ],
    shortcut: APP_ICON,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e1b4b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
