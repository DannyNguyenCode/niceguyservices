import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LO_TAGLINE } from "@/components/templates/demos/liquid-occasions/liquidOccasionsConfig";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-lo-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-lo-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Liquid Occasions — Premium Event Planning (demo) | Nice Guy Web Design",
  description: `${LO_TAGLINE}. Multi-route premium event planning demo with journey form, experiences, portfolio, and process — placeholder copy only.`,
  robots: { index: false, follow: true },
};

export default function LiquidOccasionsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`lo-root ${playfair.variable} ${plusJakarta.variable} min-h-dvh bg-[var(--lo-background)] text-[var(--lo-on-background)] antialiased selection:bg-[var(--lo-secondary-container)] selection:text-[var(--lo-on-secondary-container)]`}
        style={{ fontFamily: "var(--font-lo-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        {children}
      </div>
    </>
  );
}
