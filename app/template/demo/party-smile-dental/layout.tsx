import { Nunito, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TopUtilityNav } from "@/components/templates/demos/party-smile-dental/TopUtilityNav";
import { PartySmileDentalFooter } from "@/components/templates/demos/party-smile-dental/PartySmileDentalShared";
import { PartySmileDentalHeader } from "@/components/templates/demos/party-smile-dental/PartySmileDentalHeader";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-psd-headline",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-psd-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Party Board — Smile Board Family Dental (demo) | Nice Guy Web Design",
  description:
    "Fictional family dental demo with board-game journey UX — services, forms, booking flow, and team profiles; not a real clinic.",
  robots: { index: false, follow: true },
};

export default function PartySmileDentalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className={`${nunito.variable} ${dmSans.variable} psd-root min-h-dvh bg-[#fffef8] text-[#1a1a1a] antialiased selection:bg-[#eab308] selection:text-[#1a1a1a]`}
      style={{ fontFamily: "var(--font-psd-body), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="sticky top-0 z-50">
        <TopUtilityNav />
        <PartySmileDentalHeader />
      </div>
      <div className="min-w-0">{children}</div>
      <PartySmileDentalFooter />
    </div>
  );
}
