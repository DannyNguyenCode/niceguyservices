import type { Metadata } from "next";
import { KinshipCapitalContactBody } from "@/components/templates/demos/kinship-capital/KinshipCapitalContactBody";

export const metadata: Metadata = {
  title: "Contact | Heritage Financial (demo)",
};

export default function KinshipCapitalContactPage() {
  return <KinshipCapitalContactBody />;
}
