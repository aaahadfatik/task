import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { FavoritesProvider } from "@/hooks/use-favorites";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Indigo Commerce Dashboard",
  description: "Product management dashboard built with Next.js and shadcn/ui."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FavoritesProvider>
            <div className="min-h-screen">
              <SiteHeader />
              <main className="container py-10">{children}</main>
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
