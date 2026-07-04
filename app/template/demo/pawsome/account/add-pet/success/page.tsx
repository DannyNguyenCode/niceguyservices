import type { Metadata } from "next";
import { PawsomeAddPetSuccessBody } from "@/components/templates/demos/pawsome/PawsomeAddPetSuccessBody";

export const metadata: Metadata = {
  title: "Profile Created - Pawsome (demo)",
};

export default function PawsomeAddPetSuccessPage() {
  return <PawsomeAddPetSuccessBody />;
}
