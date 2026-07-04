import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PawsomeCartProvider } from "@/components/templates/demos/pawsome/PawsomeCartContext";
import { PawsomeAuthProvider } from "@/components/templates/demos/pawsome/PawsomeAuthContext";
import { PawsomeCartDrawer } from "@/components/templates/demos/pawsome/PawsomeCartDrawer";
import { PawsomeDatabaseErrorBody } from "@/components/templates/demos/pawsome/PawsomeDatabaseErrorBody";
import { PawsomeShell } from "@/components/templates/demos/pawsome/PawsomeShell";
import { PsFooter } from "@/components/templates/demos/pawsome/PawsomeShared";
import { PS_TAGLINE } from "@/components/templates/demos/pawsome/pawsomeConfig";
import { isTemplateDatabaseAvailable } from "@/lib/templates/db/availability";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ps-body",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ps-headline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pawsome — Premium Pet Wellness (demo) | Nice Guy Web Design",
  description: `${PS_TAGLINE} Multi-route MD3 demo with shop, rewards, resources, account, checkout, subscriptions, and review flows — placeholder copy only.`,
  robots: { index: false, follow: true },
};

export default async function PawsomeLayout({ children }: Readonly<{ children: ReactNode }>) {
  const databaseAvailable = await isTemplateDatabaseAvailable();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${inter.variable} ${plusJakarta.variable} ps-root flex min-h-dvh flex-col bg-[var(--ps-background)] text-[var(--ps-on-surface)] antialiased selection:bg-[color-mix(in_srgb,var(--ps-secondary-container)_40%,transparent)]`}
        style={{ fontFamily: "var(--font-ps-body), ui-sans-serif, system-ui, sans-serif" }}
      >
        <PawsomeAuthProvider>
          <PawsomeCartProvider>
            <PawsomeShell>
              {databaseAvailable ? children : <PawsomeDatabaseErrorBody />}
            </PawsomeShell>
            <PawsomeCartDrawer />
            <PsFooter />
          </PawsomeCartProvider>
        </PawsomeAuthProvider>
      </div>
    </>
  );
}
