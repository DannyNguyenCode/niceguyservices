import type { Metadata } from "next";
import { KinshipCapitalAboutBody } from "@/components/templates/demos/kinship-capital/KinshipCapitalAboutBody";

export const metadata: Metadata = {
  title: "About Us | Kinship & Capital (demo)",
};

export default function KinshipCapitalAboutPage() {
  return <KinshipCapitalAboutBody />;
}
