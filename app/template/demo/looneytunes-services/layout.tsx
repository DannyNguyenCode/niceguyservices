import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LooneyToonsCafeFab } from "@/components/experience-templates/looneytoons-cafe/LooneyToonsCafeFab";
import { LooneyToonsCafeFooter } from "@/components/experience-templates/looneytoons-cafe/LooneyToonsCafeFooter";
import { LooneyToonsCafeNav } from "@/components/experience-templates/looneytoons-cafe/LooneyToonsCafeNav";
import "@/components/experience-templates/looneytoons-cafe/looneytoonsTheme.css";
import { TemplateDemoTopBar } from "@/components/experience-templates/TemplateDemoTopBar";

export const metadata: Metadata = {
  title: "LooneyTunes — Services (demo) | Nice Guy Web Design",
  description:
    "Fictional comic-brutalist services demo — playful idioms, faux menu and rewards, and placeholder contact only.",
  robots: { index: false, follow: true },
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-lt-bricolage",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-lt-space",
  display: "swap",
});

export default function LooneyToonsCafeLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${bricolage.variable} ${spaceGrotesk.variable} flex min-h-dvh flex-col bg-[#f9f9ff] text-[#151c28] antialiased`}
        style={{
          fontFamily: "var(--font-lt-space), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <TemplateDemoTopBar
          demoTag="LooneyTunes — Services (demo)"
          barClassName="border-b-2 border-[#151c28] bg-[#f9f9ff] px-4 py-2"
          innerClassName="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-2 px-0 md:px-16"
          templatesLinkClassName="text-sm font-bold text-[#495E84] underline-offset-4 hover:underline [font-family:var(--font-lt-space),system-ui,sans-serif]"
          tagClassName="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]"
        />

        <LooneyToonsCafeNav />

        <div className="flex-1 pb-28 md:pb-10">{children}</div>

        <LooneyToonsCafeFooter />
        <LooneyToonsCafeFab />
      </div>
    </>
  );
}
