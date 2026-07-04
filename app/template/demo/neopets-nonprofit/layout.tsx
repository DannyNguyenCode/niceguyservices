import { Plus_Jakarta_Sans, Quicksand, Caveat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NeopetsHeader } from "@/components/templates/demos/neopets-nonprofit/NeopetsHeader";
import { NeopetsLayoutChrome } from "@/components/templates/demos/neopets-nonprofit/NeopetsLayoutChrome";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-np-headline",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-np-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-np-handwritten",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neopets Nonprofit — Toronto Adopt-A-Pet (demo) | Nice Guy Web Design",
  description:
    "Fictional multi-page nonprofit scrapbook demo — rescue alerts, explorer, quests, library, and lost & found; not a real shelter.",
  robots: { index: false, follow: true },
};

export default function NeopetsNonprofitLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${quicksand.variable} ${plusJakarta.variable} ${caveat.variable} np-material np-paper-texture-fine min-h-dvh bg-[#fff8f2] text-[#1f1b14] antialiased selection:bg-[#8fd3ff]`}
        style={{
          fontFamily: "var(--font-np-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <NeopetsHeader />

        <NeopetsLayoutChrome>{children}</NeopetsLayoutChrome>
      </div>
    </>
  );
}
