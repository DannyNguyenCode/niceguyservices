import type { Metadata } from "next";
import { PowerPelletElectricContactBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricContactBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: ppePageTitle("Contact Power Pellet Electric"),
  alternates: { canonical: absoluteUrl("/template/demo/power-pellet-electric/contact") },
};

export default function PowerPelletElectricContactPage() {
  return <PowerPelletElectricContactBody />;
}
