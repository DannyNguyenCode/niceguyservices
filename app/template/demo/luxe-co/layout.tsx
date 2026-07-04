import { DM_Sans, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LuxeCoConsultationProvider } from "@/components/templates/demos/luxe-co/LuxeCoConsultation";
import { LuxeCoFooter } from "@/components/templates/demos/luxe-co/LuxeCoFooter";
import { LuxeCoNav } from "@/components/templates/demos/luxe-co/LuxeCoNav";

export const metadata: Metadata = {
  title: "LUXE & CO. — Premium Real Estate (demo) | Nice Guy Web Design",
  description:
    "Premium single-page real estate demo — neighborhood explorer, lifestyle matching, curated listings, market intelligence, buyer/seller roadmap, and client testimonials. Fictional placeholder copy.",
  robots: { index: false, follow: true },
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lc-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lc-body",
  display: "swap",
});

export default function LuxeCoLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`lc-root ${playfair.variable} ${dmSans.variable} min-h-dvh bg-[var(--lc-bg)] text-[var(--lc-charcoal-muted)] antialiased selection:bg-[var(--lc-gold-light)] selection:text-[var(--lc-charcoal)]`}
        style={{
          fontFamily: "var(--font-lc-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <LuxeCoConsultationProvider>
          <LuxeCoNav />
          <div>{children}</div>
          <LuxeCoFooter />
        </LuxeCoConsultationProvider>
      </div>
    </>
  );
}
