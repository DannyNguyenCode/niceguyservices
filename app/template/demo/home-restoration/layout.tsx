import { Cormorant_Garamond, Outfit } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HomeRestorationFooter } from "@/components/templates/demos/home-restoration/HomeRestorationFooter";
import { HomeRestorationNav } from "@/components/templates/demos/home-restoration/HomeRestorationNav";

export const metadata: Metadata = {
  title: "Home Restoration — Premium Residential Concierge (demo) | Nice Guy Web Design",
  description:
    "Premium single-page home restoration demo — editorial hero, sanctuary storytelling, curated space services, restoration journey, before/after gallery, hospitality tiers, and concierge booking. Fictional placeholder copy.",
  robots: { index: false, follow: true },
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hr-display",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hr-body",
  display: "swap",
});

export default function HomeRestorationLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`hr-root ${cormorant.variable} ${outfit.variable} min-h-dvh bg-[var(--hr-bg)] text-[var(--hr-charcoal-muted)] antialiased selection:bg-[var(--hr-gold-light)] selection:text-[var(--hr-charcoal)]`}
        style={{
          fontFamily: "var(--font-hr-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <HomeRestorationNav />
        <div>{children}</div>
        <HomeRestorationFooter />
      </div>
    </>
  );
}
