import { Inter, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ViClientShell } from "@/components/templates/demos/valley-interlocking/ViClientShell";
import { VI_SITE, VI_TAGLINE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingConfig";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-vi-headline",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-vi-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${VI_SITE} (demo) | Nice Guy Web Design`,
  description: `${VI_TAGLINE} — Fictional multi-page interlocking & landscaping demo with home, about, services, and contact routes; all placeholder copy.`,
  robots: { index: false, follow: true },
};

export default function ValleyInterlockingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="anonymous" />
      <div
        className={`vi-root ${playfair.variable} ${inter.variable} min-h-dvh bg-[var(--vi-background)] text-[var(--vi-on-background)] antialiased selection:bg-[var(--vi-primary-fixed)] selection:text-[var(--vi-on-primary-fixed)]`}
        style={{ fontFamily: "var(--font-vi-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <ViClientShell>{children}</ViClientShell>
      </div>
    </>
  );
}
