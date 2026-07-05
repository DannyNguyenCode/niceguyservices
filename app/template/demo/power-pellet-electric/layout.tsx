import { Hanken_Grotesk, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PpeFooter, PpeNav, PpeScanline } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricShared";
import { PPE_SITE_NAME, ppeDemoMetadataTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ppe-headline",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ppe-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ppe-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: ppeDemoMetadataTitle(`${PPE_SITE_NAME} | High Voltage Arcade Precision`),
  description:
    "Fictional retro arcade electrician demo — home, services, panel upgrade detail, about, resources, and contact form; neon yellow/pink MD3 palette; all placeholder copy.",
  robots: { index: false, follow: true },
};

export default function PowerPelletElectricLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`ppe-root dark ${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} min-h-dvh overflow-x-clip antialiased selection:bg-[var(--ppe-primary-container)] selection:text-[var(--ppe-on-primary-container)]`}
        style={{ fontFamily: "var(--font-ppe-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <PpeNav />
        <PpeScanline />
        <div className="min-w-0 overflow-x-clip">
          <div className="pb-[max(4.5rem,env(safe-area-inset-bottom,0px)+4rem)] lg:pb-0">{children}</div>
          <div className="pb-[max(4.5rem,env(safe-area-inset-bottom,0px)+4rem)] lg:pb-0">
            <PpeFooter />
          </div>
        </div>
      </div>
    </>
  );
}
