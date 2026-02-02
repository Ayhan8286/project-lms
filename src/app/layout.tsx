import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConfettiProvider } from "@/components/providers/ConfettiProvider";
import { SearchCommand } from "@/components/SearchCommand";
import { AffiliateTracker } from "@/components/AffiliateTracker";
import { LanguageProvider } from "@/lib/i18n/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al Huda Network",
  description: "Quranic Education Platform",
  icons: {
    icon: "/logo.png", // Assuming we have a logo
    apple: "/logo.png",
  },
  openGraph: {
    title: "Al Huda Network",
    description: "Learn Quran Online with Expert Teachers",
    url: "https://alhuda.network",
    siteName: "Al Huda Network",
    images: [
      {
        url: "/og-image.jpg", // Placeholder
        width: 1200,
        height: 630,
      }
    ],
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#059669" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ConfettiProvider />
              <SearchCommand />
              <Toaster />
              <Suspense fallback={null}>
                <AffiliateTracker />
              </Suspense>
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
