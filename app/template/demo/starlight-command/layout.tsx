import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TemplateDemoTopBar } from "@/components/experience-templates/TemplateDemoTopBar";
import { StarlightHeader } from "@/components/experience-templates/starlight-command/StarlightHeader";
import { StarlightMobileNav } from "@/components/experience-templates/starlight-command/StarlightMobileNav";
import { StarlightSiteFooter } from "@/components/experience-templates/starlight-command/StarlightSiteFooter";
import "@/components/experience-templates/starlight-command/starlightTheme.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sc-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sc-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arcade Trades — Industrial command (demo) | Nice Guy Web Design",
  description:
    "Fictional multi-page Toronto electrical trades demo — Arcade Trades retro-industrial command UI, mission logs, and reputation board; not a real contractor.",
  robots: { index: false, follow: true },
};

export default function ArcadeTradesIndustrialDemoLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${spaceGrotesk.variable} ${inter.variable} sc-root min-h-dvh bg-[#131313] text-[#e5e2e1] antialiased selection:bg-[#ee671c] selection:text-[#4c1a00]`}
        style={{ fontFamily: "var(--font-sc-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <div className="sc-crt-overlay" aria-hidden />
        <TemplateDemoTopBar
          demoTag="Arcade — Trades — industrial deck (fictional demo)"
          barClassName="relative z-[70] border-b border-[#594238]/80 bg-[#131313]/95 px-4 py-2 backdrop-blur-sm"
          innerClassName="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2"
          templatesLinkClassName="text-sm font-semibold text-[#ee671c] underline-offset-4 hover:underline"
          tagClassName="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e0c0b2] [font-family:var(--font-sc-display),ui-sans-serif]"
        />
        <StarlightHeader />
        <div className="min-w-0 overflow-x-clip">
          <div className="relative z-0 pb-[max(7rem,env(safe-area-inset-bottom,0px)+5.5rem)] md:pb-10 lg:pb-8">{children}</div>
          <div className="relative z-0 pb-[max(7rem,env(safe-area-inset-bottom,0px)+5.5rem)] md:pb-0">
            <StarlightSiteFooter />
          </div>
        </div>
        <StarlightMobileNav />
      </div>
    </>
  );
}
