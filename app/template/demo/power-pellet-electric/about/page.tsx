import type { Metadata } from "next";
import { PowerPelletElectricAboutBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricAboutBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: ppePageTitle("About Power Pellet Electric"),
  alternates: { canonical: absoluteUrl("/template/demo/power-pellet-electric/about") },
};

export default function PowerPelletElectricAboutPage() {
  return <PowerPelletElectricAboutBody />;
}
