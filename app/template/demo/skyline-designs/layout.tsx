import { Inter, Outfit } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SkylineDesignsLayoutFooter } from "@/components/templates/demos/skyline-designs/SkylineDesignsLayoutFooter";
import { SdNav } from "@/components/templates/demos/skyline-designs/SkylineDesignsShared";
import { SD_TAGLINE } from "@/components/templates/demos/skyline-designs/skylineDesignsConfig";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-sd-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sd-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skyline Designs — Toronto Digital Craftsman (demo) | Nice Guy Web Design",
  description: `${SD_TAGLINE} — Fictional five-route portfolio demo with home, skills, education, experience, and contact pages; ethereal cloud aesthetic with all placeholder copy.`,
  robots: { index: false, follow: true },
};

export default function SkylineDesignsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`sd-root ${outfit.variable} ${inter.variable} min-h-dvh overflow-x-hidden bg-[var(--sd-background)] text-[var(--sd-on-background)] antialiased selection:bg-[var(--sd-primary-container)] selection:text-[var(--sd-on-primary-container)]`}
        style={{ fontFamily: "var(--font-sd-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <SdNav />
        <div className="min-w-0">{children}</div>
        <SkylineDesignsLayoutFooter />
      </div>
    </>
  );
}
