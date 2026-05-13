import type { Metadata } from "next";
import { LooneyToonsCafeRewardsBody } from "@/components/experience-templates/looneytoons-cafe/LooneyToonsCafeRewardsBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Rewards (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/rewards") },
};

export default function LooneyToonsCafeRewardsPage() {
  return <LooneyToonsCafeRewardsBody />;
}
