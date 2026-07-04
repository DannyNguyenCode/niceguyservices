import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StarlightHeader } from "@/components/templates/demos/starlight-command/StarlightHeader";
import { StarlightMobileNav } from "@/components/templates/demos/starlight-command/StarlightMobileNav";
import { StarlightSiteFooter } from "@/components/templates/demos/starlight-command/StarlightSiteFooter";

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
