import type { Metadata } from "next";
import { CompanionPetResourcesBody } from "@/components/templates/demos/companion-pet/CompanionPetResourcesBody";

export const metadata: Metadata = {
  title: "Resources - Companion Pet Supply (demo)",
};

export default function CompanionPetResourcesPage() {
  return <CompanionPetResourcesBody />;
}
