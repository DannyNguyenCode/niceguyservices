import type { Metadata } from "next";
import { PowerPelletElectricServicesBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricServicesBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: ppePageTitle("Electrical Services"),
  alternates: { canonical: absoluteUrl("/template/demo/power-pellet-electric/services") },
};

export default function PowerPelletElectricServicesPage() {
  return <PowerPelletElectricServicesBody />;
}
