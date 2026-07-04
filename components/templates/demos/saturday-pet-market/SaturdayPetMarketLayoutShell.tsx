import "server-only";

import type { ReactNode } from "react";
import { Be_Vietnam_Pro, Permanent_Marker, Quicksand } from "next/font/google";
import { SaturdayPetMarketChrome } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketChrome";
import { SpmAuthProvider } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketAuthContext";
import { SpmCartProvider } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketCartContext";
import { SpmSpecialistChatProvider } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketSpecialistChatContext";
import { SaturdayPetMarketShell } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketShell";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-spm-headline",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-spm-body",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-spm-handwritten",
  display: "swap",
});

export function SaturdayPetMarketLayoutShell({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`spm-root ${quicksand.variable} ${beVietnam.variable} ${permanentMarker.variable} min-h-dvh bg-[var(--spm-background)] text-[var(--spm-on-background)] antialiased selection:bg-[var(--spm-tertiary-container)] selection:text-[var(--spm-on-tertiary-container)]`}
        style={{ fontFamily: "var(--font-spm-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <SpmAuthProvider>
          <SpmCartProvider>
            <SpmSpecialistChatProvider>
              <SaturdayPetMarketShell>{children}</SaturdayPetMarketShell>
              <SaturdayPetMarketChrome />
            </SpmSpecialistChatProvider>
          </SpmCartProvider>
        </SpmAuthProvider>
      </div>
    </>
  );
}
