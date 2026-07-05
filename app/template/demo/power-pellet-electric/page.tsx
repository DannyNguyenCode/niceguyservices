import type { Metadata } from "next";
import { PowerPelletElectricHomeBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricHomeBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: ppePageTitle("High Voltage Arcade Precision"),
  alternates: { canonical: absoluteUrl("/template/demo/power-pellet-electric") },
};

export default function PowerPelletElectricHomePage() {
  return <PowerPelletElectricHomeBody />;
}
