import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Talentopia — Gioco educativo",
  description:
    "Talentopia: quiz, corsi e minigiochi per ragazzi 10-13 anni. Guadagna XP, monete e badge!",
  icons: {
    icon: "/favicon.svg",
  },
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
