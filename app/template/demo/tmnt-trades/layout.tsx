import { Montserrat, Space_Grotesk, Work_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TmntFooter } from "@/components/experience-templates/tmnt-construction/TmntFooter";
import { TmntNav } from "@/components/experience-templates/tmnt-construction/TmntNav";
import "@/components/experience-templates/tmnt-construction/tmntTheme.css";
import { TemplateDemoTopBar } from "@/components/experience-templates/TemplateDemoTopBar";

export const metadata: Metadata = {
  title: "TMNT — Trades (demo) | Nice Guy Web Design",
  description:
    "Fictional tactical trades demo — light industrial palette with comic layout and tongue-in-cheek mission copy; phones and addresses are not real.",
  robots: { index: false, follow: true },
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-tmnt-headline",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-tmnt-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-tmnt-label",
  display: "swap",
});

export default function TmntConstructionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${montserrat.variable} ${workSans.variable} ${spaceGrotesk.variable} flex min-h-dvh flex-col bg-[#f7faf4] text-[#181d19] antialiased selection:bg-[#216b41] selection:text-white`}
        style={{
          fontFamily: "var(--font-tmnt-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <TemplateDemoTopBar
          demoTag="TMNT — Trades (demo)"
          barClassName="border-b border-[#bfc9be] bg-[#f1f5ee] px-4 py-2"
          innerClassName="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2"
          templatesLinkClassName="text-sm font-semibold text-[#216b41] underline-offset-4 hover:underline"
          tagClassName="text-[10px] font-bold uppercase tracking-[0.2em] text-[#404941] [font-family:var(--font-tmnt-label),system-ui,sans-serif]"
        />

        <TmntNav />

        <div className="flex-1 pb-28 md:pb-2">{children}</div>

        <TmntFooter />
      </div>
    </>
  );
}
