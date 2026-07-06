import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The House Of Karji — Curated Luxury Fragrances | Premium Perfume Atelier",
  description: "Discover curated luxury fragrances from the world's finest perfume houses. Authentic parfum, extrait de parfum, and artisanal scents with secure worldwide shipping.",
  keywords: ["luxury perfume", "fragrance", "parfum", "extrait de parfum", "oud", "niche perfume", "The House Of Karji"],
  authors: [{ name: "The House Of Karji" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "The House Of Karji — Curated Luxury Fragrances",
    description: "Premium parfum, extrait de parfum & artisanal scents from the world's finest houses.",
    siteName: "The House Of Karji",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The House Of Karji — Curated Luxury Fragrances",
    description: "Premium parfum, extrait de parfum & artisanal scents.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
