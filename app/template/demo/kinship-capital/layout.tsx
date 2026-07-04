import { Inter, Montserrat } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { KinshipCapitalLayoutFooter } from "@/components/templates/demos/kinship-capital/KinshipCapitalLayoutFooter";
import { KcNav } from "@/components/templates/demos/kinship-capital/KinshipCapitalShared";
import { KC_TAGLINE } from "@/components/templates/demos/kinship-capital/kinshipCapitalConfig";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-kc-headline",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-kc-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kinship & Capital — Heritage Financial (demo) | Nice Guy Web Design",
  description: `${KC_TAGLINE} — Fictional multi-page family wealth demo with contact, services, pricing, FAQ, and about routes; all placeholder copy.`,
  robots: { index: false, follow: true },
};

export default function KinshipCapitalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`kc-root ${montserrat.variable} ${inter.variable} min-h-dvh bg-[var(--kc-background)] text-[var(--kc-on-background)] antialiased selection:bg-[var(--kc-primary-fixed)] selection:text-[var(--kc-on-primary-fixed)]`}
        style={{ fontFamily: "var(--font-kc-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <KcNav />
        <div className="min-w-0">{children}</div>
        <KinshipCapitalLayoutFooter />
      </div>
    </>
  );
}
