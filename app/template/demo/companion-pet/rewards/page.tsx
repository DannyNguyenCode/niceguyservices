import type { Metadata } from "next";
import { CompanionPetRewardsBody } from "@/components/templates/demos/companion-pet/CompanionPetRewardsBody";

export const metadata: Metadata = {
  title: "Rewards - Companion Pet Supply (demo)",
};

export default function CompanionPetRewardsPage() {
  return <CompanionPetRewardsBody />;
}
