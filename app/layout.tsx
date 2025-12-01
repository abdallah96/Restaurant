import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCartBar } from "@/components/order/MobileCartBar";
import { FloatingCart } from "@/components/order/FloatingCart";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Keur Gui - Restaurant Sénégalais | Fast Food & Menu du Jour",
  description: "Découvrez les saveurs authentiques du Sénégal avec notre fast food et notre menu du jour traditionnel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        {children}
        <Footer />
        <MobileCartBar />
        <FloatingCart />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
