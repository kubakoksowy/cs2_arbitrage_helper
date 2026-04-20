import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CS Investment Tracker",
  description: "Track your CS2 skin investments, monitor profits, and manage your inventory. Free tool for Counter-Strike 2 traders.",
  keywords: ["CS2", "Counter-Strike 2", "skins", "investment tracker", "CS2 trading", "skin prices", "inventory manager", "profit tracker"],
  openGraph: {
    title: "CS Investment Tracker",
    description: "Track your CS2 skin investments, monitor profits, and manage your inventory.",
    type: "website",
    url: "https://cs2-tracker.vercel.app",
    siteName: "CS Investment Tracker",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "CS Investment Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS Investment Tracker",
    description: "Track your CS2 skin investments, monitor profits, and manage your inventory.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}