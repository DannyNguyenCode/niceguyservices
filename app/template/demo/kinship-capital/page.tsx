import type { Metadata } from "next";
import { KinshipCapitalHomeBody } from "@/components/templates/demos/kinship-capital/KinshipCapitalHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Heritage Financial | Kinship & Capital (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/kinship-capital") },
};

export default function KinshipCapitalHomePage() {
  return <KinshipCapitalHomeBody />;
}
