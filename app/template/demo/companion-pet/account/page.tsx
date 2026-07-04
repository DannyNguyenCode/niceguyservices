import type { Metadata } from "next";
import { CompanionPetAccountBody } from "@/components/templates/demos/companion-pet/CompanionPetAccountBody";

export const metadata: Metadata = {
  title: "Account - Companion Pet Supply (demo)",
};

export default function CompanionPetAccountPage() {
  return <CompanionPetAccountBody />;
}
