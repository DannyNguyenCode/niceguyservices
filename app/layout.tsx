import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { cookies } from 'next/headers';
import ThemeProvider from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nice Guy Services",
  description: "Building and maintaining clean, modern websites giving you more time to focus on what matters.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get('theme')?.value ?? 'retro') as 'retro' | 'dark';

  return (
    <html lang="en" data-theme={'retro'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider initialTheme={theme}>
          <Navigation />
          <div id="content-container">
            {children}
          </div>
          <Footer />
        </ThemeProvider>

      </body>
    </html>
  );
}
