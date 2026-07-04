import { Inter, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CompanionPetShell } from "@/components/templates/demos/companion-pet/CompanionPetShell";
import { CompanionPetDatabaseErrorBody } from "@/components/templates/demos/companion-pet/CompanionPetDatabaseErrorBody";
import { CompanionPetFooter } from "@/components/templates/demos/companion-pet/CompanionPetShared";
import { isTemplateDatabaseAvailable } from "@/lib/templates/db/availability";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cp-headline",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cp-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Companion — Premium Pet Supply (demo) | Nice Guy Web Design",
  description:
    "Fictional premium pet retail demo with gamified loyalty, shop filters, rewards dashboard, resource hub, account center, and checkout — placeholder copy only.",
  robots: { index: false, follow: true },
};

export default async function CompanionPetLayout({ children }: Readonly<{ children: ReactNode }>) {
  const databaseAvailable = await isTemplateDatabaseAvailable();

  return (
    <div
      className={`${inter.variable} ${dmSans.variable} cp-root flex min-h-dvh flex-col bg-[var(--cp-white)] text-[var(--cp-charcoal)] antialiased selection:bg-[var(--cp-blue-muted)]`}
      style={{ fontFamily: "var(--font-cp-body), ui-sans-serif, system-ui, sans-serif" }}
    >
      <CompanionPetShell>
        {databaseAvailable ? children : <CompanionPetDatabaseErrorBody />}
      </CompanionPetShell>
      <CompanionPetFooter />
    </div>
  );
}
