import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LooneyToonsCafeFab } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeFab";
import { LooneyToonsCafeFooter } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeFooter";
import { LooneyToonsCafeNav } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeNav";
import { LooneyToonsCartDrawer } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCartDrawer";
import { LooneyToonsCartProvider } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCartContext";
import { LooneyToonsCafeAuthProvider } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeAuthContext";

export const metadata: Metadata = {
  title: "LooneyTunes — Services (demo) | Nice Guy Web Design",
  description:
    "Fictional comic-brutalist services demo — playful idioms, faux menu and rewards, and placeholder contact only.",
  robots: { index: false, follow: true },
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-lt-bricolage",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-lt-space",
  display: "swap",
});

export default function LooneyToonsCafeLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${bricolage.variable} ${spaceGrotesk.variable} flex min-h-dvh flex-col bg-[#f9f9ff] text-[#151c28] antialiased`}
        style={{
          fontFamily: "var(--font-lt-space), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <LooneyToonsCafeAuthProvider>
          <LooneyToonsCartProvider>
            <LooneyToonsCafeNav />

            <div className="flex-1 pb-28 md:pb-10">{children}</div>

            <LooneyToonsCafeFooter />
            <LooneyToonsCafeFab />
            <LooneyToonsCartDrawer />
          </LooneyToonsCartProvider>
        </LooneyToonsCafeAuthProvider>
      </div>
    </>
  );
}
