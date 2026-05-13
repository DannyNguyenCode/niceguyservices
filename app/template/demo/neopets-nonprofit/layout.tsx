import { Plus_Jakarta_Sans, Quicksand, Caveat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TemplateDemoTopBar } from "@/components/experience-templates/TemplateDemoTopBar";
import { NeopetsDonateFab } from "@/components/experience-templates/neopets-nonprofit/NeopetsDonateFab";
import { NeopetsHeader } from "@/components/experience-templates/neopets-nonprofit/NeopetsHeader";
import "@/components/experience-templates/neopets-nonprofit/neopetsTheme.css";

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
        className={`${quicksand.variable} ${plusJakarta.variable} ${caveat.variable} np-material min-h-dvh bg-[#fff8f2] text-[#1f1b14] antialiased selection:bg-[#8fd3ff]`}
        style={{
          fontFamily: "var(--font-np-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <TemplateDemoTopBar
          demoTag="Neopets Nonprofit — Toronto Adopt-A-Pet (demo)"
          barClassName="z-[60] border-b border-[#ebe1d5] bg-[#fcf2e6]/95 px-4 py-2 backdrop-blur-sm"
          innerClassName="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2"
          templatesLinkClassName="text-sm font-semibold tracking-wide text-[#0d658c] underline-offset-4 hover:underline"
          tagClassName="text-[10px] font-bold uppercase tracking-[0.2em] text-[#745b00]"
        />

        <NeopetsHeader />

        <div className="pb-8 sm:pb-10">{children}</div>

        <NeopetsDonateFab />
      </div>
    </>
  );
}
