import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { cookies } from "next/headers";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { parseStoredColorMode } from "@/lib/themes/siteTheme";
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
  title: "Nice Guy Web Design — Toronto & GTA small business websites",
  description:
    "Nice Guy Web Design — custom websites for small businesses in Toronto and the GTA. Fast, maintainable builds with clear communication and ongoing support.",
  verification: {
    google: "SVu4bQTn5qjJHWHKw6pz34Ob__tmftRjWWFkMecbU_Q",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: BUSINESS.name,
    title: "Nice Guy Web Design — Toronto & GTA small business websites",
    description:
      "Custom websites for small businesses in Toronto and the GTA — fast, SEO-ready, and fully supported.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nice Guy Web Design",
    description:
      "Custom websites for small businesses in Toronto and the GTA — fast, SEO-ready, and fully supported.",
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
  const dataTheme =
    initialColorMode === "dark" ? "niceguys-dark" : "niceguys-light";

  return (
    <html lang="en" data-theme={dataTheme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteJsonLd />
        <ThemeProvider initialTheme={initialColorMode}>
          <Navigation />
          <main id="content-container">
            {children}
          </main>
          <Footer />
        </ThemeProvider>

      </body>
    </html>
  );
}
