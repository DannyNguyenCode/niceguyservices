import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import DeferredMaterialSymbols from "@/components/DeferredMaterialSymbols";
import { cookies } from "next/headers";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { dataThemeName, parseStoredColorMode } from "@/lib/themes/siteTheme";
import { BUSINESS, getSiteUrl } from "@/lib/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <SiteJsonLd />
        <DeferredMaterialSymbols />
        <ThemeProvider initialTheme={initialColorMode}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
