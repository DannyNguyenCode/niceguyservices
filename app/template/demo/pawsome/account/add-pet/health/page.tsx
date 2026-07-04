import type { Metadata } from "next";
import { PawsomeAddPetHealthBody } from "@/components/templates/demos/pawsome/PawsomeAddPetHealthBody";

export const metadata: Metadata = {
  title: "Pet Health Profile - Pawsome (demo)",
};

export default function PawsomeAddPetHealthPage() {
  return <PawsomeAddPetHealthBody />;
}
