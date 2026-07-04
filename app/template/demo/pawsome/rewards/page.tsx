import type { Metadata } from "next";
import { PawsomeRewardsBody } from "@/components/templates/demos/pawsome/PawsomeRewardsBody";

export const metadata: Metadata = {
  title: "Rewards Dashboard - Pawsome (demo)",
};

export default function PawsomeRewardsPage() {
  return <PawsomeRewardsBody />;
}
