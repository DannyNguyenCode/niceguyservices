import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LuminaFooter } from "@/components/templates/demos/lumina-landscapes/LuminaFooter";
import { LuminaNav } from "@/components/templates/demos/lumina-landscapes/LuminaNav";

export const metadata: Metadata = {
  title: "Lumina Landscapes — Landscape Studio (demo) | Nice Guy Web Design",
  description:
    "Premium single-page landscape architecture studio demo — cinematic outdoor retreats, material library, design process journey, and consultation intake. Fictional placeholder copy.",
  robots: { index: false, follow: true },
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lumina-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-lumina-body",
  display: "swap",
});

const dmSansLabel = DM_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-lumina-label",
  display: "swap",
});

export default function LuminaLandscapesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`lumina-root ${cormorant.variable} ${dmSans.variable} ${dmSansLabel.variable} min-h-dvh bg-[var(--lumina-bg)] text-[var(--lumina-cream-muted)] antialiased selection:bg-[var(--lumina-bronze)] selection:text-[var(--lumina-bg)]`}
        style={{
          fontFamily: "var(--font-lumina-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <LuminaNav />

        <div>{children}</div>

        <LuminaFooter />
      </div>
    </>
  );
}
