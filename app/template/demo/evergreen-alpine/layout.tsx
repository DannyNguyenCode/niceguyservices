import { Montserrat, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EvergreenBottomNav } from "@/components/templates/demos/evergreen-alpine/EvergreenBottomNav";
import { EvergreenEstimateProvider } from "@/components/templates/demos/evergreen-alpine/EvergreenEstimate";
import { EvergreenFooter } from "@/components/templates/demos/evergreen-alpine/EvergreenFooter";
import { EvergreenHashScroll } from "@/components/templates/demos/evergreen-alpine/EvergreenHashScroll";
import { EvergreenHeader } from "@/components/templates/demos/evergreen-alpine/EvergreenHeader";

export const metadata: Metadata = {
  title: "EverGreen & Alpine — Property Stewardship (demo) | Nice Guy Web Design",
  description:
    "Fictional landscaping, property maintenance, and snow removal demo — seasonal storytelling, year-round care, premium homeowner-focused design.",
  robots: { index: false, follow: true },
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-eg-headline",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-eg-body",
  display: "swap",
});

export default function EvergreenAlpineLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${montserrat.variable} ${sourceSans.variable} flex min-h-dvh scroll-pt-20 flex-col scroll-smooth bg-[#fbf9f8] text-[#1b1c1c] antialiased selection:bg-[#c1ecd4] selection:text-[#002114]`}
        style={{
          fontFamily: "var(--font-eg-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <EvergreenEstimateProvider>
          <EvergreenHashScroll />
          <EvergreenHeader />

          <div className="flex-1 pb-20 md:pb-0">{children}</div>

          <EvergreenFooter />
          <EvergreenBottomNav />
        </EvergreenEstimateProvider>
      </div>
    </>
  );
}
