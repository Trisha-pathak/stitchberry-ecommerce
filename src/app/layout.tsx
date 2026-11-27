import type { Metadata } from "next";
import { Fredoka, Quicksand, Caveat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import {
  YarnCursor,
  FallingWoolThreads,
  RollingYarnTracker,
  FloatingCraftMotifs,
  RouteWoolLoader,
} from "@/components/PastelAnimations";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "StitchBerry — Handmade Crochet Treasures & Custom Embroidery Studio",
  description:
    "A pastel fantasy crochet and custom embroidery studio. Shop ready-made crochet bouquets, plushies & bags, design custom crochet pre-orders, or book doorstep pickup embroidery for your clothes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${quicksand.variable} ${caveat.variable}`}
    >
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <RouteWoolLoader />
          <YarnCursor />
          <FallingWoolThreads />
          <RollingYarnTracker />
          <FloatingCraftMotifs />
          <Navbar />
          <CartDrawer />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
          <WhatsAppWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
