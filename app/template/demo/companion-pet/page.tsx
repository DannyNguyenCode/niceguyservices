import type { Metadata } from "next";
import { CompanionPetHomeBody } from "@/components/templates/demos/companion-pet/CompanionPetHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Home - Companion Pet Supply (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/companion-pet") },
};

export default function CompanionPetHomePage() {
  return <CompanionPetHomeBody />;
}
