import "@/app/styles/templates/comfortflow-hvac-ui.css";
import { Inter, Instrument_Serif } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CfhFooter } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacShared";
import { Header } from "@/components/templates/demos/comfortflow-hvac/home/Header";
import { CFH_SITE_NAME, CFH_TAGLINE, cfhDemoMetadataTitle } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-cfh-sans-loaded",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cfh-display-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: cfhDemoMetadataTitle(`${CFH_SITE_NAME} | ${CFH_TAGLINE}`),
  description:
    "Fictional multi-route HVAC demo — home comfort network, maintenance plans, heating, cooling, air quality, water heaters, comfort systems, resources, and contact booking; all placeholder copy.",
  robots: { index: false, follow: true },
};

export default function ComfortflowHvacLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />
      <div
        className={`cfh-root light ${inter.variable} ${instrumentSerif.variable} min-h-dvh overflow-x-visible antialiased selection:bg-[var(--cfh-secondary-fixed)] selection:text-[var(--cfh-on-secondary-fixed)]`}
        style={{ fontFamily: "var(--font-cfh-sans-loaded), ui-sans-serif, system-ui, sans-serif" }}
      >
        <Header />
        <div className="min-w-0">{children}</div>
        <CfhFooter />
      </div>
    </>
  );
}
