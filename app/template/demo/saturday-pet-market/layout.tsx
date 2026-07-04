import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SaturdayPetMarketDatabaseErrorBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketDatabaseErrorBody";
import { SaturdayPetMarketLayoutShell } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketLayoutShell";
import { SPM_TAGLINE } from "@/components/templates/demos/saturday-pet-market/saturdayPetMarketConfig";
import { isTemplateDatabaseAvailable } from "@/lib/templates/db/availability";

export const metadata: Metadata = {
  title: "Saturday Morning Pet Market (demo) | Nice Guy Web Design",
  description: `${SPM_TAGLINE} — Fictional retro neighborhood pet retail demo with shop, cart, account, checkout, community, resources, locations, contact, FAQ, and login routes; all placeholder copy.`,
  robots: { index: false, follow: true },
};

export default async function SaturdayPetMarketLayout({ children }: Readonly<{ children: ReactNode }>) {
  const databaseAvailable = await isTemplateDatabaseAvailable();

  return (
    <SaturdayPetMarketLayoutShell>
      {databaseAvailable ? children : <SaturdayPetMarketDatabaseErrorBody />}
    </SaturdayPetMarketLayoutShell>
  );
}
