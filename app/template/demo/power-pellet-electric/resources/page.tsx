import type { Metadata } from "next";
import { PowerPelletElectricResourcesBody } from "@/components/templates/demos/power-pellet-electric/PowerPelletElectricResourcesBody";
import { ppePageTitle } from "@/components/templates/demos/power-pellet-electric/powerPelletElectricConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: ppePageTitle("Electrical Resources"),
  alternates: { canonical: absoluteUrl("/template/demo/power-pellet-electric/resources") },
};

export default function PowerPelletElectricResourcesPage() {
  return <PowerPelletElectricResourcesBody />;
}
