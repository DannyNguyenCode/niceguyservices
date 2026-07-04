import type { Metadata } from "next";
import { PawsomeLunaShopBody } from "@/components/templates/demos/pawsome/PawsomeLunaShopBody";

export const metadata: Metadata = {
  title: "Luna's Wellness Shop - Pawsome (demo)",
};

export default function PawsomeLunaShopPage() {
  return <PawsomeLunaShopBody />;
}
