import type { Metadata } from "next";
import { KinshipCapitalServicesBody } from "@/components/templates/demos/kinship-capital/KinshipCapitalServicesBody";

export const metadata: Metadata = {
  title: "Services | Heritage Financial (demo)",
};

export default function KinshipCapitalServicesPage() {
  return <KinshipCapitalServicesBody />;
}
