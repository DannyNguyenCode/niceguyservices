import type { Metadata } from "next";
import { CompanionPetShopBody } from "@/components/templates/demos/companion-pet/CompanionPetShopBody";

export const metadata: Metadata = {
  title: "Shop - Companion Pet Supply (demo)",
};

export default function CompanionPetShopPage() {
  return <CompanionPetShopBody />;
}
