import type { Metadata } from "next";
import { KinshipCapitalFaqBody } from "@/components/templates/demos/kinship-capital/KinshipCapitalFaqBody";

export const metadata: Metadata = {
  title: "FAQ | Heritage Financial (demo)",
};

export default function KinshipCapitalFaqPage() {
  return <KinshipCapitalFaqBody />;
}
