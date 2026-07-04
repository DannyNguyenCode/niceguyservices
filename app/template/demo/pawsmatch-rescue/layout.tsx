import { DM_Sans, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PawsMatchDatabaseErrorBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchDatabaseErrorBody";
import { PawsMatchFooter } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchFooter";
import { PawsMatchShell } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchShell";
import { isTemplateDatabaseAvailable } from "@/lib/templates/db/availability";

export const metadata: Metadata = {
  title: "PawsMatch Rescue — Pet Adoption (demo) | Nice Guy Web Design",
  description:
    "Pet adoption demo with discover, apply, and track your application — login, adoption status, and a calm step-by-step flow. Fictional placeholder copy.",
  robots: { index: false, follow: true },
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pmr-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pmr-body",
  display: "swap",
});

export default async function PawsMatchRescueLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const databaseAvailable = await isTemplateDatabaseAvailable();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`pmr-root ${playfair.variable} ${dmSans.variable} flex min-h-dvh flex-col bg-[var(--pmr-bg)] text-[var(--pmr-brown-muted)] antialiased selection:bg-[var(--pmr-sage-light)] selection:text-[var(--pmr-brown)]`}
        style={{
          fontFamily: "var(--font-pmr-body), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <PawsMatchShell>
          {databaseAvailable ? children : <PawsMatchDatabaseErrorBody />}
        </PawsMatchShell>
        <PawsMatchFooter />
      </div>
    </>
  );
}
