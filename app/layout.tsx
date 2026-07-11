import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Марина Филина — Внештатный арт-директор бренда",
  description: "Портфолио Марины Филиной. Бренд-дизайнер. Создам образ бренда, продающий вашу идею.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full bg-(--color-background) text-(--color-text) font-sans">
        <LenisProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </LenisProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
