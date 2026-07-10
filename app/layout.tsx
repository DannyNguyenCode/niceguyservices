import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { cookies } from "next/headers";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { dataThemeName, parseStoredColorMode } from "@/lib/themes/siteTheme";
import { BUSINESS, getSiteUrl } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nice Guy Web Design | Toronto Small Business Websites",
    template: "%s | Nice Guy Web Design",
  },
  description:
    "Custom websites and SEO-ready builds for Toronto and GTA small businesses. Fast, maintainable websites designed to improve visibility, generate leads, and support long-term growth.",
  verification: {
    google: "SVu4bQTn5qjJHWHKw6pz34Ob__tmftRjWWFkMecbU_Q",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: BUSINESS.name,
    title: "Nice Guy Web Design | Toronto Small Business Websites",
    description:
      "Custom websites and SEO-ready builds for Toronto and GTA small businesses — designed to improve visibility, generate leads, and stay easy to maintain.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nice Guy Web Design — Toronto small business websites",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nice Guy Web Design | Toronto Small Business Websites",
    description:
      "Custom websites and SEO-ready builds for Toronto and GTA small businesses.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialColorMode = parseStoredColorMode(cookieStore.get("theme")?.value);
  const dataTheme = dataThemeName(initialColorMode);

  return (
    <html lang="en" data-theme={dataTheme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteJsonLd />
        <ThemeProvider initialTheme={initialColorMode}>{children}</ThemeProvider>

      </body>
    </html>
  );
}
